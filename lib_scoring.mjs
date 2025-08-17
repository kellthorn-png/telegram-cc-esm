// lib_scoring.mjs — standalone (no external deps)

// Minimalne helpery (lokalne)
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

/**
 * EV w ujęciu procentowym (np. 0.05 = +5%)
 * p: { ev_reference_odds?: number, odds?: number }
 */
export function evPct(p) {
  if (!p || !p.ev_reference_odds || !p.odds) return 0;
  return (p.odds - p.ev_reference_odds) / p.ev_reference_odds;
}

/**
 * Score czasu do rozpoczęcia (0..1).
 * 0 przy ~0.25h i mniej, rośnie do 1 przy ~6h.
 */
export function timeScore(hoursToKick) {
  return clamp((hoursToKick - 0.25) / (6 - 0.25), 0, 1);
}

/**
 * CLV score (0..1). 0.5 = neutral.
 * p: { clv_close_odds?: number|null, odds?: number }
 */
export function clvScore(p) {
  if (!p || p.clv_close_odds == null || !p.odds) return 0.5;
  const clv = (p.clv_close_odds - p.odds) / p.odds;
  return clamp(0.5 + clv, 0, 1);
}

/**
 * Łączny score 0..1 na podstawie EV/źródła/CLV/czasu.
 * weights: { ev:number, source:number, clv:number, time:number }
 * p: obiekt typu/zakładu (może zawierać p.rating w [0..1])
 */
export function computeScore01(p, hoursToKick, weights) {
  const ev = clamp(0.5 + evPct(p), 0, 1);
  const src = clamp(p?.rating ?? 0.5, 0, 1);
  const t = timeScore(hoursToKick);
  const clv = clvScore(p);
  const w = weights || { ev: 0.35, source: 0.25, clv: 0.2, time: 0.2 };
  return clamp(ev * w.ev + src * w.source + clv * w.clv + t * w.time, 0, 1);
}

/* --- sanity checks (nie blokują działania, tylko ostrzegają w konsoli) --- */
(function () {
  try {
    if (timeScore(0) !== 0) console.warn("[lib_scoring] timeScore(0) != 0");
    if (timeScore(6) !== 1) console.warn("[lib_scoring] timeScore(6) != 1");
    // Prosty test compute:
    const demo = computeScore01(
      { ev_reference_odds: 1.90, odds: 2.00, rating: 0.7, clv_close_odds: 2.05 },
      3, // godziny do startu
      { ev: 0.35, source: 0.25, clv: 0.2, time: 0.2 }
    );
    if (!(demo >= 0 && demo <= 1)) console.warn("[lib_scoring] computeScore01 out of range");
  } catch (e) {
    // nie rzucaj w produkcji
  }
})();
