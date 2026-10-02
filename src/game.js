import { missions } from "./missions.js";

const KEY = "zentrion-game";
export const today = () => new Date().toLocaleDateString("en-CA");
const addDays = (iso, n) => { const d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.toLocaleDateString("en-CA"); };

export const tasks = [
  { id: "code", label: "Pass all tests on 3 code problems", goal: 3, tok: 5, bonus: 15, stars: 1 },
  { id: "quiz", label: "Score 75% or more in 2 quizzes", goal: 2, tok: 5, bonus: 10, stars: 1 },
  { id: "doubt", label: "Ask the doubt helper 3 questions", goal: 3, tok: 1, bonus: 5, stars: 1 },
  { id: "avatar", label: "Save your own avatar", goal: 1, tok: 5, bonus: 0, stars: 1 },
  { id: "bridge", label: "Finish the Bridge Chain mission", goal: 6, tok: 3, bonus: 30, stars: 3 },
  ...missions.map(m => ({ id: "m-" + m.id, label: `Finish the ${m.title} mission`, goal: m.levels.reduce((n, l) => n + l.challenges.length, 0), tok: 4, bonus: 40, stars: 3 })),
];

export function streakOf(days) {
  const set = new Set(days);
  let d = today();
  if (!set.has(d)) d = addDays(d, -1);
  let n = 0;
  while (set.has(d)) { n++; d = addDays(d, -1); }
  return n;
}
export const weekStart = () => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.toLocaleDateString("en-CA"); };
export const weekSolved = g => Object.values(g.solved).filter(s => s.date >= weekStart()).length;
export const fastest = g => { const v = Object.values(g.solved).map(s => s.ms).filter(x => x > 0); return v.length ? Math.min(...v) : 0; };
export const mastered = g => Object.entries(g.topics).filter(([, t]) => t.r >= 3 && t.r / (t.r + t.w) >= 0.75).map(([n]) => n);
export const weakest = g => Object.entries(g.topics).filter(([, t]) => t.w > 0).sort((a, b) => b[1].w - a[1].w).slice(0, 4);
export const missionsDone = g => missions.filter(m => g.done["m-" + m.id]).length + (g.done.bridge ? 1 : 0);

export const medals = [
  ["spark", "First Spark", "Earn your first star", g => g.stars >= 1],
  ["bronze", "Bronze Engineer", "Earn 3 stars", g => g.stars >= 3],
  ["silver", "Silver Engineer", "Earn 8 stars", g => g.stars >= 8],
  ["gold", "Gold Engineer", "Earn 15 stars", g => g.stars >= 15],
  ["hero", "Mission Hero", "Finish 3 missions", g => missionsDone(g) >= 3],
  ["master", "Mission Master", "Finish every mission", g => missionsDone(g) >= missions.length + 1],
  ["fire", "On Fire", "Reach a 3-day streak", g => streakOf(g.days) >= 3],
  ["speed", "Speedster", "Solve a problem in under 30 seconds", g => { const f = fastest(g); return f > 0 && f < 30000; }],
  ["sharp", "Sharp Mind", "Master 2 topics", g => mastered(g).length >= 2],
  ["rich", "Token Collector", "Collect 50 tokens in total", g => g.tokens + g.spent >= 50],
];

const fresh = () => ({ tokens: 0, spent: 0, stars: 0, prog: {}, done: {}, owned: [], topics: {}, solved: {}, days: [], goal: 5, remind: "", lastRemind: "" });
export const loadGame = () => { try { return { ...fresh(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return fresh(); } };
const save = g => { try { localStorage.setItem(KEY, JSON.stringify(g)); } catch {} window.dispatchEvent(new Event("zgame")); };
const touch = g => { const d = today(); if (!g.days.includes(d)) g.days = [...g.days.slice(-90), d]; };

export function record(id, key) {
  const t = tasks.find(x => x.id === id);
  const g = loadGame();
  const list = g.prog[id] || [];
  if (list.includes(key)) return null;
  g.prog[id] = [...list, key];
  g.tokens += t.tok;
  let finished = false, bonus = 0;
  if (!g.done[id] && g.prog[id].length >= t.goal) { g.done[id] = true; g.stars += t.stars; g.tokens += t.bonus; bonus = t.bonus; finished = true; }
  touch(g);
  save(g);
  return { tok: t.tok + bonus, finished, stars: finished ? t.stars : 0 };
}
export function logAttempt({ key, topic, level, ok, ms }) {
  const g = loadGame();
  const t = g.topics[topic] || { r: 0, w: 0 };
  g.topics[topic] = ok ? { ...t, r: t.r + 1 } : { ...t, w: t.w + 1 };
  if (ok && key && !g.solved[key]) g.solved[key] = { level, topic, ms, date: today() };
  touch(g);
  save(g);
}
export function buy(item, cost) {
  const g = loadGame();
  if (g.owned.includes(item)) return true;
  if (g.tokens < cost) return false;
  g.tokens -= cost; g.spent += cost; g.owned = [...g.owned, item];
  save(g);
  return true;
}
const patch = o => { const g = loadGame(); Object.assign(g, o); save(g); };
export const setGoal = n => patch({ goal: n });
export const setRemind = t => patch({ remind: t, lastRemind: "" });
export const stampReminder = d => patch({ lastRemind: d });
export const rewardText = r => r ? `+${r.tok} tokens${r.finished ? ` and ${r.stars} star${r.stars > 1 ? "s" : ""}, task complete!` : ""}` : "";
export const shower = () => window.dispatchEvent(new Event("zshower"));
