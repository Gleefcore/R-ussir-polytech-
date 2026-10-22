'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Brain,
  Star,
  Search,
  Building2,
  Rocket,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  Layers,
  Award,
  Users,
  Compass,
  BookOpen,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { techPrograms, strategyPrograms } from '@/data/vipPrograms';
import { partnerCompanies } from '@/data/partners';
import { VipCard } from '@/components/vip/VipCard';
import { PartnerCard } from '@/components/vip/PartnerCard';

type TabType = 'all' | 'formations' | 'projects' | 'partners' | 'mentors';

export default function EntrepreneurVipPage() {
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrage intelligent par mot-clé
  const query = searchQuery.trim().toLowerCase();

  const filteredPartners = useMemo(() => {
    if (!query) return partnerCompanies;
    return partnerCompanies.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query) ||
        p.badge.toLowerCase().includes(query) ||
        p.founder.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.services.some((s) => s.toLowerCase().includes(query)) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  }, [query]);

  const filteredTech = useMemo(() => {
    if (!query) return techPrograms;
    return techPrograms.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.badges.some((b) => b.toLowerCase().includes(query)) ||
        p.mentor.toLowerCase().includes(query)
    );
  }, [query]);

  const filteredStrategy = useMemo(() => {
    if (!query) return strategyPrograms;
    return strategyPrograms.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.summary.toLowerCase().includes(query) ||
        p.badges.some((b) => b.toLowerCase().includes(query)) ||
        p.mentor.toLowerCase().includes(query)
    );
  }, [query]);

  const totalResults =
    filteredPartners.length + filteredTech.length + filteredStrategy.length;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-slate-50 dark:bg-[#050B14] transition-colors duration-300">
      {/* Hero Section Prestige */}
      <div className="relative overflow-hidden border-b border-slate-200 dark:border-white/10 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent">
        {/* Background Ambience Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-br from-[#D4AF37]/15 via-sky-500/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          {/* Badge d'excellence */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-full px-5 py-2 mb-6 shadow-sm backdrop-blur-md"
          >
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="text-[#D4AF37] text-xs sm:text-sm font-black tracking-widest uppercase font-mono">
              Écosystème Entrepreneuriat &amp; Ingénierie
            </span>
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight"
          >
            Le Coin de l&apos;Ingénieur{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
              Entrepreneur
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-medium mb-4 leading-relaxed"
          >
            « Les compétences ne s&apos;arrêtent pas aux cours. Elles se construisent aussi dans les projets. »
          </motion.p>

          <p className="text-xs sm:text-sm text-[#D4AF37] font-bold tracking-wider uppercase mb-10 font-mono">
            « L&apos;excellence est notre seul standard. »
          </p>

          {/* Repères Visuels & Chiffres Clés */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10"
          >
            <div className="glass-card p-4 rounded-2xl border border-sky-500/30 bg-white/80 dark:bg-white/5 text-center shadow-md">
              <Cpu className="w-6 h-6 text-sky-500 mx-auto mb-1.5" />
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">5</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Ateliers Pratiques
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-[#D4AF37]/30 bg-white/80 dark:bg-white/5 text-center shadow-md">
              <Brain className="w-6 h-6 text-[#D4AF37] mx-auto mb-1.5" />
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">4</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Parcours Stratégiques
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-white/80 dark:bg-white/5 text-center shadow-md">
              <Building2 className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">3</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Entreprises Partenaires
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-purple-500/30 bg-white/80 dark:bg-white/5 text-center shadow-md">
              <Rocket className="w-6 h-6 text-purple-400 mx-auto mb-1.5" />
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Projets Concrets
              </p>
            </div>
          </motion.div>

          {/* Cartouche Institutionnel */}
          <div className="max-w-3xl mx-auto glass-card p-6 border border-[#D4AF37]/30 rounded-3xl bg-gradient-to-r from-[#D4AF37]/10 via-white/5 to-sky-500/10 text-center shadow-lg">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              Cet espace rassemble les ateliers techniques, les projets de recherche appliquée et les initiatives menées en collaboration avec les entreprises fondées par des ingénieurs polytechniciens.
            </p>
          </div>
        </div>
      </div>

      {/* Barre d'Outils & Navigation Progressive */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-[#050B14]/95 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Barre de recherche instantanée */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une compétence, atelier (CAO, Python, Brevets...)..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Onglets de filtrage progressif */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tous les parcours ({totalResults})</span>
              </button>

              <button
                onClick={() => setActiveTab('formations')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'formations'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Formations &amp; Ateliers ({filteredTech.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'projects'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/25'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Stratégie &amp; Initiatives ({filteredStrategy.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('partners')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'partners'
                    ? 'bg-[#D4AF37] text-slate-900 shadow-md shadow-[#D4AF37]/25'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Entreprises Partenaires ({filteredPartners.length})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-16">
        {/* Résultat vide */}
        {totalResults === 0 && (
          <div className="text-center py-16 glass-card rounded-3xl p-8 border border-dashed border-slate-300 dark:border-white/10">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Aucun atelier ne correspond à votre recherche « {searchQuery} »
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Essayez « Python », « CAO », « Modélisation », « Brevets » ou réinitialisez la recherche.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-slate-900 font-black text-xs uppercase tracking-wider shadow-md"
            >
              Réinitialiser
            </button>
          </div>
        )}

        {/* SECTION 1: FORMATIONS & ATELIERS TECHNIQUES */}
        {(activeTab === 'all' || activeTab === 'formations') && filteredTech.length > 0 && (
          <section id="formations" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-500 shadow-sm flex-shrink-0">
                  <Cpu className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                    Formations &amp; Ateliers Pratiques
                  </h2>
                  <p className="text-sky-600 dark:text-poly-cyan text-xs sm:text-sm font-mono font-bold mt-1">
                    Encadrement Technique : Yannick BIKEI &bull; Directeur Informatique et Opérationnel
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 self-start md:self-auto">
                {filteredTech.length} Ateliers Programmés
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTech.map((program, index) => (
                <VipCard key={program.id} program={program} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: PROJETS, STRATÉGIE & HAUTE PERFORMANCE */}
        {(activeTab === 'all' || activeTab === 'projects') && filteredStrategy.length > 0 && (
          <section id="strategie" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] shadow-sm flex-shrink-0">
                  <Brain className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                    Vision Industrielle, Stratégie &amp; Initiatives
                  </h2>
                  <p className="text-[#D4AF37] text-xs sm:text-sm font-mono font-bold mt-1">
                    Encadrement Stratégique : Eugène Samuel GWET &bull; Cofondateur &amp; PCA Réussir Polytech
                  </p>
                </div>
              </div>

              <span className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 self-start md:self-auto">
                {filteredStrategy.length} Parcours
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStrategy.map((program, index) => (
                <VipCard key={program.id} program={program} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: ENTREPRISES PARTENAIRES OFFICIELLES */}
        {(activeTab === 'all' || activeTab === 'partners') && filteredPartners.length > 0 && (
          <section id="partenaires" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full px-3.5 py-1 mb-2 text-[#D4AF37] text-xs font-black uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Écosystème Industriel Partenaire</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                  Entreprises Partenaires Confirmées
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mt-1">
                  Structures d&apos;ingénierie et d&apos;innovation technologique collaborant avec Réussir Polytech.
                </p>
              </div>

              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 self-start md:self-auto">
                {filteredPartners.length} Entreprises Actives
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {filteredPartners.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 4: CADRE D'INCUBATION TECHNIQUE */}
        {(activeTab === 'all' || activeTab === 'projects') && (
          <section id="incubation" className="scroll-mt-32">
            <div className="glass-card p-8 sm:p-10 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/5 via-white/5 to-[#050B14] relative overflow-hidden shadow-lg">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-4 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <Rocket className="w-4 h-4" />
                  <span>Pôle Projets &bull; De l&apos;Étude au Prototype</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading mb-3">
                  Développement de Projets Techniques &amp; Ingénierie
                </h2>

                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium mb-6">
                  L&apos;écosystème Réussir Polytech accompagne les initiatives d&apos;élèves-ingénieurs dans la modélisation, le prototypage logiciel et la conception industrielle.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-3.5 rounded-2xl">
                    <span className="text-xs font-black text-emerald-500 font-mono">PHASE 1</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Cahier des Charges</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Spécifications fonctionnelles, objectifs et livrables.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-3.5 rounded-2xl">
                    <span className="text-xs font-black text-[#D4AF37] font-mono">PHASE 2</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Modélisation &amp; Code</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Architecture technique, prototypage et simulations.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-3.5 rounded-2xl">
                    <span className="text-xs font-black text-sky-500 font-mono">PHASE 3</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">Validation &amp; Déploiement</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Tests, documentation et mise en application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Slogan officiel en clôture */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="border-t border-slate-200 dark:border-white/10 pt-10 text-center">
          <p className="text-xs font-black tracking-widest text-[#D4AF37] uppercase font-mono mb-2">
            RÉUSSIR POLYTECH
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
            « L&apos;excellence est notre seul standard. »
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Plateforme académique d&apos;excellence pour les élèves-ingénieurs du Cameroun.
          </p>
        </div>
      </div>
    </div>
  );
}
