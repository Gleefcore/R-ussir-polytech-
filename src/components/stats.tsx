"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { STATS } from "@/content";

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);
  return (
    <span ref={ref} className="font-display text-4xl font-bold text-white md:text-5xl">
      {n.toLocaleString("fr-FR")}
      <span className="gold-text">{suffix}</span>
    </span>
  );
}

export default function StatsBand() {
  return (
    <div className="glass grid grid-cols-2 gap-8 px-8 py-10 shadow-card md:grid-cols-4">
      {STATS.map((s) => (
        <div key={s.label} className="text-center">
          <Counter value={s.value} suffix={s.suffix} />
          <p className="mt-2 font-mono text-[11px] uppercase tracking-widest2 text-white/50">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
