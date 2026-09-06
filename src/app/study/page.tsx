import { redirect } from "next/navigation";
import StudyClient from "@/components/study";
import { GridBG, Orb } from "@/components/fx-deco";
import { getSessionUser, toPublic } from "@/lib/auth";

export const metadata = { title: "Espace étude" };

export default function StudyPage() {
  const user = getSessionUser();
  if (!user) redirect("/login?next=/study");

  return (
    <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 md:px-8">
      <GridBG />
      <Orb className="right-[-8%] top-[10%] h-80 w-80 bg-gold-600/10" />
      <div className="relative">
        <p className="kicker">Espace étude</p>
        <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">
          Votre <span className="gold-text">centre de commandement</span> de révisions
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/60">
          Organisez vos révisions, suivez votre progression par matière et retrouvez n'importe quelle ressource en quelques secondes.
        </p>
      </div>
      <div className="relative mt-10">
        <StudyClient user={toPublic(user)} initialItems={user.study} />
      </div>
    </main>
  );
}
