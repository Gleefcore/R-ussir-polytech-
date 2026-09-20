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
} from 'lucide-react';
import { techPrograms, strategyPrograms, vipPrograms } from '@/data/vipPrograms';
import { partnerCompanies } from '@/data/partners';
import { VipCard } from '@/components/vip/VipCard';
import { PartnerCard } from '@/components/vip/PartnerCard';

type TabType = 'all' | 'partners' | 'tech' | 'strategy' | 'incubation';

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
              Écosystème Entrepreneuriat & Ingénierie d&apos;Élite
            </span>
            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 font-heading tracking-tight"
          >
            L&apos;Ingénieur Entrepreneur{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]">
              & Partenaires VIP
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-300 text-base sm:text-lg max-w-3xl mx-auto font-medium mb-10 leading-relaxed"
          >
            Le carrefour où la rigueur académique polytechnicienne rencontre l&apos;innovation industrielle,
            la haute technologie logicielle et l&apos;audace entrepreneuriale.
            <br className="hidden sm:inline" />
            <span className="italic font-bold text-slate-800 dark:text-[#F3E5AB]">
              « L&apos;excellence est notre seul standard. »
            </span>
          </motion.p>

          {/* KPI Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-10"
          >
            <div className="glass-card p-4 rounded-2xl border border-[#D4AF37]/30 bg-white/80 dark:bg-white/5 text-center shadow-md">
              <Building2 className="w-6 h-6 text-[#D4AF37] mx-auto mb-1.5" />
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">3</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Entreprises Partenaires
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-sky-500/30 bg-white/80 dark:bg-white/5 text-center shadow-md">
              <Cpu className="w-6 h-6 text-sky-500 mx-auto mb-1.5" />
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">5</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Modules Techniques
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-poly-gold/30 bg-white/80 dark:bg-white/5 text-center shadow-md">
              <Brain className="w-6 h-6 text-[#D4AF37] mx-auto mb-1.5" />
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">4</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Modules Stratégiques
              </p>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-emerald-500/30 bg-white/80 dark:bg-white/5 text-center shadow-md">
              <Rocket className="w-6 h-6 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-2xl font-black text-slate-900 dark:text-white font-heading">100%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Projets & Ingénieurs
              </p>
            </div>
          </motion.div>

          {/* Cartouche d'Adhésion VIP Directe */}
          <div className="max-w-3xl mx-auto glass-card p-6 border-2 border-[#D4AF37]/50 rounded-3xl bg-gradient-to-r from-[#D4AF37]/15 via-white/5 to-sky-500/15 text-left flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xl">
            <div>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                <span>Accès Exclusif & Accompagnement sur Mesure</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium">
                Consultez librement les partenaires et programmes ci-dessous. Pour activer votre adhésion VIP,
                bénéficier d&apos;un mentorat personnalisé ou commander une étude technique, contactez directement la direction.
              </p>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_STRATEGY || '237672356441'}?text=${encodeURIComponent("Bonjour M. Eugène Samuel GWET (PCA Réussir Polytech), je souhaite souscrire à l'Espace Ingénieur Entrepreneur et échanger avec la direction.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm text-slate-900 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] shadow-lg shadow-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider flex items-center gap-2"
            >
              <span>Contacter la Direction</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Barre d'Outils Intelligente : Recherche & Onglets */}
      <div className="sticky top-16 z-30 bg-white/90 dark:bg-[#050B14]/90 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Barre de recherche instantanée */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une entreprise, un outil (CAO, Python, Brevets...)..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 transition-all"
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

            {/* Onglets de filtrage */}
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
                <span>Tout ({totalResults})</span>
              </button>

              <button
                onClick={() => setActiveTab('partners')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'partners'
                    ? 'bg-[#D4AF37] text-slate-900 shadow-md shadow-[#D4AF37]/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Entreprises Partenaires ({filteredPartners.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('tech')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'tech'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Volet Technique ({filteredTech.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('strategy')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'strategy'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Volet Stratégie ({filteredStrategy.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('incubation')}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  activeTab === 'incubation'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>Pôle Projets</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-20">
        {/* Résultat vide si recherche infructueuse */}
        {totalResults === 0 && (
          <div className="text-center py-16 glass-card rounded-3xl p-8 border border-dashed border-slate-300 dark:border-white/10">
            <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Aucun élément ne correspond à votre recherche « {searchQuery} »
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Essayez des termes comme « CAO », « 3D », « Python », « Brevets », « Concours » ou effacez la recherche.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-5 py-2.5 rounded-xl bg-[#D4AF37] text-slate-900 font-black text-xs uppercase tracking-wider shadow-md"
            >
              Réinitialiser la recherche
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 1: ENTREPRISES PARTENAIRES CRÉÉES PAR DES INGÉNIEURS              */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'partners') && filteredPartners.length > 0 && (
          <section id="partenaires" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-full px-3.5 py-1 mb-2 text-[#D4AF37] text-xs font-black uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Partenaires Officiels d&apos;Ingénierie</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                  Entreprises Fondées par des Ingénieurs
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm font-medium mt-1">
                  Découvrez les 3 piliers entrepreneuriaux et technologiques partenaires de Réussir Polytech.
                </p>
              </div>

              <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 self-start md:self-auto">
                3 Structures d&apos;Élite Actives
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {filteredPartners.map((partner, index) => (
                <PartnerCard key={partner.id} partner={partner} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: VOLET TECHNIQUE & OUTILS MÉTIERS                               */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'tech') && filteredTech.length > 0 && (
          <section id="technique" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-500 shadow-sm flex-shrink-0">
                  <Cpu className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                    Volet Technique & Outils Métiers
                  </h2>
                  <p className="text-sky-600 dark:text-poly-cyan text-xs sm:text-sm font-mono font-bold mt-1">
                    Mentor : Bikey Yannick — Directeur Informatique et Opérationnel
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_TECH || '237695957287'}?text=${encodeURIComponent("Bonjour M. Bikey Yannick (Directeur Informatique de Réussir Polytech), je souhaite échanger avec vous sur les formations du Volet Technique.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all self-start md:self-auto shadow-md shadow-sky-500/25"
              >
                Contacter Yannick Bikey →
              </a>
            </div>

            <div className="glass-card p-5 border border-sky-500/30 rounded-2xl mb-8 bg-sky-500/5">
              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">
                Formations certifiantes pour maîtriser les outils incontournables de l&apos;ingénieur moderne :
                de la bureautique de recherche haute précision (thèses, modèles Excel matriciels) au génie informatique,
                design industriel, production multimédia et infrastructures cloud.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTech.map((program, index) => (
                <VipCard key={program.id} program={program} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: VOLET STRATÉGIE, VISION & HAUTE PERFORMANCE                    */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'strategy') && filteredStrategy.length > 0 && (
          <section id="strategie" className="scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] shadow-sm flex-shrink-0">
                  <Brain className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                    Volet Stratégie, Vision & Haute Performance
                  </h2>
                  <p className="text-[#D4AF37] text-xs sm:text-sm font-mono font-bold mt-1">
                    Mentor : Eugène Samuel GWET — Cofondateur & PCA, Fondateur de G-INNOVA
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_STRATEGY || '237672356441'}?text=${encodeURIComponent("Bonjour M. Eugène Samuel GWET (PCA de Réussir Polytech), je souhaite échanger avec vous sur les formations du Volet Stratégie & Vision.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-slate-900 rounded-xl text-xs font-black uppercase tracking-wider transition-all self-start md:self-auto shadow-md shadow-[#D4AF37]/25"
              >
                Contacter Eugène Gwet →
              </a>
            </div>

            <div className="glass-card p-5 border border-[#D4AF37]/30 rounded-2xl mb-8 bg-[#D4AF37]/5">
              <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed font-medium">
                Programmes d&apos;élite pour forger l&apos;âme d&apos;un ingénieur-bâtisseur et leader d&apos;envergure :
                discipline intellectuelle implacable, vision industrielle à long terme, négociation d&apos;affaires,
                dépôt de brevets technologiques et structuration de deeptech.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredStrategy.map((program, index) => (
                <VipCard key={program.id} program={program} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: PÔLE INCUBATION & PROJETS D'ÉLÈVES                             */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'incubation') && (
          <section id="incubation" className="scroll-mt-32">
            <div className="glass-card p-8 sm:p-12 rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-white/5 to-poly-night relative overflow-hidden shadow-2xl">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-4 py-1.5 mb-4 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <Rocket className="w-4 h-4" />
                  <span>Incubateur Polytech • De l&apos;Idée au Prototype</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading mb-4">
                  Vous avez un projet technique ou une idée de startup ?
                </h2>

                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-medium mb-8">
                  Réussir Polytech et ses entreprises partenaires mobilisent leurs expertises pour vous accompagner.
                  Bénéficiez de la CAO 3D et du prototypage avec <strong>G-INNOVA</strong>, du développement logiciel avec{' '}
                  <strong>Les As de l&apos;Informatique</strong>, et du renforcement méthodologique avec{' '}
                  <strong>Intellectual Academy</strong>.
                </p>

                {/* Étapes du processus */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-4 rounded-2xl">
                    <span className="text-xs font-black text-emerald-500 font-mono">ÉTAPE 01</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Cahier des Charges</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Définition précise du besoin, des contraintes mécaniques ou logicielles.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-4 rounded-2xl">
                    <span className="text-xs font-black text-[#D4AF37] font-mono">ÉTAPE 02</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Conception & Code</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Modélisation 3D avec G-INNOVA et architecture logicielle avec Les As de l&apos;Informatique.
                    </p>
                  </div>

                  <div className="bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 p-4 rounded-2xl">
                    <span className="text-xs font-black text-sky-500 font-mono">ÉTAPE 03</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">Prototype & Déploiement</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Impression 3D, tests en conditions réelles et présentation devant jury d&apos;ingénieurs.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <a
                    href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_STRATEGY || '237672356441'}?text=${encodeURIComponent("Bonjour, je suis élève-ingénieur et je souhaite soumettre un projet technique ou une idée de startup à l'incubateur Réussir Polytech.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-black text-xs sm:text-sm text-slate-900 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] shadow-xl shadow-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Lightbulb className="w-4 h-4 text-slate-900" />
                    <span>Soumettre mon projet à la direction</span>
                  </a>

                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Étude confidentielle & sans engagement pour tout élève polytechnicien
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Slogan & Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="border-t border-slate-200 dark:border-white/10 pt-10 text-center">
          <p className="text-xs font-black tracking-widest text-[#D4AF37] uppercase font-mono mb-2">
            Groupe d&apos;Études Réussir Polytech
          </p>
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading">
            « L&apos;excellence est notre seul standard. »
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Plateforme offerte à tout élève ingénieur qui veut avancer et bâtir l&apos;avenir.
          </p>
        </div>
      </div>
    </div>
  );
}
