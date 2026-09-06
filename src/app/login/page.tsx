"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { CircuitBand, GridBG, Orb } from "@/components/fx-deco";
import { Btn } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Connexion impossible.");
    router.push(params.get("next") ?? "/dashboard");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="label" htmlFor="id">Email ou numéro de téléphone</label>
        <input id="id" className="input" placeholder="vous@exemple.cm ou 6XX XX XX XX" value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
      </div>
      <div>
        <label className="label" htmlFor="pw">Mot de passe</label>
        <input id="pw" type="password" className="input" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
      <Btn type="submit" className="w-full" disabled={loading}>{loading ? "Connexion en cours…" : "Se connecter"}</Btn>
      <p className="text-center text-sm text-white/50">
        Pas encore de compte ? <Link href="/register" className="font-semibold text-gold-400 hover:text-gold-300">Créer un compte étudiant</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      <GridBG />
      <Orb className="left-[-8%] top-[16%] h-96 w-96 bg-night-600/40" />
      <Orb className="right-[-6%] bottom-[10%] h-80 w-80 bg-gold-600/15" />
      <CircuitBand className="absolute inset-x-0 top-16 h-20 w-full opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}
        className="relative w-full max-w-md"
      >
        <div className="glass-strong p-9 shadow-card">
          <img src="/logo.png" alt="RÉUSSIR POLYTECH" className="logo-glow mx-auto h-16 w-auto" />
          <h1 className="mt-6 text-center font-display text-2xl font-bold">Connexion à votre espace</h1>
          <p className="mt-2 text-center text-sm text-white/50">Accédez à vos ressources, vos demandes et votre progression.</p>
          <div className="mt-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
        <div className="glass mt-5 p-5">
          <p className="kicker">Comptes de démonstration</p>
          <div className="mt-3 space-y-1.5 font-mono text-xs text-white/60">
            <p>Étudiant : <span className="text-gold-300">etudiant@demo.rp</span> / <span className="text-gold-300">Demo@1234</span></p>
            <p>Admin : <span className="text-gold-300">admin@reussirpolytech.com</span> / <span className="text-gold-300">Admin@2026</span></p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
