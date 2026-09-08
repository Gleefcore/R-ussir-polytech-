import { NextResponse } from "next/server";
import { CATALOG } from "@/config";
import { requireAdmin } from "@/lib/auth";
import { getDB, save } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  try {
    const b = await req.json();
    const db = getDB();
    const r = db.resources.find((x) => x.id === params.id);
    if (!r) return NextResponse.json({ error: "Ressource introuvable." }, { status: 404 });

    if (typeof b.title === "string" && b.title.trim()) r.title = b.title.trim();
    if (CATALOG.some((s) => s.id === b.subject)) r.subject = String(b.subject);
    if (["MSP1", "MSP2"].includes(b.level)) r.level = b.level;
    if (["cours", "td", "exercices", "tp", "examens"].includes(b.type)) r.type = b.type;
    if (typeof b.premium === "boolean") r.premium = b.premium;
    if (typeof b.description === "string") r.description = b.description;
    if (typeof b.preview === "string") r.preview = b.preview;
    if (Array.isArray(b.tags)) r.tags = b.tags.map(String);
    save();
    return NextResponse.json({ resource: r });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  const db = getDB();
  const idx = db.resources.findIndex((x) => x.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Ressource introuvable." }, { status: 404 });
  db.resources.splice(idx, 1);
  save();
  return NextResponse.json({ ok: true });
}
