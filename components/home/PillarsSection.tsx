'use client';

import { BookOpen, FileCheck, Users, ShieldCheck } from 'lucide-react';

const pillars = [
  {
    icon: BookOpen,
    title: 'Polycopiés & Cours Certifiés',
    desc: 'Supports de cours magistraux officiels dispensés par le corps professoral émérite des écoles polytechniques du Cameroun (notamment Pr Takou, Pr Bouetou, Pr Mama, Dr Yatat et leurs pairs). Tout le contenu théorique pour maîtriser vos démonstrations.',
  },
  {
    icon: FileCheck,
    title: 'Annales & Épreuves Corrigées',
    desc: 'Banque d\'archives des contrôles continus, examens de synthèse et devoirs surveillés des 10 dernières années. Entraînez-vous dans les conditions exactes de l\'épreuve.',
  },
  {
    icon: Users,
    title: 'Mentorat Fraternel & Entraide',
    desc: 'Un réseau de 14 dirigeants, aînés de promotion et majors pour orienter chaque promotion. Aucun élève-ingénieur ne progresse en restant isolé face aux difficultés.',
  },
];

export function PillarsSection() {
  return (
    <section className="py-16 bg-white dark:bg-[#070E1B] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 block mb-2">
            NOTRE ENGAGEMENT UNIVERSITAIRE
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
            La Rigueur Académique au Service de Votre Réussite
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pil) => {
            const Icon = pil.icon;
            return (
              <div
                key={pil.title}
                className="p-6 sm:p-8 rounded-3xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 text-[#D4AF37] flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2.5 font-heading">
                    {pil.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {pil.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
