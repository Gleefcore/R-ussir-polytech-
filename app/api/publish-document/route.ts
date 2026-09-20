import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dztibqpfatzubvglkkki.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Clé d'accès unique maître
const VALID_KEYS = [
  'RP-ADMIN-EXCELLENCE-2026',
  'POLYTECH2026',
  ...(process.env.ADMIN_ACCESS_KEY ? [process.env.ADMIN_ACCESS_KEY.trim().toUpperCase()] : []),
];

function isAuthorized(key: string | null): boolean {
  if (!key) return false;
  return VALID_KEYS.includes(key.trim().toUpperCase());
}

// Dictionnaire officiel des 35 matières de la base Supabase
const SUBJECTS_CATALOG: Record<
  string,
  { id: string; name: string; level: 'MSP1' | 'MSP2' | 'VIP'; semester: 1 | 2; semester_id: string; level_id: string }
> = {
  // MSP1 — SEMESTRE 1
  mth111: { id: '12ec69db-66b7-4320-898d-f0d44381dedd', name: 'Analyse réelle 1', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  mth112: { id: '1ba88bfb-a116-486b-ab90-2e46f35e16d0', name: 'Algèbre Générale', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  phy111: { id: '8333d73e-4ab3-42e1-8ad0-36b76c230419', name: 'Électromagnétisme 1', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  phy112: { id: 'bd222e77-19fe-4dbb-8ecb-601b278aa643', name: 'Mécanique du point', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  phy113: { id: '2be7574b-ef79-4bab-bd75-bbdc03c2a9a4', name: 'TP Physique', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  inf111: { id: 'aaf4c508-d0ca-4fcf-af43-804063d68642', name: 'Informatique 1', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  chm111: { id: '6afd1cf2-afcd-4591-8ae9-e80d7f851d35', name: 'Éléments de Chimie', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  lng111: { id: 'af3054df-b058-4db8-8050-2ac498c7fb37', name: 'Langue (Anglais/Français)', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  mec111: { id: 'a6c88689-cbb8-4c75-be74-31b98528ce83', name: 'Dessin technique', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  eps111: { id: '3ab79463-efa7-4e85-8c0a-a21b4ac7a2fb', name: 'Comportement et Sport', level: 'MSP1', semester: 1, semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },

  // MSP1 — SEMESTRE 2
  mth121: { id: '3b3cf192-327e-413b-b8ae-5f75a248e774', name: 'Analyse réelle 2', level: 'MSP1', semester: 2, semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  mth122: { id: '12fd190a-abcc-4603-b2a2-81564ba3bbfc', name: 'Géométrie euclidienne et affine', level: 'MSP1', semester: 2, semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  mth123: { id: '92cee162-0f81-41f2-8ed2-684bd301ef1c', name: 'Algèbre linéaire', level: 'MSP1', semester: 2, semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  phy121: { id: '7ce44d10-8a9c-47ad-846a-bbe05e595231', name: 'Électromagnétisme 2', level: 'MSP1', semester: 2, semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  gmc121: { id: 'd4d3f70c-f243-41ff-9598-b19c5f0fa1dc', name: 'Technologie et sciences des matériaux', level: 'MSP1', semester: 2, semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  inf121: { id: '0fff631b-eaf6-4fed-b3d2-d9e076595201', name: 'Informatique 2', level: 'MSP1', semester: 2, semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  lng121: { id: 'b1abca9e-b125-40c2-b31f-dc4b1da91021', name: 'Langue (Anglais/Français)', level: 'MSP1', semester: 2, semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  mec121: { id: 'e21f6507-3e29-4aa3-ad82-bc77a9286c89', name: 'Dessin technique', level: 'MSP1', semester: 2, semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },
  eps121: { id: 'cc279255-22f3-4c5e-a75c-90a664b3f7ac', name: 'Comportement et Sport', level: 'MSP1', semester: 2, semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660', level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225' },

  // MSP2 — SEMESTRE 1
  mth211: { id: 'c0eee154-69c1-4003-836e-2bc01fb212eb', name: 'Algèbre multilinéaire', level: 'MSP2', semester: 1, semester_id: 'd1d9a277-f89e-4d7e-9763-04ac79ca75da', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  mth212: { id: 'f0ac6c48-dfd7-4d60-b7c4-55de79fe8ffd', name: 'Séries intégrales', level: 'MSP2', semester: 1, semester_id: 'd1d9a277-f89e-4d7e-9763-04ac79ca75da', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  mth213: { id: 'b7a49332-92f4-42bb-9e81-8ed9fe8e9df5', name: 'Probabilités et statistiques', level: 'MSP2', semester: 1, semester_id: 'd1d9a277-f89e-4d7e-9763-04ac79ca75da', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  phy211: { id: '754d884b-fe94-44ba-b7d2-17735f9348fc', name: 'Mécanique des solides', level: 'MSP2', semester: 1, semester_id: 'd1d9a277-f89e-4d7e-9763-04ac79ca75da', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  phy212: { id: 'ee9a51b0-cda8-4adb-a639-d0ed1f14167d', name: 'Électrocinétique', level: 'MSP2', semester: 1, semester_id: 'd1d9a277-f89e-4d7e-9763-04ac79ca75da', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  phy213: { id: 'f0c40d98-60ea-46f0-a3ae-6bcf1faf644c', name: 'TP Physique', level: 'MSP2', semester: 1, semester_id: 'd1d9a277-f89e-4d7e-9763-04ac79ca75da', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  inf211: { id: 'ffadbc45-5a56-4d7a-b9f2-0394b1613058', name: 'Informatique 3', level: 'MSP2', semester: 1, semester_id: 'd1d9a277-f89e-4d7e-9763-04ac79ca75da', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  lng211: { id: '4925c9ec-69e5-4c72-a381-991c6934aec1', name: 'Langue (Anglais/Français)', level: 'MSP2', semester: 1, semester_id: 'd1d9a277-f89e-4d7e-9763-04ac79ca75da', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },

  // MSP2 — SEMESTRE 2
  mth221: { id: '07bde2d9-1382-4572-9432-ee1ccd82e243', name: 'Analyse dans les espaces vectoriels', level: 'MSP2', semester: 2, semester_id: 'aa98c57d-015e-44f2-a158-93b9005e89f4', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  mth222: { id: 'b423c542-65e7-4d77-a8e6-a0aa9a87409c', name: 'Analyse numérique', level: 'MSP2', semester: 2, semester_id: 'aa98c57d-015e-44f2-a158-93b9005e89f4', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  ele221: { id: '6fbc7d09-0ef8-4b13-800e-26899f39203e', name: 'Circuits électriques et électroniques', level: 'MSP2', semester: 2, semester_id: 'aa98c57d-015e-44f2-a158-93b9005e89f4', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  phy221: { id: '5fe9c96d-209c-4e18-a71a-bc97ee56917e', name: 'Optique géométrique et ondulatoire', level: 'MSP2', semester: 2, semester_id: 'aa98c57d-015e-44f2-a158-93b9005e89f4', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  phy222: { id: 'ca3d6685-5b64-4ea8-ab58-0d29dcea2547', name: 'Thermodynamique', level: 'MSP2', semester: 2, semester_id: 'aa98c57d-015e-44f2-a158-93b9005e89f4', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  mec221: { id: 'f8757c0b-0ba8-4dce-8c6d-95c0f1224b3e', name: 'Statique', level: 'MSP2', semester: 2, semester_id: 'aa98c57d-015e-44f2-a158-93b9005e89f4', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  inf221: { id: '1faf9e6e-3b00-4d2a-97e0-63d9587491a9', name: 'Informatique 4', level: 'MSP2', semester: 2, semester_id: 'aa98c57d-015e-44f2-a158-93b9005e89f4', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },
  lng222: { id: '06b6f73c-fc3e-4414-9b25-b79e070f6b76', name: 'Langue (Anglais/Français)', level: 'MSP2', semester: 2, semester_id: 'aa98c57d-015e-44f2-a158-93b9005e89f4', level_id: 'b83edd42-d8b4-460b-8d9f-7877de9b5218' },

  // ESPACE VIP INGÉNIEUR ENTREPRENEUR
  vip_tech: { id: 'vip-tech-program', name: 'VIP : Volet Technique & Outils Métiers', level: 'VIP', semester: 1, semester_id: 'vip-sem', level_id: 'vip-level' },
  vip_strat: { id: 'vip-strat-program', name: 'VIP : Volet Stratégie & Leadership', level: 'VIP', semester: 1, semester_id: 'vip-sem', level_id: 'vip-level' },
  vip_projets: { id: 'vip-projets-program', name: 'VIP : Projets & Bureau G-INNOVA', level: 'VIP', semester: 2, semester_id: 'vip-sem', level_id: 'vip-level' },
};

// 1. GET — Lister les documents (tous ou par matière)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const subjectCode = searchParams.get('subjectCode')?.toLowerCase();

    if (subjectCode) {
      const meta = SUBJECTS_CATALOG[subjectCode];
      if (!meta) {
        return NextResponse.json({ resources: [] });
      }

      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('status', 'published')
        .eq('subject_id', meta.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json({ resources: data || [] });
    }

    // Récupérer tous les documents pour le cockpit administrateur
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ resources: data || [], catalog: SUBJECTS_CATALOG });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// 2. POST — Publier un nouveau document (MSP1, MSP2, VIP)
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const accessKey = formData.get('accessKey') as string;
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || '';
    const subjectCode = ((formData.get('subjectCode') as string) || 'mth111').toLowerCase();
    const type = ((formData.get('type') as string) || 'exam').toLowerCase();
    const date = (formData.get('date') as string) || '';

    if (!isAuthorized(accessKey)) {
      return NextResponse.json({ error: 'Code d\'accès administrateur invalide.' }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Fichier PDF requis.' }, { status: 400 });
    }

    if (!title.trim()) {
      return NextResponse.json({ error: 'Le titre du document est obligatoire.' }, { status: 400 });
    }

    const meta = SUBJECTS_CATALOG[subjectCode];
    if (!meta) {
      return NextResponse.json({ error: 'Matière inconnue : ' + subjectCode }, { status: 400 });
    }

    // Sauvegarde dans Supabase Storage
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
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: pubUrl } = supabase.storage.from('academic-files').getPublicUrl(storagePath);

    // Insertion dans la table resources
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
        file_url: pubUrl.publicUrl,
        file_size: buffer.length,
        file_format: 'pdf',
        status: 'published',
        visibility: 'public',
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Document "${title}" publié avec succès sous ${meta.name} (${meta.level}) !`,
      resource,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// 3. DELETE — Retirer (supprimer) une épreuve ou un document
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const accessKey = req.headers.get('x-admin-key') || searchParams.get('accessKey');

    if (!isAuthorized(accessKey)) {
      return NextResponse.json({ error: 'Code d\'accès administrateur requis pour supprimer.' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Identifiant du document requis.' }, { status: 400 });
    }

    // Récupérer le storage_path
    const { data: doc } = await supabase.from('resources').select('storage_path, storage_bucket').eq('id', id).single();

    if (doc?.storage_path) {
      await supabase.storage.from(doc.storage_bucket || 'academic-files').remove([doc.storage_path]);
    }

    const { error: deleteError } = await supabase.from('resources').delete().eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Le document a été retiré avec succès.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// 4. PATCH — Modifier les métadonnées d'une épreuve (titre, session, type)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, accessKey, title, description, type } = body;

    if (!isAuthorized(accessKey)) {
      return NextResponse.json({ error: 'Code d\'accès administrateur requis pour modifier.' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'ID requis.' }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (title) updates.title = title.trim();
    if (description !== undefined) updates.description = description ? description.trim() : null;
    if (type) updates.type = type.toLowerCase();

    const { error: updateError } = await supabase.from('resources').update(updates).eq('id', id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Document mis à jour avec succès.' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
