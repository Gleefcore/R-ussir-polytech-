import type { Metadata } from "next";
import { Sora, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Footer, Navbar, Providers } from "@/components/layout";
import { getSessionUser, toPublic } from "@/lib/auth";
import { SITE } from "@/config";

const display = Sora({ subsets: ["latin"], variable: "--font-display", weight: ["400", "600", "700", "800"] });
const body = Inter({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600"] });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", weight: ["400", "600"] });

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.slogan}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    "RÉUSSIR POLYTECH est l'académie numérique des étudiants ingénieurs de l'ENSPY : cours complets, TD corrigés, annales, préparation aux examens, entrepreneuriat et suivi de progression.",
  keywords: ["ENSPY", "MSP1", "MSP2", "ingénieur", "cours", "TD corrigés", "annales", "RÉUSSIR POLYTECH"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const user = getSessionUser();
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <Navbar user={user ? toPublic(user) : null} />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
