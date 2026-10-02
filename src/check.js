export const okAns = (a, c) => {
  if (c.text) return String(a).trim().toLowerCase() === String(c.ans).toLowerCase();
  const x = parseFloat(a), y = parseFloat(c.ans);
  return Number.isFinite(x) && Math.abs(x - y) <= Math.max(0.005, Math.abs(y) * 0.002);
};
