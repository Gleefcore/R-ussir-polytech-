export interface PartnerCompany {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  logo: string;
  founder: string;
  founderRole: string;
  description: string;
  services: string[];
  keyMetrics: { label: string; value: string }[];
  tags: string[];
  whatsapp: string;
  whatsappMessage: string;
  themeColor: {
    border: string;
    bg: string;
    text: string;
    badgeBg: string;
    badgeText: string;
  };
}

export const partnerCompanies: PartnerCompany[] = [
  {
    id: 'ginnova',
    name: 'G-INNOVA',
    badge: 'Bureau d\'Études & R&D Technologique',
    tagline: 'Conception CAO 3D, Prototypage Industriel & Stratégie',
    logo: '/assets/partners/ginnova.jpg',
    founder: 'Eugène Samuel GWET',
    founderRole: 'Élève-Ingénieur, Cofondateur & PCA de Réussir Polytech',
    description:
      'Fondé par Eugène Samuel GWET, G-INNOVA est un bureau d\'études technologiques et de conception industrielle polytechnicienne. Il accompagne les projets d\'ingénierie depuis l\'esquisse technique (CAO 3D, modélisation mécanique) jusqu\'au prototypage fonctionnel, au design industriel et au montage de business models stratégiques.',
    services: [
      'Conception & Modélisation CAO 3D (SolidWorks, AutoCAD, Fusion 360)',
      'Ateliers de Prototypage Rapide & Impression 3D Industrielle',
      'Design Graphique, Identité Visuelle & Image de Marque d\'Ingénierie',
      'Montage de Dossiers Techniques, Brevets & Feuilles de Route R&D',
      'Incubation & Structuration de Startups Industrielles Polytech',
    ],
    keyMetrics: [
      { label: 'Pôle R&D', value: 'Actif & Opérationnel' },
      { label: 'Projets Accompagnés', value: '25+ Réalisations' },
      { label: 'Écosystème', value: '100% Polytech' },
    ],
    tags: ['Conception 3D', 'R&D Industrielle', 'Prototypage', 'Stratégie', 'Design Industriel'],
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_STRATEGY || '237672356441',
    whatsappMessage:
      'Bonjour M. Eugène Samuel GWET, je vous contacte via Réussir Polytech pour collaborer avec le bureau d\'études G-INNOVA ou solliciter un accompagnement sur mon projet.',
    themeColor: {
      border: 'border-[#D4AF37]/50',
      bg: 'from-[#D4AF37]/10 via-[#070E1B] to-[#0A1628]',
      text: 'text-[#D4AF37]',
      badgeBg: 'bg-[#D4AF37]/15 border-[#D4AF37]/30',
      badgeText: 'text-[#D4AF37]',
    },
  },
  {
    id: 'intellectual-academy',
    name: 'Intellectual Academy',
    badge: 'Pôle Préparatoire & Académique',
    tagline: 'Cours de Remise à Niveau & Excellence Scientifique',
    logo: '/assets/partners/intellectual-academy.jpg',
    founder: 'Collectif d\'Ingénieurs & Enseignants',
    founderRole: 'Partenaire Pédagogique Officiel de Réussir Polytech',
    description:
      'Structure préparatoire de référence spécialisée dans les cours de remise à niveau scientifique, le renforcement intensif et la préparation aux concours d\'entrée des grandes écoles d\'ingénieurs (ENSPY, Douala, etc.). Intellectual Academy forge les bases solides en mathématiques, physique et sciences fondamentales pour garantir une intégration sereine dans le cursus d\'ingénieur.',
    services: [
      'Remise à Niveau Intensive en Mathématiques & Physique Supérieures',
      'Préparation d\'Élite aux Concours d\'Entrée des Écoles d\'Ingénieurs',
      'Coaching Méthodologique & Résolution Accélérée des Épreuves-Types',
      'Séances Pratiques de Travaux Dirigés & Évaluations Périodiques',
      'Mentorat Fraternel & Transition Lycée → Classes Préparatoires',
    ],
    keyMetrics: [
      { label: 'Élèves Accompagnés', value: '+300 Futurs Ingénieurs' },
      { label: 'Spécialités', value: 'Maths · Physique · Chimie' },
      { label: 'Pédagogie', value: 'Rigueur & Clarté' },
    ],
    tags: ['Remise à Niveau', 'Concours Ingénieurs', 'Sciences Exactes', 'Maths Takou', 'Excellence'],
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || '237672356441',
    whatsappMessage:
      'Bonjour, je vous contacte via Réussir Polytech pour me renseigner sur les cours de remise à niveau et programmes d\'Intellectual Academy.',
    themeColor: {
      border: 'border-sky-500/50',
      bg: 'from-sky-500/10 via-[#070E1B] to-[#0A1628]',
      text: 'text-sky-500',
      badgeBg: 'bg-sky-500/15 border-sky-500/30',
      badgeText: 'text-sky-400',
    },
  },
  {
    id: 'as-de-l-informatique',
    name: 'Les As de l\'Informatique',
    badge: 'Structure Digitale & Pôle d\'Étude Logicielle',
    tagline: 'Structure & Groupe d\'Étude en Informatique Avancée',
    logo: '/assets/partners/as-de-l-informatique.jpg',
    founder: 'Collectif d\'Ingénieurs du Génie Informatique',
    founderRole: 'Partenaire Technologique Officiel de Réussir Polytech',
    description:
      'Structure d\'étude, de formation pratique et d\'ingénierie logicielle fondée par des ingénieurs informaticiens passionnés. Les As de l\'Informatique propulsent les étudiants et créateurs de solutions dans la maîtrise du code, de l\'algorithmique, du développement web & mobile, des architectures cloud et de la cybersécurité.',
    services: [
      'Bootcamps de Programmation Avancée (Python, C/C++, Java, React, Next.js)',
      'Développement de Plateformes Web, Applications Mobiles & SaaS',
      'Algorithmique de Haute Précision, Structures de Données & Optimisation',
      'Architecture Cloud, Bases de Données Supabase & Cybersécurité',
      'Ateliers Pratiques d\'Automatisation & Projets Collaboratifs Git',
    ],
    keyMetrics: [
      { label: 'Développeurs Formés', value: '+150 Compétences' },
      { label: 'Domaines Métiers', value: 'Full-Stack · Cloud · IA' },
      { label: 'Approche', value: '100% Projets Réels' },
    ],
    tags: ['Programmation', 'Génie Informatique', 'Développement Web', 'Algorithmes', 'Architecture Cloud'],
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_TECH || '237695957287',
    whatsappMessage:
      'Bonjour, je vous contacte via Réussir Polytech pour découvrir les programmes de formation et collaborations avec Les As de l\'Informatique.',
    themeColor: {
      border: 'border-orange-500/50',
      bg: 'from-orange-500/10 via-[#070E1B] to-[#0A1628]',
      text: 'text-orange-500',
      badgeBg: 'bg-orange-500/15 border-orange-500/30',
      badgeText: 'text-orange-400',
    },
  },
];
