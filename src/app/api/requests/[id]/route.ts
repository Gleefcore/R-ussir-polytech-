import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getDB, save } from "@/lib/db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis." }, { status: 403 });
  try {
    const b = await req.json();
    const status = b.status === "approved" ? "approved" : b.status === "rejected" ? "rejected" : null;
    if (!status) return NextResponse.json({ error: "Statut invalide." }, { status: 400 });

    const db = getDB();
    const request = db.requests.find((r) => r.id === params.id);
    if (!request) return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });

    request.status = status;
    request.updatedAt = Date.now();

    if (status === "approved") {
      const user = db.users.find((u) => u.id === request.userId);
      if (user && !user.unlocked.includes(request.resourceId)) user.unlocked.push(request.resourceId);
    }
    save();
    return NextResponse.json({ request });
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}
