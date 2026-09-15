import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Réussir Polytech — L\'excellence est notre seul standard',
  description:
    'Plateforme SaaS d\'excellence pour élèves ingénieurs de l\'École Polytechnique. Ressources académiques, corrections, formations VIP et communauté d\'élite.',
  keywords: ['polytechnique', 'ingénieur', 'réussir', 'académique', 'Cameroun', 'MSP1', 'MSP2'],
  authors: [{ name: 'Réussir Polytech' }],
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Typographie d'élite internationale : Outfit pour les titres, Plus Jakarta Sans pour les corps de texte */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#F8FAFC] text-[#0F172A] dark:bg-[#050B14] dark:text-[#F1F5F9] selection:bg-[#D4AF37]/20 selection:text-[#D4AF37] transition-colors duration-300">
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
