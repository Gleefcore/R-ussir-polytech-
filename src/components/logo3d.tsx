"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";

/** Logo flottant en 3D : inclinaison suivant la souris + halo lumineux pulsé. */
export default function Logo3D({ className = "" }: { className?: string }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 130, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 130, damping: 16 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    ry.set(px * 26);
    rx.set(-py * 18);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div
      className={`${className} [perspective:1000px]`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="animate-float"
      >
        <img
          src="/logo.png"
          alt="Logo RÉUSSIR POLYTECH"
          width={640}
          height={640}
          fetchPriority="high"
          decoding="async"
          draggable={false}
          className="logo-glow h-full w-full select-none object-contain"
        />
      </motion.div>
    </div>
  );
}
