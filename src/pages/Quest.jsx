import { useState } from "react";
import { departments } from "../data.jsx";
import { Avatar, loadAvatar } from "../avatar.jsx";
import { record, rewardText, shower } from "../game.js";
import { okAns } from "../check.js";
import { diagnoseAnswer } from "../diagnose.js";

const steps = [
  { id: "civil", title: "Civil: size the deck", text: "A bridge deck beam spans 8 m and carries 20 kN/m. Find the maximum bending moment in kN·m. Formula: M = wL² / 8.", ans: "160", reveal: "Correct! The support reaction R = wL / 2 = 80 kN. That load travels to the next team." },
  { id: "mech", title: "Mech: check the hanger rod", text: "A steel hanger rod carries the 80 kN reaction. Its area is 400 mm². Find the stress in MPa. σ = F / A, with F in newtons.", ans: "200", reveal: "200 MPa is below the 250 MPa limit, so the rod is safe." },
  { id: "eee", title: "EEE: power the sensors", text: "The strain-sensor box runs on 230 V and draws 0.5 A at power factor 0.8. Find its real power in watts.", ans: "92", reveal: "92 W keeps the sensors alive all night." },
  { id: "ece", title: "ECE: read the sensor", text: "A voltage divider with Vin = 5 V, R1 = 1 kΩ and R2 = 4 kΩ feeds the logger. Find Vout in volts.", ans: "4", reveal: "4 V is a clean signal for the logger." },
  { id: "cse", title: "CSE: log the reading", text: "The logger stores the stress value 200 as a binary number. Type that binary number.", ans: "11001000", text: true, reveal: "Stored! 200 in binary is 11001000." },
  { id: "ads", title: "AI & DS: judge the health", text: "The last four readings in MPa are 190, 200, 210 and 200. Find the mean. A mean of 220 or less means the bridge is healthy.", ans: "200", reveal: "Mean = 200 MPa, so the bridge is healthy." },
];
const col = id => departments.find(d => d.id === id)?.color;

export default function Quest() {
  const [step, setStep] = useState(() => { try { return Math.min(+localStorage.getItem("zentrion-quest") || 0, steps.length); } catch { return 0; } });
  const [val, setVal] = useState("");
  const [solved, setSolved] = useState("");
  const [wrong, setWrong] = useState(false);
  const goTo = n => { setStep(n); setVal(""); setSolved(""); setWrong(false); try { localStorage.setItem("zentrion-quest", String(n)); } catch {} };
  const s = steps[step];
  const check = e => {
    e.preventDefault();
    if (!okAns(val, s)) { setWrong(true); return; }
    const r = record("bridge", s.id);
    setWrong(false);
    setSolved(s.reveal + (r ? " " + rewardText(r) : ""));
    shower();
  };
  return (
    <section className="domain">
      <p className="eyebrow">CROSS-BRANCH QUEST</p>
      <h1>The Bridge Chain</h1>
      <p className="lead">One bridge, six branches. Each team's answer unlocks the next team's job, so nobody can finish it alone.</p>
      <ol className="chain" aria-label="Quest progress">
        {steps.map((x, i) => <li key={x.id} style={{ "--c": col(x.id) }} className={i < step || (i === step && solved) ? "done" : i === step ? "now" : ""}>{x.id.toUpperCase()}</li>)}
      </ol>
      {step >= steps.length ? (
        <div className="bench wide" style={{ "--c": "#15803D" }}>
          <div className="cheer win"><Avatar cfg={{ ...loadAvatar(), acc: "hardhat", mood: "grin" }} size={80} /><p>Bridge approved! Six branches built one structure together. 🎉</p></div>
          <button className="run" onClick={() => goTo(0)}>Play again</button>
        </div>
      ) : (
        <form className="bench wide" style={{ "--c": col(s.id) }} onSubmit={check}>
          <h2>Step {step + 1}: {s.title}</h2>
          <p className="hint">{s.text}</p>
          <label>Your answer<input value={val} onChange={e => { setVal(e.target.value); setWrong(false); }} disabled={!!solved} inputMode="decimal" /></label>
          {wrong && <p className="err" role="alert">{diagnoseAnswer(val, s)}</p>}
          {!solved && <button className="run" type="submit">Check answer</button>}
          {solved && (
            <>
              <div className="cheer win" role="status"><Avatar cfg={{ ...loadAvatar(), mood: "grin" }} size={56} /><p>{solved}</p></div>
              <button type="button" className="run" onClick={() => goTo(step + 1)}>{step === steps.length - 1 ? "Finish the quest" : "Pass to the next team"}</button>
            </>
          )}
        </form>
      )}
    </section>
  );
}
