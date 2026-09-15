export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: string;
  description: string;
  photo: string;
  order: number;
  isFounder?: boolean;
}

export const team: TeamMember[] = [
  {
    id: 'eugene-gwet',
    name: 'Eugène Samuel GWET',
    title: 'Cofondateur & Président du Conseil d\'Administration',
    role: 'PCA',
    description: 'Fondateur de G-INNOVA, designer graphique freelance et leader certifié Coursera. Architecte de la vision stratégique de Réussir Polytech.',
    photo: '/assets/team/eugene-gwet.jpg',
    order: 1,
    isFounder: true,
  },
  {
    id: 'stevia-matho',
    name: 'Stevia Matho Re',
    title: 'Cofondatrice & Présidente-Directrice Générale',
    role: 'PDG',
    description: 'Pilote exécutive de la plateforme. Garant de l\'excellence opérationnelle et du développement académique de la communauté.',
    photo: '/assets/team/stevia-matho.jpg',
    order: 2,
    isFounder: true,
  },
  {
    id: 'alex-ngoua',
    name: 'Alex Ngoua Edou',
    title: 'Secrétaire Général',
    role: 'SG',
    description: 'Proche collaborateur du PCA. Coordonne les activités administratives et veille à la mise en œuvre des décisions stratégiques.',
    photo: '/assets/team/alex-ngoua.jpg',
    order: 3,
  },
  {
    id: 'christian-khouya',
    name: 'Khouya Christian Landry',
    title: 'Cofondateur & Trésorier',
    role: 'Trésorier',
    description: 'Gardien des ressources financières de l\'organisation. Assure la transparence et la rigueur dans la gestion des fonds.',
    photo: '/assets/team/christian-khouya.jpg',
    order: 4,
    isFounder: true,
  },
  {
    id: 'sarah-ondoua',
    name: 'Sarah Ondoua Ella',
    title: 'Cofondatrice',
    role: 'Fondatrice',
    description: 'Pilier de la fondation de Réussir Polytech. Contribue activement à l\'épanouissement de la communauté étudiante.',
    photo: '/assets/team/sarah-ondoua.jpg',
    order: 5,
    isFounder: true,
  },
  {
    id: 'bikey-yannick',
    name: 'Bikey Yannick',
    title: 'Directeur Informatique et Opérationnel',
    role: 'DIO',
    description: 'Mentor VIP des modules techniques. Architecte des systèmes informatiques et formateur certifié en outils métiers d\'ingénieur.',
    photo: '/assets/team/bikey-yannick.jpg',
    order: 6,
  },
  {
    id: 'loice-tadontsa',
    name: 'Loïce Tadontsa',
    title: 'Coordinatrice des activités et séances de travail',
    role: 'Coordinatrice',
    description: 'Orchestratrice de la dynamique collective. Planifie et anime les sessions académiques pour maximiser la productivité du groupe.',
    photo: '/assets/team/loice-tadontsa.jpg',
    order: 7,
  },
  {
    id: 'rose-mbog',
    name: 'Rose Héloïse Mbog',
    title: 'Directrice Informatique Adjointe',
    role: 'DIA & Responsable Matériel',
    description: 'Responsable du matériel technique. Assure la continuité des infrastructures numériques et le support opérationnel.',
    photo: '/assets/team/rose-mbog.jpg',
    order: 8,
  },
  {
    id: 'emmanuella-amour',
    name: 'Emmanuella Amour',
    title: 'Ambassadrice N°1',
    role: 'Ambassadrice',
    description: 'Première représentante de la marque Réussir Polytech. Porte les valeurs de la communauté auprès du plus grand nombre.',
    photo: '/assets/team/emmanuella-amour.jpg',
    order: 9,
  },
  {
    id: 'atyame-yolande',
    name: 'Atyame Yolande',
    title: 'Ambassadrice N°2',
    role: 'Ambassadrice',
    description: 'Deuxième représentante officielle. Renforce le rayonnement de Réussir Polytech au sein de l\'École Polytechnique.',
    photo: '/assets/team/atyame-yolande.jpg',
    order: 10,
  },
  {
    id: 'franck',
    name: 'Franck',
    title: 'Communication & Assistant Secrétaire Général',
    role: 'Communication',
    description: 'Voix et image de la communauté. Gère les canaux de communication et assiste le Secrétaire Général dans ses missions.',
    photo: '/assets/team/franck.jpg',
    order: 11,
  },
  {
    id: 'pacha',
    name: 'Pacha',
    title: 'Leader des cadets généralistes',
    role: 'Leader Cadets',
    description: 'Guide et mentor des étudiants MSP1 en filière généraliste. Catalyseur de cohésion et d\'excellence pour les nouvelles recrues.',
    photo: '/assets/team/pacha.jpg',
    order: 12,
  },
  {
    id: 'bic-rouge',
    name: 'Bic-rouge',
    title: 'Leader des cadets techniciens',
    role: 'Leader Techniciens',
    description: 'Référent technique des cadets. Encadre et motive les étudiants de filière technique vers l\'excellence polytechnicienne.',
    photo: '/assets/team/bic-rouge.jpg',
    order: 13,
  },
];
