"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { STUDY_TIPS } from "@/content";
import { SUBJECTS, subjectLabel } from "@/config";
import type { PublicUser, StudyItem, Subject } from "@/lib/types";
import { Badge, Btn, SubjectIcon } from "./ui";

export default function StudyClient({ user, initialItems }: { user: PublicUser; initialItems: StudyItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState<StudyItem[]>(initialItems);
  const [topic, setTopic] = useState("");
  const [subject, setSubject] = useState<Subject>("math");
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);

  const call = async (body: Record<string, unknown>) => {
    setBusy(true);
    const res = await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) setItems(data.items);
  };

  const progress = useMemo(() => {
    return SUBJECTS.map((s) => {
      const list = items.filter((i) => i.subject === s.id);
      const done = list.filter((i) => i.done).length;
      return { subject: s.id, label: s.label, total: list.length, done, pct: list.length ? Math.round((done / list.length) * 100) : 0 };
    });
  }, [items]);

  const globalPct = items.length ? Math.round((items.filter((i) => i.done).length / items.length) * 100) : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_1fr_300px]">
      {/* Progression */}
      <div className="space-y-6">
        <div className="glass p-7">
          <p className="kicker">Suivi de progression</p>
          <div className="mt-5 flex items-end justify-between">
            <span className="font-display text-4xl font-bold gold-text">{globalPct}%</span>
            <span className="font-mono text-[11px] text-white/40">{items.filter((i) => i.done).length}/{items.length} tâches</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-night-700">
            <div className="h-full rounded-full bg-gold-grad transition-all duration-700" style={{ width: `${globalPct}%` }} />
          </div>
          <div className="mt-7 space-y-5">
            {progress.map((p) => (
              <div key={p.subject}>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-semibold text-white/70">
                    <SubjectIcon subject={p.subject} className="h-4 w-4 text-gold-400" /> {p.label}
                  </span>
                  <span className="font-mono text-white/45">{p.pct}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-night-700">
                  <div className="h-full rounded-full bg-gradient-to-r from-sky-400 to-gold-400 transition-all duration-700" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass p-7">
          <p className="kicker">Méthodes de révision</p>
          <ul className="mt-4 space-y-4">
            {STUDY_TIPS.map((t, i) => (
              <li key={t.title}>
                <p className="text-sm font-semibold text-gold-300">{i + 1}. {t.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/55">{t.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Planificateur */}
      <div className="glass p-7">
        <div className="flex items-center justify-between">
          <p className="kicker">Organisation des révisions — {user.level}</p>
          <Badge tone="gold">{user.level}</Badge>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); if (topic.trim()) { call({ action: "add", subject, topic: topic.trim() }); setTopic(""); } }}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <select value={subject} onChange={(e) => setSubject(e.target.value as Subject)} className="input !w-auto sm:w-40">
            {SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} className="input flex-1" placeholder="Ajouter un objectif de révision… (ex. : refaire le TD 3 d'analyse)" />
          <Btn type="submit" disabled={busy} className="!px-5">+ Ajouter</Btn>
        </form>

        <ul className="mt-6 space-y-3">
          {items.length === 0 && (
            <li className="rounded-xl border border-dashed border-white/15 p-8 text-center text-sm text-white/45">
              Aucune tâche pour l'instant. Ajoutez votre premier objectif de révision ci-dessus. 👆
            </li>
          )}
          {items.map((it) => (
            <li key={it.id} className="group flex items-center gap-4 rounded-xl border border-white/10 bg-night-800/50 p-4 transition hover:border-gold-500/30">
              <button
                onClick={() => call({ action: "toggle", id: it.id })}
                aria-label="Basculer la tâche"
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                  it.done ? "border-gold-500 bg-gold-grad text-night-950" : "border-white/25 hover:border-gold-400"
                }`}
              >
                {it.done && "✓"}
              </button>
              <div className="min-w-0 flex-1">
                <p className={`text-sm font-medium ${it.done ? "text-white/40 line-through" : "text-white/85"}`}>{it.topic}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest2 text-white/35">{subjectLabel(it.subject)}</p>
              </div>
              <button onClick={() => call({ action: "remove", id: it.id })} className="text-white/30 transition hover:text-rose-400" aria-label="Supprimer">✕</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Recherche & accès */}
      <div className="space-y-6">
        <div className="glass p-7">
          <p className="kicker">Recherche rapide</p>
          <form
            onSubmit={(e) => { e.preventDefault(); router.push(`/library?q=${encodeURIComponent(q)}`); }}
            className="mt-4 space-y-3"
          >
            <input value={q} onChange={(e) => setQ(e.target.value)} className="input" placeholder="Mot-clé : résidus, SQL, pendule…" />
            <Btn type="submit" variant="outline" className="w-full">Rechercher dans la bibliothèque</Btn>
          </form>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Btn href={`/library`} variant="ghost" className="!px-3 !py-2.5 text-xs">Tout voir</Btn>
            <Btn href="/msp1" variant="ghost" className="!px-3 !py-2.5 text-xs">MSP1</Btn>
            <Btn href="/msp2" variant="ghost" className="!px-3 !py-2.5 text-xs">MSP2</Btn>
            <Btn href="/dashboard" variant="ghost" className="!px-3 !py-2.5 text-xs">Mes docs</Btn>
          </div>
        </div>
        <div className="glass border-gold-500/20 p-7">
          <p className="kicker">Classement par matière</p>
          <ul className="mt-4 space-y-2">
            {SUBJECTS.map((s) => (
              <li key={s.id}>
                <a href={`/library?subject=${s.id}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-night-800/50 px-4 py-3 text-sm text-white/75 transition hover:border-gold-500/40 hover:text-white">
                  <span className="flex items-center gap-2"><SubjectIcon subject={s.id} className="h-4 w-4 text-gold-400" /> {s.label}</span>
                  <span aria-hidden>→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
