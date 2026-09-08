"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { SITE, waLink } from "@/config";
import type { PublicUser } from "@/lib/types";
import { Btn, WhatsAppIcon } from "./ui";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/msp1", label: "MSP1" },
  { href: "/msp2", label: "MSP2" },
  { href: "/entrepreneur", label: "Ressources entrepreneur" },
  { href: "/vip", label: "VIP" },
  { href: "/a-propos", label: "À propos" },
];

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);
  useEffect(() => {
    const sync = () => setLight(document.documentElement.classList.contains("light"));
    sync();
    window.addEventListener("rp-theme", sync);
    return () => window.removeEventListener("rp-theme", sync);
  }, []);
  const toggle = () => {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    try { localStorage.setItem("rp-theme", next ? "light" : "dark"); } catch { /* privé */ }
    window.dispatchEvent(new Event("rp-theme"));
  };
  return (
    <button
      onClick={toggle}
      aria-label={light ? "Activer le mode sombre" : "Activer le mode clair"}
      title={light ? "Mode sombre" : "Mode clair"}
      className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gold-400 transition hover:border-gold-500/50 hover:text-gold-300 ${className}`}
    >
      {light ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}

function LogoutBtn() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      className="rounded-xl border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 transition hover:border-rose-400/50 hover:text-rose-300"
    >
      Déconnexion
    </button>
  );
}

export function Navbar({ user }: { user: PublicUser | null }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-white/5 bg-night-950/85 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <img src="/logo.png" alt="RÉUSSIR POLYTECH" className="h-10 w-auto transition-transform duration-500 group-hover:scale-105 md:h-11" />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative rounded-lg px-3 py-2 text-[13px] font-medium tracking-wide transition ${
                pathname === l.href ? "text-gold-300" : "text-white/65 hover:text-white"
              }`}
            >
              {l.label}
              {pathname === l.href && (
                <motion.span layoutId="nav-dot" className="absolute inset-x-3 -bottom-0.5 h-px bg-gold-grad" />
              )}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="rounded-xl border border-gold-500/40 px-4 py-2 text-xs font-bold text-gold-300 transition hover:bg-gold-500/10">
                  ADMIN
                </Link>
              )}
              <Link href="/dashboard" className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 transition hover:border-gold-500/40">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-grad font-mono text-[10px] font-bold text-night-950">
                  {user.name.slice(0, 1).toUpperCase()}
                </span>
                {user.name.split(" ")[0]} · {user.level}
              </Link>
              <LogoutBtn />
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-xl px-4 py-2 text-[13px] font-semibold text-white/75 transition hover:text-white">
                Connexion étudiant
              </Link>
              <Btn href="/register" className="!px-5 !py-2.5 text-xs">Commencer maintenant</Btn>
            </>
          )}
        </div>

        <button
          aria-label="Menu"
          onClick={() => setOpen((o) => !o)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-xl border border-white/10 lg:hidden"
        >
          <span className={`h-px w-5 bg-white transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-5 bg-white transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-white/5 bg-night-900/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-6 py-4">
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${pathname === l.href ? "bg-gold-500/10 text-gold-300" : "text-white/75"}`}>
                  {l.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-3">
                <ThemeToggle className="!w-12 shrink-0" />
                {user ? (
                  <>
                    <Btn href="/dashboard" variant="outline" className="flex-1 !py-2.5 text-xs">Mon espace</Btn>
                    {user.role === "admin" && <Btn href="/admin" variant="ghost" className="!py-2.5 text-xs">Admin</Btn>}
                    <LogoutBtn />
                  </>
                ) : (
                  <>
                    <Btn href="/login" variant="ghost" className="flex-1 !py-2.5 text-xs">Connexion étudiant</Btn>
                    <Btn href="/register" className="flex-1 !py-2.5 text-xs">Inscription</Btn>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-night-900/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <img src="/logo.png" alt="RÉUSSIR POLYTECH" className="h-14 w-auto" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            {SITE.slogan} Une académie numérique conçue par un collectif d'étudiants ingénieurs de l'{SITE.org}, pour accompagner chaque promotion vers l'excellence.
          </p>
          <a href={waLink("Bonjour RÉUSSIR POLYTECH, je souhaite rejoindre la plateforme.")} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20">
            <WhatsAppIcon className="h-4 w-4" /> {SITE.name} sur WhatsApp
          </a>
        </div>
        <div>
          <p className="kicker">Navigation</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-gold-300">{l.label}</Link>
              </li>
            ))}
            <li><Link href="/admin" className="transition hover:text-gold-300">Administration</Link></li>
            <li><Link href="/confidentialite" className="transition hover:text-gold-300">Politique de confidentialité</Link></li>
          </ul>
        </div>
        <div>
          <p className="kicker">Contact</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>WhatsApp : <span className="text-gold-300">{SITE.city.includes("Cameroun") ? "+237 6 72 35 64 41" : ""}</span></li>
            <li>{SITE.email}</li>
            <li>{SITE.city}</li>
            <li className="pt-2 font-mono text-[11px] text-white/35">v2.0 — architecture évolutive</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center font-mono text-[11px] tracking-widest2 text-white/35">
        © 2026 RÉUSSIR POLYTECH — PAR DES INGÉNIEURS, POUR LES FUTURS INGÉNIEURS
      </div>
    </footer>
  );
}
