import { Link } from "react-router-dom";
import { departments } from "../data.jsx";
import { useUser, signOut } from "../hooks.js";

const look = {
  cse: { bg: "#EE8FA3", ic: ">_", sub: "Coding • Logic • Problem Solving" },
  ece: { bg: "#5FD0C0", ic: "▣", sub: "Circuits • Electronics • Embedded Systems" },
  mech: { bg: "#7C9DE0", ic: "⚙", sub: "Design • Mechanics • Problem Solving" },
  eee: { bg: "#B79BEF", ic: "ϟ", sub: "Power • Electrical Machines • Control" },
  civil: { bg: "#E8CE7A", ic: "⌂", sub: "Structures • Design • Construction" },
  ads: { bg: "#86D68A", ic: "◎", sub: "AI • Data • Machine Learning" },
};

function Art() {
  return (
    <svg className="art" viewBox="0 0 420 300" aria-hidden="true">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#60A5FA" /><stop offset="1" stopColor="#1D4ED8" /></linearGradient></defs>
      <circle cx="110" cy="80" r="30" fill="url(#g)" />
      <rect x="230" y="30" width="70" height="22" rx="11" fill="url(#g)" transform="rotate(-12 265 41)" />
      <polygon points="80,170 100,158 120,170 120,194 100,206 80,194" fill="#3B82F6" />
      <circle cx="350" cy="210" r="24" fill="#2563EB" /><circle cx="350" cy="210" r="11" fill="#BFDBFE" />
      <rect x="360" y="90" width="16" height="50" rx="8" fill="#60A5FA" transform="rotate(20 368 115)" />
      <rect x="120" y="70" width="190" height="130" rx="10" fill="#1E40AF" />
      <rect x="130" y="80" width="170" height="110" rx="4" fill="url(#g)" />
      <text x="215" y="148" textAnchor="middle" fill="#DBEAFE" fontSize="30" fontWeight="700">{"</>"}</text>
      <path d="M96 208 L334 208 L350 232 L80 232 Z" fill="#93C5FD" />
      <circle cx="330" cy="70" r="5" fill="#2563EB" /><circle cx="60" cy="110" r="4" fill="#60A5FA" /><circle cx="300" cy="260" r="6" fill="#3B82F6" />
    </svg>
  );
}

export default function Home() {
  const u = useUser();
  return (
    <>
      <section className="hero">
        <div className="wrap herogrid">
          <div>
            <span className="pill">UNIFIED ENGINEERING PORTAL</span>
            <h1>Learn. Practice.<br />Build.</h1>
            <p>One platform for every engineering department.</p>
            <div className="ctas"><a className="btn solid big" href="#departments">Explore Departments</a><Link className="btn ghost big" to="/missions">Start a mission</Link></div>
          </div>
          <Art />
        </div>
      </section>
      <section className="wrap start" aria-label="Account">
        {u ? (
          <div className="startcard">
            <div><h2>Welcome back, {u.name}!</h2><p>Signed in as {u.role === "faculty" ? "Faculty" : "Student"}</p></div>
            <div className="ctas">
              <Link className="btn solid" to={u.role === "faculty" ? "/faculty" : "/dashboard"}>My dashboard</Link>
              <Link className="btn ghost" to="/settings">⚙ Settings</Link>
              <button className="btn ghost" onClick={signOut}>🚪 Log out</button>
            </div>
          </div>
        ) : (
          <>
            <h2 className="sec2">Sign in to continue</h2>
            <div className="roles">
              <div className="rolecard">
                <span aria-hidden="true">🎓</span><h3>Student</h3>
                <p>Missions, practice, rewards and your 🔥 streak.</p>
                <div className="ctas"><Link className="btn solid" to="/login?role=student">Sign in</Link><Link className="btn ghost" to="/signup?role=student">Sign up</Link></div>
              </div>
              <div className="rolecard">
                <span aria-hidden="true">🧑‍🏫</span><h3>Faculty</h3>
                <p>Assign tasks and follow your class progress.</p>
                <div className="ctas"><Link className="btn solid" to="/login?role=faculty">Sign in</Link><Link className="btn ghost" to="/signup?role=faculty">Sign up</Link></div>
              </div>
            </div>
            <p className="startlink"><Link to="/settings">⚙ Settings</Link></p>
          </>
        )}
      </section>
      <section className="depts" id="departments">
        <div className="wrap">
          <p className="eyebrow">CURRICULUM PATHS</p>
          <h2>Choose Your Department</h2>
          <p className="sub">Learn and practice skills tailored to your engineering department.</p>
          <div className="cards">
            {departments.map(d => (
              <Link key={d.id} to={`/domain/${d.id}`} className="card" style={{ background: look[d.id].bg }}>
                <div className="top"><span className="ic" aria-hidden="true">{look[d.id].ic}</span><span className="code">{d.code}</span></div>
                <h3>{d.name}</h3>
                <p>{look[d.id].sub}</p>
                <span className="go">Explore Pathway →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="wrap feats">
        <Link to="/missions" className="feat"><h3>🗺️ Real-world missions</h3><p>Solve a problem, unlock the next place on the map, and earn rewards.</p></Link>
        <Link to="/practice" className="feat"><h3>💻 Learn and practise</h3><p>Beginner to advanced problems with friendly explanations.</p></Link>
        <Link to="/avatar" className="feat"><h3>🙂 Your avatar</h3><p>Boy or girl, lots of styles. Earn tokens, stars and a 🔥 streak.</p></Link>
      </section>
    </>
  );
}
