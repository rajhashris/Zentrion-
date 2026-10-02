import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { departments } from "../data.jsx";
import { problems } from "../content.js";
import { missions } from "../missions.js";
import { Avatar, loadAvatar } from "../avatar.jsx";
import LogoutButton from "../LogoutButton.jsx";
import { useGame, readProfile, useUser, saveUser, signOut } from "../hooks.js";
import { streakOf, weekSolved, fastest, mastered, weakest, medals, missionsDone, setGoal, setRemind } from "../game.js";

const lvls = ["Beginner", "Intermediate", "Advanced"];

export default function Me() {
  const g = useGame();
  const me = useUser();
  const nav = useNavigate();
  const [tab, setTab] = useState("progress");
  const [u, setU] = useState({ name: "", email: "", dept: "cse", year: "1", college: "", bio: "", ...(readProfile() || {}) });
  const [saved, setSaved] = useState(false);
  const [perm, setPerm] = useState(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  const set = k => e => { setU({ ...u, [k]: e.target.value }); setSaved(false); };
  const save = e => { e.preventDefault(); saveUser(u); setSaved(true); };

  const streak = streakOf(g.days);
  const solved = Object.values(g.solved);
  const all = [...Object.values(problems).flat(), ...missions.flatMap(m => m.levels.flatMap(l => l.challenges))];
  const f = fastest(g);
  const mine = missions.find(m => m.dept === u.dept);
  const nextM = [mine, ...missions].filter(Boolean).find(m => !g.done["m-" + m.id]);
  const ms = mastered(g);
  const weak = weakest(g);
  const wk = weekSolved(g);
  const week = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - 6 + i); return [d.toLocaleDateString("en-CA"), d.toLocaleDateString("en-US", { weekday: "narrow" })]; });
  const ask = () => { try { Notification.requestPermission().then(setPerm); } catch {} };

  return (
    <section className="domain">
      <div className="hello">
        <Avatar cfg={loadAvatar()} size={84} />
        <div>
          <h1>{u.name || "Your profile"}</h1>
          <p className="lead" style={{ margin: 0 }}>🔥 {streak}-day streak · ⭐ {g.stars} · 🪙 {g.tokens}</p>
        </div>
        {me && <LogoutButton className="btn ghost push" />}
      </div>
      {!me && (
        <div className="bench wide" style={{ marginTop: 16 }}>
          <h2>You are not signed in</h2>
          <p className="hint">Sign in to keep your name, department and role.</p>
          <div className="pills"><Link to="/login?role=student" className="pillbtn">🎓 Sign in as student</Link><Link to="/login?role=faculty" className="pillbtn">🧑‍🏫 Sign in as faculty</Link></div>
        </div>
      )}
      <div className="tabs" role="tablist" style={{ marginTop: 16 }}>
        {[["progress", "My progress"], ["goals", "Goals"], ["details", "Details"]].map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} className="tab" onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === "progress" && (
        <>
          <div className="tiles">
            <div className="tile"><small>🏆 Missions completed</small><strong>{missionsDone(g)} of {missions.length + 1}</strong></div>
            <div className="tile"><small>🔥 Current streak</small><strong>{streak} day{streak === 1 ? "" : "s"}</strong></div>
            <div className="tile"><small>⚡ Fastest solve</small><strong>{f ? `${Math.round(f / 1000)} s` : "Not yet"}</strong></div>
            <div className="tile"><small>✅ Problems solved</small><strong>{solved.length}</strong></div>
            <div className="tile"><small>🧠 Topics mastered</small><strong>{ms.length ? ms.join(", ") : "None yet"}</strong></div>
            <div className="tile"><small>🎯 Current quest</small><strong>{nextM ? <Link to={`/missions/${nextM.id}`}>{nextM.icon} {nextM.title}</Link> : "All missions done"}</strong></div>
          </div>
          <div className="bench wide">
            <h2>Problems by level</h2>
            {lvls.map(l => {
              const n = solved.filter(s => s.level === l).length, t = all.filter(p => p.level === l).length;
              return <div key={l} className="meter" style={{ gridTemplateColumns: "110px 1fr 56px" }}><span>{l}</span><i style={{ "--w": `${t ? n / t * 100 : 0}%` }} /><b>{n}/{t}</b></div>;
            })}
          </div>
          <div className="bench wide">
            <h2>Where to improve</h2>
            {weak.length === 0
              ? <p className="hint">No mistakes yet. Keep practising!</p>
              : <>
                {weak.map(([t, s], i) => {
                  const acc = Math.round(s.r / (s.r + s.w) * 100);
                  return <div key={t} className="meter" style={{ gridTemplateColumns: "1fr 90px 120px" }}><span>{i === 0 ? "⚠️ " : ""}{t}</span><i style={{ "--w": `${acc}%` }} /><b>{s.w} wrong · {acc}%</b></div>;
                })}
                <p className="hint">Most mistakes are in <b>{weak[0][0]}</b>. Read the Learn card for it, then try again. <Link to="/learn" className="back">Open Learn</Link></p>
              </>}
          </div>
          <div className="bench wide">
            <h2>Badges</h2>
            <div className="medals">
              {medals.map(([id, name, how, test]) => { const got = test(g); return <div key={id} className={"medal" + (got ? " got" : "")}><span aria-hidden="true">{got ? "🏅" : "🔒"}</span><b>{name}</b><small>{how}</small></div>; })}
            </div>
            <p><Link to="/rewards" className="back">See tasks and rewards</Link></p>
          </div>
        </>
      )}

      {tab === "goals" && (
        <>
          <div className="bench wide">
            <h2>🔥 Last 7 days</h2>
            <div className="week">{week.map(([d, w]) => <span key={d} className={g.days.includes(d) ? "on" : ""} title={d}>{g.days.includes(d) ? "🔥" : w}</span>)}</div>
          </div>
          <div className="bench wide">
            <h2>Weekly goal</h2>
            <p className="hint">How many problems do you want to solve each week?</p>
            <div className="pills">{[3, 5, 10].map(n => <button key={n} className="pillbtn" aria-pressed={g.goal === n} onClick={() => setGoal(n)}>{n} problems</button>)}</div>
            <div className="meter" style={{ gridTemplateColumns: "1fr 70px" }}><i style={{ "--w": `${Math.min(100, wk / g.goal * 100)}%` }} /><b>{Math.min(wk, g.goal)}/{g.goal}</b></div>
            <p className="hint">{wk >= g.goal ? "Goal reached! Amazing work 🎉" : `${g.goal - wk} more to reach this week's goal.`}</p>
          </div>
          <div className="bench wide">
            <h2>⏰ Daily reminder</h2>
            <p className="hint">Get a nudge if you have not practised yet today. It works while Zentrion is open in your browser.</p>
            <div className="fields"><label>Remind me at<input type="time" value={g.remind} onChange={e => setRemind(e.target.value)} /></label></div>
            <div className="pills">
              {g.remind && <button className="pillbtn" onClick={() => setRemind("")}>Turn off</button>}
              {perm === "default" && <button className="pillbtn" onClick={ask}>Allow notifications</button>}
            </div>
            {perm === "denied" && <p className="hint">Notifications are blocked in your browser. You will still see a reminder inside the app.</p>}
          </div>
        </>
      )}

      {tab === "details" && (
        <div className="studio">
          <div className="bench prev">
            <Avatar cfg={loadAvatar()} size={140} />
            <Link to="/avatar" className="btn ghost">Customise avatar</Link>
            <Link to="/settings" className="back">Settings</Link>
            <Link to="/leaderboard" className="back">Leaderboard</Link>
            <Link to="/about" className="back">About Zentrion</Link>
            <button className="pillbtn" onClick={() => { signOut(); nav("/"); }}>🚪 Log out</button>
          </div>
          <form className="bench" onSubmit={save}>
            <p className="hint">Saved only in this browser.</p>
            <div className="fields">
              <label>Full name<input required value={u.name} onChange={set("name")} /></label>
              <label>Email<input type="email" value={u.email} onChange={set("email")} /></label>
              <label>College<input value={u.college} onChange={set("college")} /></label>
              <label>Year<select value={u.year} onChange={set("year")}>{["1", "2", "3", "4"].map(y => <option key={y} value={y}>Year {y}</option>)}</select></label>
              <label>Department<select value={u.dept} onChange={set("dept")}>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></label>
            </div>
            <label>About you<textarea className="short" value={u.bio} onChange={set("bio")} placeholder="Interests, goals, favourite subjects…" /></label>
            <button className="run" type="submit">Save details</button>
            {saved && <p role="status" className="hint">Saved!</p>}
          </form>
        </div>
      )}
    </section>
  );
}
