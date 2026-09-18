import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SUBJECT_METADATA: Record<string, { id: string; name: string; semester_id: string; level_id: string }> = {
  mth111: {
    id: '12ec69db-66b7-4320-898d-f0d44381dedd',
    name: 'Analyse réelle 1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  mth112: {
    id: '1ba88bfb-a116-486b-ab90-2e46f35e16d0',
    name: 'Algèbre Générale',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  phy111: {
    id: '8333d73e-4ab3-42e1-8ad0-36b76c230419',
    name: 'Électromagnétisme 1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  phy112: {
    id: 'bd222e77-19fe-4dbb-8ecb-601b278aa643',
    name: 'Mécanique du point',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  inf111: {
    id: 'aaf4c508-d0ca-4fcf-af43-804063d68642',
    name: 'Informatique 1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  gmc121: {
    id: 'd4d3f70c-f243-41ff-9598-b19c5f0fa1dc',
    name: 'Technologie et sciences des matériaux',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const subjectCode = ((formData.get('subjectCode') as string) || 'mth111').toLowerCase();
    const type = ((formData.get('type') as string) || 'exam').toLowerCase(); // 'course' | 'td' | 'exam' | 'correction'
    const date = (formData.get('date') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier PDF fourni.' }, { status: 400 });
    }

    if (!title.trim()) {
      return NextResponse.json({ error: 'Le titre du document est obligatoire.' }, { status: 400 });
    }

    const meta = SUBJECT_METADATA[subjectCode] || SUBJECT_METADATA['mth111'];

    // 1. Sauvegarde dans Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storagePath = `direct/${subjectCode}/${Date.now()}-${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('academic-files')
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('Erreur upload Supabase:', uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: pubUrl } = supabase.storage
      .from('academic-files')
      .getPublicUrl(storagePath);

    const fileUrl = pubUrl.publicUrl;

    // 2. Enregistrement dans la table resources
    const { data: resource, error: insertError } = await supabase
      .from('resources')
      .insert({
        title: title.trim(),
        description: date ? `Session : ${date}` : null,
        type: type,
        subject_id: meta.id,
        semester_id: meta.semester_id,
        level_id: meta.level_id,
        storage_bucket: 'academic-files',
        storage_path: storagePath,
        file_url: fileUrl,
        file_size: buffer.length,
        file_format: 'pdf',
        status: 'published',
        visibility: 'public',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Erreur insert table resources:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Document publié avec succès dans la base de données et sur le site !',
      resource,
      fileUrl,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectCode = searchParams.get('subjectCode')?.toLowerCase();

    let query = supabase
      .from('resources')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (subjectCode && SUBJECT_METADATA[subjectCode]) {
      query = query.eq('subject_id', SUBJECT_METADATA[subjectCode].id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resources: data });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
