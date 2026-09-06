import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDB, save, uid } from "@/lib/db";

export async function POST(req: Request) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  try {
    const b = await req.json();
    const action = String(b.action ?? "");

    if (action === "add") {
      const topic = String(b.topic ?? "").trim();
      const subject = ["math", "physique", "info"].includes(b.subject) ? b.subject : "math";
      if (!topic) return NextResponse.json({ error: "Intitulé requis." }, { status: 400 });
      user.study.push({ id: uid("s"), subject, topic, done: false });
    } else if (action === "toggle") {
      const item = user.study.find((i) => i.id === b.id);
      if (item) item.done = !item.done;
    } else if (action === "remove") {
      user.study = user.study.filter((i) => i.id !== b.id);
    } else {
      return NextResponse.json({ error: "Action inconnue." }, { status: 400 });
    }
    save();
    return NextResponse.json({ items: user.study });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
