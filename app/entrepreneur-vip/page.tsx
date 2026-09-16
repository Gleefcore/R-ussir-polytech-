import { techPrograms, strategyPrograms } from '@/data/vipPrograms';
import { VipCard } from '@/components/vip/VipCard';
import { Cpu, Brain, Star } from 'lucide-react';

export default function EntrepreneurVipPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-br from-poly-gold/15 via-transparent to-poly-cyan/15 dark:from-poly-gold/10 dark:via-poly-night dark:to-poly-cyan/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/15 border border-[#D4AF37]/40 rounded-full px-5 py-2 mb-6 shadow-sm">
            <Star className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm font-black tracking-wider uppercase font-mono">
              Espace VIP Exclusif • Showroom Officiel
            </span>
            <Star className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-4 font-heading">
            L&apos;Ingénieur Entrepreneur{' '}
            <span className="text-gold-gradient">(Espace VIP)</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg max-w-3xl mx-auto font-medium mb-8">
            Deux volets de formation d&apos;élite pour forger les ingénieurs-bâtisseurs de demain.
            Technique de haute précision. Vision stratégique d&apos;empire.
          </p>

          {/* Bannière d'accès unique et monétisation */}
          <div className="max-w-2xl mx-auto glass-card p-5 border-2 border-[#D4AF37]/40 rounded-2xl bg-gradient-to-r from-[#D4AF37]/10 via-white/5 to-[#38BDF8]/10 text-left flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>👑 Votre compte étudiant donne accès à tout le catalogue</span>
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                Consultez librement tous les programmes ci-dessous. Pour activer votre adhésion VIP et débloquer les sessions privées, réglez directement auprès de la direction sur WhatsApp.
              </p>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_STRATEGY || '237672356441'}?text=${encodeURIComponent("Bonjour M. Eugène Samuel GWET (PCA Réussir Polytech), je souhaite souscrire et payer mon adhésion VIP pour l'Espace Ingénieur Entrepreneur. Merci de m'indiquer la procédure de règlement.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 btn-primary py-2.5 px-4 text-xs font-black text-[#050B14] flex items-center gap-1.5 shadow-md shadow-[#D4AF37]/30 hover:scale-105 transition-transform"
            >
              <span>Régler l&apos;Adhésion VIP</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* VOLET TECHNIQUE */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-poly-cyan/15 border border-poly-cyan/30 shadow-sm">
              <Cpu className="w-7 h-7 text-sky-600 dark:text-poly-cyan" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                Volet Technique & Outils Métiers
              </h2>
              <p className="text-sky-600 dark:text-poly-cyan text-sm font-mono font-bold mt-0.5">
                Mentor : Bikey Yannick — Directeur Informatique et Opérationnel
              </p>
            </div>
          </div>

          <div className="glass-card p-5 border border-poly-cyan/30 mb-6 flex flex-col sm:flex-row gap-4 items-start shadow-md dark:shadow-none">
            <div className="flex-1">
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                Formations certifiantes pour maîtriser les outils du 21ème siècle. De la
                bureautique haute précision à l&apos;Intelligence Artificielle, chaque module est
                conçu pour l&apos;ingénieur en action.
              </p>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_TECH || '237695957287'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white dark:bg-poly-cyan/15 dark:text-poly-cyan dark:border dark:border-poly-cyan/30 rounded-xl text-sm font-bold transition-all whitespace-nowrap shadow-sm"
            >
              Contacter Yannick →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {techPrograms.map((program, index) => (
              <VipCard key={program.id} program={program} index={index} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
          <Star className="w-5 h-5 text-[#D4AF37]" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
        </div>

        {/* VOLET STRATÉGIQUE */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 shadow-sm">
              <Brain className="w-7 h-7 text-[#D4AF37]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white font-heading">
                Volet Stratégie, Vision & Haute Performance
              </h2>
              <p className="text-[#D4AF37] text-sm font-mono font-bold mt-0.5">
                Mentor : Eugène Samuel GWET — Cofondateur & PCA, Fondateur de G-INNOVA
              </p>
            </div>
          </div>

          <div className="glass-card p-5 border border-[#D4AF37]/30 mb-6 flex flex-col sm:flex-row gap-4 items-start shadow-md dark:shadow-none">
            <div className="flex-1">
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
                Programmes d&apos;élite pour forger votre âme de leader et de bâtisseur. Vision
                industrielle, discipline d&apos;acier, leadership naturel et techniques
                d&apos;innovation expérimentée. Pour ceux qui veulent dominer, pas juste réussir.
              </p>
            </div>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_STRATEGY || '237672356441'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 px-5 py-2.5 bg-[#D4AF37] hover:bg-[#C59B27] text-[#050B14] font-black rounded-xl text-sm transition-all whitespace-nowrap shadow-sm shadow-[#D4AF37]/20"
            >
              Contacter Eugène →
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {strategyPrograms.map((program, index) => (
              <VipCard key={program.id} program={program} index={index} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
