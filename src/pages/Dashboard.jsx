import { Link, Navigate } from "react-router-dom";
import { departments } from "../data.jsx";
import { missions } from "../missions.js";
import { Avatar, loadAvatar } from "../avatar.jsx";
import LogoutButton from "../LogoutButton.jsx";
import { useGame, readUser } from "../hooks.js";
import { streakOf, weekSolved } from "../game.js";

export default function Dashboard() {
  const g = useGame();
  const u = readUser();
  if (!u) return <Navigate to="/login" replace />;
  if (u.role === "faculty") return <Navigate to="/faculty" replace />;
  const d = departments.find(x => x.id === u.dept) || departments[0];
  const m = missions.find(x => x.dept === d.id) || missions[0];
  const total = m.levels.reduce((n, l) => n + l.challenges.length, 0);
  const done = (g.prog["m-" + m.id] || []).length;
  const wk = weekSolved(g);
  let assigned = [];
  try { assigned = (JSON.parse(localStorage.getItem("zentrion-assigned")) || []).filter(a => a.dept === u.dept); } catch {}
  return (
    <section className="domain" style={{ "--c": d.color }}>
      <div className="hello">
        <Avatar cfg={loadAvatar()} size={76} />
        <div><h1>Hi, {u.name}!</h1><p className="lead" style={{ margin: 0 }}>🔥 {streakOf(g.days)}-day streak · {d.name}</p></div>
        <LogoutButton className="btn ghost push" />
      </div>
      <div className="dgrid" style={{ marginTop: 20 }}>
        <Link to={`/missions/${m.id}`} className="bench" style={{ color: "inherit" }}>
          <h2>{m.icon} {done >= total ? "Replay" : done ? "Continue" : "Start"}: {m.title}</h2>
          <p className="hint">{done} of {total} challenges done</p>
          <div className="meter" style={{ gridTemplateColumns: "1fr" }}><i style={{ "--w": `${done / total * 100}%` }} /></div>
        </Link>
        <div className="bench">
          <h2>Weekly goal</h2>
          <p className="hint">{Math.min(wk, g.goal)} of {g.goal} problems this week</p>
          <div className="meter" style={{ gridTemplateColumns: "1fr" }}><i style={{ "--w": `${Math.min(100, wk / g.goal * 100)}%` }} /></div>
        </div>
      </div>
      <div className="dgrid">
        <Link to={`/domain/${d.id}`} className="bench" style={{ color: "inherit" }}><h2>🛠️ Workbench</h2><p className="hint">{d.tool.title}</p></Link>
        <Link to={`/practice?dept=${d.id}`} className="bench" style={{ color: "inherit" }}><h2>💻 Practice</h2><p className="hint">Beginner to advanced problems</p></Link>
      </div>
      {assigned.length > 0 && (
        <div className="bench wide">
          <h2>Assigned by faculty</h2>
          {assigned.map((a, i) => <Link key={i} to={a.to} className="out" style={{ marginTop: 8 }}><span>{a.label}</span><strong>{a.note || "Open"}</strong></Link>)}
        </div>
      )}
    </section>
  );
}
