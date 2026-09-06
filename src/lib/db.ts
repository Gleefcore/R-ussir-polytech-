import fs from "fs";
import path from "path";
import type { DB, Resource } from "./types";
import { hashPassword } from "./auth";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "db.json");

let cache: DB | null = null;

const R = (
  id: string,
  title: string,
  subject: Resource["subject"],
  level: Resource["level"],
  type: Resource["type"],
  premium: boolean,
  description: string,
  preview: string,
  tags: string[]
): Resource => ({ id, title, subject, level, type, premium, description, preview, tags, createdAt: Date.now() });

function seed(): DB {
  const adminPw = hashPassword("Admin@2026");
  const demoPw = hashPassword("Demo@1234");
  const now = Date.now();
  return {
    users: [
      {
        id: "u-admin",
        name: "Administration RÉUSSIR POLYTECH",
        email: "admin@reussirpolytech.com",
        phone: "672356441",
        passHash: adminPw.hash,
        passSalt: adminPw.salt,
        level: "MSP2",
        role: "admin",
        createdAt: now,
        unlocked: [],
        study: [],
      },
      {
        id: "u-demo",
        name: "Étudiant Démo",
        email: "etudiant@demo.rp",
        phone: "699000000",
        passHash: demoPw.hash,
        passSalt: demoPw.salt,
        level: "MSP1",
        role: "student",
        createdAt: now,
        unlocked: ["res-03"],
        study: [
          { id: "s-1", subject: "math", topic: "Revoir le chapitre limites & continuité", done: true },
          { id: "s-2", subject: "physique", topic: "Fiche de révision : mécanique du point", done: false },
          { id: "s-3", subject: "info", topic: "Refaire le TP tableaux pointeurs en C", done: false },
        ],
      },
    ],
    resources: [
      R("res-01", "Analyse I — Cours complet (limites, continuité, dérivabilité)", "math", "MSP1", "cours", false,
        "Cours fondamental d'analyse pour la première année : limites, continuité, dérivabilité et développements limités, avec démonstrations rigoureuses et exemples issus des amphithéâtres de l'ENSPY.",
        "Chapitre 1 — Limites de suites\nDéfinition 1.1 (limite d'une suite). Soit (u_n) une suite réelle. On dit que u_n tend vers l quand, pour tout ε > 0, il existe N tel que n ≥ N implique |u_n − l| ≤ ε.\nThéorème 1.2 (gendarmes). Si u_n ≤ v_n ≤ w_n à partir d'un rang et si u_n, w_n → l, alors v_n → l.",
        ["analyse", "limites", "dérivabilité"]),
      R("res-02", "Algèbre linéaire — Cours & applications", "math", "MSP1", "cours", false,
        "Espaces vectoriels, applications linéaires, matrices, déterminants et réduction : le cours complet avec exercices d'application progressifs.",
        "Chapitre 3 — Matrices et systèmes\nDéfinition. Une matrice A ∈ M_n(K) est inversible s'il existe B telle que AB = BA = I_n.\nMéthode du pivot de Gauss : complexité O(n³), stabilité numérique discutée en TD.",
        ["algèbre", "matrices", "espaces vectoriels"]),
      R("res-03", "TD Analyse I — Corrigé détaillé", "math", "MSP1", "td", true,
        "Le TD officiel d'analyse avec correction rédigée pas à pas : raisonnements ε-δ, théorèmes de comparaison, études de fonctions complètes.",
        "Exercice 2 — Corrigé\nOn montre que u_{n+1} = √(2 + u_n) est croissante et majorée par 2, donc convergente.\nLa limite l vérifie l = √(2 + l) d'où l² − l − 2 = 0 et l = 2 (l = −1 rejetée).",
        ["td", "corrigé", "analyse"]),
      R("res-04", "Exercices corrigés — Intégrales et primitives", "math", "MSP1", "exercices", false,
        "Une banque de 40 exercices progressifs sur les primitives et intégrales, tous corrigés avec les techniques clés : IPP, changement de variable, décomposition en éléments simples.",
        "Exercice 12 — ∫ x·eˣ dx\nIntégration par parties : u = x, dv = eˣ dx ⇒ ∫ x eˣ dx = x eˣ − eˣ + C.\nAstuce RP : toujours tabuler les IPP itérées.",
        ["intégrales", "primitives", "exercices"]),
      R("res-05", "Sujet d'examen Mathématiques MSP1 — Session 2025 (corrigé)", "math", "MSP1", "examens", true,
        "Le sujet réel de l'évaluation de mathématiques MSP1, session 2025, avec barème et correction complète rédigée par le collectif.",
        "Problème 1 (8 points) — Étude de la suite u_{n+1} = (u_n² + 2)/(2u_n)\n1. Montrer que u_n > √2 pour n ≥ 1.\n2. Étudier la monotonie. 3. Conclure à la convergence et identifier la limite.",
        ["examen", "annales", "2025"]),
      R("res-06", "Analyse complexe — Cours MSP2", "math", "MSP2", "cours", false,
        "Holomorphie, équations de Cauchy-Riemann, intégration complexe, séries de Laurent et théorème des résidus avec applications au calcul d'intégrales réelles.",
        "Théorème (formule intégrale de Cauchy). Si f est holomorphe sur un ouvert simplement connexe Ω et γ un lacet de Ω, alors pour tout a intérieur à γ : f(a) = (1/2iπ) ∮_γ f(z)/(z−a) dz.",
        ["complexe", "résidus", "holomorphie"]),
      R("res-07", "Probabilités & statistiques — Cours complet MSP2", "math", "MSP2", "cours", true,
        "Variables aléatoires, lois usuelles, théorèmes limites et introduction aux processus : le cours de référence pour les probabilités en deuxième année.",
        "Définition (espérance). Pour X une v.a. discrète : E[X] = Σ x·P(X = x).\nThéorème central limite : √n (X̄_n − μ) → N(0, σ²) en loi.",
        ["probabilités", "statistiques", "TCL"]),
      R("res-08", "TD Probabilités — Corrigé détaillé MSP2", "math", "MSP2", "td", true,
        "Correction complète du TD de probabilités : calculs de lois, fonctions génératrices, exercices de convergence.",
        "Exercice 5 — Loi du nombre de passages\nOn reconnaît une loi géométrique de paramètre p : E[N] = 1/p, Var(N) = (1−p)/p².",
        ["td", "probabilités", "corrigé"]),
      R("res-09", "Examen Mathématiques MSP2 — Session 2026 (corrigé)", "math", "MSP2", "examens", true,
        "Sujet intégral de la dernière évaluation MSP2 avec correction barémée : analyse complexe et probabilités.",
        "Exercice 3 (6 points) — Calculer ∫_{−∞}^{+∞} dx/(1+x⁴) par la méthode des résidus.\nPôles : e^{iπ/4}, e^{3iπ/4}. Résultat : π/√2.",
        ["examen", "annales", "MSP2"]),
      R("res-10", "Mécanique du point — Cours complet", "physique", "MSP1", "cours", false,
        "Cinématique, dynamique newtonienne, énergie et moments : le cours de mécanique du point illustré par des systèmes classiques des TD de l'ENSPY.",
        "Loi fondamentale : m·d²r/dt² = Σ F.\nÉnergie cinétique : Ec = ½ m v². Théorème de l'énergie cinétique : ΔEc = Σ W(F).",
        ["mécanique", "newton", "cinématique"]),
      R("res-11", "TD Mécanique du point — Corrigé détaillé", "physique", "MSP1", "td", true,
        "Tous les exercices du TD de mécanique corrigés : pendules, projectiles, frottements solides et fluides, avec schémas bilan soignés.",
        "Exercice 4 — Projectile avec frottement fluide linéaire\nm dv/dt = mg − k v ⇒ v(t) = (mg/k)(1 − e^{−kt/m}) + v₀ e^{−kt/m}.",
        ["td", "mécanique", "corrigé"]),
      R("res-12", "Électricité & électromagnétisme — Cours", "physique", "MSP1", "cours", false,
        "Électrostatique, magnétostatique et équations de Maxwell : un cours structuré avec les démonstrations attendues en évaluation.",
        "Équations de Maxwell : ∇·E = ρ/ε₀ ; ∇·B = 0 ; ∇×E = −∂B/∂t ; ∇×B = μ₀ J + μ₀ε₀ ∂E/t.",
        ["électromagnétisme", "maxwell", "électrostatique"]),
      R("res-13", "Examen Physique MSP1 — Session 2025 (corrigé)", "physique", "MSP1", "examens", true,
        "Le sujet d'évaluation de physique MSP1 avec correction complète et conseils de rédaction pour maximiser les points.",
        "Problème 2 (7 points) — Pendule simple amorti\nθ'' + 2λθ' + ω₀²θ = 0. Régimes : pseudo-périodique, critique, apériodique.",
        ["examen", "physique", "annales"]),
      R("res-14", "Thermodynamique — Cours complet MSP2", "physique", "MSP2", "cours", false,
        "Premier et second principes, fonctions d'état, machines thermiques et diagrammes : le cours de thermodynamique de deuxième année.",
        "Premier principe : ΔU = W + Q.\nEntropie : dS = δQ_rev/T. Second principe : S créée ≥ 0.",
        ["thermodynamique", "entropie", "machines"]),
      R("res-15", "TD Thermodynamique — Corrigé détaillé MSP2", "physique", "MSP2", "td", true,
        "Correction pas à pas du TD : cycles de Carnot, Rankine et exercices de bilans entropiques.",
        "Exercice 7 — Rendement de Carnot\nη = 1 − T_f/T_c = 1 − 300/600 = 0,5.",
        ["td", "thermodynamique", "corrigé"]),
      R("res-16", "Optique ondulatoire — Cours & interférences", "physique", "MSP2", "cours", true,
        "Interférences, diffraction, cohérence et applications instrumentales : le cours avancé d'optique ondulatoire.",
        "Différence de marche : δ = d·sinθ. Franges brillantes : δ = kλ.\nIntensité : I = I₀ cos²(πδ/λ).",
        ["optique", "interférences", "diffraction"]),
      R("res-17", "Examen Physique MSP2 — Session 2026 (corrigé)", "physique", "MSP2", "examens", true,
        "Sujet complet de l'évaluation MSP2 : thermodynamique et optique ondulatoire, avec barème officiel reconstitué.",
        "Exercice 2 (5 points) — Interféromètre de Michelson\nΔm = 2e/λ ; contraste des franges et influence de la cohérence temporelle.",
        ["examen", "MSP2", "annales"]),
      R("res-18", "Algorithmique & structures de données — Cours", "info", "MSP1", "cours", false,
        "Complexité, listes, piles, files, arbres et tris : le cours d'algorithmique avec analyses de complexité démontrées.",
        "Complexité du tri fusion : T(n) = 2T(n/2) + O(n) ⇒ T(n) = O(n log n) (théorème maître).\nStructure file : enfiler/défiler en O(1).",
        ["algorithmique", "complexité", "tris"]),
      R("res-19", "Programmation C — Travaux pratiques guidés", "info", "MSP1", "tp", false,
        "Six TP guidés en langage C : pointeurs, tableaux dynamiques, fichiers et structures, avec code de référence commenté.",
        "TP 3 — Allocation dynamique\nint *t = malloc(n * sizeof(int));\nif (!t) { fprintf(stderr, \"alloc\\n\"); exit(1); }\n/* ... */ free(t);",
        ["C", "pointeurs", "tp"]),
      R("res-20", "Exercices corrigés — Récursivité & complexité", "info", "MSP1", "exercices", true,
        "30 exercices corrigés sur la récursivité, les récurrences et l'analyse de complexité, du niveau base au niveau examen.",
        "Exercice 9 — Résoudre T(n) = T(n−1) + n, T(1) = 1.\nT(n) = Σ_{k=1..n} k = n(n+1)/2 ⇒ Θ(n²).",
        ["récursivité", "complexité", "exercices"]),
      R("res-21", "Examen Informatique MSP1 — Session 2025 (corrigé)", "info", "MSP1", "examens", true,
        "Sujet d'évaluation d'informatique MSP1 : traces d'algorithmes, écriture de fonctions C et questions de cours, entièrement corrigé.",
        "Exercice 1 (4 points) — Donner la trace de mystere(5) :\nint mystere(int n){ return n<=1 ? 1 : n*mystere(n-1); }\nRéponse : 120.",
        ["examen", "C", "annales"]),
      R("res-22", "Programmation orientée objet C++ — Cours MSP2", "info", "MSP2", "cours", false,
        "Classes, héritage, polymorphisme, templates et STL : le cours de POO en C++ avec bonnes pratiques de conception.",
        "class Forme { public: virtual double aire() const = 0; virtual ~Forme() = default; };\nclass Cercle : public Forme { double r; public: double aire() const override { return M_PI*r*r; } };",
        ["C++", "POO", "STL"]),
      R("res-23", "Bases de données & SQL — Cours complet MSP2", "info", "MSP2", "cours", false,
        "Modèle relationnel, algèbre relationnelle, SQL avancé, normalisation et transactions : le cours de référence en bases de données.",
        "SELECT s.nom, AVG(n.note) AS moy\nFROM notes n JOIN students s ON s.id = n.student_id\nGROUP BY s.nom HAVING AVG(n.note) >= 12;",
        ["SQL", "bases de données", "normalisation"]),
      R("res-24", "TD SQL — Corrigé détaillé MSP2", "info", "MSP2", "td", true,
        "Correction complète du TD de SQL : jointures, sous-requêtes corrélées, fenêtres et optimisation d'index.",
        "Exercice 6 — Sous-requête corrélée\nSELECT nom FROM etudiants e WHERE note > (SELECT AVG(note) FROM etudiants WHERE filiere = e.filiere);",
        ["td", "SQL", "corrigé"]),
      R("res-25", "Examen Informatique MSP2 — Session 2026 (corrigé)", "info", "MSP2", "examens", true,
        "Sujet intégral de l'évaluation MSP2 : POO C++, SQL et questions d'architecture, avec correction barémée.",
        "Problème 1 (9 points) — Concevoir une hiérarchie de classes pour un gestionnaire de ressources académiques (UML → C++).",
        ["examen", "MSP2", "annales"]),
    ],
    requests: [
      { id: "req-0001", userId: "u-demo", resourceId: "res-03", status: "approved", createdAt: now - 86400000 * 3, updatedAt: now - 86400000 * 2 },
      { id: "req-0002", userId: "u-demo", resourceId: "res-05", status: "pending", createdAt: now - 3600000 * 5, updatedAt: now - 3600000 * 5 },
    ],
    sessions: [],
    announcements: [
      { id: "a-1", title: "Session de révision intensive MSP1 — Octobre 2026", body: "Deux semaines de séances corrigées en direct (maths & physique) organisées par le collectif. Places limitées : inscrivez-vous via WhatsApp.", date: "2026-09-01" },
      { id: "a-2", title: "Nouveaux sujets corrigés disponibles", body: "Les évaluations session 2026 de MSP2 (maths, physique, info) viennent d'être ajoutées à la bibliothèque premium.", date: "2026-08-24" },
      { id: "a-3", title: "Recrutement ambassadeurs de promo", body: "Rejoignez l'équipe : un ambassadeur par filière pour relayer les besoins étudiants. Écrivez-nous sur WhatsApp avec votre nom et votre filière.", date: "2026-08-10" },
    ],
  };
}

export function getDB(): DB {
  if (cache) return cache;
  if (fs.existsSync(FILE)) {
    cache = JSON.parse(fs.readFileSync(FILE, "utf8")) as DB;
  } else {
    cache = seed();
    save();
  }
  return cache;
}

export function save(): void {
  if (!cache) return;
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(cache, null, 2));
  fs.renameSync(tmp, FILE);
}

export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
