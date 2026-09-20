import { team } from '@/data/team';
import { TeamCard } from '@/components/about/TeamCard';
import { Users, Quote } from 'lucide-react';

export default function AProposPage() {

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-poly-gold/15 border border-poly-gold/30 rounded-full px-4 py-1.5 mb-6 shadow-sm">
            <Users className="w-4 h-4 text-poly-gold" />
            <span className="text-poly-gold text-xs font-bold tracking-wider uppercase">
              Organigramme officiel
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
            L&apos;équipe{' '}
            <span className="text-gold-gradient">Réussir Polytech</span>
          </h1>
          <p className="text-slate-600 dark:text-white/50 max-w-2xl mx-auto">
            {team.length} architectes de l&apos;excellence. Unis par les actes constitutifs d&apos;Éseka du{' '}
            <span className="text-poly-gold font-bold">07 Mai 2026</span>.
          </p>
        </div>

        {/* Quote */}
        <div className="glass-card p-6 border border-poly-gold/30 dark:border-poly-gold/20 mb-12 text-center relative shadow-md dark:shadow-none">
          <Quote className="w-8 h-8 text-poly-gold/30 dark:text-poly-gold/20 absolute top-4 left-4" />
          <p className="text-slate-800 dark:text-white/70 text-base italic leading-relaxed">
            &ldquo;La vélocité s&apos;acquiert dans l&apos;isolement, mais{' '}
            <span className="text-poly-gold not-italic font-bold">
              l&apos;excellence s&apos;atteint dans la collectivité.
            </span>
            &rdquo;
          </p>
          <p className="text-slate-400 dark:text-white/30 text-xs mt-3 font-mono font-medium">— Axiome fondateur, Éseka 2026</p>
        </div>

        {/* Organigramme Officiel */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-6 h-6 text-poly-gold" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Organigramme Officiel ({team.length} Membres)</h2>
            <div className="flex-1 h-px bg-poly-gold/20" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>

        {/* Piliers */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {['Solidarité', 'Rigueur', 'Bienveillance', 'Transparence'].map((pilier, i) => (
            <div
              key={pilier}
              className="glass-card p-4 text-center border border-slate-200 dark:border-white/5 hover:border-poly-gold/40 transition-all shadow-sm dark:shadow-none"
            >
              <div className="text-2xl mb-2">
                {['🤝', '🎯', '💛', '👁️'][i]}
              </div>
              <p className="text-slate-900 dark:text-white font-bold text-sm">{pilier}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
