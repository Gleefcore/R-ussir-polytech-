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
  subject: string,
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
          { id: "s-1", subject: "math", topic: "Revoir le chapitre limites & continuité (Analyse réelle 1)", done: true },
          { id: "s-2", subject: "physique", topic: "Fiche de révision : mécanique du point", done: false },
          { id: "s-3", subject: "info", topic: "Refaire le TP tableaux pointeurs en C", done: false },
        ],
      },
    ],
    resources: [
      /* ============ MSP1 · SEMESTRE 1 ============ */
      R("res-01", "Analyse réelle 1 — Cours complet (limites, continuité, dérivabilité)", "analyse-reelle-1", "MSP1", "cours", false,
        "Le cours fondamental d'Analyse réelle 1 du semestre 1 : suites et limites réelles, continuité, dérivabilité et développements limités, avec démonstrations rigoureuses conformes au programme officiel MSP1.",
        "Chapitre 1 — Limites de suites\nDéfinition 1.1 (limite d'une suite). Soit (u_n) une suite réelle. On dit que u_n tend vers l quand, pour tout ε > 0, il existe N tel que n ≥ N implique |u_n − l| ≤ ε.\nThéorème 1.2 (gendarmes). Si u_n ≤ v_n ≤ w_n à partir d'un rang et si u_n, w_n → l, alors v_n → l.",
        ["analyse", "limites", "dérivabilité"]),
      R("res-02", "Algèbre Générale — Cours & applications", "algebre-generale", "MSP1", "cours", false,
        "Cours officiel d'Algèbre Générale (semestre 1) : structures algébriques, groupes, anneaux, corps et arithmétique des entiers, avec exercices d'application progressifs.",
        "Chapitre 2 — Groupes\nDéfinition. (G, ∗) est un groupe si ∗ est associative, admet un élément neutre e et si tout élément admet un symétrique.\nExemple. (ℤ/nℤ, +) est un groupe commutatif d'ordre n.",
        ["algèbre", "groupes", "arithmétique"]),
      R("res-03", "Analyse réelle 1 — TD corrigé détaillé", "analyse-reelle-1", "MSP1", "td", true,
        "Le TD officiel d'Analyse réelle 1 avec correction rédigée pas à pas : raisonnements ε-δ, théorèmes de comparaison, études de fonctions complètes.",
        "Exercice 2 — Corrigé\nOn montre que u_{n+1} = sqrt(2 + u_n) est croissante et majorée par 2, donc convergente.\nLa limite l vérifie l = sqrt(2 + l) d'où l² − l − 2 = 0 et l = 2 (l = −1 rejetée).",
        ["td", "corrigé", "analyse"]),
      R("res-04", "Analyse réelle 1 — Exercices corrigés (intégrales et primitives)", "analyse-reelle-1", "MSP1", "exercices", false,
        "Une banque de 40 exercices progressifs sur les primitives et intégrales d'Analyse réelle 1, tous corrigés avec les techniques clés : IPP, changement de variable, décomposition en éléments simples.",
        "Exercice 12 — ∫ x·eˣ dx\nIntégration par parties : u = x, dv = eˣ dx ⇒ ∫ x e dx = x eˣ − eˣ + C.\nAstuce RP : toujours tabuler les IPP itérées.",
        ["intégrales", "primitives", "exercices"]),
      R("res-05", "Examen Analyse réelle 1 — Session 2025 (corrigé)", "analyse-reelle-1", "MSP1", "examens", true,
        "Le sujet réel de l'évaluation d'Analyse réelle 1, session 2025, avec barème et correction complète rédigée par le collectif.",
        "Problème 1 (8 points) — Étude de la suite u_{n+1} = (u_n² + 2)/(2u_n)\n1. Montrer que u_n > sqrt(2) pour n ≥ 1.\n2. Étudier la monotonie. 3. Conclure à la convergence et identifier la limite.",
        ["examen", "annales", "2025"]),
      R("res-10", "Mécanique du point — Cours complet", "mecanique-point", "MSP1", "cours", false,
        "Cours officiel de Mécanique du point (semestre 1) : cinématique, dynamique newtonienne, énergie et moments, illustré par les systèmes classiques des TD de l'ENSPY.",
        "Loi fondamentale : m·d²r/dt² = Σ F.\nÉnergie cinétique : Ec = ½ m v². Théorème de l'énergie cinétique : ΔEc = Σ W(F).",
        ["mécanique", "newton", "cinématique"]),
      R("res-11", "Mécanique du point — TD corrigé détaillé", "mecanique-point", "MSP1", "td", true,
        "Tous les exercices du TD de Mécanique du point corrigés : pendules, projectiles, frottements solides et fluides, avec schémas bilan soignés.",
        "Exercice 4 — Projectile avec frottement fluide linéaire\nm dv/dt = mg − k v ⇒ v(t) = (mg/k)(1 − e^{−kt/m}) + v₀ e^{−kt/m}.",
        ["td", "mécanique", "corrigé"]),
      R("res-12", "Électromagnétisme 1 — Cours (électrostatique & magnétostatique)", "electromagnetisme-1", "MSP1", "cours", false,
        "Cours officiel d'Électromagnétisme 1 (semestre 1) : champs électrostatiques, potentiel, dipôles, magnétostatique et théorème d'Ampère, avec les démonstrations attendues en évaluation.",
        "Théorème de Gauss : flux de E à travers une surface fermée = Q_int/ε₀.\nThéorème d'Ampère : circulation de B le long d'un contour = μ₀ I_enlacé.",
        ["électromagnétisme", "gauss", "ampère"]),
      R("res-13", "Examen Mécanique du point — Session 2025 (corrigé)", "mecanique-point", "MSP1", "examens", true,
        "Le sujet d'évaluation de Mécanique du point MSP1 avec correction complète et conseils de rédaction pour maximiser les points.",
        "Problème 2 (7 points) — Pendule simple amorti\nθ'' + 2λθ' + ω₀²θ = 0. Régimes : pseudo-périodique, critique, apériodique.",
        ["examen", "mécanique", "annales"]),
      R("res-14", "TP Physique — Travaux pratiques guidés (mécanique & électricité)", "tp-physique", "MSP1", "tp", false,
        "Les séances de TP Physique du semestre 1 : protocoles, montages, traitement des incertitudes et modèles de comptes-rendus rédigés par le collectif.",
        "TP 2 — Pendule simple : mesure de g\nT = 2π sqrt(L/g) ⇒ g = 4π²L/T².\nIncertitude-type : Δg/g = ΔL/L + 2ΔT/T.",
        ["tp", "protocole", "incertitudes"]),
      R("res-15", "Informatique 1 — Cours d'algorithmique & structures de données", "informatique-1", "MSP1", "cours", false,
        "Cours officiel d'Informatique 1 (semestre 1) : complexité, listes, piles, files, arbres et tris, avec analyses de complexité démontrées.",
        "Complexité du tri fusion : T(n) = 2T(n/2) + O(n) ⇒ T(n) = O(n log n) (théorème maître).\nStructure file : enfiler/défiler en O(1).",
        ["algorithmique", "complexité", "tris"]),
      R("res-16", "Informatique 1 — TP guidés de programmation C", "informatique-1", "MSP1", "tp", false,
        "Six TP guidés en langage C conformes au programme d'Informatique 1 : pointeurs, tableaux dynamiques, fichiers et structures, avec code de référence commenté.",
        "TP 3 — Allocation dynamique\nint *t = malloc(n * sizeof(int));\nif (!t) { fprintf(stderr, \"alloc\\n\"); exit(1); }\n/* ... */ free(t);",
        ["C", "pointeurs", "tp"]),
      R("res-17", "Informatique 1 — Exercices corrigés (récursivité & complexité)", "informatique-1", "MSP1", "exercices", true,
        "30 exercices corrigés d'Informatique 1 sur la récursivité, les récurrences et l'analyse de complexité, du niveau base au niveau examen.",
        "Exercice 9 — Résoudre T(n) = T(n−1) + n, T(1) = 1.\nT(n) = Σ_{k=1..n} k = n(n+1)/2 ⇒ Θ(n²).",
        ["récursivité", "complexité", "exercices"]),
      R("res-18", "Éléments de Chimie — Cours (atome, liaison, solutions)", "elements-chimie", "MSP1", "cours", false,
        "Cours officiel d'Éléments de Chimie (semestre 1) : structure de l'atome, classification périodique, liaison chimique et chimie des solutions, avec exercices types.",
        "Concentration molaire : C = n/V.\nLoi de dilution : C₁V₁ = C₂V₂.\npH = −log[H₃O⁺].",
        ["chimie", "atome", "solutions"]),
      R("res-19", "Examen Électromagnétisme 1 — Session 2025 (corrigé)", "electromagnetisme-1", "MSP1", "examens", true,
        "Sujet intégral de l'évaluation d'Électromagnétisme 1 avec correction barémée : applications du théorème de Gauss et calculs de champs.",
        "Exercice 3 (5 points) — Champ créé par un plan infini uniformément chargé\nE = σ/(2ε₀), direction perpendiculaire au plan : démonstration par Gauss.",
        ["examen", "électromagnétisme", "annales"]),

      /* ============ MSP1 · SEMESTRE 2 ============ */
      R("res-30", "Analyse réelle 2 — Cours complet (séries & fonctions de plusieurs variables)", "analyse-reelle-2", "MSP1", "cours", false,
        "Cours officiel d'Analyse réelle 2 (semestre 2) : séries numériques et séries de fonctions, calcul différentiel à plusieurs variables, avec démonstrations au programme.",
        "Séries numériques : Σ u_n converge absolument ⇒ Σ u_n converge.\nDifférentielle : f(a+h) = f(a) + Df(a)·h + o(‖h‖).",
        ["séries", "différentiel", "analyse"]),
      R("res-31", "Algèbre linéaire — Cours & applications", "algebre-lineaire", "MSP1", "cours", false,
        "Cours officiel d'Algèbre linéaire (semestre 2) : espaces vectoriels, applications linéaires, matrices, déterminants et réduction d'endomorphismes.",
        "Chapitre 3 — Matrices et systèmes\nDéfinition. Une matrice A ∈ M_n(K) est inversible s'il existe B telle que AB = BA = I_n.\nMéthode du pivot de Gauss : complexité O(n³).",
        ["algèbre", "matrices", "espaces vectoriels"]),
      R("res-32", "Géométrie euclidienne et affine — Cours", "geometrie", "MSP1", "cours", false,
        "Cours officiel de Géométrie euclidienne et affine (semestre 2) : espaces affines, espaces euclidiens, isométries et produits vectoriels, avec figures et exercices types.",
        "Espace affine : E dirigé par un espace vectoriel V.\nProduit scalaire : ⟨x|y⟩ = ‖x‖‖y‖cosθ. Identité de polarisation.",
        ["géométrie", "euclidien", "affine"]),
      R("res-33", "Analyse réelle 2 — TD corrigé détaillé", "analyse-reelle-2", "MSP1", "td", true,
        "Correction complète du TD d'Analyse réelle 2 : convergence de séries, extrema liés et différentielles, rédigée pas à pas.",
        "Exercice 5 — Nature de Σ 1/(n ln n)\nCritère de condensation de Cauchy : la série diverge (comparaison à l'intégrale de 1/x ln x).",
        ["td", "séries", "corrigé"]),
      R("res-34", "Électromagnétisme 2 — Cours (équations de Maxwell & ondes)", "electromagnetisme-2", "MSP1", "cours", false,
        "Cours officiel d'Électromagnétisme 2 (semestre 2) : régime variable, équations de Maxwell, propagation des ondes électromagnétiques et polarisation.",
        "Équations de Maxwell : ∇·E = ρ/ε₀ ; ∇·B = 0 ; ∇×E = −∂B/∂t ; ∇×B = μ₀ J + μ₀ε₀ ∂E/t.\nOnde plane : E = E₀ e^{i(k·r − ωt)}.",
        ["maxwell", "ondes", "propagation"]),
      R("res-35", "Technologie et sciences des matériaux — Cours", "technologie-materiaux", "MSP1", "cours", false,
        "Cours officiel de Technologie et sciences des matériaux (semestre 2) : structure des matériaux, propriétés mécaniques, diagrammes de phases et choix des matériaux en ingénierie.",
        "Contrainte : σ = F/S. Déformation : ε = ΔL/L.\nLoi de Hooke : σ = E·ε (domaine élastique).",
        ["matériaux", "métallurgie", "propriétés"]),
      R("res-36", "Informatique 2 — Cours de programmation C++ & POO", "informatique-2", "MSP1", "cours", false,
        "Cours officiel d'Informatique 2 (semestre 2) : passage du C au C++, classes, encapsulation, héritage et introduction au polymorphisme.",
        "class Forme { public: virtual double aire() const = 0; virtual ~Forme() = default; };\nclass Cercle : public Forme { double r; public: double aire() const override { return M_PI*r*r; } };",
        ["C++", "POO", "classes"]),
      R("res-37", "Algèbre linéaire — Exercices corrigés (réduction & déterminants)", "algebre-lineaire", "MSP1", "exercices", true,
        "Banque d'exercices corrigés d'Algèbre linéaire : diagonalisation, polynôme caractéristique, déterminants et systèmes, niveau examen.",
        "Exercice 8 — Diagonaliser A = [[4,1],[2,3]]\nPolynôme caractéristique : (4−λ)(3−λ)−2 = λ²−7λ+10 ⇒ λ = 2, 5. A est diagonalisable.",
        ["réduction", "déterminants", "exercices"]),
      R("res-38", "Examen Analyse réelle 2 — Session 2026 (corrigé)", "analyse-reelle-2", "MSP1", "examens", true,
        "Sujet intégral de l'évaluation d'Analyse réelle 2, session 2026, avec barème officiel reconstitué et correction rédigée.",
        "Exercice 3 (6 points) — Rayon de convergence de Σ (n²/3ⁿ) xⁿ\nRègle de d'Alembert : R = 3.",
        ["examen", "annales", "2026"]),
      R("res-39", "Examen Informatique 2 — Session 2026 (corrigé)", "informatique-2", "MSP1", "examens", true,
        "Sujet d'évaluation d'Informatique 2 : conception de classes C++, traces d'exécution et questions de cours, entièrement corrigé.",
        "Problème 1 (9 points) — Concevoir une hiérarchie de classes pour un gestionnaire de ressources académiques (UML → C++).",
        ["examen", "C++", "annales"]),

      /* ============ MSP2 · spécialités ============ */
      R("res-50", "Analyse complexe — Cours MSP2", "analyse-complexe", "MSP2", "cours", false,
        "Holomorphie, équations de Cauchy-Riemann, intégration complexe, séries de Laurent et théorème des résidus avec applications au calcul d'intégrales réelles.",
        "Théorème (formule intégrale de Cauchy). Si f est holomorphe sur un ouvert simplement connexe Ω et γ un lacet de Ω, alors pour tout a intérieur à γ : f(a) = (1/2iπ) ∮_γ f(z)/(z−a) dz.",
        ["complexe", "résidus", "holomorphie"]),
      R("res-51", "Probabilités & statistiques — Cours complet MSP2", "probabilites", "MSP2", "cours", true,
        "Variables aléatoires, lois usuelles, théorèmes limites et introduction aux processus : le cours de référence pour les probabilités en deuxième année.",
        "Définition (espérance). Pour X une v.a. discrète : E[X] = Σ x·P(X = x).\nThéorème central limite : sqrt(n) (X̄_n − μ) → N(0, σ²) en loi.",
        ["probabilités", "statistiques", "TCL"]),
      R("res-52", "TD Probabilités — Corrigé détaillé MSP2", "probabilites", "MSP2", "td", true,
        "Correction complète du TD de probabilités : calculs de lois, fonctions génératrices, exercices de convergence.",
        "Exercice 5 — Loi du nombre de passages\nOn reconnaît une loi géométrique de paramètre p : E[N] = 1/p, Var(N) = (1−p)/p².",
        ["td", "probabilités", "corrigé"]),
      R("res-53", "Thermodynamique — Cours complet MSP2", "thermodynamique", "MSP2", "cours", false,
        "Premier et second principes, fonctions d'état, machines thermiques et diagrammes : le cours de thermodynamique de deuxième année.",
        "Premier principe : ΔU = W + Q.\nEntropie : dS = δQ_rev/T. Second principe : S créée ≥ 0.",
        ["thermodynamique", "entropie", "machines"]),
      R("res-54", "TD Thermodynamique — Corrigé détaillé MSP2", "thermodynamique", "MSP2", "td", true,
        "Correction pas à pas du TD : cycles de Carnot, Rankine et exercices de bilans entropiques.",
        "Exercice 7 — Rendement de Carnot\nη = 1 − T_f/T_c = 1 − 300/600 = 0,5.",
        ["td", "thermodynamique", "corrigé"]),
      R("res-55", "Optique ondulatoire — Cours & interférences", "optique-ondulatoire", "MSP2", "cours", true,
        "Interférences, diffraction, cohérence et applications instrumentales : le cours avancé d'optique ondulatoire.",
        "Différence de marche : δ = d·sinθ. Franges brillantes : δ = kλ.\nIntensité : I = I₀ cos²(πδ/λ).",
        ["optique", "interférences", "diffraction"]),
      R("res-56", "Programmation orientée objet C++ — Cours avancé MSP2", "poo-cpp", "MSP2", "cours", false,
        "Classes, héritage, polymorphisme, templates et STL : le cours de POO en C++ avec bonnes pratiques de conception.",
        "template <typename T> class Pile { std::vector<T> d; public: void push(const T& x){ d.push_back(x); } };",
        ["C++", "POO", "STL"]),
      R("res-57", "Bases de données & SQL — Cours complet MSP2", "bases-donnees", "MSP2", "cours", false,
        "Modèle relationnel, algèbre relationnelle, SQL avancé, normalisation et transactions : le cours de référence en bases de données.",
        "SELECT s.nom, AVG(n.note) AS moy\nFROM notes n JOIN students s ON s.id = n.student_id\nGROUP BY s.nom HAVING AVG(n.note) >= 12;",
        ["SQL", "bases de données", "normalisation"]),
      R("res-58", "TD SQL — Corrigé détaillé MSP2", "bases-donnees", "MSP2", "td", true,
        "Correction complète du TD de SQL : jointures, sous-requêtes corrélées, fenêtres et optimisation d'index.",
        "Exercice 6 — Sous-requête corrélée\nSELECT nom FROM etudiants e WHERE note > (SELECT AVG(note) FROM etudiants WHERE filiere = e.filiere);",
        ["td", "SQL", "corrigé"]),
      R("res-59", "Examen Analyse complexe MSP2 — Session 2026 (corrigé)", "analyse-complexe", "MSP2", "examens", true,
        "Sujet intégral de la dernière évaluation MSP2 d'analyse complexe avec correction barémée : résidus et intégrales réelles.",
        "Exercice 3 (6 points) — Calculer ∫_{−∞}^{+∞} dx/(1+x⁴) par la méthode des résidus.\nPôles : e^{iπ/4}, e^{3iπ/4}. Résultat : π/sqrt(2).",
        ["examen", "annales", "MSP2"]),
    ],
    requests: [
      { id: "req-0001", userId: "u-demo", resourceId: "res-03", status: "approved", createdAt: now - 86400000 * 3, updatedAt: now - 86400000 * 2 },
      { id: "req-0002", userId: "u-demo", resourceId: "res-05", status: "pending", createdAt: now - 3600000 * 5, updatedAt: now - 3600000 * 5 },
    ],
    sessions: [],
    announcements: [
      { id: "a-1", title: "Session de révision intensive MSP1 — Octobre 2026", body: "Deux semaines de séances corrigées en direct (Analyse réelle 1 & Mécanique du point) organisées par le collectif. Places limitées : inscrivez-vous via WhatsApp.", date: "2026-09-01" },
      { id: "a-2", title: "Nouveaux sujets corrigés disponibles", body: "Les évaluations session 2026 (Analyse réelle 2, Informatique 2, Analyse complexe) viennent d'être ajoutées aux ressources premium.", date: "2026-08-24" },
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
