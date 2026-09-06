import { NextResponse } from "next/server";
import { startSession, toPublic, verifyPassword } from "@/lib/auth";
import { getDB } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const identifier = String(b.identifier ?? "").trim().toLowerCase().replace(/\s+/g, "");
    const password = String(b.password ?? "");
    if (!identifier || !password) return NextResponse.json({ error: "Identifiants incomplets." }, { status: 400 });

    const db = getDB();
    const user = db.users.find((u) => u.email === identifier || u.phone === identifier || u.phone === identifier.replace(/^\+?237/, ""));
    if (!user || !verifyPassword(password, user)) {
      return NextResponse.json({ error: "Email / téléphone ou mot de passe incorrect." }, { status: 401 });
    }
    startSession(user.id);
    return NextResponse.json({ ok: true, user: toPublic(user) });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
