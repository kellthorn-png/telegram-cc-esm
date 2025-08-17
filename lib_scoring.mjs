// lib_scoring.mjs — EV / scoring helpers
import { clamp } from "./lib_utils.mjs";

export function evPct(p) {
  if (!p || !p.ev_reference_odds || !p.odds) return 0;
  return (p.odds - p.ev_reference_odds) / p.ev_reference_odds;
}

export function timeScore(hoursToKick) {
  return clamp((hoursToKick - 0.25) / (6 - 0.25), 0, 1);
}

export function clvScore(p) {
  if (!p || p.clv_close_odds == null) return 0.5;
  const clv = (p.clv_close_odds - p.odds) / p.odds;
  return clamp(0.5 + clv, 0, 1);
}

export function computeScore01(p, hoursToKick, weights) {
  const ev = clamp(0.5 + evPct(p), 0, 1);
  const src = clamp(p?.rating ?? 0.5, 0, 1);
  const t = timeScore(hoursToKick);
  const clv = clvScore(p);
  const w = weights || { ev: 0.35, source: 0.25, clv: 0.2, time: 0.2 };
  return clamp(ev * w.ev + src * w.source + clv * w.clv + t * w.time, 0, 1);
}

// self-test
(function(){
  if (timeScore(0) !== 0) console.warn("timeScore(0) != 0");
  if (timeScore(6) !== 1) console.warn("timeScore(6) != 1");
})();
