import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDB, save, uid } from "@/lib/db";

export async function POST(req: Request) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Connexion requise pour suivre une demande." }, { status: 401 });
  try {
    const b = await req.json();
    const resourceId = String(b.resourceId ?? "");
    const db = getDB();
    const resource = db.resources.find((r) => r.id === resourceId);
    if (!resource) return NextResponse.json({ error: "Ressource introuvable." }, { status: 404 });

    const existing = db.requests.find((r) => r.userId === user.id && r.resourceId === resourceId);
    if (existing) return NextResponse.json({ request: existing });

    const request = {
      id: uid("req"),
      userId: user.id,
      resourceId,
      status: "pending" as const,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    db.requests.push(request);
    save();
    return NextResponse.json({ request });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
