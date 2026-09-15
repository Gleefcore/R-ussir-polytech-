import { AuthForm } from '@/components/auth/AuthForm';
import Image from 'next/image';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-200 dark:bg-hero-gradient transition-colors duration-300" />
      <div
        className="absolute inset-0 opacity-20 dark:opacity-30"
        style={{
          backgroundImage: `linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-poly-gold/10 dark:bg-poly-gold/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-20 h-20 mb-4">
            <Image
              src="/assets/logo-polytech.png"
              alt="Réussir Polytech"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Réussir Polytech</h1>
          <p className="text-poly-cyan text-xs font-mono tracking-widest uppercase font-bold mt-1">
            L&apos;excellence est notre seul standard
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8 border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-none">
          <AuthForm />
        </div>

        <p className="text-center text-slate-400 dark:text-white/20 text-xs mt-6 font-medium">
          Plateforme réservée aux élèves ingénieurs de l&apos;École Polytechnique
        </p>
      </div>
    </div>
  );
}
