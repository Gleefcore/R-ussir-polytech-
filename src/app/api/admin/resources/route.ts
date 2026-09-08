import { NextResponse } from "next/server";
import { CATALOG } from "@/config";
import { requireAdmin } from "@/lib/auth";
import { getDB, save, uid } from "@/lib/db";
import type { Resource } from "@/lib/types";

export async function POST(req: Request) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  try {
    const b = await req.json();
    const title = String(b.title ?? "").trim();
    const description = String(b.description ?? "").trim();
    const preview = String(b.preview ?? "").trim();
    if (title.length < 4 || !description || !preview) {
      return NextResponse.json({ error: "Titre, description et aperçu sont obligatoires." }, { status: 400 });
    }
    const resource: Resource = {
      id: uid("res"),
      title,
      subject: CATALOG.some((s) => s.id === b.subject) ? String(b.subject) : CATALOG[0].id,
      level: b.level === "MSP2" ? "MSP2" : "MSP1",
      type: ["cours", "td", "exercices", "tp", "examens"].includes(b.type) ? b.type : "cours",
      premium: !!b.premium,
      description,
      preview,
      tags: Array.isArray(b.tags) ? b.tags.map(String) : [],
      createdAt: Date.now(),
    };
    const db = getDB();
    db.resources.push(resource);
    save();
    return NextResponse.json({ resource });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
