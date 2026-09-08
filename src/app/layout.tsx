import type { Metadata, Viewport } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Navbar, Providers } from "@/components/layout";
import { getSessionUser, toPublic } from "@/lib/auth";
import { SITE } from "@/config";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["400", "600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "600"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://reussir-polytech.app"),
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "RÉUSSIR POLYTECH est le collectif académique des étudiants ingénieurs de l'ENSPY : fiches de TD, épreuves et corrections des programmes officiels MSP1 et MSP2, espace entrepreneur, formations VIP et suivi de progression. Réussir ensemble, construire l'excellence.",
  keywords: ["ENSPY", "École Polytechnique", "MSP1", "MSP2", "ingénieur", "fiches de TD", "épreuves", "corrections", "RÉUSSIR POLYTECH"],
  authors: [{ name: SITE.name }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.slogan}`,
    description: "Le collectif académique des étudiants ingénieurs : TD, examens, corrections, entrepreneuriat et formations d'excellence.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: SITE.name }],
  },
  twitter: {
    card: "summary",
    title: `${SITE.name} — ${SITE.slogan}`,
    description: "Réussir ensemble, construire l'excellence.",
    images: ["/logo.png"],
  },
  icons: { icon: "/logo.png", apple: "/logo.png" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#030A16" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7fb" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('rp-theme')==='light')document.documentElement.classList.add('light')}catch(e){}`,
          }}
        />
        <Navbar user={user ? toPublic(user) : null} />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
