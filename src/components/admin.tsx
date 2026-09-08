"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATALOG, RES_TYPES, subjectCat, subjectLabel, typeLabel } from "@/config";
import type { Level, PublicUser, PurchaseRequest, ResType, Resource } from "@/lib/types";
import { Badge, Btn, StatusChip, SubjectIcon } from "./ui";

export type AdminRequest = PurchaseRequest & { userName: string; resourceTitle: string };

const EMPTY: Omit<Resource, "id" | "createdAt"> = {
  title: "", subject: "math", level: "MSP1", type: "cours", premium: false,
  description: "", preview: "", tags: [],
};

export default function AdminPanel({
  resources, users, requests,
}: { resources: Resource[]; users: PublicUser[]; requests: AdminRequest[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"overview" | "resources" | "users" | "requests">("overview");
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [msg, setMsg] = useState("");

  const refresh = () => router.refresh();
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3500); };

  const saveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(editingId ? `/api/admin/resources/${editingId}` : "/api/admin/resources", {
      method: editingId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      flash(editingId ? "✓ Ressource modifiée." : "✓ Ressource publiée.");
      setForm(EMPTY); setEditingId(null); setShowForm(false); refresh();
    } else flash("✕ " + ((await res.json()).error ?? "Erreur."));
  };

  const deleteResource = async (id: string) => {
    if (!confirm("Supprimer définitivement cette ressource ?")) return;
    const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    if (res.ok) { flash("✓ Ressource supprimée."); refresh(); }
  };

  const patchUser = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (res.ok) { flash("✓ Utilisateur mis à jour."); refresh(); }
  };

  const patchRequest = async (id: string, status: "approved" | "rejected") => {
    const res = await fetch(`/api/requests/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) { flash(status === "approved" ? "✓ Demande validée — document débloqué pour l'étudiant." : "Demande refusée."); refresh(); }
  };

  const pending = requests.filter((r) => r.status === "pending");

  const TABS = [
    { id: "overview", label: "Aperçu" },
    { id: "resources", label: `Ressources (${resources.length})` },
    { id: "users", label: `Utilisateurs (${users.length})` },
    { id: "requests", label: `Demandes (${pending.length} en attente)` },
  ] as const;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`rounded-xl px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-widest2 transition ${
              tab === t.id ? "bg-gold-grad text-night-950" : "border border-white/10 text-white/55 hover:border-gold-500/40 hover:text-gold-300"
            }`}>
            {t.label}
          </button>
        ))}
      </div>
      {msg && <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{msg}</p>}

      {/* APERÇU */}
      {tab === "overview" && (
        <div className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            { l: "Utilisateurs inscrits", v: users.length, s: "étudiants & admins" },
            { l: "Ressources publiées", v: resources.length, s: `${resources.filter((r) => r.premium).length} premium` },
            { l: "Demandes en attente", v: pending.length, s: "à traiter sur WhatsApp" },
            { l: "Demandes validées", v: requests.filter((r) => r.status === "approved").length, s: "documents délivrés" },
          ].map((c) => (
            <div key={c.l} className="glass p-6">
              <p className="font-display text-4xl font-bold gold-text">{c.v}</p>
              <p className="mt-2 text-sm font-semibold text-white/80">{c.l}</p>
              <p className="font-mono text-[10px] uppercase tracking-widest2 text-white/40">{c.s}</p>
            </div>
          ))}
          <div className="glass mt-2 p-6 md:col-span-4">
            <p className="kicker">Dernières demandes</p>
            <ul className="mt-4 space-y-2">
              {requests.slice(0, 5).map((r) => (
                <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-night-800/50 px-4 py-3 text-sm">
                  <span className="text-white/80">{r.userName} → <span className="text-gold-300">{r.resourceTitle}</span></span>
                  <StatusChip status={r.status} />
                </li>
              ))}
              {requests.length === 0 && <li className="text-sm text-white/45">Aucune demande.</li>}
            </ul>
          </div>
        </div>
      )}

      {/* RESSOURCES */}
      {tab === "resources" && (
        <div className="mt-8">
          <div className="flex justify-end">
            <Btn onClick={() => { setShowForm((s) => !s); setEditingId(null); setForm(EMPTY); }} variant={showForm ? "ghost" : "gold"}>
              {showForm ? "Fermer le formulaire" : "+ Nouvelle ressource"}
            </Btn>
          </div>

          {showForm && (
            <form onSubmit={saveResource} className="glass mt-5 space-y-5 p-7">
              <div>
                <label className="label">Titre</label>
                <input className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Ex. : TD Analyse II — corrigé détaillé" />
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="label">Matière officielle</label>
                  <select className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                    <optgroup label="MSP1 — Semestre 1">
                      {CATALOG.filter((s) => s.level === "MSP1" && (s.semester === "S1" || s.semester === "both")).map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="MSP1 — Semestre 2">
                      {CATALOG.filter((s) => s.level === "MSP1" && (s.semester === "S2" || s.semester === "both")).map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </optgroup>
                    <optgroup label="MSP2 — Spécialités">
                      {CATALOG.filter((s) => s.level === "MSP2").map((s) => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div>
                  <label className="label">Niveau</label>
                  <select className="input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value as Level })}>
                    <option value="MSP1">MSP1</option><option value="MSP2">MSP2</option>
                  </select>
                </div>
                <div>
                  <label className="label">Type</label>
                  <select className="input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as ResType })}>
                    {RES_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-night-800/60 px-4 py-3 text-sm font-semibold text-white/75">
                    <input type="checkbox" checked={form.premium} onChange={(e) => setForm({ ...form, premium: e.target.checked })} className="accent-gold-500" />
                    ★ Premium
                  </label>
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input min-h-[80px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div>
                <label className="label">Aperçu (extrait affiché publiquement)</label>
                <textarea className="input min-h-[80px] font-mono text-xs" value={form.preview} onChange={(e) => setForm({ ...form, preview: e.target.value })} required />
              </div>
              <div>
                <label className="label">Tags (séparés par des virgules)</label>
                <input className="input" value={form.tags.join(", ")} onChange={(e) => setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })} />
              </div>
              <Btn type="submit">{editingId ? "Enregistrer les modifications" : "Publier la ressource"}</Btn>
            </form>
          )}

          <div className="mt-6 space-y-3">
            {resources.map((r) => (
              <div key={r.id} className="glass flex flex-wrap items-center gap-4 p-5">
                <SubjectIcon subject={subjectCat(r.subject)} className="h-5 w-5 shrink-0 text-gold-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white/85">{r.title}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest2 text-white/40">
                    {subjectLabel(r.subject)} · {r.level} · {typeLabel(r.type)}
                  </p>
                </div>
                <Badge tone={r.premium ? "gold" : "green"}>{r.premium ? "★ Premium" : "Gratuit"}</Badge>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(r.id); setForm({ title: r.title, subject: r.subject, level: r.level, type: r.type, premium: r.premium, description: r.description, preview: r.preview, tags: r.tags }); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-gold-500/50 hover:text-gold-300">Modifier</button>
                  <button onClick={() => deleteResource(r.id)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-rose-500/50 hover:text-rose-300">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UTILISATEURS */}
      {tab === "users" && (
        <div className="mt-8 space-y-3">
          {users.map((u) => (
            <div key={u.id} className="glass flex flex-wrap items-center gap-4 p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-grad font-display font-bold text-night-950">{u.name.slice(0, 1).toUpperCase()}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white/85">{u.name}</p>
                <p className="mt-0.5 font-mono text-[11px] text-white/40">{u.email} · {u.phone}</p>
              </div>
              <Badge tone={u.role === "admin" ? "gold" : "blue"}>{u.role === "admin" ? "Admin" : "Étudiant"}</Badge>
              <select value={u.level} onChange={(e) => patchUser(u.id, { level: e.target.value })}
                className="rounded-lg border border-white/15 bg-night-800 px-3 py-1.5 font-mono text-xs text-white/75 outline-none">
                <option value="MSP1">MSP1</option><option value="MSP2">MSP2</option>
              </select>
              {u.role !== "admin" && (
                <button onClick={() => patchUser(u.id, { role: "admin" })} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-white/60 transition hover:border-gold-500/50 hover:text-gold-300">→ admin</button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* DEMANDES */}
      {tab === "requests" && (
        <div className="mt-8 space-y-3">
          {requests.length === 0 && <p className="glass p-8 text-center text-sm text-white/50">Aucune demande pour le moment.</p>}
          {requests.map((r) => (
            <div key={r.id} className="glass flex flex-wrap items-center gap-4 p-5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white/85">{r.userName}</p>
                <p className="mt-0.5 truncate text-xs text-gold-300">{r.resourceTitle}</p>
                <p className="mt-1 font-mono text-[10px] text-white/35">Réf. {r.id} · {new Date(r.createdAt).toLocaleString("fr-FR")}</p>
              </div>
              <StatusChip status={r.status} />
              {r.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => patchRequest(r.id, "approved")} className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20">✓ Paiement confirmé</button>
                  <button onClick={() => patchRequest(r.id, "rejected")} className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20">Refuser</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
