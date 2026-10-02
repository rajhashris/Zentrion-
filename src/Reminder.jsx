import { useEffect, useState } from "react";
import { loadGame, stampReminder, today } from "./game.js";

export default function Reminder() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const check = () => {
      const g = loadGame();
      if (!g.remind) return;
      const hhmm = new Date().toTimeString().slice(0, 5);
      const d = today();
      if (hhmm < g.remind || g.lastRemind === d || g.days.includes(d)) return;
      stampReminder(d);
      setShow(true);
      try { if ("Notification" in window && Notification.permission === "granted") new Notification("Zentrion", { body: "Time to practise! Keep your 🔥 streak alive." }); } catch {}
    };
    check();
    const t = setInterval(check, 30000);
    return () => clearInterval(t);
  }, []);
  if (!show) return null;
  return <div className="toast" role="alert">⏰ Time to practise! Keep your 🔥 streak alive. <button onClick={() => setShow(false)}>Got it</button></div>;
}
