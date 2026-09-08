import type { Level } from "./lib/types";

export const SITE = {
  name: "RÉUSSIR POLYTECH",
  slogan: "Réussir aujourd'hui, construire les ingénieurs de demain.",
  org: "ENSPY",
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

export const RES_TYPES = [
  { id: "cours", label: "Cours" },
  { id: "td", label: "TD" },
  { id: "exercices", label: "Exercices" },
  { id: "tp", label: "TP" },
  { id: "examens", label: "Examens" },
] as const;

export const typeLabel = (id: string) =>
  RES_TYPES.find((t) => t.id === id)?.label ?? id;

/* ------------------------------------------------------------------ */
/*  CATALOGUE OFFICIEL DES MATIÈRES — programme ENSPY                  */
/* ------------------------------------------------------------------ */

export type Cat = "math" | "physique" | "info" | "chimie" | "tech" | "transversal";

export interface SubjectDef {
  id: string;
  label: string;
  level: Level;
  semester: "S1" | "S2" | "both" | null;
  cat: Cat;
}

export const CAT_LABELS: Record<Cat, string> = {
  math: "Mathématiques",
  physique: "Physique",
  info: "Informatique",
  chimie: "Chimie",
  tech: "Technologie & technique",
  transversal: "Transversal",
};

/** Programme officiel MSP1 (Niveau 1) — Semestres 1 & 2. */
export const CATALOG: SubjectDef[] = [
  // ---- MSP1 · Semestre 1 ----
  { id: "analyse-reelle-1", label: "Analyse réelle 1", level: "MSP1", semester: "S1", cat: "math" },
  { id: "algebre-generale", label: "Algèbre Générale", level: "MSP1", semester: "S1", cat: "math" },
  { id: "electromagnetisme-1", label: "Électromagnétisme 1", level: "MSP1", semester: "S1", cat: "physique" },
  { id: "mecanique-point", label: "Mécanique du point", level: "MSP1", semester: "S1", cat: "physique" },
  { id: "tp-physique", label: "TP Physique", level: "MSP1", semester: "S1", cat: "physique" },
  { id: "informatique-1", label: "Informatique 1", level: "MSP1", semester: "S1", cat: "info" },
  { id: "elements-chimie", label: "Éléments de Chimie", level: "MSP1", semester: "S1", cat: "chimie" },
  { id: "langue", label: "Langue (Anglais/Français)", level: "MSP1", semester: "both", cat: "transversal" },
  { id: "dessin-technique", label: "Dessin technique", level: "MSP1", semester: "both", cat: "tech" },
  { id: "comportement-sport", label: "Comportement et Sport", level: "MSP1", semester: "both", cat: "transversal" },
  // ---- MSP1 · Semestre 2 ----
  { id: "analyse-reelle-2", label: "Analyse réelle 2", level: "MSP1", semester: "S2", cat: "math" },
  { id: "geometrie", label: "Géométrie euclidienne et affine", level: "MSP1", semester: "S2", cat: "math" },
  { id: "algebre-lineaire", label: "Algèbre linéaire", level: "MSP1", semester: "S2", cat: "math" },
  { id: "electromagnetisme-2", label: "Électromagnétisme 2", level: "MSP1", semester: "S2", cat: "physique" },
  { id: "technologie-materiaux", label: "Technologie et sciences des matériaux", level: "MSP1", semester: "S2", cat: "tech" },
  { id: "informatique-2", label: "Informatique 2", level: "MSP1", semester: "S2", cat: "info" },
  // ---- MSP2 · matières de spécialité ----
  { id: "analyse-complexe", label: "Analyse complexe", level: "MSP2", semester: null, cat: "math" },
  { id: "probabilites", label: "Probabilités & statistiques", level: "MSP2", semester: null, cat: "math" },
  { id: "thermodynamique", label: "Thermodynamique", level: "MSP2", semester: null, cat: "physique" },
  { id: "optique-ondulatoire", label: "Optique ondulatoire", level: "MSP2", semester: null, cat: "physique" },
  { id: "poo-cpp", label: "Programmation orientée objet C++", level: "MSP2", semester: null, cat: "info" },
  { id: "bases-donnees", label: "Bases de données & SQL", level: "MSP2", semester: null, cat: "info" },
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
