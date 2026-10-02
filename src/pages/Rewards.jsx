import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tasks, medals, loadGame } from "../game.js";

export default function Rewards() {
  const [g, setG] = useState(loadGame());
  useEffect(() => {
    const f = () => setG(loadGame());
    window.addEventListener("zgame", f);
    return () => window.removeEventListener("zgame", f);
  }, []);
  return (
    <section className="domain">
      <h1>Tasks and rewards</h1>
      <p className="lead">Finish tasks to earn tokens and stars. Spend tokens on special avatar items, and collect medals.</p>
      <div className="dgrid">
        <div className="bench"><h2>🪙 {g.tokens} tokens</h2><p className="hint">Unlock items in the avatar studio.</p><Link to="/avatar" className="btn solid">Open avatar shop</Link></div>
        <div className="bench"><h2>⭐ {g.stars} stars</h2><p className="hint">Stars come from completing tasks.</p></div>
      </div>
      <div className="bench wide">
        <h2>Tasks</h2>
        {tasks.map(t => {
          const n = Math.min((g.prog[t.id] || []).length, t.goal);
          return (
            <div key={t.id} className="meter" style={{ gridTemplateColumns: "1fr 120px 54px" }}>
              <span>{g.done[t.id] ? "✅ " : ""}{t.label}</span>
              <i style={{ "--w": `${n / t.goal * 100}%` }} /><b>{n}/{t.goal}</b>
            </div>
          );
        })}
      </div>
      <div className="bench wide">
        <h2>Medals</h2>
        <div className="medals">
          {medals.map(([id, name, how, test]) => {
            const got = test(g);
            return <div key={id} className={"medal" + (got ? " got" : "")}><span aria-hidden="true">{got ? "🏅" : "🔒"}</span><b>{name}</b><small>{how}</small></div>;
          })}
        </div>
      </div>
    </section>
  );
}
