import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string | null;

    if (!file || !userId) {
      return NextResponse.json({ error: 'Fichier et identifiant utilisateur requis.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${userId}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, buffer, {
      contentType: file.type || 'image/jpeg',
      upsert: true,
    });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: pubData } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const avatarUrl = `${pubData.publicUrl}?t=${Date.now()}`;

    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: {
        avatar_url: avatarUrl,
      },
    });

    await supabase.from('profiles').upsert(
      {
        id: userId,
        avatar_url: avatarUrl,
      },
      { onConflict: 'id' }
    );

    return NextResponse.json({
      success: true,
      avatarUrl,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne de téléversement';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
