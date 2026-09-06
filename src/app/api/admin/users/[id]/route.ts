import { NextResponse } from "next/server";
import { requireAdmin, toPublic } from "@/lib/auth";
import { getDB, save } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  try {
    const b = await req.json();
    const db = getDB();
    const u = db.users.find((x) => x.id === params.id);
    if (!u) return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    if (["MSP1", "MSP2"].includes(b.level)) u.level = b.level;
    if (["student", "admin"].includes(b.role)) u.role = b.role;
    save();
    return NextResponse.json({ user: toPublic(u) });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
