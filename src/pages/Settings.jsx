import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { readSettings, saveSetting, applySettings } from "../settings.js";
import { useUser, signOut } from "../hooks.js";

export default function Settings({ theme, setTheme }) {
  const [s, setS] = useState(readSettings());
  const [msg, setMsg] = useState("");
  const u = useUser();
  const nav = useNavigate();
  const pick = (k, v) => { saveSetting(k, v); setS(readSettings()); };
  const wipe = keys => {
    try { keys.forEach(k => localStorage.removeItem(k)); } catch {}
    ["zavatar", "zgame", "zuser"].forEach(n => window.dispatchEvent(new Event(n)));
    applySettings();
    setS(readSettings());
  };
  const pills = (items, cur, on) => <div className="pills">{items.map(([v, l]) => <button key={v} className="pillbtn" aria-pressed={cur === v} onClick={() => on(v)}>{l}</button>)}</div>;
  return (
    <section className="domain">
      <h1>Settings</h1>
      <div className="bench wide">
        <h2>Account</h2>
        {u ? (
          <>
            <p className="hint">Signed in as <b>{u.name}</b> ({u.role === "faculty" ? "Faculty" : "Student"})</p>
            <div className="pills">
              <Link to="/me" className="pillbtn">Edit profile</Link>
              <button className="pillbtn" onClick={() => { signOut(); nav("/"); }}>🚪 Log out</button>
            </div>
          </>
        ) : (
          <>
            <p className="hint">You are not signed in.</p>
            <div className="pills">
              <Link to="/login?role=student" className="pillbtn">🎓 Sign in as student</Link>
              <Link to="/login?role=faculty" className="pillbtn">🧑‍🏫 Sign in as faculty</Link>
            </div>
          </>
        )}
      </div>
      <div className="bench wide">
        <div className="opt-row"><h2>Theme</h2>{pills([["light", "Light"], ["dark", "Dark"]], theme, setTheme)}</div>
        <div className="opt-row"><h2>Animations</h2>{pills([["0", "On"], ["1", "Reduced"]], s.calm, v => pick("calm", v))}</div>
        <div className="opt-row"><h2>Text size</h2>{pills([["normal", "Normal"], ["large", "Large"]], s.size, v => pick("size", v))}</div>
        <p className="hint">Reminders and weekly goals are in <Link to="/me" className="back">Me → Goals</Link>.</p>
      </div>
      <div className="bench wide">
        <h2>Your data</h2>
        <p className="hint">Everything is stored only in this browser.</p>
        <div className="pills">
          <button className="pillbtn" onClick={() => { wipe(["zentrion-avatar"]); setMsg("Avatar reset."); }}>Reset avatar</button>
          <button className="pillbtn" onClick={() => { if (window.confirm("Clear all saved data on this device?")) { wipe(["zentrion-user", "zentrion-in", "zentrion-avatar", "zentrion-calm", "zentrion-size", "zentrion-game", "zentrion-assigned", "zentrion-quest"]); setMsg("All saved data cleared."); } }}>Clear all saved data</button>
        </div>
        {msg && <p role="status" className="hint">{msg}</p>}
      </div>
    </section>
  );
}
