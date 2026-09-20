import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

export function Footer() {
  const support = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || '237672356441';

  return (
    <footer className="border-t border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-poly-card mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-md p-0.5 bg-white dark:bg-slate-900 flex items-center justify-center">
                <Image src="/assets/logo-polytech.png" alt="Logo" fill className="object-contain" />
              </div>
              <div>
                <p className="text-xs text-poly-cyan font-mono tracking-widest uppercase font-bold">Réussir</p>
                <p className="font-black text-slate-900 dark:text-white">POLYTECH</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-white/50 text-sm leading-relaxed max-w-sm">
              Instance de coopération académique volontaire et plateforme SaaS d&apos;excellence pour
              élèves ingénieurs.
            </p>
            <p className="text-poly-gold text-xs font-mono mt-3 italic font-semibold">
              &ldquo;L&apos;excellence est notre seul standard&rdquo;
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href={`https://wa.me/${support}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg border border-slate-300 dark:border-white/10 hover:border-green-500/50 text-slate-500 hover:text-green-500 dark:text-white/50 dark:hover:text-green-400 transition-all bg-white dark:bg-transparent shadow-sm"
                aria-label="WhatsApp Support"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">Navigation</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Accueil' },
                { href: '/msp1', label: 'MSP1' },
                { href: '/msp2', label: 'MSP2' },
                { href: '/entrepreneur-vip', label: 'VIP Élite' },
                { href: '/a-propos', label: 'Notre équipe' },
                { href: '/admin/publier', label: 'Publier une épreuve ⚡' },
                { href: '/politique-de-confidentialite', label: 'Politique de Confidentialité' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-white/50 hover:text-poly-gold dark:hover:text-poly-gold text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Piliers */}
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Nos piliers
            </h3>
            <ul className="space-y-2">
              {['Solidarité', 'Rigueur', 'Bienveillance', 'Transparence'].map((pilier) => (
                <li key={pilier} className="flex items-center gap-2 text-slate-600 dark:text-white/50 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-poly-gold flex-shrink-0" />
                  {pilier}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/5 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-white/30 text-xs">
            © {new Date().getFullYear()} Réussir Polytech. Actes constitutifs d&apos;Éseka — 07 Mai 2026.
          </p>
          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/politique-de-confidentialite"
              className="text-slate-500 hover:text-poly-gold transition-colors font-medium"
            >
              Politique de Confidentialité
            </Link>
            <span className="text-slate-400 dark:text-white/20">•</span>
            <p className="text-slate-400 dark:text-white/20 font-mono">
              Solidarité · Rigueur · Bienveillance · Transparence
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
