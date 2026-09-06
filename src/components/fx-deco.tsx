/** Décorations animées réutilisables (CSS/SVG pur, compatibles serveur). */

export function CircuitBand({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1200 90"
      fill="none"
      aria-hidden
      className={`pointer-events-none ${className}`}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
      preserveAspectRatio="none"
    >
      <g stroke="#E3A82B" strokeOpacity=".35" strokeWidth="1.2">
        <path className="circuit-path" d="M0 45h180l24-24h140l20 20h180l26-26h150l22 22h160l24-24h274" />
        <path className="circuit-path" d="M0 62h120l18 18h220l24-24h260l18 18h240l26-26h274" style={{ animationDelay: "-1.2s" }} />
        <path className="circuit-path" d="M0 28h90l16 16h300l22-22h280l20 20h200l24-24h248" style={{ animationDelay: "-2.1s" }} />
      </g>
      <g fill="#E3A82B" fillOpacity=".55">
        <circle cx="204" cy="21" r="2.6" />
        <circle cx="364" cy="41" r="2.6" />
        <circle cx="570" cy="15" r="2.6" />
        <circle cx="742" cy="37" r="2.6" />
        <circle cx="358" cy="80" r="2.2" />
        <circle cx="642" cy="56" r="2.2" />
        <circle cx="908" cy="48" r="2.2" />
      </g>
      <g stroke="#3D6EA8" strokeOpacity=".4" strokeWidth="1">
        <path className="circuit-path" d="M1200 70h-160l-20-20h-220l-24 24h-260l-18-18h-240l-26 26H0" style={{ animationDelay: "-.6s" }} />
      </g>
    </svg>
  );
}

const EQUATIONS = [
  { t: "e^{iπ} + 1 = 0", pos: "left-[4%] top-[16%]", rot: "-6deg", d: "0s" },
  { t: "∇ × E = −∂B/t", pos: "right-[6%] top-[22%]", rot: "5deg", d: "-2s" },
  { t: "∫₀^∞ e^{−x²} dx = √π/2", pos: "left-[9%] bottom-[24%]", rot: "4deg", d: "-4s" },
  { t: "O(n log n)", pos: "right-[12%] bottom-[30%]", rot: "-4deg", d: "-1s" },
  { t: "det(A − λI) = 0", pos: "left-[22%] top-[8%]", rot: "3deg", d: "-3s" },
  { t: "F = m·d²r/dt²", pos: "right-[24%] top-[10%]", rot: "-3deg", d: "-5s" },
  { t: "ΔS ≥ 0", pos: "left-[38%] bottom-[12%]", rot: "2deg", d: "-2.5s" },
  { t: "P(A|B) = P(B|A)P(A)/P(B)", pos: "right-[30%] bottom-[14%]", rot: "-2deg", d: "-6s" },
];

export function Equations({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden font-mono ${className}`}>
      {EQUATIONS.map((e) => (
        <span
          key={e.t}
          className={`eq absolute text-[11px] tracking-wider text-gold-300/50 md:text-xs ${e.pos}`}
          style={{ ["--rot" as string]: e.rot, animationDelay: e.d }}
        >
          {e.t}
        </span>
      ))}
    </div>
  );
}

export function Orb({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`pointer-events-none absolute rounded-full blur-3xl ${className}`} />;
}

export function GridBG({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`grid-bg mask-fade-b pointer-events-none absolute inset-0 ${className}`} />;
}
