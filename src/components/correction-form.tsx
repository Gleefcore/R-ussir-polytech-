"use client";

import { useState } from "react";
import { waLink } from "@/config";
import type { PublicUser, Resource } from "@/lib/types";
import { WhatsAppIcon } from "./ui";

/** Formulaire « Demander l'accès à la correction » → envoi sur WhatsApp (672356441). */
export default function CorrectionForm({ resource, user }: { resource: Resource; user: PublicUser | null }) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    message: `Bonjour, je souhaite obtenir l'accès à la correction : ${resource.title} (${resource.level}).`,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: resource.id }),
      }).catch(() => undefined);
    }
    const msg =
      `Bonjour RÉUSSIR POLYTECH 👋\nDemande d'accès à une correction protégée :\n« ${resource.title} » — ${resource.level}\n\n` +
      `Nom : ${form.name}\nEmail : ${form.email}\nTéléphone : ${form.phone}\nMessage : ${form.message}`;
    window.open(waLink(msg), "_blank", "noopener");
    setSent(true);
  };

  if (!open)
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-3.5 py-2 text-xs font-bold text-gold-300 transition hover:bg-gold-500/20"
      >
        🔒 Demander l'accès à la correction
      </button>
    );

  return (
    <form onSubmit={submit} className="w-full rounded-xl border border-gold-500/25 bg-night-800/60 p-4">
      <p className="text-xs font-semibold uppercase tracking-widest2 text-gold-400">Demander l'accès à la correction</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <input required className="input !py-2.5 text-xs" placeholder="Nom *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" className="input !py-2.5 text-xs" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input required className="input !py-2.5 text-xs" placeholder="Téléphone *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input required className="input !py-2.5 text-xs sm:col-span-1" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="submit" className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-500">
          <WhatsAppIcon className="h-4 w-4" /> Envoyer sur WhatsApp
        </button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-white/50 hover:text-white/80">Annuler</button>
      </div>
      {sent && (
        <p className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          ✓ WhatsApp ouvert avec votre demande. {user ? "Demande enregistrée : suivez-la dans votre tableau de bord." : "Créez un compte pour suivre votre demande."} L'équipe confirme après paiement Orange Money.
        </p>
      )}
    </form>
  );
}
