import { redirect } from "next/navigation";
import AdminPanel, { AdminRequest } from "@/components/admin";
import { GridBG } from "@/components/fx-deco";
import { requireAdmin } from "@/lib/auth";
import { getDB } from "@/lib/db";
import { toPublic } from "@/lib/auth";

export const metadata = { title: "Administration" };

export default function AdminPage() {
  const admin = requireAdmin();
  if (!admin) redirect("/login?next=/admin");
  const db = getDB();

  const requests: AdminRequest[] = db.requests
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((r) => ({
      ...r,
      userName: db.users.find((u) => u.id === r.userId)?.name ?? "Utilisateur supprimé",
      resourceTitle: db.resources.find((x) => x.id === r.resourceId)?.title ?? "Ressource supprimée",
    }));

  return (
    <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-8">
      <GridBG />
      <div className="relative">
        <p className="kicker">Espace administration sécurisé</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
          Console de <span className="gold-text">pilotage</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/60">
          Publiez cours, TD, exercices et examens ; gérez les utilisateurs, les ressources premium et la
          validation manuelle des paiements Orange Money.
        </p>
      </div>
      <div className="relative mt-10">
        <AdminPanel resources={db.resources} users={db.users.map(toPublic)} requests={requests} />
      </div>
    </main>
  );
}
