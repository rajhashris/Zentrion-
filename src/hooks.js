import { useState, useEffect } from "react";
import { loadGame } from "./game.js";

export function useGame() {
  const [g, setG] = useState(loadGame());
  useEffect(() => {
    const f = () => setG(loadGame());
    window.addEventListener("zgame", f);
    return () => window.removeEventListener("zgame", f);
  }, []);
  return g;
}

const ping = () => window.dispatchEvent(new Event("zuser"));
export const readProfile = () => { try { return JSON.parse(localStorage.getItem("zentrion-user")); } catch { return null; } };
const inFlag = () => { try { return localStorage.getItem("zentrion-in") === "1"; } catch { return false; } };
export const readUser = () => (inFlag() ? readProfile() : null);
export function saveUser(u) { try { localStorage.setItem("zentrion-user", JSON.stringify(u)); } catch {} ping(); }
export function signIn(u) { try { localStorage.setItem("zentrion-user", JSON.stringify(u)); localStorage.setItem("zentrion-in", "1"); } catch {} ping(); }
export function signOut() { try { localStorage.removeItem("zentrion-in"); } catch {} ping(); }
export function useUser() {
  const [u, setU] = useState(readUser());
  useEffect(() => {
    const f = () => setU(readUser());
    window.addEventListener("zuser", f);
    return () => window.removeEventListener("zuser", f);
  }, []);
  return u;
}
