import { useEffect, useState } from "react";

export default function Shower() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    let t;
    const f = () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.calm === "1") return;
      setOn(true);
      clearTimeout(t);
      t = setTimeout(() => setOn(false), 3200);
    };
    window.addEventListener("zshower", f);
    return () => { window.removeEventListener("zshower", f); clearTimeout(t); };
  }, []);
  if (!on) return null;
  return (
    <div className="shower" aria-hidden="true">
      {Array.from({ length: 26 }, (_, i) => (
        <span key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 9) * 0.18}s`, fontSize: `${1.4 + (i % 4) * 0.4}rem` }}>{i % 5 === 0 ? "⭐" : "🍫"}</span>
      ))}
    </div>
  );
}
