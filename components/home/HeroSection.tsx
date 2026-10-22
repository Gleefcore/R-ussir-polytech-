'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Search,
  BookOpen,
  ArrowRight,
  Users,
  FileCheck,
  Star,
  Award,
  DownloadCloud,
  Smartphone,
  Share,
  PlusSquare,
  X,
  Download,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

/* ─── Types & Interfaces ─────────────────────────────────────────────────── */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/* ─── Floating Particle (SVG dots animés) ─────────────────────────────────── */
const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  duration: Math.random() * 8 + 6,
}));

/* ─── Stat Counter animé ─────────────────────────────────────────────────── */
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count}{suffix}</span>;
}

/* ─── Composant Principal HeroSection ───────────────────────────────────── */
export function HeroSection() {
  const [searchWord, setSearchWord] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const globeX = useTransform(mouseX, [0, 1], [-18, 18]);
  const globeY = useTransform(mouseY, [0, 1], [-12, 12]);

  useEffect(() => {
    setIsMounted(true);

    /* Détection plateforme */
    const isIosDev = /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    setIsIos(isIosDev && isSafari);

    /* Déjà installé ? */
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(Boolean(isStandalone));

    /* Enregistrement SW */
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    /* Capture de beforeinstallprompt */
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  const handleInstall = async () => {
    if (isIos) { setShowIosGuide(true); return; }
    if (!deferredPrompt) { setShowInstallBanner(true); return; }
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const quickSearches = [
    { label: 'Analyse Réelle 1 & 2', level: 'MSP1', href: '/msp1?q=analyse' },
    { label: 'Algèbre Linéaire', level: 'MSP1', href: '/msp1?q=algebre' },
    { label: 'Algèbre Multilinéaire', level: 'MSP2', href: '/msp2?q=algebre' },
    { label: 'Électromagnétisme', level: 'MSP1', href: '/msp1?q=electromag' },
    { label: 'Probabilités & Stats', level: 'MSP2', href: '/msp2?q=probabilites' },
  ];

  /* ─── Variants Framer Motion ───────────────────────────────────────────── */
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  /* ─── RENDER ────────────────────────────────────────────────────────────── */
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#030B18]"
      onMouseMove={handleMouseMove}
    >
      {/* ═══ FOND : GLOBE TERRESTRE EN PARALLAXE ═══ */}
      <div className="absolute inset-0 z-0">
        {/* Couche de dégradé sombre overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020810]/95 via-[#030B18]/80 to-[#030B18] z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030B18]/90 via-transparent to-[#030B18]/70 z-10" />

        {/* Globe avec parallaxe au mouvement de souris */}
        <motion.div
          style={{ x: globeX, y: globeY }}
          className="absolute right-[-5%] top-[50%] -translate-y-1/2 w-[580px] h-[580px] sm:w-[720px] sm:h-[720px] lg:w-[900px] lg:h-[900px] z-0 opacity-60 lg:opacity-75"
          initial={{ opacity: 0, scale: 0.7, rotate: -15 }}
          animate={{ opacity: 0.65, scale: 1, rotate: 0 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Rotation lente continue du globe */}
          <motion.div
            className="w-full h-full relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          >
            <Image
              src="/assets/globe-terrestre.jpg"
              alt="Globe terrestre — Réussir Polytech"
              fill
              className="object-contain select-none pointer-events-none"
              priority
              style={{ filter: 'hue-rotate(10deg) saturate(1.3) brightness(1.1)' }}
            />
          </motion.div>

          {/* Halo lumineux autour du globe */}
          <div className="absolute inset-[-15%] rounded-full bg-[#0284C7]/10 blur-[80px] animate-pulse" />
          <div className="absolute inset-[-8%] rounded-full bg-[#D4AF37]/8 blur-[50px]" />
        </motion.div>

        {/* Grille de perspective futuriste */}
        <div
          className="absolute inset-0 z-5 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(212,175,55,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.8) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Halos d'ambiance premium */}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-[#D4AF37]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] bg-[#0284C7]/10 rounded-full blur-[120px] pointer-events-none" />
      </div>

      {/* ═══ PARTICULES FLOTTANTES ═══ */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        {isMounted && particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              background: p.id % 3 === 0
                ? 'rgba(212,175,55,0.7)'
                : p.id % 3 === 1
                  ? 'rgba(2,132,199,0.5)'
                  : 'rgba(255,255,255,0.3)',
            }}
            animate={{
              y: [0, -35, 0],
              opacity: [0.2, 0.9, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ═══ CONTENU PRINCIPAL ═══ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 sm:pt-32 sm:pb-24 min-h-screen flex flex-col justify-center">

        {/* ─── BADGE INSTITUTIONNEL ─── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-3 mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/35 text-[#D4AF37] font-mono text-[11px] font-black tracking-widest uppercase backdrop-blur-md">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>ENSPY — École Nationale Supérieure Polytechnique de Yaoundé</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Plateforme officielle • Promotion 2026</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* ─── COLONNE GAUCHE : TEXTE + ACTIONS ─── */}
          <motion.div
            className="lg:col-span-7 flex flex-col"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* TITRE HÉROÏQUE */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.03] font-heading text-white mb-4">
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] animate-[shimmer_3s_ease-in-out_infinite]">
                  Réussir
                </span>
                <span className="block text-white">
                  Polytech.
                </span>
              </h1>
            </motion.div>

            {/* SLOGAN OFFICIEL */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-xl font-bold font-mono text-[#D4AF37]/90 tracking-wide mb-4"
            >
              « L&apos;excellence est notre seul standard. »
            </motion.p>

            {/* DESCRIPTION */}
            <motion.p
              variants={itemVariants}
              className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-medium max-w-lg"
            >
              La plateforme officielle de l&apos;élite polytechnique. Accédez à tous les{' '}
              <strong className="text-white">cours certifiés</strong>, les{' '}
              <strong className="text-white">fiches de TD</strong> et les{' '}
              <strong className="text-white">annales</strong> du corps professoral émérite
              (Pr Takou, Pr Bouetou, Pr Mama, Dr Yatat et leurs pairs).
            </motion.p>

            {/* ═══ BOUTON TÉLÉCHARGER L'APPLICATION (PRIORITÉ ABSOLUE MOBILE) ═══ */}
            <motion.div variants={itemVariants} className="mb-8">
              {!isInstalled ? (
                <div className="relative group">
                  <button
                    onClick={handleInstall}
                    className="
                      w-full sm:w-auto flex items-center justify-center gap-3
                      px-8 py-4 rounded-2xl font-black text-sm sm:text-base
                      bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37]
                      text-[#050B14] shadow-[0_0_40px_rgba(212,175,55,0.5)]
                      hover:shadow-[0_0_60px_rgba(212,175,55,0.75)]
                      hover:scale-[1.03] active:scale-[0.97]
                      transition-all duration-300 ease-out
                      border-2 border-[#D4AF37]
                      relative overflow-hidden
                    "
                    style={{
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2.5s ease-in-out infinite',
                    }}
                  >
                    {/* Reflet animé */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />

                    <Smartphone className="w-5 h-5 flex-shrink-0 relative z-10" />
                    <span className="relative z-10">
                      {isIos ? 'Installer sur iPhone/iPad' : 'Télécharger l\'Application'}
                    </span>
                    <Download className="w-5 h-5 flex-shrink-0 relative z-10" />
                  </button>

                  {/* Texte indicatif sous le bouton */}
                  <p className="mt-2 text-[11px] text-slate-400 font-mono text-center sm:text-left">
                    {isIos
                      ? 'Safari → Partager → Sur l\'écran d\'accueil'
                      : 'Gratuit • Android, iPhone & PC • Accès hors ligne'}
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 font-bold text-sm w-fit">
                  <Sparkles className="w-5 h-5" />
                  <span>Application installée avec succès !</span>
                </div>
              )}
            </motion.div>

            {/* BARRE DE RECHERCHE */}
            <motion.div
              variants={itemVariants}
              className="mb-5 p-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-inner backdrop-blur-md"
            >
              <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] flex-shrink-0">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                placeholder="Rechercher une matière (Analyse 1, Algèbre, Électrostatique...)"
                className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
              />
              <Link
                href={searchWord ? `/msp1?q=${encodeURIComponent(searchWord)}` : '/msp1'}
                className="px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all flex-shrink-0 shadow-md"
              >
                Chercher
              </Link>
            </motion.div>

            {/* Recherches rapides */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-1.5 mb-8">
              <span className="text-[11px] font-mono text-slate-500 mr-1">Populaires :</span>
              {quickSearches.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#D4AF37]/20 hover:text-[#D4AF37] text-slate-400 border border-white/8 transition-colors"
                >
                  {item.label}{' '}
                  <span className="text-[9px] text-[#D4AF37] font-mono">({item.level})</span>
                </Link>
              ))}
            </motion.div>

            {/* ─── CARTES MSP 1 & MSP 2 ─── */}
            <motion.div variants={itemVariants}>
              <p className="text-[11px] font-black uppercase tracking-wider text-white/60 mb-3 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                <span>Choisissez votre filière et commencez maintenant :</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* CARTE MSP 1 */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/msp1"
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-amber-400 to-[#B8860B] text-slate-950 font-black shadow-xl shadow-amber-500/30 flex flex-col justify-between border-2 border-amber-300/60 group transition-shadow hover:shadow-[0_0_50px_rgba(212,175,55,0.4)] block"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-950 text-[#D4AF37]">
                          1ère Année • ENSPY
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight">Filière MSP 1</h3>
                      <p className="text-xs font-semibold text-slate-900/80 mt-1 leading-snug">
                        Analyse Réelle, Algèbre Fondamentale, Mécanique, Électrostatique, Chimie.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-950/20 flex items-center justify-between text-xs font-black">
                      <span>Accéder au Cockpit MSP1</span>
                      <span>→</span>
                    </div>
                  </Link>
                </motion.div>

                {/* CARTE MSP 2 */}
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/msp2"
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#0A1628] via-[#0C2340] to-[#040D1B] text-white font-black shadow-xl shadow-slate-950/60 flex flex-col justify-between border-2 border-[#D4AF37]/40 group hover:border-[#D4AF37]/70 hover:shadow-[0_0_40px_rgba(2,132,199,0.3)] transition-all block"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                          2ème Année • ENSPY
                        </span>
                        <ArrowRight className="w-5 h-5 text-[#D4AF37] group-hover:translate-x-1.5 transition-transform" />
                      </div>
                      <h3 className="text-xl font-black tracking-tight text-white">Filière MSP 2</h3>
                      <p className="text-xs font-semibold text-slate-300 mt-1 leading-snug">
                        Algèbre Multilinéaire, Séries Intégrales, Thermodynamique, Électrocinétique.
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-black text-[#D4AF37]">
                      <span>Accéder au Cockpit MSP2</span>
                      <span>→</span>
                    </div>
                  </Link>
                </motion.div>
              </div>

              {/* BANDEAU VIP */}
              <motion.div
                variants={cardVariants}
                className="mt-3.5"
              >
                <Link
                  href="/entrepreneur-vip"
                  className="p-4 rounded-2xl bg-gradient-to-r from-[#0A1628] via-[#0C2340] to-[#040D1B] border-2 border-[#D4AF37]/40 hover:border-[#D4AF37]/80 text-white transition-all flex items-center justify-between group shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] block"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
                      <Star className="w-5 h-5 fill-[#D4AF37]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                          Espace d&apos;Élite Métiers
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37] text-slate-950 font-black">VIP</span>
                      </div>
                      <h4 className="text-sm font-black text-white">
                        L&apos;Ingénieur Entrepreneur • Formations & Compétences Clés
                      </h4>
                      <p className="text-xs text-slate-300">
                        Bureautique avancée, Python, CAO 3D, Leadership — Bikei Yannick & Eugène Gwet.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37] group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ─── COLONNE DROITE : PRESTIGE VISUEL + STATS ─── */}
          <motion.div
            className="lg:col-span-5 relative hidden lg:block"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.0, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Carte prestige principale */}
            <motion.div
              className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-2xl bg-[#070E1B] group"
              whileHover={{ scale: 1.01 }}
            >
              <div className="relative h-[420px] w-full">
                <Image
                  src="/assets/gallery/family-leaders-portrait.jpg"
                  alt="La direction et les mentors de Réussir Polytech"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#030B18] via-[#030B18]/50 to-transparent" />
              </div>

              {/* Badge excellence */}
              <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-full bg-[#030B18]/85 border border-[#D4AF37]/50 backdrop-blur-md text-[11px] font-black text-[#D4AF37] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>Standard Polytechnique</span>
              </div>

              {/* Cartouche bas */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold">
                    Réseau Actif d&apos;Élèves-Ingénieurs
                  </span>
                </div>
                <h3 className="text-base font-black leading-tight">Une promotion unie vers le sommet</h3>
                <p className="text-xs text-slate-300 mt-1 mb-4">
                  Des promotions complètes partagent quotidiennement les annales et s&apos;entraident.
                </p>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10 text-center">
                  <div>
                    <p className="text-sm font-black text-[#D4AF37]">
                      {isMounted ? <AnimatedCounter target={100} suffix="%" /> : '100%'}
                    </p>
                    <p className="text-[9px] uppercase font-mono text-slate-400">Gratuit</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-sky-400">
                      {isMounted ? <><AnimatedCounter target={350} suffix="+" /></> : '+350'}
                    </p>
                    <p className="text-[9px] uppercase font-mono text-slate-400">Annales</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-emerald-400">24/7</p>
                    <p className="text-[9px] uppercase font-mono text-slate-400">Accès Libre</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Cartes flottantes de stat */}
            <motion.div
              className="absolute -left-6 top-10 px-4 py-3 rounded-2xl bg-[#0A1628]/90 border border-[#D4AF37]/40 backdrop-blur-md shadow-xl"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <p className="text-[11px] font-black text-white">Polycopiés Certifiés</p>
                  <p className="text-[10px] text-slate-400">Corps professoral émérite</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="absolute -right-4 bottom-28 px-4 py-3 rounded-2xl bg-[#0A1628]/90 border border-sky-500/40 backdrop-blur-md shadow-xl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-[11px] font-black text-white">14 Mentors Actifs</p>
                  <p className="text-[10px] text-slate-400">Aînés de promotion</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ═══ PILIERS PRESTIGE (4 STATISTIQUES INDUSTRIELLES) ═══ */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {[
            { icon: BookOpen, label: 'Polycopiés Certifiés', sub: 'Conformes au programme officiel', color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/25' },
            { icon: FileCheck, label: 'Annales CC & Examens', sub: 'Épreuves du corps professoral', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/25' },
            { icon: DownloadCloud, label: 'Téléchargement Direct', sub: 'Accès libre sans friction', color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10', border: 'border-[#D4AF37]/25' },
            { icon: Users, label: 'Entraide & Mentorat', sub: '14 aînés de promotion', color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/25' },
          ].map(({ icon: Icon, label, sub, color, bg, border }) => (
            <motion.div
              key={label}
              className={`p-4 rounded-2xl bg-white/3 border ${border} backdrop-blur-sm flex items-center gap-3 hover:bg-white/6 transition-colors`}
              whileHover={{ scale: 1.03, y: -2 }}
            >
              <div className={`p-2.5 rounded-xl ${bg} ${color} flex-shrink-0 border ${border}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-white">{label}</p>
                <p className="text-[10px] text-slate-400">{sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Indicateur de scroll */}
        <motion.div
          className="flex flex-col items-center mt-10 text-slate-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
        >
          <span className="text-[10px] font-mono uppercase tracking-widest mb-2">Découvrir</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ GUIDE INSTALLATION IOS (MODAL) ═══ */}
      <AnimatePresence>
        {showIosGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowIosGuide(false)}
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              className="bg-[#0B1528] border border-[#D4AF37]/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                  <span className="font-black text-white">Installer sur iOS</span>
                </div>
                <button onClick={() => setShowIosGuide(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { step: '1', icon: <Share className="w-4 h-4 inline mx-1 text-sky-400" />, text: 'Appuyez sur le bouton Partager dans Safari' },
                  { step: '2', icon: <PlusSquare className="w-4 h-4 inline mx-1 text-sky-400" />, text: 'Sélectionnez « Sur l\'écran d\'accueil »' },
                  { step: '3', icon: <Download className="w-4 h-4 inline mx-1 text-emerald-400" />, text: 'Appuyez sur « Ajouter » pour installer' },
                ].map(({ step, icon, text }) => (
                  <div key={step} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step}
                    </span>
                    <p>{text}{icon}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowIosGuide(false)}
                className="mt-5 w-full py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-sm"
              >
                Compris !
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ STYLES CSS ANIMATION SHIMMER ═══ */}
      <style jsx>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
}
