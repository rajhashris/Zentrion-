const get = (k, d) => { try { return localStorage.getItem(k) ?? d; } catch { return d; } };
export const readSettings = () => ({ calm: get("zentrion-calm", "0"), size: get("zentrion-size", "normal") });
export function applySettings() {
  const s = readSettings();
  document.documentElement.dataset.calm = s.calm;
  document.documentElement.dataset.size = s.size;
}
export function saveSetting(k, v) {
  try { localStorage.setItem(`zentrion-${k}`, v); } catch {}
  applySettings();
}
