import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PwaProvider } from '@/components/pwa/PwaProvider';

export const viewport: Viewport = {
  themeColor: '#0A1628',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Réussir Polytech — L\'excellence est notre seul standard',
  description:
    'Plateforme SaaS d\'excellence pour élèves ingénieurs de l\'École Polytechnique. Ressources académiques, corrections, formations VIP et communauté d\'élite.',
  keywords: ['polytechnique', 'ingénieur', 'réussir', 'académique', 'Cameroun', 'MSP1', 'MSP2'],
  authors: [{ name: 'Réussir Polytech' }],
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Réussir Polytech',
  },
  openGraph: {
    title: 'Réussir Polytech',
    description: 'L\'excellence est notre seul standard',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Manifest PWA standard sans crossOrigin restrictif pour compatibilité Chrome Android totale */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Réussir Polytech" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Typographie d'élite internationale : Outfit pour les titres, Plus Jakarta Sans pour les corps de texte */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Script d'interception immédiate de l'installation PWA avant l'hydratation React */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                window.__rp_deferred_prompt = null;
                window.addEventListener('beforeinstallprompt', function(e) {
                  e.preventDefault();
                  window.__rp_deferred_prompt = e;
                  window.dispatchEvent(new CustomEvent('rp-pwa-prompt-available'));
                });
                window.addEventListener('appinstalled', function() {
                  window.__rp_deferred_prompt = null;
                  window.dispatchEvent(new CustomEvent('rp-pwa-installed'));
                });
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-[#F8FAFC] text-[#0F172A] dark:bg-[#050B14] dark:text-[#F1F5F9] selection:bg-[#D4AF37]/20 selection:text-[#D4AF37] transition-colors duration-300">
        <ThemeProvider>
          <PwaProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </PwaProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
