import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Assurer la résilience réseau en environnement local ou proxy
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Veuillez renseigner votre matricule/email et votre mot de passe.' },
        { status: 400 }
      );
    }

    const cleanId = identifier.trim();
    const cleanUpper = cleanId.toUpperCase();
    const cleanLower = cleanId.toLowerCase();
    let targetEmail = cleanLower;
    let targetUser: any = null;

    // Récupérer la liste des utilisateurs pour résolution par Matricule, Nom ou Email
    const { data: userList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const users = userList?.users || [];

    if (cleanId.includes('@')) {
      // 1. Recherche directe par email
      targetUser = users.find((u) => u.email?.toLowerCase() === cleanLower);
    } else {
      // 2. Recherche par Matricule, puis par Nom/Prénom, puis par Téléphone
      targetUser = users.find((u) => {
        const mat = u.user_metadata?.matricule?.trim().toUpperCase();
        const name = u.user_metadata?.full_name?.trim().toLowerCase();
        const emailPrefix = u.email?.split('@')[0]?.toUpperCase();
        const phone = (u.user_metadata?.phone || u.phone || '').replace(/[^0-9]/g, '');
        const searchPhone = cleanId.replace(/[^0-9]/g, '');

        if (mat && mat === cleanUpper) return true;
        if (emailPrefix && emailPrefix === cleanUpper) return true;
        if (name && (name === cleanLower || (cleanLower.length >= 3 && name.includes(cleanLower)))) return true;
        if (searchPhone.length >= 8 && phone.includes(searchPhone)) return true;
        return false;
      });

      if (targetUser && targetUser.email) {
        targetEmail = targetUser.email.toLowerCase();
      } else {
        // Fallback matricule
        const safeLocal = cleanUpper.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        targetEmail = `${safeLocal}@polytech.rp`;
      }
    }

    // 3. Si l'utilisateur existe mais que son email n'est pas encore confirmé, auto-confirmation immédiate
    if (targetUser && !targetUser.email_confirmed_at) {
      await supabase.auth.admin.updateUserById(targetUser.id, { email_confirm: true });
    }

    // 4. Tentative de connexion par mot de passe
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: password,
    });

    if (signInError) {
      if (!targetUser) {
        return NextResponse.json(
          {
            error: `Aucun compte n'a été trouvé correspondant à "${cleanId}". Vous pouvez vous connecter avec votre matricule, votre nom ou votre email.`,
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: 'Mot de passe incorrect pour cet identifiant. Vérifiez votre saisie et réessayez.',
        },
        { status: 401 }
      );
    }

    const user = authData.user;
    const session = authData.session;
    const level = user?.user_metadata?.level || 'MSP1';
    const fullName = user?.user_metadata?.full_name || cleanId;

    return NextResponse.json({
      success: true,
      user,
      session,
      level,
      fullName,
      email: targetEmail,
      matricule: user?.user_metadata?.matricule || cleanId,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne de connexion';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
