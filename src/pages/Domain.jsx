import { useEffect, useState } from "react";
import { useParams, useSearchParams, Navigate, Link } from "react-router-dom";
import { departments } from "../data.jsx";
import { problems, quizzes } from "../content.js";
import { Calc, CodeRunner, Quiz } from "../tools.jsx";
import { Avatar, loadAvatar } from "../avatar.jsx";

const icons = { cse: ["</>", "{ }", ">_"], ece: ["▣", "∿", "Ω"], mech: ["⚙", "⌀", "N·m"], eee: ["ϟ", "∿", "V"], civil: ["⌂", "▦", "kN"], ads: ["◎", "σ", "%"] };
const pos = [[8, 18], [86, 14], [14, 70], [82, 72], [30, 36], [68, 40]];

function Gate({ d }) {
  return (
    <div className="gate" style={{ "--c": d.color }} role="status">
      <div className="doodles" aria-hidden="true">
        {[...icons[d.id], ...icons[d.id]].map((t, k) => <span key={k} style={{ left: `${pos[k][0]}%`, top: `${pos[k][1]}%`, animationDelay: `${k * 0.18}s` }}>{t}</span>)}
      </div>
      <div className="gav"><Avatar cfg={loadAvatar()} size={150} /></div>
      <p>Opening your {d.name} workbench…</p>
      <div className="load"><i /></div>
    </div>
  );
}

export default function Domain() {
  const { id } = useParams();
  const [sp, setSp] = useSearchParams();
  const d = departments.find(x => x.id === id);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(false);
    const calm = matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.calm === "1";
    const t = setTimeout(() => setReady(true), calm ? 0 : 1300);
    return () => clearTimeout(t);
  }, [id]);
  if (!d) return <Navigate to="/" replace />;
  if (!ready) return <Gate d={d} />;
  const tab = sp.get("tab") || "bench";
  const probs = problems[id];
  const p = Math.min(Math.max(+sp.get("p") || 0, 0), probs.length - 1);
  const go = (t, n = 0) => setSp({ tab: t, p: n });
  return (
    <section className="domain" style={{ "--c": d.color }}>
      <h1>{d.name}</h1>
      <p className="lead">{d.blurb}</p>
      <ul className="topics">{d.topics.map(t => <li key={t}>{t}</li>)}</ul>
      <div className="tabs" role="tablist">
        {[["bench", "Workbench"], ["code", "Code practice"], ["quiz", "Quiz"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className="tab" onClick={() => go(k)}>{l}</button>
        ))}
      </div>
      {tab === "bench" && <Calc cfg={d.tool} key={id} />}
      {tab === "code" && (
        <>
          <div className="pills">{probs.map((x, i) => <button key={i} className="pillbtn" aria-pressed={p === i} onClick={() => go("code", i)}>{x.title}</button>)}</div>
          <CodeRunner prob={probs[p]} key={id + p} />
        </>
      )}
      {tab === "quiz" && <Quiz qs={quizzes[id]} topic={`${d.code} quiz`} key={id} />}
    </section>
  );
}
