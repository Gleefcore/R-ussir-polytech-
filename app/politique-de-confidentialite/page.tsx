'use client';

import { Shield, BookOpen, CheckCircle, Lock, Users, FileText, Scale } from 'lucide-react';
import Link from 'next/link';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50 dark:bg-[#050A14] text-slate-800 dark:text-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/35 rounded-full px-4 py-1.5 mb-4 shadow-sm">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs font-black tracking-widest uppercase font-mono">
              Cadre Juridique & Déontologique
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 font-heading">
            Politique de <span className="text-gold-gradient">Confidentialité</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Engagement solennel de la communauté Réussir Polytech quant à l&apos;utilisation légitime des ressources pédagogiques et à la protection des données des élèves ingénieurs.
          </p>
        </div>

        {/* Note Cadre de Droit & Ressources des Professeurs */}
        <div className="glass-card p-8 rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl mb-12 relative overflow-hidden bg-gradient-to-br from-[#D4AF37]/5 via-transparent to-sky-500/5">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex-shrink-0">
              <Scale className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 font-heading">
                Statut et Droit d&apos;Utilisation des Documents Académiques
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                La plateforme <strong>Réussir Polytech</strong> est le fruit du travail concerté de l&apos;équipe d&apos;élèves ingénieurs pour centraliser et valoriser l&apos;excellence académique.
              </p>
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2">
                <p>
                  ✅ <strong>Mise à disposition par les enseignants :</strong> Les cours, polycopiés, fiches de travaux dirigés (TD) et sujets d&apos;examens ou de contrôles continus hébergés sur la plateforme sont des supports pédagogiques officiellement mis par les professeurs et enseignants-chercheurs à la disposition des élèves ingénieurs dans le cadre de leur formation universitaire.
                </p>
                <p>
                  ✅ <strong>Droit d&apos;usage des élèves ingénieurs :</strong> Conformément aux usages académiques et aux libertés d&apos;étude, tout élève ingénieur dispose du droit plein et entier d&apos;accéder, de consulter, de télécharger et de travailler sur ces ressources pour ses révisions, ses entraînements et son perfectionnement intellectuel.
                </p>
                <p>
                  ✅ <strong>Finalité non commerciale :</strong> Ces documents sont strictement réservés à des fins d&apos;apprentissage, d&apos;émulation collective et de progression académique au sein de la communauté.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles détaillés */}
        <div className="space-y-8">
          {/* Article 1 */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center font-mono font-bold text-sm">
                01
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                Responsabilité & Propriété Académique
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
              Réussir Polytech agit comme une instance bénévole de mutualisation et d&apos;indexation des savoirs. Les auteurs respectifs des polycopiés (éminents professeurs et docteurs : Pr Takou, Pr Bouetou, Dr Yatat, Dr Remaoun, etc.) demeurent les titulaires exclusifs de la paternité intellectuelle de leurs enseignements.
            </p>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              La certification apposée sur les documents (cachet Direction Générale et filigrane officiel) vise à garantir aux étudiants l&apos;authenticité, l&apos;intégrité du contenu et la conformité aux programmes officiels dispensés.
            </p>
          </div>

          {/* Article 2 */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-mono font-bold text-sm">
                02
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                Protection des Données Personnelles des Utilisateurs
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
              Lorsque vous vous inscrivez ou vous connectez à la plateforme Réussir Polytech :
            </p>
            <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 text-sm space-y-1.5 ml-2 mb-3">
              <li>Vos identifiants sont chiffrés et sécurisés via notre infrastructure cloud dédiée (Supabase Authentication avec protocole TLS/SSL de bout en bout).</li>
              <li>Vos sessions restent mémorisées localement sur votre navigateur afin de vous éviter des reconnexions répétitives, conformément à votre demande de navigation fluide.</li>
              <li>Aucune donnée personnelle n&apos;est vendue, cédée ou transmise à des tiers sous quelque prétexte que ce soit.</li>
            </ul>
          </div>

          {/* Article 3 */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-mono font-bold text-sm">
                03
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                Accès aux Programmes VIP & Accompagnement
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
              Les modules techniques avancés (Espace Ingénieur VIP, masterclasses et outils métiers) font l&apos;objet d&apos;une orientation personnalisée. Les échanges financiers ou inscriptions spécifiques sont traités directement et en toute transparence avec la Direction Générale (via WhatsApp sécurisé avec Eugène Gwet ou Pierre Yannick Bikei).
            </p>
          </div>

          {/* Article 4 */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center font-mono font-bold text-sm">
                04
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white font-heading">
                Modifications & Contact Déontologique
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
              La présente politique peut être actualisée par le Conseil d&apos;Administration de Réussir Polytech conformément aux évolutions institutionnelles de l&apos;École. Pour toute question, suggestion ou signalement relatif à un document pédagogique, vous pouvez contacter directement le secrétariat général :
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:contact@reussir-polytech.cm"
                className="btn-secondary text-xs px-4 py-2"
              >
                contact@reussir-polytech.cm
              </a>
              <Link href="/a-propos" className="btn-primary text-xs px-4 py-2">
                Consulter l&apos;Organigramme Officiel
              </Link>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#D4AF37] hover:underline"
          >
            ← Retourner à la page d&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
