import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Clé d'accès administrateur par défaut pour l'équipe (configurable dans les variables d'environnement)
const ADMIN_ACCESS_KEY = process.env.ADMIN_ACCESS_KEY || 'POLYTECH2026';

const SUBJECT_METADATA: Record<
  string,
  { id: string; name: string; semester: 1 | 2; level: 'MSP1' | 'MSP2'; semester_id: string; level_id: string }
> = {
  // MSP1 — SEMESTRE 1
  mth111: {
    id: '12ec69db-66b7-4320-898d-f0d44381dedd',
    name: 'Analyse réelle 1',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  mth112: {
    id: '1ba88bfb-a116-486b-ab90-2e46f35e16d0',
    name: 'Algèbre Générale',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  phy111: {
    id: '8333d73e-4ab3-42e1-8ad0-36b76c230419',
    name: 'Électromagnétisme 1',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  phy112: {
    id: 'bd222e77-19fe-4dbb-8ecb-601b278aa643',
    name: 'Mécanique du point',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  phy113: {
    id: '2be7574b-ef79-4bab-bd75-bbdc03c2a9a4',
    name: 'TP Physique',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  inf111: {
    id: 'aaf4c508-d0ca-4fcf-af43-804063d68642',
    name: 'Informatique 1',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  chm111: {
    id: '6afd1cf2-afcd-4591-8ae9-e80d7f851d35',
    name: 'Éléments de Chimie',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  lng111: {
    id: 'af3054df-b058-4db8-8050-2ac498c7fb37',
    name: 'Langue (Anglais/Français)',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  mec111: {
    id: 'a6c88689-cbb8-4c75-be74-31b98528ce83',
    name: 'Dessin technique',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  eps111: {
    id: '3ab79463-efa7-4e85-8c0a-a21b4ac7a2fb',
    name: 'Comportement et Sport',
    semester: 1,
    level: 'MSP1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },

  // MSP1 — SEMESTRE 2
  mth121: {
    id: '3b3cf192-327e-413b-b8ae-5f75a248e774',
    name: 'Analyse réelle 2',
    semester: 2,
    level: 'MSP1',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  mth122: {
    id: '12fd190a-abcc-4603-b2a2-81564ba3bbfc',
    name: 'Géométrie euclidienne et affine',
    semester: 2,
    level: 'MSP1',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  mth123: {
    id: '92cee162-0f81-41f2-8ed2-684bd301ef1c',
    name: 'Algèbre linéaire',
    semester: 2,
    level: 'MSP1',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  phy121: {
    id: '7ce44d10-8a9c-47ad-846a-bbe05e595231',
    name: 'Électromagnétisme 2',
    semester: 2,
    level: 'MSP1',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  gmc121: {
    id: 'd4d3f70c-f243-41ff-9598-b19c5f0fa1dc',
    name: 'Technologie et sciences des matériaux',
    semester: 2,
    level: 'MSP1',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  inf121: {
    id: '0fff631b-eaf6-4fed-b3d2-d9e076595201',
    name: 'Informatique 2',
    semester: 2,
    level: 'MSP1',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  lng121: {
    id: 'b1abca9e-b125-40c2-b31f-dc4b1da91021',
    name: 'Langue (Anglais/Français)',
    semester: 2,
    level: 'MSP1',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  mec121: {
    id: 'e21f6507-3e29-4aa3-ad82-bc77a9286c89',
    name: 'Dessin technique',
    semester: 2,
    level: 'MSP1',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
  eps121: {
    id: 'cc279255-22f3-4c5e-a75c-90a664b3f7ac',
    name: 'Comportement et Sport',
    semester: 2,
    level: 'MSP1',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225',
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const accessKey = (formData.get('accessKey') as string) || '';
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const subjectCode = ((formData.get('subjectCode') as string) || 'mth111').toLowerCase();
    const type = ((formData.get('type') as string) || 'exam').toLowerCase(); // 'course' | 'td' | 'exam' | 'correction'
    const date = (formData.get('date') as string) || '';

    // Vérification de la clé d'accès administrateur
    if (!accessKey || accessKey.trim() !== ADMIN_ACCESS_KEY.trim()) {
      return NextResponse.json(
        { error: 'Clé d\'accès administrateur incorrecte. Veuillez saisir la clé d\'équipe.' },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier PDF fourni.' }, { status: 400 });
    }

    if (!title.trim()) {
      return NextResponse.json({ error: 'Le titre du document est obligatoire.' }, { status: 400 });
    }

    const meta = SUBJECT_METADATA[subjectCode];
    if (!meta) {
      return NextResponse.json({ error: `Matière "${subjectCode}" inconnue.` }, { status: 400 });
    }

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

    // 2. Enregistrement strict dans la table resources avec l'exact subject_id
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
      message: `Document "${title}" enregistré avec succès sous ${meta.name} (${subjectCode.toUpperCase()}) !`,
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

    // Filtre strict : si subjectCode est fourni, on filtre EXCLUSIVEMENT sur le subject_id exact
    if (subjectCode) {
      const meta = SUBJECT_METADATA[subjectCode];
      if (!meta) {
        // Code matière inexistant -> on ne renvoie rien pour éviter de mélanger des matières
        return NextResponse.json({ resources: [] });
      }

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('status', 'published')
        .eq('subject_id', meta.id)
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ resources: data || [] });
    }

    // Si aucun subjectCode n'est spécifié (pour la vue admin générale)
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ resources: data || [] });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
