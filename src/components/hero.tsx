"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Logo3D from "./logo3d";
import { CircuitBand, Equations, GridBG, Orb } from "./fx-deco";

/* Three.js chargé en lazy (hors SSR) : il ne bloque plus le rendu ni le JS initial. */
const ThreeHero = dynamic(() => import("./three-hero"), { ssr: false, loading: () => null });
import { Btn } from "./ui";
import { SITE } from "@/config";

export function BridgeSVG({ className = "" }: { className?: string }) {
  const cable = (x: number) => `M150 30 L${x} 120`;
  return (
    <motion.svg viewBox="0 0 300 150" fill="none" className={className} aria-hidden>
      <motion.path
        d="M10 120 H290" stroke="#E3A82B" strokeWidth="2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      <motion.path
        d="M146 120 V22 M154 120 V22 M146 26 L154 22" stroke="#3D6EA8" strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: .3 }}
      />
      {[40, 65, 90, 115].map((x, i) => (
        <motion.path key={x} d={cable(x)} stroke="#E3A82B" strokeOpacity=".7" strokeWidth=".8"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: .8, delay: .6 + i * .12 }} />
      ))}
      {[260, 235, 210, 185].map((x, i) => (
        <motion.path key={x} d={cable(x)} stroke="#E3A82B" strokeOpacity=".7" strokeWidth=".8"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: .8, delay: .6 + i * .12 }} />
      ))}
      <motion.path
        d="M235 120 a28 28 0 0 1 56 0" stroke="#E3A82B" strokeWidth="1.6"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1, delay: 1.2 }}
      />
      {[40, 65, 90, 115, 185, 210, 235, 260].map((x) => (
        <circle key={x} cx={x} cy="120" r="1.6" fill="#F3D07E" />
      ))}
    </motion.svg>
  );
}

export function RobotArmSVG({ className = "" }: { className?: string }) {
  return (
    <motion.svg viewBox="0 0 320 180" fill="none" className={className} aria-hidden>
      <motion.rect x="30" y="150" width="52" height="14" rx="4" fill="#16375F"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} />
      <motion.g
        style={{ originX: "56px", originY: "150px" }}
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path d="M56 150 L96 84" stroke="#E3A82B" strokeWidth="5" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: .8 }} />
        <circle cx="96" cy="84" r="6" fill="#0B1F3A" stroke="#E3A82B" strokeWidth="2.5" />
        <motion.g style={{ originX: "96px", originY: "84px" }} animate={{ rotate: [4, -4, 4] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
          <motion.path d="M96 84 L168 96" stroke="#F3D07E" strokeWidth="4" strokeLinecap="round"
            initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: .8, delay: .4 }} />
          <circle cx="168" cy="96" r="4.5" fill="#0B1F3A" stroke="#F3D07E" strokeWidth="2" />
          <path d="M168 96 L182 104" stroke="#F3D07E" strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>
      </motion.g>
      <motion.path d="M182 104 H286 M196 104 V138 M232 104 V138 M268 104 V138 M188 138 H280"
        stroke="#3D6EA8" strokeWidth="1.4" strokeDasharray="4 4"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2.4, delay: .9 }} />
      <motion.path d="M196 120 a18 18 0 0 1 36 0 M232 120 a18 18 0 0 1 36 0"
        stroke="#E3A82B" strokeWidth="1.2"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6, delay: 2 }} />
      <circle cx="182" cy="104" r="2" fill="#F3D07E" />
    </motion.svg>
  );
}

export default function Hero() {
  return (
    <section className="noise relative flex min-h-screen items-center overflow-hidden pt-24">
      <GridBG />
      <Orb className="left-[-10%] top-[10%] h-[420px] w-[420px] bg-night-600/40" />
      <Orb className="right-[-8%] top-[30%] h-[380px] w-[380px] bg-gold-600/15" />
      <ThreeHero />
      <Equations />
      <CircuitBand className="absolute inset-x-0 bottom-0 h-24 w-full opacity-70" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-28 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8 }}
          className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-widest2 text-gold-300"
        >
          <span className="relative flex h-1.5 w-1.5 rounded-full bg-gold-400 ping-soft" />
          Collectif académique · {SITE.org} · l'entraide comme méthode
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: .15 }} className="mx-auto w-64 md:w-96">
          <Logo3D className="h-40 w-full md:h-56" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .3 }}
          className="mx-auto mt-8 max-w-4xl text-balance font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-[4.2rem]"
        >
          Réussir ensemble, construire{" "}
          <span className="shimmer-text">l'excellence</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .45 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 md:text-lg"
        >
          {SITE.baseline} Fiches de TD, épreuves et corrections des programmes officiels MSP1 et MSP2,
          entraide organisée et formations d'excellence.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Btn href="/register">Commencer maintenant →</Btn>
          <Btn href="/msp1" variant="outline">Explorer MSP1</Btn>
          <Btn href="/msp2" variant="ghost">Explorer MSP2</Btn>
          <Btn href="/vip" variant="ghost">Espace VIP</Btn>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-6 items-start justify-center rounded-full border border-white/20 p-1.5">
          <div className="h-2 w-1 rounded-full bg-gold-400" />
        </div>
      </motion.div>
    </section>
  );
}
