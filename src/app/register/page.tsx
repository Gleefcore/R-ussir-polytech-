"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CircuitBand, GridBG, Orb } from "@/components/fx-deco";
import { Btn } from "@/components/ui";
import type { Level } from "@/lib/types";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [level, setLevel] = useState<Level>("MSP1");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, level }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Inscription impossible.");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-28">
      <GridBG />
      <Orb className="right-[-8%] top-[12%] h-96 w-96 bg-night-600/40" />
      <Orb className="left-[-6%] bottom-[8%] h-80 w-80 bg-gold-600/15" />
      <CircuitBand className="absolute inset-x-0 bottom-10 h-20 w-full opacity-40" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="relative w-full max-w-lg">
        <div className="glass-strong p-9 shadow-card">
          <img src="/logo.png" alt="RÉUSSIR POLYTECH" className="logo-glow mx-auto h-16 w-auto" />
          <h1 className="mt-6 text-center font-display text-2xl font-bold">Créer votre compte étudiant</h1>
          <p className="mt-2 text-center text-sm text-white/50">Rejoignez l'académie numérique des ingénieurs de l'ENSPY.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="label" htmlFor="name">Nom complet</label>
              <input id="name" className="input" placeholder="Ex. : Jeanne Kamga" value={form.name} onChange={set("name")} required />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="email">Adresse email</label>
                <input id="email" type="email" className="input" placeholder="vous@exemple.cm" value={form.email} onChange={set("email")} required />
              </div>
              <div>
                <label className="label" htmlFor="phone">Téléphone</label>
                <input id="phone" className="input" placeholder="6XX XX XX XX" value={form.phone} onChange={set("phone")} required />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="pw">Mot de passe</label>
              <input id="pw" type="password" className="input" placeholder="6 caractères minimum" value={form.password} onChange={set("password")} required minLength={6} />
            </div>
            <div>
              <span className="label">Niveau d'étude</span>
              <div className="grid grid-cols-2 gap-3">
                {(["MSP1", "MSP2"] as Level[]).map((lv) => (
                  <button
                    type="button" key={lv} onClick={() => setLevel(lv)}
                    className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                      level === lv
                        ? "border-gold-500/60 bg-gold-500/15 text-gold-300 shadow-gold-glow"
                        : "border-white/10 bg-night-800/60 text-white/60 hover:border-white/25"
                    }`}
                  >
                    {lv}
                    <span className="mt-0.5 block font-mono text-[10px] font-normal tracking-widest2 text-white/40">
                      {lv === "MSP1" ? "1ʳᵉ année" : "2ᵉ année"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}
            <Btn type="submit" className="w-full" disabled={loading}>{loading ? "Création du compte…" : "Commencer maintenant →"}</Btn>
            <p className="text-center text-sm text-white/50">
              Déjà inscrit ? <Link href="/login" className="font-semibold text-gold-400 hover:text-gold-300">Se connecter</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </main>
  );
}
