/**
 * Générateur PDF minimaliste (sans dépendance) — produit de vrais documents
 * PDF 1.4 téléchargeables pour les ressources de la bibliothèque.
 */
// Caractères Unicode → octets WinAnsi (0x80-0x9F)
const WINANSI: Record<string, string> = {
  "—": "\u0097", "–": "\u0096", "‘": "\u0091", "’": "\u0092",
  "“": "\u0093", "”": "\u0094", "…": "\u0085", "€": "\u0080",
};
// Symboles hors WinAnsi → transcription ASCII lisible
const FALLBACK: Record<string, string> = {
  "→": "->", "⇒": "=>", "≤": "<=", "≥": ">=", "≠": "!=", "≈": "~=",
  "×": "x", "÷": "/", "√": "sqrt", "π": "pi", "λ": "lambda", "μ": "mu",
  "θ": "theta", "Σ": "Sigma", "∫": "INT", "∮": "INT", "ε": "eps",
  "∈": "in", "∞": "inf", "∀": "pour tout", "∃": "il existe", "∂": "d",
  "∇": "nabla", "Δ": "Delta", "α": "alpha", "β": "beta", "γ": "gamma",
  "ω": "omega", "φ": "phi", "η": "eta", "ρ": "rho", "σ": "sigma",
  "τ": "tau", "κ": "kappa", "★": "*", "✓": "OK", "·": ".",
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4", "₅": "5",
  "₆": "6", "₇": "7", "₈": "8", "₉": "9",
  "⁰": "0", "¹": "1", "⁴": "4", "⁵": "5", "⁶": "6", "⁷": "7", "⁸": "8", "⁹": "9",
};
const sanitize = (s: string) =>
  s
    .split("")
    .map((ch) => {
      const c = ch.codePointAt(0)!;
      if (c < 0x80) return ch;
      if (WINANSI[ch]) return WINANSI[ch];
      if (FALLBACK[ch]) return FALLBACK[ch];
      if (c <= 0xff) return ch;
      return "";
    })
    .join("");

const esc = (s: string) => sanitize(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");

function wrap(text: string, width = 92): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length > width) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + " " + w).trim();
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

export function buildPdf(title: string, meta: string[], body: string[]): Buffer {
  const ops: string[] = [];
  ops.push("BT /F1 18 Tf 0.89 0.66 0.17 rg 56 786 Td (RÉUSSIR POLYTECH) Tj ET");
  ops.push("BT /F2 9 Tf 0.45 0.5 0.6 rg 56 770 Td (Académie numérique des ingénieurs — ENSPY) Tj ET");
  ops.push("0.89 0.66 0.17 RG 1.2 w 56 758 m 539 758 l S");
  let y = 724;
  for (const t of wrap(title, 60)) {
    ops.push(`BT /F1 15 Tf 0.04 0.09 0.2 rg 56 ${y} Td (${esc(t)}) Tj ET`);
    y -= 21;
  }
  y -= 4;
  for (const m of meta) {
    ops.push(`BT /F2 10 Tf 0.4 0.45 0.55 rg 56 ${y} Td (${esc(m)}) Tj ET`);
    y -= 15;
  }
  y -= 10;
  for (const line of body.slice(0, 36)) {
    ops.push(`BT /F2 10.5 Tf 0.12 0.15 0.22 rg 56 ${y} Td (${esc(line)}) Tj ET`);
    y -= 16;
  }
  ops.push("BT /F2 8 Tf 0.55 0.58 0.65 rg 56 42 Td (Document délivré par RÉUSSIR POLYTECH — WhatsApp +237 6 72 35 64 41) Tj ET");
  const stream = ops.join("\n");

  const objects: string[] = [];
  objects[1] = "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj";
  objects[2] = "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj";
  objects[3] =
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >> endobj";
  objects[4] = `4 0 obj << /Length ${Buffer.byteLength(stream, "latin1")} >> stream\n${stream}\nendstream endobj`;
  objects[5] = "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >> endobj";
  objects[6] = "6 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> endobj";

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  for (let i = 1; i <= 6; i++) {
    offsets[i] = Buffer.byteLength(pdf, "latin1");
    pdf += objects[i] + "\n";
  }
  const xref = Buffer.byteLength(pdf, "latin1");
  pdf += "xref\n0 7\n0000000000 65535 f \n";
  for (let i = 1; i <= 6; i++) pdf += offsets[i].toString().padStart(10, "0") + " 00000 n \n";
  pdf += `trailer << /Size 7 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(pdf, "latin1");
}
