export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  desc: string;
  tier: "Fondateurs & direction" | "Coordination & technique" | "Ambassadeurs & leaders";
}

/** Équipe officielle — les photos réelles déposées dans /public/equipe/<slug>.jpg s'affichent automatiquement. */
export const TEAM: TeamMember[] = [
  { slug: "eugene-samuel-gwet", name: "Eugène Samuel GWET", role: "Cofondateur · PCA", desc: "Fondateur de G-INNOVA, designer graphique freelance et leader certifié Coursera. Il porte la vision stratégique et l'identité visuelle du collectif.", tier: "Fondateurs & direction" },
  { slug: "stevia-matho-re", name: "Stevia Matho Re", role: "Cofondatrice · PDG", desc: "Dirige la structure exécutive du collectif : partenariats, croissance et excellence opérationnelle.", tier: "Fondateurs & direction" },
  { slug: "khouya-christian", name: "Khouya Christian", role: "Cofondateur · Trésorier", desc: "Garant de la transparence financière : budgets, cotisations et investissement dans les ressources pédagogiques.", tier: "Fondateurs & direction" },
  { slug: "sarah-ondoual-ella", name: "Sarah Ondoual Ella", role: "Cofondatrice", desc: "Cheville ouvrière de la fondation du collectif, engagée pour l'entraide académique et la solidarité entre promotions.", tier: "Fondateurs & direction" },
  { slug: "alex-ngoua-edou", name: "Alex Ngoua Edou", role: "Secrétaire Général", desc: "Proche collaborateur du PCA : coordination des instances, procès-verbaux et circulation de l'information officielle.", tier: "Coordination & technique" },
  { slug: "bikey-yannick", name: "Bikey Yannick", role: "Directeur informatique et opérationnel", desc: "Pilote la plateforme numérique, les outils internes et l'exploitation quotidienne de RÉUSSIR POLYTECH.", tier: "Coordination & technique" },
  { slug: "loice-tadontsa", name: "Loïce Tadontsa", role: "Coordinatrice des activités et séances de travail", desc: "Organise les séances de révision collective, les ateliers et le calendrier académique du collectif.", tier: "Coordination & technique" },
  { slug: "rose-mbog", name: "Rose Mbog", role: "Directrice informatique adjointe", desc: "Responsable du matériel technique : elle veille à l'équipement des séances et au support des membres.", tier: "Coordination & technique" },
  { slug: "emmanuella-amour", name: "Emmanuella Amour", role: "Ambassadrice numéro 1", desc: "Porte-voix du collectif auprès des promotions : elle relaie les besoins et accueille les nouveaux membres.", tier: "Ambassadeurs & leaders" },
  { slug: "atyame-yolande", name: "Atyame Yolande", role: "Ambassadrice numéro 2", desc: "Anime la communauté étudiante et diffuse les ressources et opportunités du collectif.", tier: "Ambassadeurs & leaders" },
  { slug: "franck", name: "Franck", role: "Communication · Assistant SG", desc: "Crée les visuels, anime les canaux officiels et assiste le Secrétariat Général.", tier: "Ambassadeurs & leaders" },
  { slug: "pacha", name: "Pacha", role: "Leader des cadets généralistes", desc: "Encadre les cadets des filières généralistes : méthode, discipline et cohésion.", tier: "Ambassadeurs & leaders" },
  { slug: "bicrouge", name: "Bicrouge", role: "Leader des cadets techniciens", desc: "Encadre les cadets des filières techniques : ateliers pratiques et entraide technique.", tier: "Ambassadeurs & leaders" },
];

export const STATS = [
  { value: 1200, suffix: "+", label: "Documents partagés" },
  { value: 350, suffix: "+", label: "Étudiants accompagnés" },
  { value: 95, suffix: "%", label: "Taux de satisfaction" },
  { value: 24, suffix: "/7", label: "Support WhatsApp" },
];

export const VALUES = [
  { title: "Solidarité", text: "Aucun étudiant ne reste seul face à la difficulté : la réussite de l'un prépare celle de tous." },
  { title: "Rigueur", text: "Des documents vérifiés, des corrections rédigées avec exigence, une méthode d'ingénieur." },
  { title: "Bienveillance", text: "Un espace sans jugement où chaque question est légitime et chaque progrès célébré." },
  { title: "Transparence", text: "Des processus clairs, des accès expliqués, une équipe joignable et responsable." },
];

export const WHY = [
  { title: "Ressources académiques", text: "Fiches de TD, épreuves et corrections des unités d'enseignement officielles, vérifiées par le collectif." },
  { title: "Préparation aux examens", text: "Annales corrigées et séances de révision collective pour aborder chaque évaluation avec méthode." },
  { title: "Travail collectif", text: "L'entraide comme moteur : séances de travail, ambassadeurs de promo et leaders de cadets." },
  { title: "Développement personnel", text: "Formations VIP, leadership, entrepreneuriat : grandir au-delà du cursus d'ingénieur." },
];

export const MISSION = "Accompagner chaque étudiant ingénieur vers la réussite académique par l'entraide, la rigueur et le partage des connaissances.";
export const VISION = "Devenir la communauté de référence des ingénieurs de l'École Polytechnique : un réseau solidaire qui prépare les leaders technologiques de demain.";

export const PROJECTS = [
  { name: "PolyPrep AI", tagline: "Assistant de révision génératif entraîné sur les annales de l'école.", tags: ["IA", "EdTech"], status: "En incubation" },
  { name: "SmartCampus", tagline: "Capteurs IoT low-cost pour suivre la consommation électrique du campus.", tags: ["IoT", "Énergie"], status: "Prototype" },
  { name: "AgriTrace", tagline: "Traçabilité agricole par QR-code pour les coopératives de la région.", tags: ["AgriTech", "Mobile"], status: "Pilote terrain" },
];

export const ENTRE_CARDS = [
  { title: "Innovation", text: "Veille technologique, hackathons et culture du prototype : l'idée devient preuve en 30 jours." },
  { title: "Création de projets", text: "Du problème observé au MVP : cadrage, maquette, test terrain, itération." },
  { title: "Gestion de projet", text: "Planification, budget, risques et indicateurs : piloter un projet comme un ingénieur." },
  { title: "Leadership", text: "Posture, communication et décision : conduire une équipe vers un objectif commun." },
];

export const OPPORTUNITIES = [
  { title: "Concours national d'innovation étudiante", date: "Candidatures jusqu'au 15 nov. 2026" },
  { title: "Programme d'incubation Orange Cameroun", date: "Cohorte de janvier 2027" },
  { title: "Bourses d'excellence ingénierie", date: "Dossier avant le 30 oct. 2026" },
  { title: "Hackathon RÉUSSIR POLYTECH 48h", date: "Édition #2 — décembre 2026" },
];

export const TESTIMONIALS = [
  { name: "Boris T.", level: "MSP1", text: "Les fiches de TD et les corrections détaillées m'ont fait passer de 9/20 à 15/20 en Analyse réelle 1 en un semestre." },
  { name: "Sandrine M.", level: "MSP2", text: "Enfin des épreuves corrigées conformes au programme officiel. Je prépare mes examens avec une vraie méthode." },
  { name: "Kevin A.", level: "MSP1", text: "L'entraide organisée par les leaders de cadets a changé ma façon de travailler : on apprend, on explique, on progresse ensemble." },
  { name: "Laure N.", level: "MSP2", text: "Le pôle entrepreneur m'a aidée à structurer mon projet de startup étudiante. Bien plus qu'un site : une communauté." },
  { name: "Patrick E.", level: "MSP2", text: "Demande de correction envoyée sur WhatsApp un soir, document reçu le lendemain matin. Sérieux et rapides." },
];

export const ROADMAP = [
  { code: "01", title: "Assistant IA étudiant", text: "Un copilote entraîné sur les cours et annales pour expliquer et guider 24h/24." },
  { code: "02", title: "Recherche intelligente", text: "Recherche sémantique dans tous les documents : le théorème exact, pas juste le bon fichier." },
  { code: "03", title: "Chatbot pédagogique", text: "Un tuteur conversationnel pour s'exercer et se corriger en temps réel." },
  { code: "04", title: "Analyse des performances", text: "Tableaux de bord de progression par unité d'enseignement pour piloter ses révisions." },
];

export const STUDY_TIPS = [
  { title: "Méthode Pomodoro 50/10", text: "50 minutes de travail profond, 10 minutes de pause réelle. Trois cycles par matière." },
  { title: "Fiches actives", text: "Résumez chaque unité en une fiche recto : définitions, théorèmes, un exercice type corrigé à la main." },
  { title: "Annales chronométrées", text: "Refaites les épreuves en conditions réelles avant de comparer à la correction." },
  { title: "Enseignez pour apprendre", text: "Expliquez un concept à un camarade : ce que vous ne savez pas expliquer, vous ne le savez pas encore." },
];
