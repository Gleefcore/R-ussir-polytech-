import type { Level, Subject } from "./lib/types";

export interface Founder {
  name: string;
  role: string;
  level: string;
  img: string;
  parcours: string;
  vision: string;
  motivation: string;
  quote: string;
}

export const FOUNDERS: Founder[] = [
  {
    name: "Armand KOSSONGUE",
    role: "Cofondateur & Président",
    level: "MSP2 — Génie Informatique",
    img: "/founders/founder-1.jpg",
    parcours: "Major de sa promotion au cycle préparatoire, passionné de systèmes distribués et de pédagogie active.",
    vision: "Faire de RÉUSSIR POLYTECH la référence académique numérique de tout étudiant ingénieur de l'ENSPY.",
    motivation: "« Aucun étudiant ne devrait affronter seul la difficulté d'un programme d'ingénieur. »",
    quote: "L'excellence n'est pas un accident : c'est une méthode, partagée.",
  },
  {
    name: "Clarisse MENGUE",
    role: "Cofondatrice & Directrice Académique",
    level: "MSP2 — Génie Industriel",
    img: "/founders/founder-2.jpg",
    parcours: "Responsable du pôle pédagogie : elle structure les corrigés, les fiches de révision et le suivi des promotions.",
    vision: "Un cursus accompagné, du premier cours de MSP1 jusqu'au diplôme d'ingénieur.",
    motivation: "« Transmettre, c'est multiplier ce que l'on sait. »",
    quote: "Chaque corrigé rédigé est une marche vers le diplôme de quelqu'un.",
  },
  {
    name: "Steve NDONG",
    role: "Cofondateur & CTO",
    level: "MSP2 — Génie Informatique",
    img: "/founders/founder-3.jpg",
    parcours: "Architecte de la plateforme : Next.js, sécurité, base de données et expérience utilisateur premium.",
    vision: "Une infrastructure capable d'évoluer pendant des années : IA, analyse de performances, recherche intelligente.",
    motivation: "« Construire des outils dont on aurait rêvé étant étudiant. »",
    quote: "Le code est notre pont entre deux générations d'ingénieurs.",
  },
  {
    name: "Aïcha BELLO",
    role: "Cofondatrice & Directrice Entrepreneuriat",
    level: "MSP2 — Génie Électrique",
    img: "/founders/founder-4.jpg",
    parcours: "Entrepreneure étudiante, lauréate de deux concours d'innovation nationaux, mentor du pôle startup.",
    vision: "Que chaque ingénieur de l'ENSPY puisse transformer un projet de TP en entreprise réelle.",
    motivation: "« L'ingénieur de demain sera entrepreneur ou ne sera pas. »",
    quote: "Un carnet d'exercices bien tenu et un business plan : mêmes rigueurs.",
  },
];

export const TESTIMONIALS = [
  { name: "Boris T.", level: "MSP1 — Génie Civil", text: "Les TD corrigés m'ont fait passer de 9/20 à 15/20 en analyse en un semestre. La plateforme est magnifique et tout est trouvable en secondes." },
  { name: "Sandrine M.", level: "MSP2 — Génie Électrique", text: "Les anciens sujets d'évaluation corrigés, c'est exactement ce qui manquait à l'ENSPY. Je prépare mes examens avec une vraie méthode maintenant." },
  { name: "Kevin A.", level: "MSP1 — Génie Informatique", text: "L'espace étude avec le suivi de progression m'a réconcilié avec l'organisation. Et le support WhatsApp répond en quelques minutes." },
  { name: "Laure N.", level: "MSP2 — Génie Industriel", text: "Le pôle entrepreneuriat m'a aidée à structurer mon projet de startup étudiante. Bien plus qu'une bibliothèque : une vraie communauté d'ingénieurs." },
  { name: "Patrick E.", level: "MSP2 — Génie Civil", text: "Qualité irréprochable des corrigés, design premium, livraison des documents fluide après paiement Orange Money. Rien à redire." },
];

export const STATS = [
  { value: 1200, suffix: "+", label: "Documents académiques" },
  { value: 350, suffix: "+", label: "Étudiants accompagnés" },
  { value: 95, suffix: "%", label: "Taux de satisfaction" },
  { value: 24, suffix: "/7", label: "Support WhatsApp" },
];

export const PROGRAM: Record<Level, Record<Subject, string[]>> = {
  MSP1: {
    math: ["Analyse I (limites, continuité, dérivabilité)", "Algèbre linéaire & matrices", "Géométrie analytique", "Probabilités & statistiques"],
    physique: ["Mécanique du point", "Électricité & électromagnétisme", "Optique géométrique", "Travaux pratiques de physique"],
    info: ["Algorithmique & structures de données", "Programmation C", "Architecture des ordinateurs", "Travaux pratiques"],
  },
  MSP2: {
    math: ["Analyse complexe", "Probabilités & processus", "Méthodes numériques", "Optimisation"],
    physique: ["Thermodynamique", "Ondes & optique ondulatoire", "Introduction à la physique quantique", "Travaux pratiques avancés"],
    info: ["Programmation orientée objet C++", "Bases de données & SQL", "Systèmes d'exploitation", "Projets & TP"],
  },
};

export const PROJECTS = [
  { name: "PolyPrep AI", tagline: "Assistant de révision génératif entraîné sur les annales de l'ENSPY.", tags: ["IA", "EdTech"], status: "En incubation" },
  { name: "SmartCampus", tagline: "Capteurs IoT low-cost pour surveiller la consommation électrique des bâtiments du campus.", tags: ["IoT", "Énergie"], status: "Prototype" },
  { name: "AgriTrace", tagline: "Traçabilité agricole par QR-code pour les coopératives de la région du Centre.", tags: ["AgriTech", "Mobile"], status: "Pilote terrain" },
];

export const OPPORTUNITIES = [
  { title: "Concours national d'innovation étudiante", date: "Candidatures jusqu'au 15 nov. 2026" },
  { title: "Programme d'incubation Orange Cameroun", date: "Cohorte de janvier 2027" },
  { title: "Bourses d'excellence ingénierie", date: "Dossier avant le 30 oct. 2026" },
  { title: "Hackathon RÉUSSIR POLYTECH 48h", date: "Édition #2 — décembre 2026" },
];

export const ADVICE = [
  { title: "Résolvez un vrai problème", text: "Le meilleur projet startup naît d'une douleur vécue sur le campus, pas d'une idée décorative." },
  { title: "Prototypez en 30 jours", text: "Un MVP imparfait qui tourne vaut mieux qu'un cahier des charges parfait qui dort." },
  { title: "Entourez-vous complémentaire", text: "Un ingénieur + un gestionnaire + un designer : le trio classique des startups qui durent." },
  { title: "Documentez tout", text: "Comme un TD : hypothèses, calculs, résultats. Un investisseur lit un dossier comme un correcteur lit une copie." },
];

export const ROADMAP = [
  { code: "01", title: "Assistant IA étudiant", text: "Un copilote entraîné sur les cours et annales pour répondre, expliquer et guider 24h/24." },
  { code: "02", title: "Recherche intelligente", text: "Recherche sémantique dans tous les documents : trouvez le théorème exact, pas juste le bon fichier." },
  { code: "03", title: "Génération d'exercices", text: "Des séries d'exercices générées et corrigées automatiquement, calibrées sur votre niveau." },
  { code: "04", title: "Analyse des performances", text: "Tableaux de bord de progression par matière pour piloter vos révisions comme un projet." },
];

export const STUDY_TIPS = [
  { title: "Méthode Pomodoro 50/10", text: "50 minutes de travail profond, 10 minutes de pause réelle (sans écran). Trois cycles par matière." },
  { title: "Fiches aktives", text: "Résumez chaque chapitre en une fiche recto : définitions, théorèmes, un exercice type corrigé à la main." },
  { title: "Annales chronométrées", text: "Refaites les anciens sujets en conditions réelles avant de comparer au corrigé premium." },
  { title: "Enseignez pour apprendre", text: "Expliquez un concept à un camarade : ce que vous ne savez pas expliquer, vous ne le savez pas encore." },
];
