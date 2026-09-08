import type { Level } from "./lib/types";

export const SITE = {
  name: "RÉUSSIR POLYTECH",
  slogan: "Réussir ensemble, construire l'excellence.",
  baseline: "RÉUSSIR POLYTECH est un collectif académique qui transforme l'apprentissage individuel en réussite collective.",
  org: "École Polytechnique",
  email: "contact@reussirpolytech.cm",
  city: "Yaoundé, Cameroun",
};

/** Contact WhatsApp officiel de l'équipe (paiement Orange Money + remise des documents). */
export const WHATSAPP = {
  raw: "672356441",
  international: "237672356441",
  display: "+237 6 72 35 64 41",
};

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP.international}?text=${encodeURIComponent(message)}`;

export const LEVELS = ["MSP1", "MSP2"] as const;

/** Types de documents affichés dans chaque matière (cahier des charges). */
export const RES_TYPES = [
  { id: "td", label: "Fiches de TD" },
  { id: "examens", label: "Épreuves / Examens" },
  { id: "corrections", label: "Corrections" },
] as const;

export const typeLabel = (id: string) =>
  RES_TYPES.find((t) => t.id === id)?.label ?? id;

/* ------------------------------------------------------------------ */
/*  CATALOGUE OFFICIEL DES UNITÉS D'ENSEIGNEMENT — MSP1 & MSP2         */
/* ------------------------------------------------------------------ */

export type Cat = "math" | "physique" | "info" | "chimie" | "tech" | "transversal";

export interface SubjectDef {
  id: string;
  label: string;
  level: Level;
  semester: "S1" | "S2" | "both";
  cat: Cat;
  desc?: string;
}

export const CAT_LABELS: Record<Cat, string> = {
  math: "Mathématiques",
  physique: "Physique",
  info: "Informatique",
  chimie: "Chimie",
  tech: "Technologie & technique",
  transversal: "Transversal",
};

export const CATALOG: SubjectDef[] = [
  // ---- MSP1 · Semestre 1 ----
  { id: "analyse-reelle-1", label: "Analyse réelle 1", level: "MSP1", semester: "S1", cat: "math", desc: "Suites, limites, continuité et dérivabilité." },
  { id: "algebre-generale", label: "Algèbre Générale", level: "MSP1", semester: "S1", cat: "math", desc: "Structures algébriques, groupes, anneaux, corps." },
  { id: "electromagnetisme-1", label: "Électromagnétisme 1", level: "MSP1", semester: "S1", cat: "physique", desc: "Électrostatique et magnétostatique." },
  { id: "mecanique-point", label: "Mécanique du point", level: "MSP1", semester: "S1", cat: "physique", desc: "Cinématique et dynamique newtonienne." },
  { id: "tp-physique", label: "TP Physique", level: "MSP1", semester: "S1", cat: "physique", desc: "Protocoles, mesures et incertitudes." },
  { id: "informatique-1", label: "Informatique 1", level: "MSP1", semester: "S1", cat: "info", desc: "Algorithmique et programmation C." },
  { id: "elements-chimie", label: "Éléments de Chimie", level: "MSP1", semester: "S1", cat: "chimie", desc: "Atome, liaison chimique et solutions." },
  { id: "langue", label: "Langue (Anglais/Français)", level: "MSP1", semester: "both", cat: "transversal", desc: "Communication technique bilingue." },
  { id: "dessin-technique", label: "Dessin technique", level: "MSP1", semester: "both", cat: "tech", desc: "Normes, projections et schémas." },
  { id: "comportement-sport", label: "Comportement et Sport", level: "MSP1", semester: "both", cat: "transversal", desc: "Savoir-être et épanouissement physique." },
  // ---- MSP1 · Semestre 2 ----
  { id: "analyse-reelle-2", label: "Analyse réelle 2", level: "MSP1", semester: "S2", cat: "math", desc: "Séries et fonctions de plusieurs variables." },
  { id: "geometrie", label: "Géométrie euclidienne et affine", level: "MSP1", semester: "S2", cat: "math", desc: "Espaces affines et euclidiens." },
  { id: "algebre-lineaire", label: "Algèbre linéaire", level: "MSP1", semester: "S2", cat: "math", desc: "Matrices, déterminants, réduction." },
  { id: "electromagnetisme-2", label: "Électromagnétisme 2", level: "MSP1", semester: "S2", cat: "physique", desc: "Maxwell et ondes électromagnétiques." },
  { id: "technologie-materiaux", label: "Technologie et sciences des matériaux", level: "MSP1", semester: "S2", cat: "tech", desc: "Propriétés et choix des matériaux." },
  { id: "informatique-2", label: "Informatique 2", level: "MSP1", semester: "S2", cat: "info", desc: "Programmation C++ et POO." },
  // ---- MSP2 · Semestre 1 ----
  { id: "algebre-multilineaire", label: "Algèbre multilinéaire", level: "MSP2", semester: "S1", cat: "math", desc: "Formes linéaires, tenseurs et formes quadratiques." },
  { id: "series-integrales", label: "Séries intégrales", level: "MSP2", semester: "S1", cat: "math", desc: "Intégrales impropres et séries d'intégrales." },
  { id: "probabilites-stats", label: "Probabilités et statistiques", level: "MSP2", semester: "S1", cat: "math", desc: "Variables aléatoires, lois et estimation." },
  { id: "mecanique-solides", label: "Mécanique des solides", level: "MSP2", semester: "S1", cat: "physique", desc: "Cinématique et dynamique du solide rigide." },
  { id: "electrocinetique", label: "Électrocinétique", level: "MSP2", semester: "S1", cat: "physique", desc: "Circuits en régime continu et variable." },
  { id: "tp-physique-m2", label: "TP Physique", level: "MSP2", semester: "S1", cat: "physique", desc: "Travaux pratiques de niveau 2." },
  { id: "informatique-3", label: "Informatique 3", level: "MSP2", semester: "S1", cat: "info", desc: "Structures de données avancées et C++." },
  { id: "langue-m2", label: "Langue (Anglais/Français)", level: "MSP2", semester: "both", cat: "transversal", desc: "Anglais technique et communication." },
  // ---- MSP2 · Semestre 2 ----
  { id: "analyse-espaces-dim-finies", label: "Analyse dans les espaces vectoriels de dimensions finies", level: "MSP2", semester: "S2", cat: "math", desc: "Normes, topologie et applications linéaires continues." },
  { id: "analyse-numerique", label: "Analyse numérique", level: "MSP2", semester: "S2", cat: "math", desc: "Résolution numérique et interpolation." },
  { id: "circuits-electriques", label: "Circuits électriques et électroniques", level: "MSP2", semester: "S2", cat: "physique", desc: "Analyse et conception de circuits." },
  { id: "optique-geo-ondulatoire", label: "Optique géométrique et ondulatoire", level: "MSP2", semester: "S2", cat: "physique", desc: "Lentilles, interférences et diffraction." },
  { id: "thermodynamique", label: "Thermodynamique", level: "MSP2", semester: "S2", cat: "physique", desc: "Principes, machines et diagrammes." },
  { id: "statique", label: "Statique", level: "MSP2", semester: "S2", cat: "physique", desc: "Équilibre des solides et torseurs." },
  { id: "informatique-4", label: "Informatique 4", level: "MSP2", semester: "S2", cat: "info", desc: "Programmation avancée et projets." },
];

export const subjectDef = (id: string) => CATALOG.find((s) => s.id === id);
export const subjectLabel = (id: string) => subjectDef(id)?.label ?? id;
export const subjectCat = (id: string): Cat => subjectDef(id)?.cat ?? "transversal";
export const subjectsOf = (level: Level, semester?: "S1" | "S2") =>
  CATALOG.filter(
    (s) =>
      s.level === level &&
      (semester === undefined ? true : s.semester === semester || s.semester === "both")
  );
