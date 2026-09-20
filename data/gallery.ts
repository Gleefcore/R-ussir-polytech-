export type GalleryCategory = 'realisations' | 'etudes' | 'evenements' | 'visites';

export interface GalleryCategoryMeta {
  id: GalleryCategory;
  num: number;
  label: string;
  badge: string;
  description: string;
  iconName: string;
  color: {
    bg: string;
    text: string;
    border: string;
    badgeBg: string;
  };
}

export const GALLERY_CATEGORIES: Record<GalleryCategory, GalleryCategoryMeta> = {
  realisations: {
    id: 'realisations',
    num: 1,
    label: 'Nos Réalisations',
    badge: 'Projets & Prototypes',
    description: 'Conceptions techniques, modélisations 3D, maquettes industrielles et solutions d\'ingénierie créées par nos étudiants et partenaires.',
    iconName: 'Wrench',
    color: {
      bg: 'from-amber-500/10 via-slate-900 to-slate-950',
      text: 'text-[#D4AF37]',
      border: 'border-[#D4AF37]/40',
      badgeBg: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30',
    },
  },
  etudes: {
    id: 'etudes',
    num: 2,
    label: 'Études',
    badge: 'Répétitions & TD Takou',
    description: 'Séances d\'études intensives, groupes de travail polytechniciens, travaux dirigés, calculs matriciels et résolutions d\'épreuves-types.',
    iconName: 'BookOpen',
    color: {
      bg: 'from-sky-500/10 via-slate-900 to-slate-950',
      text: 'text-sky-500',
      border: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    },
  },
  evenements: {
    id: 'evenements',
    num: 3,
    label: 'Événements & Formations',
    badge: 'Bootcamps & Séminaires',
    description: 'Bootcamps technologiques, conférences académiques, remises de certificats, ateliers d\'élite et sessions de mentorat.',
    iconName: 'Sparkles',
    color: {
      bg: 'from-purple-500/10 via-slate-900 to-slate-950',
      text: 'text-purple-400',
      border: 'border-purple-500/40',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
  },
  visites: {
    id: 'visites',
    num: 4,
    label: 'Visites',
    badge: 'Chantiers & Usines',
    description: 'Immersions industrielles, visites d\'usines de fabrication, découvertes de chantiers du génie civil et délégations d\'ingénieurs.',
    iconName: 'Compass',
    color: {
      bg: 'from-emerald-500/10 via-slate-900 to-slate-950',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
  },
};

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
  author?: string;
  tags: string[];
  createdAt: string;
}

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Modélisation Mécanique & Conception CAO 3D',
    category: 'realisations',
    description: 'Session de conception numérique et modélisation paramétrique assistée par ordinateur menée sous la supervision du bureau G-INNOVA.',
    imageUrl: '/assets/gallery/cad-engineering-2.jpg',
    date: '2026-02-28',
    location: 'Laboratoire de Modélisation Polytech, Yaoundé',
    author: 'Direction Réussir Polytech',
    tags: ['CAO 3D', 'Ingénierie', 'G-INNOVA', 'SolidWorks'],
    createdAt: '2026-02-28T14:30:00Z',
  },
  {
    id: 'gal-2',
    title: 'Travaux Dirigés & Résolution Takou Analyse Réelle',
    category: 'etudes',
    description: 'Séance d\'étude collaborative en classe préparatoire : étude des séries de Riemann, calcul différentiel et résolutions d\'épreuves.',
    imageUrl: '/assets/gallery/lab-collaboration-3.jpg',
    date: '2026-03-05',
    location: 'Salle d\'Étude Amphi 200, Yaoundé',
    author: 'Intellectual Academy & Réussir Polytech',
    tags: ['Maths Takou', 'MSP1', 'Analyse Réelle', 'Répétitions'],
    createdAt: '2026-03-05T10:15:00Z',
  },
  {
    id: 'gal-3',
    title: 'Séminaire Haute Performance & Leadership d\'Ingénieur',
    category: 'evenements',
    description: 'Conférence spéciale réunissant les élèves-ingénieurs autour de la vision industrielle, de la discipline mentale et du leadership opérationnel.',
    imageUrl: '/assets/gallery/family-leaders-portrait.jpg',
    date: '2026-03-12',
    location: 'Centre de Conférences Polytech',
    author: 'Eugène Samuel GWET & Bikey Yannick',
    tags: ['Leadership', 'Conférence', 'VIP', 'Excellence'],
    createdAt: '2026-03-12T16:00:00Z',
  },
  {
    id: 'gal-4',
    title: 'Immersion Laboratoire Robotique & Automatismes Industriels',
    category: 'visites',
    description: 'Visite guidée et immersion pratique des étudiants au sein des bancs de test mécatroniques et bancs d\'automatisation industrielle.',
    imageUrl: '/assets/gallery/lab-robotics-1.jpg',
    date: '2026-03-18',
    location: 'Plateforme Technologique Industrielle',
    author: 'Bureau d\'Études Polytech',
    tags: ['Robotique', 'Visite Industrielle', 'Automatique', 'Terrain'],
    createdAt: '2026-03-18T11:45:00Z',
  },
];
