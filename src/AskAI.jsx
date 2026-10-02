import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { answer } from "./ai.js";
import { Robot } from "./robot.jsx";
import { record, rewardText } from "./game.js";

export default function AskAI() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ from: "bot", t: "Beep boop! Ask me a doubt about a formula or concept." }]);
  const [q, setQ] = useState("");
  const [mood, setMood] = useState("idle");
  const [wave, setWave] = useState(true);
  const { pathname } = useLocation();
  const end = useRef(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [msgs, open]);
  useEffect(() => { const t = setTimeout(() => setWave(false), 3200); return () => clearTimeout(t); }, []);
  const toggle = () => {
    setOpen(!open);
    if (!open) { setMood("talk"); setTimeout(() => setMood("idle"), 1600); }
  };
  const send = e => {
    e.preventDefault();
    const t = q.trim();
    if (!t) return;
    const id = pathname.startsWith("/domain/") ? pathname.split("/")[2] : null;
    setMsgs(m => [...m, { from: "me", t }]);
    setQ("");
    setMood("think");
    const r = record("doubt", t.toLowerCase());
    setTimeout(() => {
      setMsgs(m => [...m, { from: "bot", t: answer(t, id) + (r ? `\n${rewardText(r)}` : "") }]);
      setMood("talk");
      setTimeout(() => setMood("idle"), 1600);
    }, 900);
  };
  return (
    <>
      {open && (
        <div className="askpanel" role="dialog" aria-label="Doubt helper">
          <div className="askhead">
            <div className={"askav " + mood}>
              <Robot size={60} mood={mood} />
              {mood === "think" && <span className="bubble">…</span>}
            </div>
            <b>Doubt helper</b>
            <button onClick={() => setOpen(false)} aria-label="Close helper">×</button>
          </div>
          <small>Prototype: answers come from the built-in formula and concept library.</small>
          <div className="askmsgs" role="log">{msgs.map((m, i) => <p key={i} className={m.from}>{m.t}</p>)}<div ref={end} /></div>
          <form onSubmit={send}>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Type your doubt…" aria-label="Your doubt" />
            <button className="run" type="submit">Send</button>
          </form>
        </div>
      )}
      <button className="askfab" onClick={toggle} aria-expanded={open}>
        <span className={"fabav" + (wave ? " av-wave" : "")}><Robot size={34} mood={mood} /></span>
        {open ? "Close" : "Ask a doubt"}
      </button>
    </>
  );
}
