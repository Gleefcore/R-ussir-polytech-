export interface PartnerCompany {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  logo: string;
  founder: string;
  founderRole: string;
  websiteUrl?: string;
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
    badge: 'Design, Web & Solutions Numériques',
    tagline: 'Des solutions concrètes pour présenter, organiser et développer votre activité',
    logo: '/assets/partners/ginnova.jpg',
    founder: 'Eugène Samuel GWET',
    founderRole: 'Fondateur & DG de G-INNOVA — Cofondateur & PCA de Réussir Polytech',
    websiteUrl: 'https://g-innova.vercel.app/',
    description:
      'G-INNOVA conçoit des identités visuelles, des sites web et des outils de gestion adaptés aux besoins réels des entrepreneurs, des commerces et des PME. Basée à Yaoundé avec une approche « Comprendre avant de concevoir », la structure apporte des solutions numériques sur mesure pour donner une assise professionnelle et durable à chaque activité.',
    services: [
      'Conception Graphique : Logos, chartes graphiques, flyers, affiches, brochures, cartes de visite et supports de marque',
      'Conception Web : Portfolios, sites vitrines, catalogues en ligne, e-commerce et refonte de plateformes responsives',
      'Outils Informatiques : Outils de gestion de stock, suivi des ventes, gestion de projets, clients, dépenses et tableaux de bord',
      'Formation Entrepreneuriale : Programmes pratiques sélectionnés parmi un catalogue de plus de 400 formations enregistrées',
    ],
    keyMetrics: [
      { label: 'Formations Enregistrées', value: '400+ Modules' },
      { label: 'Approche Métier', value: 'Sur Mesure' },
      { label: 'Site Officiel', value: 'g-innova.vercel.app' },
    ],
    tags: ['Design Graphique', 'Conception Web', 'Outils Informatiques', 'Formation Entrepreneuriale', 'Identité Visuelle'],
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_STRATEGY || '237672356441',
    whatsappMessage:
      'Bonjour M. Eugène Samuel GWET, je vous contacte via Réussir Polytech pour faire appel aux services de G-INNOVA (design, site web, outils de gestion ou formation).',
    themeColor: {
      border: 'border-[#1E40AF]/50 dark:border-[#D4AF37]/50',
      bg: 'from-[#1E40AF]/10 via-[#070E1B] to-[#0A1628]',
      text: 'text-[#1E40AF] dark:text-[#D4AF37]',
      badgeBg: 'bg-[#1E40AF]/15 border-[#1E40AF]/30 dark:bg-[#D4AF37]/15 dark:border-[#D4AF37]/30',
      badgeText: 'text-[#1E40AF] dark:text-[#D4AF37]',
    },
  },
  {
    id: 'intellectual-academy',
    name: 'Intellectual Academy',
    badge: 'Groupe de Prépa & Cours de Répétition',
    tagline: 'Encadrement intensif, répétitions scientifiques & réussite aux examens et concours',
    logo: '/assets/partners/intellectual-academy.jpg',
    founder: 'Collectif d\'Ingénieurs & Enseignants Répétiteurs',
    founderRole: 'Groupe de Prépa — Partenaire Pédagogique Officiel de Réussir Polytech',
    description:
      'Intellectual Academy est un groupe d\'élite spécialisé dans les cours de répétition et la préparation académique. Il assure un encadrement méthodique régulier et un renforcement intensif en mathématiques, physique et sciences fondamentales pour combler les lacunes, asseoir la maîtrise des cours et préparer efficacement les étudiants aux concours et évaluations polytechniciennes.',
    services: [
      'Cours de Répétition Réguliers & Intensifs en Mathématiques et Physique Supérieures',
      'Séances Hebdomadaires de Renforcement & Méthodologie de Résolution des Exercices-Types',
      'Préparation Rigoureuse aux Concours d\'Entrée des Grandes Écoles d\'Ingénieurs',
      'Travaux Dirigés (TD) Approfondis, Séances de Révision et Devoirs Surveillés Types',
      'Suivi Personnalisé des Élèves, Diagnostic des Difficultés et Accompagnement Continu',
    ],
    keyMetrics: [
      { label: 'Format Pédagogique', value: 'Cours de Répétition' },
      { label: 'Matières Principales', value: 'Maths & Physique' },
      { label: 'Objectif Central', value: 'Réussite & Maîtrise' },
    ],
    tags: ['Cours de Répétition', 'Groupe de Prépa', 'Mathématiques', 'Physique', 'Soutien Académique'],
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || '237672356441',
    whatsappMessage:
      'Bonjour, je vous contacte via Réussir Polytech pour m\'inscrire ou me renseigner sur les cours de répétition et programmes de prépa d\'Intellectual Academy.',
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
    badge: 'Structure Digitale & Groupe d\'Étude en Informatique',
    tagline: 'Formation au code, développement logiciel & projets technologiques réels',
    logo: '/assets/partners/as-de-l-informatique.jpg',
    founder: 'Collectif d\'Ingénieurs du Génie Informatique',
    founderRole: 'Partenaire Technologique Officiel de Réussir Polytech',
    description:
      'Structure d\'étude, de formation pratique et d\'ingénierie logicielle fondée par des ingénieurs informaticiens passionnés. Les As de l\'Informatique accompagnent les étudiants et créateurs de solutions dans la maîtrise de la programmation, du développement web et mobile, des bases de données et des architectures logicielles modernes à travers des projets concrets.',
    services: [
      'Bootcamps Pratiques de Programmation (Python, C/C++, Java, React, Next.js)',
      'Conception et Développement d\'Applications Web, Mobiles et Solutions SaaS',
      'Algorithmique de Haute Précision, Structures de Données et Optimisation de Code',
      'Architecture Cloud, Bases de Données Supabase/SQL et Bonnes Pratiques de Sécurité',
      'Ateliers Pratiques Collaboratifs, Gestion de Projets Git et Mentorat Technique',
    ],
    keyMetrics: [
      { label: 'Développeurs Formés', value: '+150 Compétences' },
      { label: 'Domaines Métiers', value: 'Code · Web · Cloud' },
      { label: 'Méthode', value: '100% Projets Réels' },
    ],
    tags: ['Programmation', 'Génie Informatique', 'Développement Web', 'Algorithmes', 'Architecture Cloud'],
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_TECH || '237695957287',
    whatsappMessage:
      'Bonjour, je vous contacte via Réussir Polytech pour découvrir les formations et opportunités avec Les As de l\'Informatique.',
    themeColor: {
      border: 'border-orange-500/50',
      bg: 'from-orange-500/10 via-[#070E1B] to-[#0A1628]',
      text: 'text-orange-500',
      badgeBg: 'bg-orange-500/15 border-orange-500/30',
      badgeText: 'text-orange-400',
    },
  },
];
