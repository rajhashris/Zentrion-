import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { departments } from "../data.jsx";
import { problems, quizzes } from "../content.js";
import { useGame } from "../hooks.js";

export default function Practice() {
  const [sp] = useSearchParams();
  const g = useGame();
  const [dept, setDept] = useState(sp.get("dept") || "all");
  const [level, setLevel] = useState("all");
  const [kind, setKind] = useState("all");
  const items = departments.flatMap(d => [
    ...problems[d.id].map((p, i) => ({ d, kind: "Code", title: p.title, level: p.level, to: `/domain/${d.id}?tab=code&p=${i}` })),
    { d, kind: "Quiz", title: `${d.name} quiz`, level: "Any", to: `/domain/${d.id}?tab=quiz` },
  ]).filter(x => (dept === "all" || x.d.id === dept) && (level === "all" || x.level === level) && (kind === "all" || x.kind === kind));
  return (
    <section className="domain">
      <h1>Practice</h1>
      <p className="lead">Code problems and quizzes from beginner to advanced.</p>
      <div className="filters">
        <label>Branch<select value={dept} onChange={e => setDept(e.target.value)}><option value="all">All branches</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
        <label>Level<select value={level} onChange={e => setLevel(e.target.value)}>{["all", "Beginner", "Intermediate", "Advanced"].map(l => <option key={l} value={l}>{l === "all" ? "All levels" : l}</option>)}</select></label>
        <label>Type<select value={kind} onChange={e => setKind(e.target.value)}><option value="all">Code and quizzes</option><option value="Code">Code</option><option value="Quiz">Quizzes</option></select></label>
      </div>
      <div className="pcards">
        {items.map((x, i) => (
          <Link key={i} to={x.to} className="pcard" style={{ "--c": x.d.color }}>
            <span className="code">{x.d.code} · {x.kind}</span>
            <h3>{g.solved[x.title] ? "✅ " : ""}{x.title}</h3>
            <p>{x.level === "Any" ? "Quick concept check" : x.level}</p>
          </Link>
        ))}
        {items.length === 0 && <p className="hint">Nothing matches these filters.</p>}
      </div>
    </section>
  );
}
