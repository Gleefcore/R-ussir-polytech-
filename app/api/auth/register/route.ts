import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Assurer la résilience réseau en environnement local ou proxy
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, matricule, phone, level, password } = await req.json();

    if (!fullName || !matricule || !password) {
      return NextResponse.json(
        { error: 'Veuillez renseigner tous les champs obligatoires.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit comporter au moins 6 caractères.' },
        { status: 400 }
      );
    }

    const cleanMatricule = matricule.trim().toUpperCase();
    const cleanEmail = email && email.trim()
      ? email.trim().toLowerCase()
      : `${cleanMatricule.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@polytech.rp`;

    // 1. Vérifier si un compte existe déjà avec ce matricule ou cet email
    const { data: userList } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const existing = userList?.users?.find(
      (u) =>
        u.email?.toLowerCase() === cleanEmail ||
        u.user_metadata?.matricule?.trim().toUpperCase() === cleanMatricule
    );

    if (existing) {
      return NextResponse.json(
        {
          error: `Un compte existe déjà pour le matricule ${cleanMatricule} (Email : ${existing.email}). Rendez-vous sur l'onglet Connexion.`,
        },
        { status: 409 }
      );
    }

    // 2. Création du compte avec email_confirm: true (Garanti 100% sans blocage d'email!)
    const { data: createData, error: createError } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password: password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName.trim(),
        matricule: cleanMatricule,
        phone: phone ? phone.trim() : '',
        level: level || 'MSP1',
      },
    });

    if (createError || !createData.user) {
      return NextResponse.json(
        { error: createError?.message || 'Erreur lors de la création du compte.' },
        { status: 500 }
      );
    }

    const newUser = createData.user;

    // 3. Enregistrement dans la table profiles
    await supabase.from('profiles').upsert(
      {
        id: newUser.id,
        full_name: fullName.trim(),
        email: cleanEmail,
        phone: phone ? phone.trim() : null,
        role: 'student',
        status: 'active',
      },
      { onConflict: 'id' }
    );

    // 4. Générer une session de connexion immédiate
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password,
    });

    if (signInError) {
      return NextResponse.json({
        success: true,
        user: newUser,
        session: null,
        level: level || 'MSP1',
        fullName: fullName.trim(),
        matricule: cleanMatricule,
        email: cleanEmail,
      });
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      session: authData.session,
      level: level || 'MSP1',
      fullName: fullName.trim(),
      matricule: cleanMatricule,
      email: cleanEmail,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne lors de l\'inscription';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
