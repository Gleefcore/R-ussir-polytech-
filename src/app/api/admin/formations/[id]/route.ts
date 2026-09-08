import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDB, save } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  try {
    const b = await req.json();
    const db = getDB();
    const f = db.formations.find((x) => x.id === params.id);
    if (!f) return NextResponse.json({ error: "Formation introuvable." }, { status: 404 });
    if (typeof b.title === "string" && b.title.trim()) f.title = b.title.trim();
    if (typeof b.level === "string" && b.level.trim()) f.level = b.level.trim();
    if (typeof b.description === "string") f.description = b.description;
    if (typeof b.preview === "string") f.preview = b.preview;
    save();
    return NextResponse.json({ formation: f });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  const db = getDB();
  const idx = db.formations.findIndex((x) => x.id === params.id);
  if (idx === -1) return NextResponse.json({ error: "Formation introuvable." }, { status: 404 });
  db.formations.splice(idx, 1);
  save();
  return NextResponse.json({ ok: true });
}
