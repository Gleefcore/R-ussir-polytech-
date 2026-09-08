import { GridBG } from "@/components/fx-deco";
import { Reveal } from "@/components/ui";
import { SITE, WHATSAPP } from "@/config";

export const metadata = { title: "Politique de confidentialité" };

const SECTIONS = [
  {
    t: "1. Protection des données étudiants",
    p: [
      "RÉUSSIR POLYTECH collecte uniquement les informations strictement nécessaires à la création et au suivi de votre compte étudiant : nom complet, adresse email, numéro de téléphone, niveau d'étude (MSP1 ou MSP2) et mot de passe chiffré.",
      "Ces données ne sont jamais vendues, louées ni transmises à des tiers. Elles restent hébergées sur les systèmes du collectif et servent exclusivement à votre accompagnement académique.",
    ],
  },
  {
    t: "2. Utilisation des informations collectées",
    p: [
      "Vos informations permettent : de sécuriser votre espace personnel ; de traiter vos demandes d'accès aux corrections protégées et aux formations VIP ; de vous notifier des ressources, séances et informations importantes de votre niveau.",
      "Les messages envoyés via WhatsApp (nom, email, téléphone, message) sont utilisés uniquement pour traiter votre demande, puis conservés le temps nécessaire à son suivi.",
    ],
  },
  {
    t: "3. Sécurité des comptes",
    p: [
      "Les mots de passe sont stockés sous forme d'empreinte cryptographique irréversible (fonction de dérivation scrypt avec sel aléatoire) : personne, pas même l'équipe, ne peut les lire.",
      "Les sessions de connexion utilisent des cookies httpOnly protégés, expirent automatiquement après 7 jours, et l'accès aux espaces personnels et d'administration est contrôlé côté serveur à chaque requête.",
    ],
  },
  {
    t: "4. Respect de la confidentialité",
    p: [
      "Chaque membre peut demander à tout moment la consultation, la correction ou la suppression de ses données en écrivant à l'équipe sur WhatsApp (" + WHATSAPP.display + ") ou par email (" + SITE.email + ").",
      "Les documents académiques partagés le sont pour un usage personnel d'étude : toute redistribution hors de la communauté engage la responsabilité de son auteur, dans le respect du travail du collectif et des enseignants.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <main className="relative overflow-hidden pb-24 pt-32">
      <GridBG />
      <div className="relative mx-auto max-w-3xl px-6 md:px-8">
        <p className="kicker">Politique de confidentialité</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight md:text-5xl">
          Vos données, <span className="gold-text">protégées comme vos copies</span>.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/60">
          Dernière mise à jour : septembre 2026. Cette politique explique, en langage clair, comment
          RÉUSSIR POLYTECH protège les informations de ses membres.
        </p>
        <div className="mt-10 space-y-6">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.t} delay={i * 0.06}>
              <section className="glass p-8">
                <h2 className="font-display text-xl font-bold text-gold-300">{s.t}</h2>
                {s.p.map((par, j) => (
                  <p key={j} className="mt-3 text-sm leading-relaxed text-white/65">{par}</p>
                ))}
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
