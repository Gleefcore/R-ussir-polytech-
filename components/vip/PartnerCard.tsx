'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Building2,
  UserCheck,
  TrendingUp,
  Award,
  Globe,
} from 'lucide-react';
import { type PartnerCompany } from '@/data/partners';

interface PartnerCardProps {
  partner: PartnerCompany;
  index: number;
}

export function PartnerCard({ partner, index }: PartnerCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`glass-card p-6 sm:p-8 border-2 transition-all group relative overflow-hidden rounded-3xl shadow-xl flex flex-col justify-between ${partner.themeColor.border} bg-gradient-to-b ${partner.themeColor.bg}`}
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-white/5 blur-3xl group-hover:bg-white/10 transition-colors pointer-events-none" />

      <div>
        {/* Top Header: Logo + Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">
          {/* Logo Frame */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-white p-2 shadow-lg border border-slate-200 dark:border-white/20 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              {!imgError ? (
                <Image
                  src={partner.logo}
                  alt={`Logo officiel ${partner.name}`}
                  fill
                  className="object-contain p-1"
                  onError={() => setImgError(true)}
                  priority={index === 0}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-black text-xl">
                  {partner.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1.5 border shadow-sm backdrop-blur-md"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  borderColor: 'rgba(255,255,255,0.2)',
                }}
              >
                <Building2 className={`w-3.5 h-3.5 ${partner.themeColor.text}`} />
                <span className="text-slate-900 dark:text-white">{partner.badge}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                {partner.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium italic mt-0.5">
                « {partner.tagline} »
              </p>
            </div>
          </div>

          {/* Official Partner Badge */}
          <div className="self-start sm:self-auto">
            <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-xl border ${partner.themeColor.badgeBg} ${partner.themeColor.badgeText}`}>
              <Award className="w-4 h-4" />
              <span>Partenaire Officiel</span>
            </span>
          </div>
        </div>

        {/* Founder & Leadership Card */}
        <div className="bg-slate-100/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 mb-5 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-poly-gold/15 border border-poly-gold/30 text-poly-gold flex-shrink-0 mt-0.5">
              <UserCheck className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Fondateur / Direction :</span>
                <span className="text-poly-gold underline decoration-poly-gold/40">{partner.founder}</span>
              </p>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium mt-0.5">
                {partner.founderRole}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium mb-6">
          {partner.description}
        </p>

        {/* Services Clés */}
        <div className="mb-6">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-heading mb-3 flex items-center gap-1.5">
            <Sparkles className={`w-3.5 h-3.5 ${partner.themeColor.text}`} />
            <span>Pôles de Compétences & Services Clés</span>
          </h4>
          <div className="space-y-2.5">
            {partner.services.map((service, sIdx) => (
              <div
                key={sIdx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium"
              >
                <CheckCircle2 className={`w-4 h-4 flex-shrink-0 mt-0.5 ${partner.themeColor.text}`} />
                <span>{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics / Chiffres Clés */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-6">
          {partner.keyMetrics.map((metric, mIdx) => (
            <div
              key={mIdx}
              className="bg-white/80 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-2.5 sm:p-3 text-center shadow-sm"
            >
              <p className={`text-xs sm:text-sm font-black ${partner.themeColor.text} font-heading`}>
                {metric.value}
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5 leading-tight">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tags / Spécialités */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {partner.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-200/70 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-300/60 dark:border-white/10"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Footer: Website + WhatsApp Direct CTA */}
      <div className="border-t border-slate-200 dark:border-white/10 pt-5 mt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span>Partenaire Réussir Polytech</span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {partner.websiteUrl && (
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 dark:text-slate-200 bg-slate-200/80 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 border border-slate-300 dark:border-white/10 transition-all shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-poly-cyan" />
              <span>Visiter le site web</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          )}

          <a
            href={`https://wa.me/${partner.whatsapp}?text=${encodeURIComponent(partner.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider text-slate-900 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] shadow-lg shadow-[#D4AF37]/25 hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all whitespace-nowrap"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Contacter sur WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
