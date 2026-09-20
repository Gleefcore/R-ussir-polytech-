export type GalleryCategory = 'realisations' | 'etudes' | 'evenements' | 'visites';

export interface GalleryCategoryMeta {
  id: GalleryCategory;
  num: number;
  label: string;
  badge: string;
  color: {
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
    color: {
      text: 'text-[#D4AF37]',
      border: 'border-[#D4AF37]/50',
      badgeBg: 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30',
    },
  },
  etudes: {
    id: 'etudes',
    num: 2,
    label: 'Études',
    badge: 'Groupes de Travail & TD',
    color: {
      text: 'text-sky-500',
      border: 'border-sky-500/50',
      badgeBg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    },
  },
  evenements: {
    id: 'evenements',
    num: 3,
    label: 'Événements & Formations',
    badge: 'Bootcamps & Séminaires',
    color: {
      text: 'text-purple-400',
      border: 'border-purple-500/50',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
  },
  visites: {
    id: 'visites',
    num: 4,
    label: 'Visites',
    badge: 'Immersions & Chantiers',
    color: {
      text: 'text-emerald-400',
      border: 'border-emerald-500/50',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
  },
};

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  description?: string;
  imageUrl: string;
  date: string;
  location: string;
  author?: string;
  tags?: string[];
  createdAt: string;
}

export const INITIAL_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Conception & Modélisation CAO 3D',
    category: 'realisations',
    description: 'Modélisation paramétrique et prototypage avec G-INNOVA.',
    imageUrl: '/assets/gallery/cad-engineering-2.jpg',
    date: '28 Fév 2026',
    location: 'Laboratoire Polytech',
    createdAt: '2026-02-28T14:30:00Z',
  },
  {
    id: 'gal-2',
    title: 'Séance d\'Étude & Travaux Dirigés Takou',
    category: 'etudes',
    description: 'Travaux dirigés et résolutions d\'épreuves en groupe de travail.',
    imageUrl: '/assets/gallery/lab-collaboration-3.jpg',
    date: '05 Mar 2026',
    location: 'Amphi 200, Yaoundé',
    createdAt: '2026-03-05T10:15:00Z',
  },
  {
    id: 'gal-3',
    title: 'Séminaire Leadership & Vision d\'Ingénieur',
    category: 'evenements',
    description: 'Conférence d\'orientation et formation d\'élite pour élèves-ingénieurs.',
    imageUrl: '/assets/gallery/family-leaders-portrait.jpg',
    date: '12 Mar 2026',
    location: 'Centre de Conférences',
    createdAt: '2026-03-12T16:00:00Z',
  },
  {
    id: 'gal-4',
    title: 'Visite Plateforme Robotique Industrielle',
    category: 'visites',
    description: 'Immersion pratique et découverte des bancs automatisés.',
    imageUrl: '/assets/gallery/lab-robotics-1.jpg',
    date: '18 Mar 2026',
    location: 'Site Technologique',
    createdAt: '2026-03-18T11:45:00Z',
  },
];
