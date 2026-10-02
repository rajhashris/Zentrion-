import { useState, useEffect } from "react";
import { Routes, Route, Link, NavLink, Navigate, useNavigate, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Domain from "./pages/Domain.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Practice from "./pages/Practice.jsx";
import Missions, { MissionPage } from "./pages/Missions.jsx";
import Quest from "./pages/Quest.jsx";
import Me from "./pages/Me.jsx";
import Faculty from "./pages/Faculty.jsx";
import Rewards from "./pages/Rewards.jsx";
import Settings from "./pages/Settings.jsx";
import { Leaderboard, Learn, About } from "./pages/Info.jsx";
import AskAI from "./AskAI.jsx";
import Shower from "./Shower.jsx";
import Reminder from "./Reminder.jsx";
import LogoutButton from "./LogoutButton.jsx";
import { applySettings } from "./settings.js";
import { departments } from "./data.jsx";
import { Avatar, AvatarStudio, loadAvatar } from "./avatar.jsx";
import { useGame, useUser, signOut } from "./hooks.js";
import { streakOf } from "./game.js";

const tabs = [["/", "Home", "🏠"], ["/learn", "Learn", "📖"], ["/practice", "Practice", "💻"], ["/missions", "Missions", "🗺️"], ["/me", "Me", "🙂"]];
const roots = tabs.map(t => t[0]);

function BackBar() {
  const nav = useNavigate();
  const { pathname, key } = useLocation();
  if (roots.includes(pathname)) return null;
  return (
    <div className="backbar">
      <button className="backbtn" onClick={() => (key === "default" ? nav("/") : nav(-1))}>← Back</button>
    </div>
  );
}

function Wallet() {
  const g = useGame();
  return <Link to="/rewards" className="rwd" aria-label={`${streakOf(g.days)} day streak, ${g.stars} stars, ${g.tokens} tokens`}>🔥 {streakOf(g.days)} · ⭐ {g.stars} · 🪙 {g.tokens}</Link>;
}

function NavUser() {
  const u = useUser();
  const nav = useNavigate();
  const [cfg, setCfg] = useState(loadAvatar());
  useEffect(() => {
    const f = () => setCfg(loadAvatar());
    window.addEventListener("zavatar", f);
    return () => window.removeEventListener("zavatar", f);
  }, []);
  const close = e => e.currentTarget.closest("details")?.removeAttribute("open");
  if (!u) return <><Link to="/login" className="btn ghost">Sign in</Link><Link to="/signup" className="btn solid hide-sm">Sign up</Link></>;
  return (
    <>
    <LogoutButton className="btn ghost logout" />
    <details className="acct">
      <summary aria-label="Account menu"><Avatar cfg={cfg} size={38} /></summary>
      <div className="menu">
        <p className="who"><b>{u.name}</b><small>{u.role === "faculty" ? "Faculty" : "Student"}</small></p>
        <Link to={u.role === "faculty" ? "/faculty" : "/dashboard"} onClick={close}>🏠 My dashboard</Link>
        <Link to="/me" onClick={close}>👤 Profile</Link>
        <Link to="/settings" onClick={close}>⚙️ Settings</Link>
        <Link to="/rewards" onClick={close}>🏅 Tasks and rewards</Link>
        <button onClick={e => { close(e); signOut(); nav("/"); }}>🚪 Log out</button>
      </div>
    </details>
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("zentrion-theme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"); } catch { return "light"; }
  });
  useEffect(() => { applySettings(); }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("zentrion-theme", theme); } catch {}
  }, [theme]);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo" aria-label="Zentrion home"><span className="mark">Z</span>Zentrion</Link>
        <nav className="links" aria-label="Main">
          {tabs.map(([to, label]) => <NavLink key={to} to={to} end={to === "/"}>{label}</NavLink>)}
        </nav>
        <div className="navright">
          <Wallet />
          <Link to="/settings" className="gear" aria-label="Settings">⚙</Link>
          <button className="theme" onClick={() => setTheme(next)} aria-label={`Switch to ${next} mode`}>{theme === "dark" ? "☀" : "☾"}</button>
          <NavUser />
        </div>
      </header>
      <main>
        <BackBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/missions" element={<Missions />} />
          <Route path="/missions/bridge" element={<Quest />} />
          <Route path="/missions/:id" element={<MissionPage />} />
          <Route path="/me" element={<Me />} />
          <Route path="/domain/:id" element={<Domain />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/avatar" element={<AvatarStudio />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/settings" element={<Settings theme={theme} setTheme={setTheme} />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/signup" element={<Auth signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/profile" element={<Navigate to="/me" replace />} />
          <Route path="/quest" element={<Navigate to="/missions/bridge" replace />} />
          <Route path="/resources" element={<Navigate to="/learn" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="foot">
        <div className="fgrid">
          <div>
            <Link to="/" className="logo"><span className="mark">Z</span>Zentrion</Link>
            <p>A learning platform for engineering students to learn, practice and build skills.</p>
          </div>
          <div>
            <h3>DEPARTMENTS</h3>
            {departments.map(d => <Link key={d.id} to={`/domain/${d.id}`}>{d.code}</Link>)}
          </div>
          <div>
            <h3>MORE</h3>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/rewards">Tasks and rewards</Link>
            <Link to="/settings">Settings</Link>
            <Link to="/about">About Us</Link>
          </div>
        </div>
      </footer>
      <nav className="tabbar" aria-label="Quick navigation">
        {tabs.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === "/"}><span aria-hidden="true">{icon}</span>{label}</NavLink>)}
      </nav>
      <AskAI />
      <Shower />
      <Reminder />
    </>
  );
}
