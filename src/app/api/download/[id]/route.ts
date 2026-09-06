import { NextResponse } from "next/server";
import { subjectLabel, typeLabel } from "@/config";
import { getSessionUser } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { buildPdf } from "@/lib/pdf";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Connexion requise pour télécharger." }, { status: 401 });
  const db = getDB();
  const resource = db.resources.find((r) => r.id === params.id);
  if (!resource) return NextResponse.json({ error: "Ressource introuvable." }, { status: 404 });

  const allowed = !resource.premium || user.unlocked.includes(resource.id) || user.role === "admin";
  if (!allowed) {
    return NextResponse.json({ error: "Ressource premium : contactez l'équipe sur WhatsApp pour l'obtenir." }, { status: 403 });
  }

  const pdf = buildPdf(
    resource.title,
    [
      `Matière : ${subjectLabel(resource.subject)}   Niveau : ${resource.level}   Type : ${typeLabel(resource.type)}`,
      `Statut : ${resource.premium ? "Premium — accès validé par l'équipe" : "Gratuit"}`,
      `Définition : ${resource.tags.map((t) => "#" + t).join("  ")}`,
    ],
    [
      ...resource.description.split(/\s+/).reduce((acc: string[], w) => {
        const last = acc[acc.length - 1] ?? "";
        if ((last + " " + w).trim().length > 95) acc.push(w);
        else acc[acc.length - 1] = (last + " " + w).trim();
        return acc;
      }, []),
      "",
      "--- EXTRAIT DU DOCUMENT ---",
      ...resource.preview.split("\n"),
      "",
      "--- FIN DE L'EXTRAIT ---",
      "Ce document est délivré à titre personnel via votre espace étudiant.",
    ]
  );

  const slug = resource.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="reussir-polytech-${slug}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
