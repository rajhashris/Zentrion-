import { Link } from "react-router-dom";
import { departments } from "../data.jsx";
import { missions } from "../missions.js";
import { formulas } from "../content.js";

const board = [["CSE", 1240], ["ECE", 1180], ["EEE", 1120], ["MECH", 1050], ["CIVIL", 980], ["AI&DS", 940]];
const top = [["Kavin", "CSE", 1240], ["Divya", "ECE", 1180], ["Suresh", "EEE", 1120], ["Anitha", "MECH", 1050], ["Karthik", "CIVIL", 980]];
const col = c => departments.find(d => d.code === c)?.color;

export function Leaderboard() {
  return (
    <section className="domain">
      <h1>Leaderboard</h1>
      <p className="lead">Branches compete on XP from solved problems and quizzes. Sample data for the prototype.</p>
      <div className="bench wide">
        <h2>Branch ranking</h2>
        <div className="bars">{board.map(([c, xp]) => <div key={c} className="bar"><span>{c}</span><i style={{ width: `${xp / 1240 * 100}%`, background: col(c) }} /><b>{xp} XP</b></div>)}</div>
      </div>
      <div className="bench wide">
        <h2>Top learners this week</h2>
        {top.map(([n, c, xp], i) => <div key={n} className="out" style={{ "--c": col(c), marginTop: 8 }}><span>{i + 1}. {n} ({c})</span><strong>{xp} XP</strong></div>)}
      </div>
    </section>
  );
}

export function Learn() {
  return (
    <section className="domain">
      <h1>Learn</h1>
      <p className="lead">Pick your branch, read the key ideas, then practise them.</p>
      <div className="pcards">
        {departments.map(d => {
          const m = missions.find(x => x.dept === d.id);
          return (
            <div key={d.id} className="pcard" style={{ "--c": d.color }}>
              <span className="code">{d.code}</span>
              <h3>{d.name}</h3>
              <ul className="topics">{d.topics.map(t => <li key={t}>{t}</li>)}</ul>
              {formulas[d.id].map(([n, f]) => <p key={n}><b>{n}:</b> {f}</p>)}
              <div className="pills" style={{ marginTop: 10 }}>
                <Link to={`/domain/${d.id}`} className="pillbtn">Workbench</Link>
                <Link to={`/practice?dept=${d.id}`} className="pillbtn">Practise</Link>
                {m && <Link to={`/missions/${m.id}`} className="pillbtn">{m.icon} Mission</Link>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="domain">
      <h1>About Zentrion</h1>
      <p className="lead">Zentrion is one common platform for engineering students. CSE, ECE, Mechanical, EEE, Civil and AI &amp; DS students all learn and practice in one place.</p>
      <div className="bench wide">
        <h2>What makes it different</h2>
        <p className="hint">Every branch gets its own workbench, quizzes, and code practice that fits what that branch actually needs, from circuit maths to beam loads to data analysis. Build a doodle avatar, climb the leaderboard, and learn at your own pace.</p>
      </div>
    </section>
  );
}
