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

export const SUBJECTS = [
  { id: "math", label: "Mathématiques" },
  { id: "physique", label: "Physique" },
  { id: "info", label: "Informatique" },
] as const;

export const RES_TYPES = [
  { id: "cours", label: "Cours" },
  { id: "td", label: "TD" },
  { id: "exercices", label: "Exercices" },
  { id: "tp", label: "TP" },
  { id: "examens", label: "Examens" },
] as const;

export const subjectLabel = (id: string) =>
  SUBJECTS.find((s) => s.id === id)?.label ?? id;
export const typeLabel = (id: string) =>
  RES_TYPES.find((t) => t.id === id)?.label ?? id;
