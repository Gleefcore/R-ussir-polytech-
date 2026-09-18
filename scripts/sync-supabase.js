const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Charger dynamiquement .env.local si les variables ne sont pas définies
if (!process.env.SUPABASE_SERVICE_ROLE_KEY && fs.existsSync(path.join(__dirname, '../.env.local'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
  for (const line of envContent.split('\n')) {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] = v.join('=').trim();
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SUBJECT_MAP = {
  'mth111': {
    id: '12ec69db-66b7-4320-898d-f0d44381dedd',
    name: 'Analyse réelle 1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225'
  },
  'mth112': {
    id: '1ba88bfb-a116-486b-ab90-2e46f35e16d0',
    name: 'Algèbre Générale',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225'
  },
  'phy111': {
    id: '8333d73e-4ab3-42e1-8ad0-36b76c230419',
    name: 'Électromagnétisme 1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225'
  },
  'phy112': {
    id: 'bd222e77-19fe-4dbb-8ecb-601b278aa643',
    name: 'Mécanique du point',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225'
  },
  'inf111': {
    id: 'aaf4c508-d0ca-4fcf-af43-804063d68642',
    name: 'Informatique 1',
    semester_id: '93ca6e19-499f-49fb-b815-1eabb6915cbf',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225'
  },
  'gmc121': {
    id: 'd4d3f70c-f243-41ff-9598-b19c5f0fa1dc',
    name: 'Technologie et sciences des matériaux',
    semester_id: 'c382a4e8-ad53-4d47-bb44-bf1c00092660',
    level_id: '5dc49dcd-ca54-4c2d-bea5-157fb41cb225'
  }
};

const DOCUMENTS_TO_SYNC = [
  // ANALYSE 1 (MTH111)
  {
    subjectCode: 'mth111',
    type: 'exam',
    title: 'Examen Final Analyse Réelle 1 (2025-2026) — Pr E. Takou',
    filename: 'examen-analyse-reelle1-2025-2026.pdf'
  },
  {
    subjectCode: 'mth111',
    type: 'exam',
    title: 'Examen Final Analyse Réelle 1 (2024-2025) — Pr E. Takou',
    filename: 'examen-analyse-reelle1-2024-2025.pdf'
  },
  {
    subjectCode: 'mth111',
    type: 'exam',
    title: 'Contrôle Continu N°1 Analyse Réelle 1 (2024-2025) — Pr E. Takou',
    filename: 'cc1-analyse-reelle1-2024-2025.pdf'
  },
  {
    subjectCode: 'mth111',
    type: 'exam',
    title: 'Contrôle Continu N°1 Analyse Réelle 1 (2022-2023) — Pr E. Takou',
    filename: 'cc1-analyse-reelle1-2022-2023.pdf'
  },
  {
    subjectCode: 'mth111',
    type: 'exam',
    title: 'Contrôle Continu N°1 Analyse Réelle 1 (2020-2021) — Pr E. Takou',
    filename: 'cc1-analyse-reelle1-2020-2021.pdf'
  },
  {
    subjectCode: 'mth111',
    type: 'exam',
    title: 'Contrôle Continu N°1 Analyse Réelle 1 (2015-2016) — Dr E. Takou',
    filename: 'cc1-analyse-reelle1-2015-2016.pdf'
  },

  // ALGÈBRE 1 (MTH112)
  {
    subjectCode: 'mth112',
    type: 'course',
    title: 'Cours d\'Algèbre Générale de l\'ENSPY (118 pages) — Pr Bouetou Bouetou Thomas',
    filename: 'cours-algebre-generale-polytechnique-bouetou.pdf'
  },
  {
    subjectCode: 'mth112',
    type: 'exam',
    title: 'Contrôle Continu Algèbre 1 (Novembre 2024) — Dr Yatat Valaire',
    filename: 'cc1-algebre1-nov-2024-yatat.pdf'
  },
  {
    subjectCode: 'mth112',
    type: 'exam',
    title: 'Examen Algèbre 1 (Janvier 2024) — Dr Yatat Valaire',
    filename: 'examen-algebre1-janvier-2024-yatat.pdf'
  },
  {
    subjectCode: 'mth112',
    type: 'exam',
    title: 'Examen 1er Semestre Algèbre (Janvier 2023) — Pr Bouetou Bouetou',
    filename: 'examen-algebre1-janvier-2023-bouetou.pdf'
  },
  {
    subjectCode: 'mth112',
    type: 'exam',
    title: 'Examen Semestriel Algèbre 1 (Janvier 2022)',
    filename: 'examen-algebre1-janvier-2022.pdf'
  },
  {
    subjectCode: 'mth112',
    type: 'exam',
    title: 'Contrôle Continu Algèbre (Novembre 2021) — Pr Bouetou Bouetou',
    filename: 'cc1-algebre1-nov-2021-bouetou.pdf'
  },
  {
    subjectCode: 'mth112',
    type: 'exam',
    title: 'Contrôle Continu Algèbre (Décembre 2020)',
    filename: 'cc1-algebre1-dec-2020.pdf'
  },

  // PHYSIQUE (PHY111 & PHY112)
  {
    subjectCode: 'phy111',
    type: 'course',
    title: 'Polycopié d\'Électromagnétisme avec exercices (113 pages) — Dr Sidi Mohammed Remaoun',
    filename: 'cours-electromagnetisme-remaoun.pdf'
  },
  {
    subjectCode: 'phy112',
    type: 'course',
    title: 'Cours de Mécanique 1 (31 pages) — Dr Roger Djob (ENSPY / Éséka)',
    filename: 'cours-mecanique1-enspy-djob.pdf'
  },

  // INFORMATIQUE 1 (INF111)
  {
    subjectCode: 'inf111',
    type: 'exam',
    title: 'Examen STI 1021 — Informatique 1 (Janvier 2025)',
    filename: 'examen-info1-janvier-2025.pdf'
  },
  {
    subjectCode: 'inf111',
    type: 'exam',
    title: 'Contrôle Continu 1 — Algorithmique (2025-2026)',
    filename: 'cc1-algorithmique-2025-2026.pdf'
  },
  {
    subjectCode: 'inf111',
    type: 'exam',
    title: 'Contrôle Continu — Informatique 1 (2024-2025)',
    filename: 'cc-info1-2024-2025.pdf'
  },
  {
    subjectCode: 'inf111',
    type: 'td',
    title: 'Fiche de TD STI 1021 — Algorithmes & Complexité',
    filename: 'td-info1-sti1021.pdf'
  },

  // TSM (GMC121)
  {
    subjectCode: 'gmc121',
    type: 'course',
    title: 'Cours TSM — Chapitre 1 : Définition, Classification et Élaboration des Matériaux (Jean Calvin Bidoung)',
    filename: 'cours-tsm-chapitre1-materiaux-bidoung.pdf'
  }
];

async function syncAll() {
  console.log(`Starting synchronization of ${DOCUMENTS_TO_SYNC.length} documents to Supabase...`);

  for (const doc of DOCUMENTS_TO_SYNC) {
    const localPath = path.join(__dirname, '../public/documents/msp1', doc.filename);
    if (!fs.existsSync(localPath)) {
      console.warn(`File not found locally: ${localPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const storagePath = `msp1/${doc.filename}`;

    console.log(`Uploading ${doc.filename} to Supabase Storage (academic-files)...`);
    const { error: uploadError } = await supabase.storage
      .from('academic-files')
      .upload(storagePath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error(`Upload error for ${doc.filename}:`, uploadError.message);
    } else {
      console.log(`✓ Uploaded ${doc.filename}`);
    }

    const { data: pubUrl } = supabase.storage
      .from('academic-files')
      .getPublicUrl(storagePath);

    const publicUrl = pubUrl ? pubUrl.publicUrl : `/documents/msp1/${doc.filename}`;
    const subjectInfo = SUBJECT_MAP[doc.subjectCode];

    if (subjectInfo) {
      // Check if already in table
      const { data: existing } = await supabase
        .from('resources')
        .select('id')
        .eq('subject_id', subjectInfo.id)
        .eq('title', doc.title)
        .maybeSingle();

      if (!existing) {
        const { error: insertError } = await supabase.from('resources').insert({
          title: doc.title,
          type: doc.type,
          subject_id: subjectInfo.id,
          semester_id: subjectInfo.semester_id,
          level_id: subjectInfo.level_id,
          storage_bucket: 'academic-files',
          storage_path: storagePath,
          file_url: publicUrl,
          file_size: fileBuffer.length,
          file_format: 'pdf',
          status: 'published',
          visibility: 'public'
        });

        if (insertError) {
          console.error(`DB insert error for ${doc.title}:`, insertError.message);
        } else {
          console.log(`✓ Stored in Supabase DB: ${doc.title}`);
        }
      } else {
        console.log(`- Already registered in Supabase DB: ${doc.title}`);
      }
    }
  }

  console.log('All documents successfully synchronized to Supabase!');
}

syncAll().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
