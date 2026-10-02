import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { departments } from "../data.jsx";
import { readProfile, signIn } from "../hooks.js";

export default function Auth({ signup }) {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const [f, setF] = useState({ name: "", email: "", dept: "cse", pw: "", role: sp.get("role") === "faculty" ? "faculty" : "student" });
  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = e => {
    e.preventDefault();
    const prev = readProfile() || {};
    const user = signup
      ? { ...prev, name: f.name, email: f.email, dept: f.dept, role: f.role }
      : { ...prev, name: prev.name || f.email.split("@")[0], dept: prev.dept || "cse", role: f.role };
    signIn(user);
    nav(user.role === "faculty" ? "/faculty" : "/dashboard");
  };
  return (
    <section className="authwrap">
      <form className="form" onSubmit={submit}>
        <p className="eyebrow">{signup ? "CREATE ACCOUNT" : "WELCOME BACK"}</p>
        <h1>{signup ? "Create your account" : "Sign in to Zentrion"}</h1>
        <div>
          <b className="lbl">{signup ? "I am a" : "Sign in as"}</b>
          <div className="roles small" role="group" aria-label="Role">
            {[["student", "🎓", "Student"], ["faculty", "🧑‍🏫", "Faculty"]].map(([v, ic, l]) => (
              <button type="button" key={v} className="rolebtn" aria-pressed={f.role === v} onClick={() => setF({ ...f, role: v })}><span aria-hidden="true">{ic}</span>{l}</button>
            ))}
          </div>
        </div>
        {signup && <label>Full name<input required value={f.name} onChange={set("name")} /></label>}
        <label>Email<input type="email" required value={f.email} onChange={set("email")} /></label>
        {signup && (
          <label>{f.role === "faculty" ? "Department you teach" : "Department"}
            <select value={f.dept} onChange={set("dept")}>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
          </label>
        )}
        <label>Password<input type="password" required minLength={6} value={f.pw} onChange={set("pw")} /></label>
        <button className="run" type="submit">{signup ? "Create account" : "Sign in"}</button>
        <p className="swap">{signup ? <>Already have an account? <Link to={`/login?role=${f.role}`}>Sign in</Link></> : <>New here? <Link to={`/signup?role=${f.role}`}>Sign up</Link></>}</p>
        <small>Prototype only: nothing is sent to a server.</small>
      </form>
    </section>
  );
}
