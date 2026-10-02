import { useState } from "react";
import { Navigate } from "react-router-dom";
import { readUser } from "../hooks.js";
import LogoutButton from "../LogoutButton.jsx";
import { departments } from "../data.jsx";
import { problems } from "../content.js";

const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const sample = [["Student A", 82], ["Student B", 64], ["Student C", 47], ["Student D", 91]];

export default function Faculty() {
  const u = readUser();
  const [list, setList] = useState(read("zentrion-assigned", []));
  const [dept, setDept] = useState(u?.dept || "cse");
  const [item, setItem] = useState("0");
  const [note, setNote] = useState("");
  if (!u) return <Navigate to="/login?role=faculty" replace />;
  if (u.role !== "faculty") return <Navigate to="/dashboard" replace />;
  const d = departments.find(x => x.id === dept);
  const opts = [...problems[dept].map((p, i) => ({ v: String(i), label: `Code: ${p.title}`, to: `/domain/${dept}?tab=code&p=${i}` })), { v: "quiz", label: "Quiz", to: `/domain/${dept}?tab=quiz` }];
  const assign = e => {
    e.preventDefault();
    const o = opts.find(x => x.v === item) || opts[0];
    const next = [{ dept, label: `${d.code}: ${o.label}`, to: o.to, note }, ...list];
    setList(next);
    try { localStorage.setItem("zentrion-assigned", JSON.stringify(next)); } catch {}
    setNote("");
  };
  return (
    <section className="domain" style={{ "--c": d.color }}>
      <div className="hello"><div><p className="eyebrow">FACULTY DESK</p><h1>Welcome, {u.name}.</h1></div><LogoutButton className="btn ghost push" /></div>
      <p className="lead">Assign tasks to your students. In this prototype, assigned tasks show on the student dashboard in the same browser.</p>
      <div className="dgrid">
        <form className="bench" onSubmit={assign}>
          <h2>Assign a task</h2>
          <div className="fields">
            <label>Department
              <select value={dept} onChange={e => { setDept(e.target.value); setItem("0"); }}>{departments.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
            </label>
            <label>Task
              <select value={item} onChange={e => setItem(e.target.value)}>{opts.map(o => <option key={o.v} value={o.v}>{o.label}</option>)}</select>
            </label>
          </div>
          <label>Note for students<input value={note} onChange={e => setNote(e.target.value)} placeholder="Due Friday" /></label>
          <button className="run" type="submit">Assign</button>
        </form>
        <div className="bench">
          <h2>Class progress</h2>
          <p className="hint">Sample data for the prototype.</p>
          {sample.map(([n, p]) => <div key={n} className="meter"><span>{n}</span><i style={{ "--w": `${p}%` }} /><b>{p}%</b></div>)}
        </div>
      </div>
      <div className="bench wide">
        <h2>Assigned so far</h2>
        {list.length === 0 && <p className="hint">Nothing assigned yet.</p>}
        {list.map((a, i) => <div key={i} className="out" style={{ marginTop: 8 }}><span>{a.label}</span><strong>{a.note || "No note"}</strong></div>)}
      </div>
    </section>
  );
}
