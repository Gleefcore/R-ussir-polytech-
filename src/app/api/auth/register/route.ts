import { NextResponse } from "next/server";
import { hashPassword, startSession, toPublic } from "@/lib/auth";
import { getDB, save, uid } from "@/lib/db";
import type { Level } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    const name = String(b.name ?? "").trim();
    const email = String(b.email ?? "").trim().toLowerCase();
    const phone = String(b.phone ?? "").replace(/\s+/g, "");
    const password = String(b.password ?? "");
    const level: Level = b.level === "MSP2" ? "MSP2" : "MSP1";

    if (name.length < 3) return NextResponse.json({ error: "Nom complet invalide." }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    if (!/^\+?\d{8,15}$/.test(phone)) return NextResponse.json({ error: "Numéro de téléphone invalide (8 chiffres minimum)." }, { status: 400 });
    if (password.length < 6) return NextResponse.json({ error: "Mot de passe : 6 caractères minimum." }, { status: 400 });

    const db = getDB();
    if (db.users.some((u) => u.email === email)) return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
    if (db.users.some((u) => u.phone === phone)) return NextResponse.json({ error: "Un compte existe déjà avec ce numéro." }, { status: 409 });

    const { salt, hash } = hashPassword(password);
    const user = {
      id: uid("u"),
      name, email, phone,
      passHash: hash, passSalt: salt,
      level, role: "student" as const,
      createdAt: Date.now(),
      unlocked: [] as string[],
      study: [] as never[],
    };
    db.users.push(user as never);
    save();
    startSession(user.id);
    return NextResponse.json({ ok: true, user: toPublic(user as never) });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
