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
    let targetEmail = cleanId.toLowerCase();
    let targetUser: any = null;

    // 1. Si ce n'est pas un email (ex: 25Q529, 24P100), recherche par matricule dans les comptes
    if (!cleanId.includes('@')) {
      const cleanMatricule = cleanId.toUpperCase();
      const { data: userList, error: listError } = await supabase.auth.admin.listUsers({
        perPage: 1000,
      });

      if (!listError && userList?.users) {
        targetUser = userList.users.find(
          (u) =>
            u.user_metadata?.matricule?.trim().toUpperCase() === cleanMatricule ||
            u.email?.split('@')[0]?.toUpperCase() === cleanMatricule
        );
      }

      if (targetUser && targetUser.email) {
        targetEmail = targetUser.email.toLowerCase();
      } else {
        // Fallback email généré lors d'inscriptions sans email
        const safeLocal = cleanMatricule.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        targetEmail = `${safeLocal}@polytech.rp`;
      }
    } else {
      // Si c'est un email direct, chercher l'utilisateur
      const { data: userList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
      targetUser = userList?.users?.find((u) => u.email?.toLowerCase() === targetEmail);
    }

    // 2. Si l'utilisateur existe mais que son email n'est pas encore confirmé, on l'auto-confirme immédiatement
    if (targetUser && !targetUser.email_confirmed_at) {
      await supabase.auth.admin.updateUserById(targetUser.id, { email_confirm: true });
    }

    // 3. Tentative de connexion par mot de passe
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: targetEmail,
      password: password,
    });

    if (signInError) {
      // Si l'utilisateur n'avait pas été trouvé par matricule
      if (!targetUser && !cleanId.includes('@')) {
        return NextResponse.json(
          {
            error: `Aucun compte n'a été trouvé avec le matricule "${cleanId}". Vérifiez votre saisie ou créez votre compte dans l'onglet Inscription.`,
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
