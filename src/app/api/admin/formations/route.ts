import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDB, save, uid } from "@/lib/db";
import type { Formation } from "@/lib/types";

export async function POST(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  try {
    const b = await req.json();
    const title = String(b.title ?? "").trim();
    const level = String(b.level ?? "").trim();
    const description = String(b.description ?? "").trim();
    const preview = String(b.preview ?? "").trim();
    if (!title || !level || !description || !preview) {
      return NextResponse.json({ error: "Tous les champs sont obligatoires." }, { status: 400 });
    }
    const formation: Formation = { id: uid("vip"), title, level, description, preview, createdAt: Date.now() };
    const db = getDB();
    db.formations.push(formation);
    save();
    return NextResponse.json({ formation });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
