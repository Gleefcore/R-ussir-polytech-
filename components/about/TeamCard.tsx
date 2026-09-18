'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { type TeamMember } from '@/data/team';
import { Crown, Shield } from 'lucide-react';

interface TeamCardProps {
  member: TeamMember;
  index: number;
}

export function TeamCard({ member, index }: TeamCardProps) {
  const [hasError, setHasError] = useState(false);

  // Active l'affichage des photos officielles disponibles (fallback initiales si absence ou erreur)
  const MEMBERS_WITH_OFFICIAL_PHOTO = new Set([
    'eugene-gwet',
    'stevia-matho',
    'alex-ngoua',
    'christian-khouya',
    'bikey-yannick',
    'loice-tadontsa',
    'rose-mbog',
    'atyame-yolande',
    'franck',
    'pacha',
  ]);
  const hasOfficialPhoto = MEMBERS_WITH_OFFICIAL_PHOTO.has(member.id);

  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07 }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="glass-card p-6 border border-slate-200 dark:border-white/10 hover:border-poly-gold/50 transition-all group relative overflow-hidden holographic shadow-md dark:shadow-none flex flex-col justify-between"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-poly-gold/10 via-transparent to-poly-cyan/10 dark:from-poly-gold/5 dark:to-poly-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Founder badge */}
      {member.isFounder && (
        <div className="absolute top-4 right-4 z-20">
          <div className="flex items-center gap-1 bg-poly-gold/20 border border-poly-gold/40 rounded-full px-2.5 py-0.5 shadow-sm">
            <Crown className="w-3 h-3 text-poly-gold" />
            <span className="text-poly-gold text-xs font-bold">Fondateur</span>
          </div>
        </div>
      )}

      {/* Avatar Container */}
      <div className="relative w-24 h-24 mx-auto mb-4 mt-2">
        <div className="w-24 h-24 rounded-full border-2 border-poly-gold/50 overflow-hidden bg-slate-100 dark:bg-poly-night flex items-center justify-center shadow-lg relative">
          {hasOfficialPhoto && !hasError ? (
            <Image
              src={member.photo}
              alt={member.name}
              fill
              className="object-cover object-top"
              onError={() => setHasError(true)}
              priority={member.order <= 3}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-poly-gold/25 via-poly-night/60 to-poly-cyan/25 text-slate-800 dark:text-white font-black text-2xl tracking-wider select-none">
              {initials}
            </div>
          )}
        </div>
        {/* Order badge */}
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white dark:bg-poly-card border-2 border-poly-gold flex items-center justify-center shadow-md z-10">
          <span className="text-poly-gold text-xs font-black">{member.order}</span>
        </div>
      </div>

      {/* Content */}
      <div className="text-center relative z-10">
        <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1 group-hover:text-poly-gold transition-colors">
          {member.name}
        </h3>
        <div className="flex items-center justify-center gap-1.5 mb-3">
          <Shield className="w-3.5 h-3.5 text-sky-600 dark:text-poly-cyan" />
          <span className="text-sky-600 dark:text-poly-cyan text-xs font-mono font-bold">{member.role}</span>
        </div>
        <p className="text-slate-600 dark:text-white/60 text-xs leading-relaxed line-clamp-3 mb-3">
          {member.description}
        </p>
        <p className="text-slate-400 dark:text-white/30 text-xs font-semibold border-t border-slate-200 dark:border-white/5 pt-2">
          {member.title}
        </p>
      </div>
    </motion.div>
  );
}
