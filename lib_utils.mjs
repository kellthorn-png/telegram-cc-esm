// lib_utils.mjs — helpers

export const fmtPct = (x) => `${(x * 100).toFixed(1)}%`;
export const nowISO = () => new Date().toISOString();
export const uid = () => Math.random().toString(36).slice(2, 9);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// źródło
export function sourceLabel(p, operatorName) {
  if (!p) return "—";
  if (p.source === "Blogabet") return `Blogabet – ${p.tipster ?? "?"}`;
  if (p.source === "Informant") return `Informator – ${p.informantHandle ?? "?"}`;
  if (p.source === "Own") return `Własny – ${operatorName || "Operator"}`;
  return p.source ?? "—";
}

// aktor (dla logu decyzji)
export function getActorLabel(d, operatorName) {
  if (!d) return operatorName || "Operator";
  if (d.actorType === "system") return "System";
  if (d.actorType === "operator") return d.actor || operatorName || "Operator";
  return d.actor || operatorName || "Operator";
}
