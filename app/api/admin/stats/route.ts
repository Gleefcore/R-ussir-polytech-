import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Résilience réseau proxy/local
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

// Dictionnaire officiel des 35 matières
const SUBJECTS_CATALOG: Record<
  string,
  { id: string; name: string; level: 'MSP1' | 'MSP2' | 'VIP'; semester: 1 | 2; code: string }
> = {
  // MSP1 — SEMESTRE 1
  mth111: { id: '12ec69db-66b7-4320-898d-f0d44381dedd', code: 'MTH111', name: 'Analyse réelle 1', level: 'MSP1', semester: 1 },
  mth112: { id: '1ba88bfb-a116-486b-ab90-2e46f35e16d0', code: 'MTH112', name: 'Algèbre Générale', level: 'MSP1', semester: 1 },
  phy111: { id: '8333d73e-4ab3-42e1-8ad0-36b76c230419', code: 'PHY111', name: 'Électromagnétisme 1', level: 'MSP1', semester: 1 },
  phy112: { id: 'bd222e77-19fe-4dbb-8ecb-601b278aa643', code: 'PHY112', name: 'Mécanique du point', level: 'MSP1', semester: 1 },
  phy113: { id: '2be7574b-ef79-4bab-bd75-bbdc03c2a9a4', code: 'PHY113', name: 'TP Physique', level: 'MSP1', semester: 1 },
  inf111: { id: 'aaf4c508-d0ca-4fcf-af43-804063d68642', code: 'INF111', name: 'Informatique 1', level: 'MSP1', semester: 1 },
  chm111: { id: '6afd1cf2-afcd-4591-8ae9-e80d7f851d35', code: 'CHM111', name: 'Éléments de Chimie', level: 'MSP1', semester: 1 },
  lng111: { id: 'af3054df-b058-4db8-8050-2ac498c7fb37', code: 'LNG111', name: 'Langue (Anglais/Français)', level: 'MSP1', semester: 1 },
  mec111: { id: 'a6c88689-cbb8-4c75-be74-31b98528ce83', code: 'MEC111', name: 'Dessin technique', level: 'MSP1', semester: 1 },
  eps111: { id: '3ab79463-efa7-4e85-8c0a-a21b4ac7a2fb', code: 'EPS111', name: 'Comportement et Sport', level: 'MSP1', semester: 1 },

  // MSP1 — SEMESTRE 2
  mth121: { id: '3b3cf192-327e-413b-b8ae-5f75a248e774', code: 'MTH121', name: 'Analyse réelle 2', level: 'MSP1', semester: 2 },
  mth122: { id: '12fd190a-abcc-4603-b2a2-81564ba3bbfc', code: 'MTH122', name: 'Géométrie euclidienne et affine', level: 'MSP1', semester: 2 },
  mth123: { id: '92cee162-0f81-41f2-8ed2-684bd301ef1c', code: 'MTH123', name: 'Algèbre linéaire', level: 'MSP1', semester: 2 },
  phy121: { id: '7ce44d10-8a9c-47ad-846a-bbe05e595231', code: 'PHY121', name: 'Électromagnétisme 2', level: 'MSP1', semester: 2 },
  gmc121: { id: 'd4d3f70c-f243-41ff-9598-b19c5f0fa1dc', code: 'GMC121', name: 'Technologie et sciences des matériaux', level: 'MSP1', semester: 2 },
  inf121: { id: '0fff631b-eaf6-4fed-b3d2-d9e076595201', code: 'INF121', name: 'Informatique 2', level: 'MSP1', semester: 2 },
  lng121: { id: 'b1abca9e-b125-40c2-b31f-dc4b1da91021', code: 'LNG121', name: 'Langue (Anglais/Français)', level: 'MSP1', semester: 2 },
  mec121: { id: 'e21f6507-3e29-4aa3-ad82-bc77a9286c89', code: 'MEC121', name: 'Dessin technique', level: 'MSP1', semester: 2 },
  eps121: { id: 'cc279255-22f3-4c5e-a75c-90a664b3f7ac', code: 'EPS121', name: 'Comportement et Sport', level: 'MSP1', semester: 2 },

  // MSP2 — SEMESTRE 1
  mth211: { id: 'c0eee154-69c1-4003-836e-2bc01fb212eb', code: 'MTH211', name: 'Algèbre multilinéaire', level: 'MSP2', semester: 1 },
  mth212: { id: 'f0ac6c48-dfd7-4d60-b7c4-55de79fe8ffd', code: 'MTH212', name: 'Séries intégrales', level: 'MSP2', semester: 1 },
  mth213: { id: 'b7a49332-92f4-42bb-9e81-8ed9fe8e9df5', code: 'MTH213', name: 'Probabilités et statistiques', level: 'MSP2', semester: 1 },
  phy211: { id: '754d884b-fe94-44ba-b7d2-17735f9348fc', code: 'PHY211', name: 'Mécanique des solides', level: 'MSP2', semester: 1 },
  phy212: { id: 'ee9a51b0-cda8-4adb-a639-d0ed1f14167d', code: 'PHY212', name: 'Électrocinétique', level: 'MSP2', semester: 1 },
  phy213: { id: 'f0c40d98-60ea-46f0-a3ae-6bcf1faf644c', code: 'PHY213', name: 'TP Physique', level: 'MSP2', semester: 1 },
  inf211: { id: 'ffadbc45-5a56-4d7a-b9f2-0394b1613058', code: 'INF211', name: 'Informatique 3', level: 'MSP2', semester: 1 },
  lng211: { id: '4925c9ec-69e5-4c72-a381-991c6934aec1', code: 'LNG211', name: 'Langue (Anglais/Français)', level: 'MSP2', semester: 1 },

  // MSP2 — SEMESTRE 2
  mth221: { id: '07bde2d9-1382-4572-9432-ee1ccd82e243', code: 'MTH221', name: 'Analyse dans les espaces vectoriels', level: 'MSP2', semester: 2 },
  mth222: { id: 'b423c542-65e7-4d77-a8e6-a0aa9a87409c', code: 'MTH222', name: 'Analyse numérique', level: 'MSP2', semester: 2 },
  ele221: { id: '6fbc7d09-0ef8-4b13-800e-26899f39203e', code: 'ELE221', name: 'Circuits électriques et électroniques', level: 'MSP2', semester: 2 },
  phy221: { id: '5fe9c96d-209c-4e18-a71a-bc97ee56917e', code: 'PHY221', name: 'Optique géométrique et ondulatoire', level: 'MSP2', semester: 2 },
  phy222: { id: 'ca3d6685-5b64-4ea8-ab58-0d29dcea2547', code: 'PHY222', name: 'Thermodynamique', level: 'MSP2', semester: 2 },
  mec221: { id: 'f8757c0b-0ba8-4dce-8c6d-95c0f1224b3e', code: 'MEC221', name: 'Statique', level: 'MSP2', semester: 2 },
  inf221: { id: '1faf9e6e-3b00-4d2a-97e0-63d9587491a9', code: 'INF221', name: 'Informatique 4', level: 'MSP2', semester: 2 },
  lng222: { id: '06b6f73c-fc3e-4414-9b25-b79e070f6b76', code: 'LNG222', name: 'Langue (Anglais/Français)', level: 'MSP2', semester: 2 },

  // VIP
  vip_tech: { id: 'vip-tech-program', code: 'VIP-TECH', name: 'VIP : Volet Technique (Bikey Yannick)', level: 'VIP', semester: 1 },
  vip_strat: { id: 'vip-strat-program', code: 'VIP-STRAT', name: 'VIP : Volet Stratégie (Eugène Gwet)', level: 'VIP', semester: 1 },
  vip_projets: { id: 'vip-projets-program', code: 'VIP-PROJ', name: 'VIP : Projets & Bureau G-INNOVA', level: 'VIP', semester: 2 },
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const key = req.headers.get('x-admin-key') || searchParams.get('accessKey');

    if (!isAuthorized(key)) {
      return NextResponse.json({ error: 'Accès non autorisé.' }, { status: 401 });
    }

    const noCacheHeaders = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
    };

    // 1. Récupération parallèle : Utilisateurs, Ressources, Demandes
    const [usersRes, resourcesRes, requestsRes] = await Promise.all([
      supabase.auth.admin.listUsers({ perPage: 1000 }),
      supabase.from('resources').select('*').order('created_at', { ascending: false }),
      supabase.from('correction_requests').select('*').order('created_at', { ascending: false }),
    ]);

    // 2. Traitement des élèves
    const rawUsers = usersRes.data?.users || [];
    const students = rawUsers.map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.user_metadata?.full_name || 'Élève Polytech',
      matricule: u.user_metadata?.matricule || 'N/A',
      phone: u.user_metadata?.phone || u.phone || 'N/A',
      level: u.user_metadata?.level || 'MSP1',
      confirmed: !!u.email_confirmed_at,
      createdAt: u.created_at,
      lastSignIn: u.last_sign_in_at,
    }));

    const totalStudents = students.length;
    const studentsByLevel = {
      MSP1: students.filter((s) => s.level === 'MSP1').length,
      MSP2: students.filter((s) => s.level === 'MSP2').length,
      ALUMNI: students.filter((s) => s.level === 'ALUMNI' || s.level === 'VIP').length,
    };

    // 3. Traitement des documents
    const rawResources = resourcesRes.data || [];
    const totalDocs = rawResources.length;

    const docsByType = {
      course: rawResources.filter((r) => r.type?.toLowerCase() === 'course').length,
      td: rawResources.filter((r) => r.type?.toLowerCase() === 'td').length,
      exam: rawResources.filter((r) => r.type?.toLowerCase() === 'exam').length,
      correction: rawResources.filter((r) => r.type?.toLowerCase() === 'correction').length,
    };

    // Calcul par matière
    const subjectStats = Object.entries(SUBJECTS_CATALOG).map(([key, meta]) => {
      const matched = rawResources.filter((r) => {
        if (r.subject_id === meta.id) return true;
        if (r.storage_path && r.storage_path.toLowerCase().includes(`/${key}/`)) return true;
        return false;
      });

      return {
        key,
        id: meta.id,
        code: meta.code,
        name: meta.name,
        level: meta.level,
        semester: meta.semester,
        total: matched.length,
        courseCount: matched.filter((r) => r.type?.toLowerCase() === 'course').length,
        tdCount: matched.filter((r) => r.type?.toLowerCase() === 'td').length,
        examCount: matched.filter((r) => r.type?.toLowerCase() === 'exam').length,
        correctionCount: matched.filter((r) => r.type?.toLowerCase() === 'correction').length,
      };
    });

    // Matières avec au moins 1 document
    const subjectsWithDocs = subjectStats.filter((s) => s.total > 0).length;
    const totalOfficialSubjects = Object.keys(SUBJECTS_CATALOG).length; // 35
    const coverageRate = Math.round((subjectsWithDocs / totalOfficialSubjects) * 100);

    // 4. Demandes de correction
    const correctionRequests = requestsRes.data || [];

    return NextResponse.json(
      {
        success: true,
        summary: {
          totalStudents,
          studentsByLevel,
          totalDocs,
          docsByType,
          totalOfficialSubjects,
          subjectsWithDocs,
          coverageRate,
          totalCorrectionRequests: correctionRequests.length,
        },
        subjectStats,
        documents: rawResources,
        students,
        correctionRequests,
      },
      { headers: noCacheHeaders }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erreur interne';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
