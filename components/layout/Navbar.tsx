'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, Star, Users, LayoutDashboard, ShieldCheck, LogOut, Images, Download, Smartphone, Share, PlusSquare, CheckCircle2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { createClient } from '@/lib/supabaseClient';

interface ActiveSession {
  name?: string;
  matricule?: string;
  level?: string;
  email?: string;
  avatar_url?: string | null;
}

const navLinks = [
  { href: '/', label: 'Accueil', icon: null, isPublic: true },
  { href: '/msp1', label: 'MSP1', icon: GraduationCap, isPublic: true },
  { href: '/msp2', label: 'MSP2', icon: GraduationCap, isPublic: true },
  { href: '/entrepreneur-vip', label: 'L\'Ingénieur Entrepreneur (Espace VIP)', icon: Star, isPublic: true },
  { href: '/galerie', label: 'Galerie', icon: Images, isPublic: true },
  { href: '/a-propos', label: 'Notre Équipe', icon: Users, isPublic: true },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<{ email?: string; user_metadata?: { level?: string; full_name?: string; avatar_url?: string } } | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showApkGuide, setShowApkGuide] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent.toLowerCase();
      if (/iphone|ipad|ipod/.test(ua)) setPlatform('ios');
      else if (/android/.test(ua)) setPlatform('android');
      else setPlatform('desktop');
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 1. Détection immédiate depuis le stockage local (zéro latence)
    try {
      const saved = localStorage.getItem('polytech_user_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.level || parsed.name)) {
          setActiveSession(parsed);
        }
      }
    } catch {
      // Ignorer
    }

    // 2. Synchronisation Supabase
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        try {
          localStorage.removeItem('polytech_user_session');
        } catch {
          // Ignorer
        }
        setActiveSession(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('polytech_user_session');
    } catch {
      // Ignorer
    }
    setActiveSession(null);
    setUser(null);
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleAppDownload = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (platform === 'ios') {
      setShowIosGuide(true);
      return;
    }
    const link = document.createElement('a');
    link.href = '/downloads/reussir-polytech.apk';
    link.setAttribute('download', 'reussir-polytech.apk');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowApkGuide(true);
  };

  const effectiveLevel = activeSession?.level || user?.user_metadata?.level || 'MSP1';
  const isLoggedIn = !!(activeSession || user);

  // Masquer la barre de navigation publique sur le cockpit administrateur pour éviter toute superposition
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#050B14]/95 backdrop-blur-lg border-b border-slate-200/80 dark:border-white/10 shadow-lg shadow-black/5 dark:shadow-black/40'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo officiel avec marque d'excellence */}
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#0284C7] to-[#D4AF37] border border-[#D4AF37]/50 shadow-md flex items-center justify-center overflow-hidden">
              <Image
                src="/assets/logo-polytech.png"
                alt="Réussir Polytech"
                fill
                className="object-contain p-0.5 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black tracking-widest uppercase text-sky-600 dark:text-sky-400 font-mono">
                  Réussir
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              </div>
              <p className="text-lg font-black text-slate-900 dark:text-white leading-none font-heading tracking-tight">
                POLYTECH
              </p>
            </div>
          </Link>

          {/* Navigation Principale Desktop */}
          <nav className="hidden xl:flex items-center gap-1.5 bg-slate-100/70 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-full px-3 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
                    active
                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14] shadow-md font-extrabold'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                  }`}
                >
                  {link.icon && <link.icon className="w-3.5 h-3.5" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions & Connexion */}
          <div className="flex items-center gap-2.5">
            <ThemeToggle />

            {/* Bouton direct Télécharger APK / Installer iPhone Desktop */}
            <button
              onClick={handleAppDownload}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#B8860B] dark:text-[#D4AF37] hover:bg-[#D4AF37]/25 text-xs font-bold transition-all shadow-sm"
              title={platform === 'ios' ? "Installer sur iPhone / iPad (Safari)" : "Télécharger le package officiel .APK pour téléphone Android"}
            >
              {platform === 'ios' ? <Smartphone className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{platform === 'ios' ? 'App iPhone' : 'App (.APK)'}</span>
            </button>

            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2.5">
                <Link
                  href={effectiveLevel === 'MSP2' ? '/msp2' : '/msp1'}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-white/5 border border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition-all shadow-sm group"
                >
                  {activeSession?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                      <img
                        src={(activeSession?.avatar_url || user?.user_metadata?.avatar_url) as string}
                        alt={activeSession?.name || user?.user_metadata?.full_name || 'Profil'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-[10px] uppercase border border-[#D4AF37]/30">
                      {(activeSession?.name || user?.user_metadata?.full_name || 'RP').substring(0, 2)}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate text-slate-900 dark:text-white font-bold">
                    {(activeSession?.name || user?.user_metadata?.full_name || 'Mon Compte').split(' ')[0]}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#D4AF37] text-slate-950 font-black">
                    {effectiveLevel}
                  </span>
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                className="hidden md:flex items-center gap-2 btn-primary text-xs py-2.5 px-4.5"
              >
                <ShieldCheck className="w-4 h-4 text-[#050B14]" />
                <span>Espace Membre</span>
              </Link>
            )}

            {/* Bouton Menu Mobile */}
            <button
              className="xl:hidden p-2.5 rounded-xl border border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-200"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Tiroir */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="xl:hidden bg-white dark:bg-[#081224] border-b border-slate-200 dark:border-white/10 px-4 py-6 space-y-2.5 shadow-2xl"
          >
            {/* Bouton Mobile Télécharger APK / Installer iPhone en tête de tiroir */}
            <button
              onClick={() => {
                setOpen(false);
                handleAppDownload();
              }}
              className="flex items-center justify-center gap-2.5 w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 mb-3"
            >
              {platform === 'ios' ? <Smartphone className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{platform === 'ios' ? 'Installer sur iPhone (Safari)' : 'Télécharger l\'Application (.APK)'}</span>
            </button>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  pathname === link.href
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[#050B14]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn ? (
              <>
                <Link
                  href={effectiveLevel === 'MSP2' ? '/msp2' : '/msp1'}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-800 dark:text-white font-bold bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                >
                  {activeSession?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                      <img
                        src={(activeSession?.avatar_url || user?.user_metadata?.avatar_url) as string}
                        alt={activeSession?.name || user?.user_metadata?.full_name || 'Profil'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xs uppercase">
                      {(activeSession?.name || user?.user_metadata?.full_name || 'RP').substring(0, 2)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="leading-tight font-black">{activeSession?.name || user?.user_metadata?.full_name || 'Mon Compte'}</p>
                    <p className="text-[11px] text-[#D4AF37] font-mono">Tableau de bord {effectiveLevel}</p>
                  </div>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm text-rose-600 dark:text-rose-400 font-semibold"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="block btn-primary text-center text-sm py-3 mt-2"
              >
                Espace Membre
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ MODALE D'INSTALLATION IOS (IPHONE / IPAD SAFARI) ═══ */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white border-2 border-[#D4AF37] rounded-3xl p-6 sm:p-7 w-full max-w-sm text-slate-900 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/20 text-[#B8860B] flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 font-heading">
                      Installer sur iPhone / iPad
                    </h3>
                    <p className="text-[10px] text-slate-500 font-semibold">3 étapes rapides (Safari)</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowIosGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 mb-5 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Dans Safari, appuyez sur le bouton <strong>Partager</strong> <Share className="w-3.5 h-3.5 inline text-sky-600 mx-1" /> au bas de l&apos;écran.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Faites défiler et sélectionnez <strong>« Sur l&apos;écran d&apos;accueil »</strong> <PlusSquare className="w-3.5 h-3.5 inline text-sky-600 mx-1" />.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="w-6 h-6 rounded-full bg-[#D4AF37] text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Appuyez sur <strong>« Ajouter »</strong> en haut à droite. L&apos;application apparaîtra avec son logo rond officiel !
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIosGuide(false)}
                className="w-full py-3 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:bg-amber-400"
              >
                C&apos;est compris !
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══ MODALE D'INSTALLATION APK ANDROID ═══ */}
      <AnimatePresence>
        {showApkGuide && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="bg-white border-2 border-emerald-500 rounded-3xl p-6 sm:p-7 w-full max-w-sm text-slate-900 shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 flex items-center justify-center">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 font-heading">
                      Téléchargement de l&apos;APK lancé !
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-bold">Fichier officiel reussir-polytech.apk</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowApkGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 mb-5 text-xs">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    1
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Ouvrez la notification de téléchargement ou votre dossier <strong>Téléchargements</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    2
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Appuyez sur <strong>reussir-polytech.apk</strong> &gt; <strong>Installer</strong>.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                    3
                  </span>
                  <p className="text-slate-700 leading-snug">
                    Si Android demande <em>« Autoriser cette source »</em>, activez le bouton pour votre navigateur.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowApkGuide(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-md hover:bg-emerald-500"
              >
                Parfait, merci !
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
