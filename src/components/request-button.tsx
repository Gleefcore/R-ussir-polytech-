"use client";

import { useState } from "react";
import { Btn, StatusChip, WhatsAppIcon } from "./ui";
import { waLink } from "@/config";
import type { PurchaseRequest, Resource } from "@/lib/types";

export default function RequestButton({
  resource,
  loggedIn,
  existing,
}: {
  resource: Resource;
  loggedIn: boolean;
  existing: PurchaseRequest | null;
}) {
  const [request, setRequest] = useState<PurchaseRequest | null>(existing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const confirm = async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resourceId: resource.id }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Impossible d'enregistrer la demande.");
    setRequest(data.request);
  };

  return (
    <div className="space-y-4">
      <Btn href={waLink(`Bonjour RÉUSSIR POLYTECH 👋\nJe souhaite obtenir la ressource :\n« ${resource.title} » (${resource.level} — ${resource.premium ? "premium" : "gratuit"}).\nMerci de m'indiquer la procédure Orange Money.`)} external className="w-full !bg-emerald-600 !bg-none hover:!bg-emerald-500 !text-white !border-emerald-400/40">
        <WhatsAppIcon /> Contacter RÉUSSIR POLYTECH sur WhatsApp
      </Btn>

      {request ? (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-center">
          <p className="text-sm font-semibold text-emerald-300">✓ Demande enregistrée — réf. {request.id}</p>
          <p className="mt-1 text-xs text-white/60">Suivez son avancement dans votre tableau de bord.</p>
          <div className="mt-3 flex justify-center"><StatusChip status={request.status} /></div>
          <Btn href="/dashboard" variant="ghost" className="mt-3 !px-4 !py-2 text-xs">Voir mon suivi</Btn>
        </div>
      ) : loggedIn ? (
        <Btn onClick={confirm} variant="outline" className="w-full" disabled={loading}>
          {loading ? "Enregistrement…" : "J'ai contacté l'équipe — confirmer ma demande"}
        </Btn>
      ) : (
        <Btn href="/login" variant="outline" className="w-full">Se connecter pour suivre ma demande</Btn>
      )}
      {error && <p className="text-center text-xs text-rose-300">{error}</p>}
    </div>
  );
}
