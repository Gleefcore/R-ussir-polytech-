export interface VipProgram {
  id: string;
  title: string;
  summary: string;
  badges: string[];
  duration: string;
  mentor: string;
  mentorTitle: string;
  mentorWhatsapp: string;
  channel: 'TECH' | 'STRATEGY';
  icon: string;
}

export const vipPrograms: VipProgram[] = [
  // Volet Technique — Bikei Yannick
  {
    id: 'bureautique',
    title: 'Bureautique Haute Précision',
    summary: 'Word & Excel Avancé : mise en page de thèses et mémoires d\'ingénieurs, calculs matriciels, modélisation de données, macros VBA.',
    badges: ['Microsoft Word', 'Microsoft Excel', 'VBA Macros', 'LaTeX'],
    duration: '4 semaines',
    mentor: 'Bikei Yannick',
    mentorTitle: 'Directeur Informatique et Opérationnel',
    mentorWhatsapp: '237695957287',
    channel: 'TECH',
    icon: '📊',
  },
  {
    id: 'design-graphique',
    title: 'Design Graphique, Infographie & Branding d\'Ingénieur',
    summary: 'Maîtrise d\'Adobe Photoshop, Illustrator, InDesign, CorelDRAW et Suite Affinity pour affiches de recherche et chartes industrielles.',
    badges: ['Photoshop', 'Illustrator', 'InDesign', 'CorelDRAW', 'Affinity'],
    duration: '6 semaines',
    mentor: 'Bikei Yannick',
    mentorTitle: 'Directeur Informatique et Opérationnel',
    mentorWhatsapp: '237695957287',
    channel: 'TECH',
    icon: '🎨',
  },
  {
    id: 'montage-video',
    title: 'Montage Vidéo & Production Audiovisuelle',
    summary: 'Camtasia et outils de montage pour vidéos techniques, vulgarisation scientifique et démonstrations logicielles professionnelles.',
    badges: ['Camtasia', 'Premiere Pro', 'After Effects', 'OBS Studio'],
    duration: '4 semaines',
    mentor: 'Bikei Yannick',
    mentorTitle: 'Directeur Informatique et Opérationnel',
    mentorWhatsapp: '237695957287',
    channel: 'TECH',
    icon: '🎬',
  },
  {
    id: 'ia-cloud',
    title: 'Intelligence Artificielle & Cloud Data',
    summary: 'Python pour l\'ingénierie, bases de données SQL, architecture Supabase et scripts d\'automatisation. Initiation au Machine Learning.',
    badges: ['Python', 'SQL', 'Supabase', 'TensorFlow', 'Pandas'],
    duration: '8 semaines',
    mentor: 'Bikei Yannick',
    mentorTitle: 'Directeur Informatique et Opérationnel',
    mentorWhatsapp: '237695957287',
    channel: 'TECH',
    icon: '🤖',
  },
  {
    id: 'gestion-projets',
    title: 'Gestion de Projets Techniques & Méthodes Agiles',
    summary: 'Scrum, versioning Git/GitHub, cahier des charges d\'ingénieur, diagrammes de Gantt et conduite de projets pluridisciplinaires.',
    badges: ['Scrum', 'Git', 'GitHub', 'Jira', 'Gantt'],
    duration: '5 semaines',
    mentor: 'Bikei Yannick',
    mentorTitle: 'Directeur Informatique et Opérationnel',
    mentorWhatsapp: '237695957287',
    channel: 'TECH',
    icon: '⚙️',
  },
  // Volet Stratégique — Eugène Samuel GWET
  {
    id: 'vision-strategie',
    title: 'Vision & Stratégie',
    summary: 'Art du positionnement industriel, anticipation technologique et feuille de route pérenne d\'un bâtisseur. Penser à 10 ans.',
    badges: ['Stratégie', 'Innovation', 'Roadmap', 'Leadership'],
    duration: '4 semaines',
    mentor: 'Eugène Samuel GWET',
    mentorTitle: 'Cofondateur & PCA — Fondateur de G-INNOVA',
    mentorWhatsapp: '237672356441',
    channel: 'STRATEGY',
    icon: '🎯',
  },
  {
    id: 'discipline-acier',
    title: 'Discipline d\'Acier & Haute Performance Mentale',
    summary: 'Protocoles de Deep Work, résilience psychologique face à la charge académique polytechnicienne, focus absolu et gestion de l\'énergie.',
    badges: ['Deep Work', 'Mental Health', 'Focus', 'Productivity'],
    duration: '3 semaines',
    mentor: 'Eugène Samuel GWET',
    mentorTitle: 'Cofondateur & PCA — Fondateur de G-INNOVA',
    mentorWhatsapp: '237672356441',
    channel: 'STRATEGY',
    icon: '🔥',
  },
  {
    id: 'leadership-elite',
    title: 'Leadership d\'Élite, Motivation & Conduite d\'Hommes',
    summary: 'Autorité naturelle, communication persuasive, psychologie d\'équipe et négociation d\'affaires. Le leader que vous serez.',
    badges: ['Leadership', 'Communication', 'Négociation', 'Psychologie'],
    duration: '5 semaines',
    mentor: 'Eugène Samuel GWET',
    mentorTitle: 'Cofondateur & PCA — Fondateur de G-INNOVA',
    mentorWhatsapp: '237672356441',
    channel: 'STRATEGY',
    icon: '👑',
  },
  {
    id: 'innovation-startups',
    title: 'Techniques d\'Innovation & Startups Deeptech',
    summary: 'Prototypage rapide, valorisation de la recherche, brevets et business model d\'ingénierie. De l\'idée au produit industriel.',
    badges: ['Innovation', 'Startup', 'Prototypage', 'Brevets', 'Business Model'],
    duration: '6 semaines',
    mentor: 'Eugène Samuel GWET',
    mentorTitle: 'Cofondateur & PCA — Fondateur de G-INNOVA',
    mentorWhatsapp: '237672356441',
    channel: 'STRATEGY',
    icon: '🚀',
  },
];

export const techPrograms = vipPrograms.filter((p) => p.channel === 'TECH');
export const strategyPrograms = vipPrograms.filter((p) => p.channel === 'STRATEGY');
