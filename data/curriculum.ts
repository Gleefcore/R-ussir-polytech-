export interface Resource {
  type: 'COURS' | 'TD' | 'EXAMEN' | 'CORRECTION';
  label: string;
  url?: string;
  isPaid: boolean;
  filename?: string;
  items?: Array<{ title: string; url: string; date?: string }>;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  semester: 1 | 2;
  level: 'MSP1' | 'MSP2';
  resources: Resource[];
}

const createDefaultResources = (): Resource[] => [
  { type: 'COURS', label: 'Polycopié de cours', isPaid: false },
  { type: 'TD', label: 'Fiche de Travaux Dirigés', isPaid: false },
  { type: 'EXAMEN', label: 'Épreuves & Examens officiels', isPaid: false },
  { type: 'CORRECTION', label: 'Corrections officielles', isPaid: true },
];

export const curriculum: Subject[] = [
  {
    id: 'mth111',
    code: 'MTH111',
    name: 'Analyse réelle 1',
    semester: 1,
    level: 'MSP1',
    resources: [
      {
        type: 'COURS',
        label: 'Polycopié de cours',
        isPaid: false,
      },
      {
        type: 'TD',
        label: 'Fiches de TD & Exercices',
        url: '/documents/msp1/cc1-analyse-reelle1-2024-2025.pdf',
        isPaid: false,
        items: [
          { title: 'Exercices d\'Analyse Réelle 1 — Bornes Sup/Inf, Suites & Adhérence', url: '/documents/msp1/cc1-analyse-reelle1-2024-2025.pdf', date: 'Session 2024-2025' },
          { title: 'Exercices d\'Analyse Réelle 1 — Topologie, Suites, Épargne & Bosquets', url: '/documents/msp1/cc1-analyse-reelle1-2022-2023.pdf', date: 'Session 2022-2023' },
          { title: 'Exercices d\'Analyse Réelle 1 — Bornes Sup/Inf, Suites & Topologie', url: '/documents/msp1/cc1-analyse-reelle1-2020-2021.pdf', date: 'Session 2020-2021' },
          { title: 'Exercices d\'Analyse Réelle 1 — Parties majorées, Adhérence, Limites', url: '/documents/msp1/cc1-analyse-reelle1-2015-2016.pdf', date: 'Session 2015-2016' },
        ],
      },
      {
        type: 'EXAMEN',
        label: 'Examens & CC Officiels',
        url: '/documents/msp1/cc1-analyse-reelle1-2024-2025.pdf',
        isPaid: false,
        items: [
          { title: 'Contrôle Continu N°1 — Analyse Réelle 1 (Pr E. Takou)', url: '/documents/msp1/cc1-analyse-reelle1-2024-2025.pdf', date: 'Novembre 2024' },
          { title: 'Contrôle Continu N°1 — Analyse Réelle 1 (Pr E. Takou)', url: '/documents/msp1/cc1-analyse-reelle1-2022-2023.pdf', date: 'Novembre 2022' },
          { title: 'Contrôle Continu N°1 — Analyse Réelle 1 (Pr E. Takou)', url: '/documents/msp1/cc1-analyse-reelle1-2020-2021.pdf', date: 'Décembre 2020' },
          { title: 'Contrôle Continu N°1 — Analyse Réelle 1 (Dr E. Takou)', url: '/documents/msp1/cc1-analyse-reelle1-2015-2016.pdf', date: 'Novembre 2015' },
        ],
      },
      {
        type: 'CORRECTION',
        label: 'Corrections Détaillées',
        isPaid: true,
      },
    ],
  },
  {
    id: 'mth112',
    code: 'MTH112',
    name: 'Algèbre Générale',
    semester: 1,
    level: 'MSP1',
    resources: [
      {
        type: 'COURS',
        label: 'Polycopié de cours magistral',
        url: '/documents/msp1/cours-algebre-generale-polytechnique-bouetou.pdf',
        isPaid: false,
        items: [
          { title: 'Cours d\'Algèbre Générale de l\'ENSPY (118 pages) — Pr Bouetou Bouetou Thomas', url: '/documents/msp1/cours-algebre-generale-polytechnique-bouetou.pdf', date: 'Édition 2022' },
        ],
      },
      {
        type: 'TD',
        label: 'Fiches de Travaux Dirigés',
        isPaid: false,
      },
      {
        type: 'EXAMEN',
        label: 'Épreuves & Examens officiels',
        isPaid: false,
      },
      {
        type: 'CORRECTION',
        label: 'Corrections Détaillées',
        isPaid: true,
      },
    ],
  },
  {
    id: 'phy111',
    code: 'PHY111',
    name: 'Électromagnétisme 1',
    semester: 1,
    level: 'MSP1',
    resources: [
      {
        type: 'COURS',
        label: 'Polycopié de cours magistral',
        url: '/documents/msp1/cours-electromagnetisme-remaoun.pdf',
        isPaid: false,
        items: [
          { title: 'Polycopié d\'Électromagnétisme avec exercices (113 pages) — Dr Sidi Mohammed Remaoun', url: '/documents/msp1/cours-electromagnetisme-remaoun.pdf', date: 'Master & Licence' },
        ],
      },
      {
        type: 'TD',
        label: 'Exercices & Travaux Dirigés',
        url: '/documents/msp1/cours-electromagnetisme-remaoun.pdf',
        isPaid: false,
        items: [
          { title: 'Exercices résolus d\'Électrostatique, Magnétostatique et Régimes variables', url: '/documents/msp1/cours-electromagnetisme-remaoun.pdf', date: 'Inclus dans polycopié' },
        ],
      },
      {
        type: 'EXAMEN',
        label: 'Épreuves & Examens officiels',
        isPaid: false,
      },
      {
        type: 'CORRECTION',
        label: 'Corrections Détaillées',
        isPaid: true,
      },
    ],
  },
  {
    id: 'phy112',
    code: 'PHY112',
    name: 'Mécanique du point',
    semester: 1,
    level: 'MSP1',
    resources: [
      {
        type: 'COURS',
        label: 'Polycopié de cours magistral',
        url: '/documents/msp1/cours-mecanique1-enspy-djob.pdf',
        isPaid: false,
        items: [
          { title: 'Cours de Mécanique 1 (31 pages) — Dr Roger Djob (ENSPY / Éséka)', url: '/documents/msp1/cours-mecanique1-enspy-djob.pdf', date: '2025/2026' },
        ],
      },
      {
        type: 'TD',
        label: 'Fiches de Travaux Dirigés',
        isPaid: false,
      },
      {
        type: 'EXAMEN',
        label: 'Épreuves & Examens officiels',
        isPaid: false,
      },
      {
        type: 'CORRECTION',
        label: 'Corrections Détaillées',
        isPaid: true,
      },
    ],
  },
  { id: 'phy113', code: 'PHY113', name: 'TP Physique', semester: 1, level: 'MSP1', resources: createDefaultResources() },
  
  // INFORMATIQUE 1 — ÉPREUVES RÉELLES OFFICIELLES CHARGÉES
  {
    id: 'inf111',
    code: 'INF111',
    name: 'Informatique 1 (STI 1021 / Algorithmique)',
    semester: 1,
    level: 'MSP1',
    resources: [
      {
        type: 'COURS',
        label: 'Polycopié de cours',
        isPaid: false,
      },
      {
        type: 'TD',
        label: 'Fiches de TD Officielles',
        url: '/documents/msp1/td-info1-sti1021.pdf',
        isPaid: false,
        items: [
          { title: 'TD STI 1021 — Algorithmes, Complexité, DL & Sub-Programs', url: '/documents/msp1/td-info1-sti1021.pdf', date: '2024-2025' },
        ],
      },
      {
        type: 'EXAMEN',
        label: 'Examens & CC Officiels',
        url: '/documents/msp1/examen-info1-janvier-2025.pdf',
        isPaid: false,
        items: [
          { title: 'Examen STI 1021 — Informatique 1 (Arbre, Hash, DL ln(x))', url: '/documents/msp1/examen-info1-janvier-2025.pdf', date: 'Janvier 2025' },
          { title: 'Contrôle Continu 1 — Algorithmique (Complexité O(ln n), Suites, C/Java)', url: '/documents/msp1/cc1-algorithmique-2025-2026.pdf', date: '2025-2026' },
          { title: 'Contrôle Continu — Informatique 1 (STI 1021, DL cos(x) 10⁻⁸)', url: '/documents/msp1/cc-info1-2024-2025.pdf', date: '2024-2025' },
        ],
      },
      {
        type: 'CORRECTION',
        label: 'Corrections Détaillées',
        isPaid: true,
      },
    ],
  },

  { id: 'chm111', code: 'CHM111', name: 'Éléments de Chimie', semester: 1, level: 'MSP1', resources: createDefaultResources() },
  { id: 'lng111', code: 'LNG111', name: 'Langue Anglais/Français', semester: 1, level: 'MSP1', resources: createDefaultResources() },
  { id: 'mec111', code: 'MEC111', name: 'Dessin technique', semester: 1, level: 'MSP1', resources: createDefaultResources() },
  { id: 'eps111', code: 'EPS111', name: 'Comportement et Sport', semester: 1, level: 'MSP1', resources: createDefaultResources() },

  // MSP1 — Semestre 2
  { id: 'mth121', code: 'MTH121', name: 'Analyse réelle 2', semester: 2, level: 'MSP1', resources: createDefaultResources() },
  { id: 'mth122', code: 'MTH122', name: 'Géométrie euclidienne et affine', semester: 2, level: 'MSP1', resources: createDefaultResources() },
  { id: 'mth123', code: 'MTH123', name: 'Algèbre linéaire', semester: 2, level: 'MSP1', resources: createDefaultResources() },
  { id: 'phy121', code: 'PHY121', name: 'Électromagnétisme 2', semester: 2, level: 'MSP1', resources: createDefaultResources() },
  {
    id: 'gmc121',
    code: 'GMC121',
    name: 'Technologie et sciences des matériaux (TSM)',
    semester: 2,
    level: 'MSP1',
    resources: [
      {
        type: 'COURS',
        label: 'Polycopié de cours magistral',
        url: '/documents/msp1/cours-tsm-chapitre1-materiaux-bidoung.pdf',
        isPaid: false,
        items: [
          { title: 'Cours TSM — Chapitre 1 : Définition, Classification et Élaboration des Matériaux', url: '/documents/msp1/cours-tsm-chapitre1-materiaux-bidoung.pdf', date: 'Jean Calvin Bidoung' },
        ],
      },
      {
        type: 'TD',
        label: 'Fiches de Travaux Dirigés',
        isPaid: false,
      },
      {
        type: 'EXAMEN',
        label: 'Épreuves & Examens officiels',
        isPaid: false,
      },
      {
        type: 'CORRECTION',
        label: 'Corrections Détaillées',
        isPaid: true,
      },
    ],
  },
  { id: 'inf121', code: 'INF121', name: 'Informatique 2', semester: 2, level: 'MSP1', resources: createDefaultResources() },
  { id: 'lng121', code: 'LNG121', name: 'Langue Anglais/Français', semester: 2, level: 'MSP1', resources: createDefaultResources() },
  { id: 'mec121', code: 'MEC121', name: 'Dessin technique', semester: 2, level: 'MSP1', resources: createDefaultResources() },
  { id: 'eps121', code: 'EPS121', name: 'Comportement et Sport', semester: 2, level: 'MSP1', resources: createDefaultResources() },

  // MSP2 — Semestre 1
  { id: 'mth211', code: 'MTH211', name: 'Algèbre multilinéaire', semester: 1, level: 'MSP2', resources: createDefaultResources() },
  { id: 'mth212', code: 'MTH212', name: 'Séries intégrales', semester: 1, level: 'MSP2', resources: createDefaultResources() },
  { id: 'mth213', code: 'MTH213', name: 'Probabilités et statistiques', semester: 1, level: 'MSP2', resources: createDefaultResources() },
  { id: 'phy211', code: 'PHY211', name: 'Mécanique des solides', semester: 1, level: 'MSP2', resources: createDefaultResources() },
  { id: 'phy212', code: 'PHY212', name: 'Électrocinétique', semester: 1, level: 'MSP2', resources: createDefaultResources() },
  { id: 'phy213', code: 'PHY213', name: 'TP Physique', semester: 1, level: 'MSP2', resources: createDefaultResources() },
  { id: 'inf211', code: 'INF211', name: 'Informatique 3', semester: 1, level: 'MSP2', resources: createDefaultResources() },
  { id: 'lng211', code: 'LNG211', name: 'Langue Anglais/Français', semester: 1, level: 'MSP2', resources: createDefaultResources() },

  // MSP2 — Semestre 2
  { id: 'mth221', code: 'MTH221', name: 'Analyse dans les espaces vectoriels de dimensions finies', semester: 2, level: 'MSP2', resources: createDefaultResources() },
  { id: 'mth222', code: 'MTH222', name: 'Analyse numérique', semester: 2, level: 'MSP2', resources: createDefaultResources() },
  { id: 'ele221', code: 'ELE221', name: 'Circuits électriques et électroniques', semester: 2, level: 'MSP2', resources: createDefaultResources() },
  { id: 'phy221', code: 'PHY221', name: 'Optique géométrique et ondulatoire', semester: 2, level: 'MSP2', resources: createDefaultResources() },
  { id: 'phy222', code: 'PHY222', name: 'Thermodynamique', semester: 2, level: 'MSP2', resources: createDefaultResources() },
  { id: 'mec221', code: 'MEC221', name: 'Statique', semester: 2, level: 'MSP2', resources: createDefaultResources() },
  { id: 'inf221', code: 'INF221', name: 'Informatique 4', semester: 2, level: 'MSP2', resources: createDefaultResources() },
  { id: 'lng222', code: 'LNG222', name: 'Langue Anglais/Français', semester: 2, level: 'MSP2', resources: createDefaultResources() },
];

export const getSubjectsByLevelAndSemester = (level: 'MSP1' | 'MSP2', semester: 1 | 2): Subject[] =>
  curriculum.filter((s) => s.level === level && s.semester === semester);
