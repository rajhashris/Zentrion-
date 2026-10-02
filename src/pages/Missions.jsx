import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { missions } from "../missions.js";
import { departments } from "../data.jsx";
import { Avatar, loadAvatar } from "../avatar.jsx";
import { CodeRunner, Cheer } from "../tools.jsx";
import { useGame, readUser } from "../hooks.js";
import { record, rewardText, shower, logAttempt } from "../game.js";
import { diagnoseAnswer } from "../diagnose.js";
import { okAns } from "../check.js";

const count = m => m.levels.reduce((n, l) => n + l.challenges.length, 0);

export default function Missions() {
  const g = useGame();
  const u = readUser();
  const list = [
    ...missions.map(m => ({ id: m.id, icon: m.icon, title: m.title, dept: m.dept, story: m.story, total: count(m), done: (g.prog["m-" + m.id] || []).length })),
    { id: "bridge", icon: "🌉", title: "The Bridge Chain", dept: "all", story: "One bridge, six branches. Each team's answer unlocks the next team's job.", total: 6, done: (g.prog.bridge || []).length },
  ].sort((a, b) => (b.dept === u?.dept) - (a.dept === u?.dept));
  return (
    <section className="domain">
      <h1>Missions</h1>
      <p className="lead">Real-world problems with a map. Solve challenges to unlock the next place and earn rewards.</p>
      <div className="pcards">
        {list.map(m => {
          const d = departments.find(x => x.id === m.dept);
          const full = m.done >= m.total;
          return (
            <Link key={m.id} to={`/missions/${m.id}`} className="pcard" style={{ "--c": d?.color || "#2563EB" }}>
              <span className="code">{m.dept === "all" ? "ALL BRANCHES" : d.code}{m.dept === u?.dept ? " · For you" : ""}</span>
              <h3>{m.icon} {m.title}</h3>
              <p>{m.story}</p>
              <div className="meter" style={{ gridTemplateColumns: "1fr 44px" }}><i style={{ "--w": `${m.done / m.total * 100}%` }} /><b>{m.done}/{m.total}</b></div>
              <p><b>{full ? "Completed ✓" : m.done ? "Continue →" : "Start →"}</b></p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function AnswerBox({ c, solved, onPass }) {
  const [v, setV] = useState("");
  const [state, setState] = useState(solved ? "ok" : "");
  const [why, setWhy] = useState("");
  const [hint, setHint] = useState(false);
  const submit = e => {
    e.preventDefault();
    const ok = okAns(v, c);
    logAttempt({ key: c.title, topic: c.topic, level: c.level, ok, ms: 0 });
    if (ok) { setState("ok"); shower(); onPass(); } else { setState("bad"); setWhy(diagnoseAnswer(v, c)); }
  };
  return (
    <form className="bench" onSubmit={submit}>
      <h2>{c.title} <small className="lvl">{c.level}</small></h2>
      <p className="hint">{c.q}</p>
      <label>Your answer<input value={v} onChange={e => { setV(e.target.value); setState(solved ? "ok" : ""); }} inputMode={c.text ? "text" : "decimal"} /></label>
      <div className="pills" style={{ marginTop: 12 }}>
        <button className="run" style={{ marginTop: 0 }} type="submit">Check answer</button>
        <button type="button" className="pillbtn" onClick={() => setHint(true)}>💡 Hint</button>
      </div>
      {hint && <div className="hintbox"><b>Hint:</b> {c.hint}</div>}
      {state === "bad" && <div className="why" role="alert">{why}<br /><b>Method:</b> {c.hint}</div>}
      {state === "ok" && <Cheer win msg={`Correct! ${c.sol}`} />}
    </form>
  );
}

export function MissionPage() {
  const { id } = useParams();
  const m = missions.find(x => x.id === id);
  const g = useGame();
  const [sel, setSel] = useState(null);
  const [ci, setCi] = useState(0);
  const [tab, setTab] = useState("learn");
  const [msg, setMsg] = useState("");
  if (!m) return <Navigate to="/missions" replace />;
  const key = "m-" + m.id;
  const done = new Set(g.prog[key] || []);
  const lv = m.levels;
  const levelDone = l => l.challenges.every(c => done.has(c.mid));
  const cur = lv.findIndex(l => !levelDone(l));
  const finished = cur === -1;
  const open = sel === null ? (finished ? lv.length - 1 : cur) : sel;
  const L = lv[open];
  const c = L.challenges[Math.min(ci, L.challenges.length - 1)];
  const dept = departments.find(d => d.id === m.dept);
  const pass = ch => {
    const before = levelDone(L);
    const r = record(key, ch.mid);
    const will = L.challenges.every(x => x.mid === ch.mid || done.has(x.mid));
    const next = lv[open + 1];
    setMsg(rewardText(r) + (will && !before ? (next ? ` 🔓 ${next.place} unlocked!` : " 🏆 Mission complete!") : ""));
  };
  const goLevel = i => { setSel(i); setCi(0); setTab("learn"); setMsg(""); };
  return (
    <section className="domain" style={{ "--c": dept.color }}>
      <p className="eyebrow">{dept.code} MISSION</p>
      <h1>{m.icon} {m.title}</h1>
      <p className="lead">{m.story}</p>
      <ol className="map" aria-label="Mission map">
        {lv.map((l, i) => {
          const unlocked = finished || i <= cur;
          const isDone = levelDone(l);
          return (
            <li key={l.place} className={"node" + (isDone ? " done" : unlocked ? " now" : " locked")}>
              <button className="orb" disabled={!unlocked} onClick={() => goLevel(i)} aria-label={`${l.place}${unlocked ? "" : ", locked"}`}>{unlocked ? l.icon : "🔒"}</button>
              {!finished && i === cur && <span className="me"><Avatar cfg={loadAvatar()} size={34} /></span>}
              <b>{l.place}</b>
              <small>{isDone ? "Cleared" : unlocked ? `Level ${i + 1}` : `Clear ${lv[i - 1].place} first`}</small>
            </li>
          );
        })}
        <li className={"node" + (finished ? " done" : " locked")}>
          <span className="orb">{finished ? "🏆" : "🔒"}</span>
          {finished && <span className="me"><Avatar cfg={{ ...loadAvatar(), mood: "grin" }} size={34} /></span>}
          <b>Mission complete</b>
          <small>{finished ? "You did it!" : "Finish every level"}</small>
        </li>
      </ol>
      {finished && <Cheer win msg={`Mission completed! You solved ${m.title}.`} />}
      <div className="bench wide" style={{ marginTop: 16 }}>
        <h2>{L.icon} Level {open + 1}: {L.title}</h2>
        <p className="hint">{L.challenges.filter(x => done.has(x.mid)).length} of {L.challenges.length} challenges done</p>
        <div className="pills">
          <button className="pillbtn" aria-pressed={tab === "learn"} onClick={() => setTab("learn")}>📖 Learn</button>
          <button className="pillbtn" aria-pressed={tab === "practice"} onClick={() => setTab("practice")}>💻 Practise</button>
        </div>
        {tab === "learn" ? (
          <>
            <p>{L.learn.text}</p>
            {L.learn.code && <pre className="snip">{L.learn.code}</pre>}
            <button className="run" onClick={() => setTab("practice")}>Start practising</button>
          </>
        ) : (
          <>
            <div className="pills">{L.challenges.map((x, i) => <button key={x.mid} className="pillbtn" aria-pressed={ci === i} onClick={() => { setCi(i); setMsg(""); }}>{done.has(x.mid) ? "✅ " : ""}Challenge {i + 1}</button>)}</div>
            {c.kind === "code"
              ? <CodeRunner key={c.mid} prob={c} onPass={() => pass(c)} />
              : <AnswerBox key={c.mid} c={c} solved={done.has(c.mid)} onPass={() => pass(c)} />}
            {msg && <div className="cheer win" role="status"><p>{msg}</p></div>}
          </>
        )}
      </div>
    </section>
  );
}
