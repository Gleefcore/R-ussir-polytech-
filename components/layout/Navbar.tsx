'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, Star, Users, LayoutDashboard, ShieldCheck, LogOut, Images } from 'lucide-react';
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
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

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
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2.5">
                <Link
                  href={effectiveLevel === 'MSP2' ? '/msp2' : '/msp1'}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/35 hover:bg-[#D4AF37]/25 transition-all shadow-sm"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Mes Cours ({effectiveLevel})</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-sm"
                >
                  {activeSession?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-300 dark:border-white/20">
                      <Image
                        src={activeSession?.avatar_url || user?.user_metadata?.avatar_url}
                        alt={activeSession?.name || user?.user_metadata?.full_name || 'Profil'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-[10px] uppercase">
                      {(activeSession?.name || user?.user_metadata?.full_name || 'RP').substring(0, 2)}
                    </div>
                  )}
                  <span className="hidden sm:inline-block max-w-[100px] truncate">
                    {activeSession?.name || user?.user_metadata?.full_name || 'Profil'}
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
                  className="block px-4 py-3 rounded-xl text-sm text-[#D4AF37] font-bold bg-[#D4AF37]/10"
                >
                  Mes Cours ({effectiveLevel})
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-slate-800 dark:text-white font-bold bg-slate-100 dark:bg-white/5"
                >
                  {activeSession?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-slate-300 dark:border-white/20">
                      <Image
                        src={activeSession?.avatar_url || user?.user_metadata?.avatar_url}
                        alt={activeSession?.name || user?.user_metadata?.full_name || 'Profil'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold text-[10px] uppercase">
                      {(activeSession?.name || user?.user_metadata?.full_name || 'RP').substring(0, 2)}
                    </div>
                  )}
                  <span>Mon Espace Profil</span>
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
    </header>
  );
}
