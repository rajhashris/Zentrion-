import { useState, useEffect } from "react";
import { Avatar, loadAvatar } from "./avatar.jsx";
import { record, rewardText, shower, logAttempt } from "./game.js";
import { diagnose } from "./diagnose.js";

export function Calc({ cfg }) {
  const [s, setS] = useState(Object.fromEntries(cfg.fields.map(f => [f.k, String(f.def)])));
  const v = Object.fromEntries(cfg.fields.map(f => [f.k, f.text ? s[f.k] : parseFloat(s[f.k])]));
  return (
    <div className="bench">
      <h2>{cfg.title}</h2>
      <p className="hint">{cfg.hint}</p>
      <div className="fields">
        {cfg.fields.map(f => (
          <label key={f.k}>{f.label}{f.unit ? ` (${f.unit})` : ""}
            <input value={s[f.k]} inputMode={f.text ? "text" : "decimal"} onChange={e => setS({ ...s, [f.k]: e.target.value })} />
          </label>
        ))}
      </div>
      <div className="outs">
        {cfg.out.map(o => {
          const r = o.fn(v);
          const ok = typeof r === "string" || Number.isFinite(r);
          return <div key={o.label} className="out"><span>{o.label}</span><strong>{!ok ? "Check your inputs" : typeof r === "string" ? r : `${+r.toFixed(3)}${o.unit ? " " + o.unit : ""}`}</strong></div>;
        })}
      </div>
    </div>
  );
}

const same = (got, exp) => typeof exp === "number" ? typeof got === "number" && Math.abs(got - exp) < 0.01 : JSON.stringify(got) === JSON.stringify(exp);
const pick = a => a[Math.floor(Math.random() * a.length)];
const wins = ["Brilliant! Every test passed.", "Nailed it! Your logic is solid.", "Boom! All tests green. Keep the streak going.", "Great work, engineer! Ready for the next one?"];
const near = n => pick([`Good progress! ${n} more to go. You are close.`, "Almost there. Check the failing case and try again.", "You are on the right track. One more tweak!"]);
const retry = ["Do not worry, every engineer debugs. Read the explanation below and try again.", "Not yet, but you are learning. Check the first failing test."];

export function Cheer({ msg, win, reward }) {
  return (
    <div className={"cheer" + (win ? " win" : "")} role="status">
      <Avatar cfg={{ ...loadAvatar(), mood: win ? "grin" : "smile" }} size={64} />
      <p>{msg}{win ? " 🎉" : ""}{reward ? <><br /><span className="reward">{reward}</span></> : null}</p>
    </div>
  );
}

export function CodeRunner({ prob, onPass }) {
  const [code, setCode] = useState(prob.starter);
  const [res, setRes] = useState(null);
  const [h, setH] = useState(0);
  const [t0] = useState(() => Date.now());
  const hints = prob.hints || [];
  const topic = prob.topic || "General";
  const run = () => {
    try {
      const fn = new Function(code + "\nreturn solve;")();
      const rows = prob.tests.map(([args, exp]) => {
        let got, err;
        try { got = fn(...args); } catch (e) { got = "error"; err = e.message; }
        const row = { call: `solve(${args.map(a => JSON.stringify(a)).join(", ")})`, exp, got, err, ok: same(got, exp) };
        return { ...row, why: row.ok ? "" : diagnose(row) };
      });
      const okc = rows.filter(r => r.ok).length;
      const win = okc === rows.length;
      logAttempt({ key: prob.title, topic, level: prob.level, ok: win, ms: Date.now() - t0 });
      let reward = "";
      if (win) { reward = rewardText(record("code", prob.title)); shower(); onPass?.(); }
      setRes({ rows, reward, trap: win ? "" : prob.trap, msg: win ? pick(wins) : okc > 0 ? near(rows.length - okc) : pick(retry) });
    } catch (e) {
      logAttempt({ key: prob.title, topic, level: prob.level, ok: false, ms: 0 });
      setRes({ err: /solve is not defined/.test(e.message) ? "Your function must be named solve." : `Your code has a syntax problem: ${e.message}. Check brackets, quotes and spelling.` });
    }
  };
  const passed = res?.rows?.filter(r => r.ok).length;
  return (
    <div className="bench">
      <h2>{prob.title} <small className="lvl">{prob.level}</small></h2>
      <p className="hint">{prob.hint}</p>
      <textarea spellCheck="false" value={code} onChange={e => setCode(e.target.value)} aria-label="Code editor" />
      <div className="pills" style={{ marginTop: 12 }}>
        <button className="run" style={{ marginTop: 0 }} onClick={run}>Run tests</button>
        {h < hints.length && <button className="pillbtn" onClick={() => setH(h + 1)}>💡 {h === 0 ? "Show a hint" : "Show another hint"}</button>}
      </div>
      {h > 0 && <div className="hintbox">{hints.slice(0, h).map((t, i) => <p key={i}><b>Hint {i + 1}{i === hints.length - 1 ? " (almost the answer)" : ""}:</b> {t}</p>)}</div>}
      {res?.err && <div className="why" role="alert">{res.err}</div>}
      {res?.rows && (
        <>
          <Cheer msg={res.msg} win={passed === res.rows.length} reward={res.reward} />
          {res.trap && <div className="hintbox"><b>Common trap:</b> {res.trap}</div>}
          <div className="outs">
            <div className="out"><span>Result</span><strong>{passed} of {res.rows.length} tests passed</strong></div>
            {res.rows.map((r, k) => (
              <div key={k}>
                <div className={"out " + (r.ok ? "pass" : "fail")}><span>{r.call}</span><strong>{String(r.got)}{r.ok ? "" : ` (expected ${JSON.stringify(r.exp)})`}</strong></div>
                {!r.ok && <p className="why">{r.why}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function Quiz({ qs, topic = "Quiz" }) {
  const [i, setI] = useState(0);
  const [pickd, setPickd] = useState(null);
  const [score, setScore] = useState(0);
  const [reward, setReward] = useState("");
  const done = i >= qs.length;
  const pct = score / qs.length;
  useEffect(() => {
    if (done && pct >= 0.75) setReward(rewardText(record("quiz", qs[0].q)));
  }, [done]);
  if (done) {
    return (
      <div className="bench"><h2>Quiz complete</h2><p className="hint">You scored {score} out of {qs.length}.</p>
        <Cheer win={pct >= 0.75} reward={reward} msg={pct >= 0.75 ? "Excellent! You really know this branch." : pct >= 0.5 ? "Good effort! Try again for a perfect score." : "Keep practising, you will get there."} />
        <button className="run" onClick={() => { setI(0); setPickd(null); setScore(0); setReward(""); }}>Try again</button></div>
    );
  }
  const q = qs[i];
  const choose = k => {
    if (pickd !== null) return;
    setPickd(k);
    const ok = k === q.a;
    logAttempt({ topic, ok });
    if (ok) { setScore(score + 1); shower(); }
  };
  return (
    <div className="bench">
      <p className="hint">Question {i + 1} of {qs.length}</p>
      <h2>{q.q}</h2>
      <div className="opts">
        {q.o.map((t, k) => <button key={k} onClick={() => choose(k)} className={"opt" + (pickd === null ? "" : k === q.a ? " right" : k === pickd ? " wrong" : "")}>{t}</button>)}
      </div>
      {pickd !== null && <p className={pickd === q.a ? "reward" : "why"} role="status">{pickd === q.a ? "Correct! 🎉" : `Not quite. The right answer is "${q.o[q.a]}".`}</p>}
      {pickd !== null && <button className="run" onClick={() => { setI(i + 1); setPickd(null); }}>{i + 1 === qs.length ? "See score" : "Next question"}</button>}
    </div>
  );
}
