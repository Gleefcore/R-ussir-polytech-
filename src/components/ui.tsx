"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ReactNode, useRef } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHead({
  kicker,
  title,
  sub,
  center = false,
}: {
  kicker: string;
  title: ReactNode;
  sub?: string;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      <p className="kicker">{kicker}</p>
      <h2 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      {sub && <p className={`mt-4 max-w-2xl text-base leading-relaxed text-white/60 ${center ? "mx-auto" : ""}`}>{sub}</p>}
    </Reveal>
  );
}

type BtnVariant = "gold" | "outline" | "ghost" | "dark";

const btnStyles: Record<BtnVariant, string> = {
  gold: "bg-gold-grad text-night-950 font-bold hover:shadow-gold-glow hover:brightness-110 border border-gold-300/40",
  outline: "border border-gold-500/40 text-gold-300 hover:bg-gold-500/10 hover:border-gold-400/70",
  ghost: "border border-white/15 text-white/85 hover:border-white/40 hover:bg-white/5",
  dark: "bg-night-700 text-white hover:bg-night-600 border border-white/10",
};

export function Btn({
  href,
  onClick,
  variant = "gold",
  children,
  className = "",
  type = "button",
  external = false,
  disabled = false,
}: {
  href?: string;
  onClick?: () => void;
  variant?: BtnVariant;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  external?: boolean;
  disabled?: boolean;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 active:scale-[.97] disabled:opacity-50 disabled:pointer-events-none ${btnStyles[variant]} ${className}`;
  if (href) {
    if (external || href.startsWith("http"))
      return (
        <a href={href} target={external ? "_blank" : undefined} rel="noreferrer" className={cls}>
          {children}
        </a>
      );
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function Badge({ children, tone = "gold" }: { children: ReactNode; tone?: "gold" | "blue" | "white" | "green" | "red" }) {
  const tones = {
    gold: "bg-gold-500/15 text-gold-300 border-gold-500/30",
    blue: "bg-sky-500/10 text-sky-300 border-sky-500/30",
    white: "bg-white/5 text-white/70 border-white/15",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    red: "bg-rose-500/10 text-rose-300 border-rose-500/30",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-widest2 ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function StatusChip({ status }: { status: "pending" | "approved" | "rejected" }) {
  if (status === "approved") return <Badge tone="green">✓ Validée — document disponible</Badge>;
  if (status === "pending") return <Badge tone="gold">● En attente de confirmation</Badge>;
  return <Badge tone="red">✕ Refusée</Badge>;
}

export function SubjectIcon({ subject, className = "h-6 w-6" }: { subject: string; className?: string }) {
  if (subject === "math")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
        <path d="M18 4H6l7 8-7 8h12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (subject === "physique")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className={className}>
        <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className}>
      <path d="M8 6 3 12l5 6M16 6l5 6-5 6M13.5 4l-3 16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const WhatsAppIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.24 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.13.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
  </svg>
);
