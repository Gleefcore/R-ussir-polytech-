import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const VALID_KEYS = [
  'RP-ADMIN-EXCELLENCE-2026',
  'POLYTECH2026',
  ...(process.env.ADMIN_ACCESS_KEY ? [process.env.ADMIN_ACCESS_KEY.trim().toUpperCase()] : []),
];

function isAuthorized(key: string | null): boolean {
  if (!key) return false;
  return VALID_KEYS.includes(key.trim().toUpperCase());
}

export async function POST(req: NextRequest) {
  try {
    const key = req.headers.get('x-admin-key');
    const formData = await req.formData();
    const accessKey = key || (formData.get('accessKey') as string | null);

    if (!isAuthorized(accessKey)) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string | null) || 'communications';

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 });
    }

    // Vérifier que c'est bien une image
    const mime = file.type || '';
    const isImage = mime.startsWith('image/') || /\.(jpe?g|png|webp|gif|svg)$/i.test(file.name);
    if (!isImage) {
      return NextResponse.json({ error: 'Le fichier doit être une image (JPG, PNG, WEBP, GIF, SVG).' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const rawExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const cleanExt = rawExt.replace(/[^a-z0-9]/g, '') || 'jpg';
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const cleanFileName = `media_${timestamp}_${randomSuffix}.${cleanExt}`;
    const storagePath = `${folder}/${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('academic-files')
      .upload(storagePath, buffer, {
        contentType: mime || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      console.error('[UploadMedia] Erreur Supabase Storage:', uploadError);
      return NextResponse.json({ error: `Erreur téléversement cloud: ${uploadError.message}` }, { status: 500 });
    }

    const { data: pubData } = supabase.storage.from('academic-files').getPublicUrl(storagePath);
    const publicUrl = `${pubData.publicUrl}?t=${Date.now()}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      fileSize: file.size,
      mimeType: mime,
      storagePath,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne lors du téléversement';
    console.error('[UploadMedia] Exception:', err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
