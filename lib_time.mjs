// lib_time.mjs — ESM utilities for time/countdown

// Zwraca "HH:MM:SS" z liczby ms
export function fmtCountdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

export function timeToKickMsFromNow(startISO, nowMs) {
  return new Date(startISO).getTime() - nowMs;
}

export function timeToKickHours(startISO, nowMs) {
  return Math.max(0, (new Date(startISO).getTime() - nowMs) / 3600000);
}

// mini self-test
(function () {
  if (fmtCountdown(0) !== "00:00:00") console.warn("fmtCountdown(0) failed");
  if (fmtCountdown(90000) !== "00:01:30") console.warn("fmtCountdown(90s) failed");
})();
