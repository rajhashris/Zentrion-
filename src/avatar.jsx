import { useState, useEffect } from "react";
import { loadGame, buy, record, rewardText } from "./game.js";

const KEY = "zentrion-avatar";
export const defaults = { gender: "boy", skin: "#F2C7A5", hair: "short", hairColor: "#3B2A20", acc: "none", shirt: "#2563EB", outfit: "tee", mood: "smile", bg: "none" };
export const loadAvatar = () => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return defaults; } };
const cost = { crown: 20, wizard: 30 };

export function Avatar({ cfg, size = 64 }) {
  const { gender, skin, hair, hairColor: hc, acc, shirt, outfit, mood, bg } = cfg;
  const girl = gender === "girl";
  const ink = "#1F2937";
  const puff = (pts, r) => pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={r} fill={hc} />);
  return (
    <svg className="avatar" viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Your avatar">
      {bg && bg !== "none" && <circle cx="60" cy="60" r="60" fill={bg} />}
      <path d="M18 120 Q18 90 60 90 Q102 90 102 120Z" fill={shirt} />
      {outfit === "hoodie" && <><path d="M32 94 Q60 76 88 94" fill="none" stroke="#00000040" strokeWidth="7" strokeLinecap="round" /><path d="M54 98 v14 M66 98 v14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" /></>}
      {outfit === "shirt" && <path d="M46 90 L60 106 L54 114 L40 94Z M74 90 L60 106 L66 114 L80 94Z" fill="#fff" />}
      {outfit === "kurta" && <><path d="M50 90 Q60 106 70 90Z" fill={skin} /><path d="M50 90 Q60 106 70 90" fill="none" stroke="#FACC15" strokeWidth="3" /><circle cx="60" cy="110" r="2" fill="#FACC15" /><circle cx="60" cy="116" r="2" fill="#FACC15" /></>}
      <rect x="52" y="74" width="16" height="20" fill={skin} />
      {hair === "long" && <><rect x="26" y="40" width="14" height="50" rx="7" fill={hc} /><rect x="80" y="40" width="14" height="50" rx="7" fill={hc} /></>}
      {hair === "bob" && <><rect x="26" y="38" width="14" height="36" rx="7" fill={hc} /><rect x="80" y="38" width="14" height="36" rx="7" fill={hc} /></>}
      {hair === "pigtails" && <><circle cx="22" cy="68" r="11" fill={hc} /><circle cx="98" cy="68" r="11" fill={hc} /></>}
      {hair === "pony" && <path d="M86 46 Q114 44 108 86 Q98 66 88 62Z" fill={hc} />}
      {hair === "bun" && <circle cx="60" cy="16" r="11" fill={hc} />}
      {hair === "afro" && puff([[30, 46], [34, 30], [46, 20], [60, 17], [74, 20], [86, 30], [90, 46]], 15)}
      <circle cx="31" cy="58" r="5" fill={skin} /><circle cx="89" cy="58" r="5" fill={skin} />
      {girl && <><circle cx="31" cy="66" r="2.5" fill="#FACC15" /><circle cx="89" cy="66" r="2.5" fill="#FACC15" /></>}
      <circle cx="60" cy="54" r="30" fill={skin} />
      {hair === "curly" && puff([[36, 38], [48, 28], [60, 25], [72, 28], [84, 38]], 13)}
      {hair === "spiky" && <path d="M30 50 L34 22 L44 38 L52 16 L60 36 L70 16 L76 38 L86 22 L90 50 Q80 36 60 36 Q40 36 30 50Z" fill={hc} />}
      {["short", "long", "bob", "bun", "pony", "pigtails"].includes(hair) && <path d="M30 52 Q30 20 60 20 Q90 20 90 52 Q80 36 60 36 Q40 36 30 52Z" fill={hc} />}
      {girl
        ? <><path d="M42 49 Q48 45 54 49 M66 49 Q72 45 78 49" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" /><path d="M43 53 l-3 -2 M77 53 l3 -2" stroke={ink} strokeWidth="2" strokeLinecap="round" /></>
        : <path d="M41 48 h14 M65 48 h14" stroke={hair === "none" ? ink : hc} strokeWidth="4" strokeLinecap="round" />}
      {mood === "starry"
        ? <><text x="48" y="62" textAnchor="middle" fontSize="15" fill="#F59E0B">★</text><text x="72" y="62" textAnchor="middle" fontSize="15" fill="#F59E0B">★</text></>
        : <><circle cx="48" cy="57" r="3.5" fill={ink} />
          {mood === "wink" ? <path d="M68 57 h8" stroke={ink} strokeWidth="3" strokeLinecap="round" /> : <circle cx="72" cy="57" r="3.5" fill={ink} />}</>}
      <circle cx="41" cy="67" r="5" fill="#F9A8D4" opacity=".55" /><circle cx="79" cy="67" r="5" fill="#F9A8D4" opacity=".55" />
      {mood === "grin"
        ? <path d="M48 67 Q60 87 72 67Z" fill="#fff" stroke={ink} strokeWidth="2.5" strokeLinejoin="round" />
        : <path d="M50 69 Q60 79 70 69" fill="none" stroke={girl ? "#BE185D" : ink} strokeWidth="3" strokeLinecap="round" />}
      {acc === "glasses" && <g fill="none" stroke={ink} strokeWidth="3"><circle cx="48" cy="57" r="10" /><circle cx="72" cy="57" r="10" /><path d="M58 57 h4" /></g>}
      {acc === "headphones" && <g><path d="M29 56 Q29 18 60 18 Q91 18 91 56" fill="none" stroke="#334155" strokeWidth="6" /><rect x="22" y="48" width="11" height="20" rx="5" fill="#334155" /><rect x="87" y="48" width="11" height="20" rx="5" fill="#334155" /></g>}
      {acc === "hardhat" && <g><path d="M30 42 Q30 14 60 14 Q90 14 90 42Z" fill="#FACC15" /><rect x="24" y="40" width="72" height="8" rx="4" fill="#EAB308" /></g>}
      {acc === "cap" && <g><path d="M30 44 Q30 16 60 16 Q90 16 90 44Z" fill="#EF4444" /><rect x="58" y="38" width="48" height="8" rx="4" fill="#B91C1C" /></g>}
      {acc === "crown" && <path d="M36 30 L40 8 L51 22 L60 6 L69 22 L80 8 L84 30Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" strokeLinejoin="round" />}
      {acc === "wizard" && <g><path d="M32 40 L62 3 L88 40Z" fill="#6D28D9" /><rect x="26" y="36" width="68" height="8" rx="4" fill="#5B21B6" /><circle cx="62" cy="24" r="3" fill="#FDE68A" /></g>}
    </svg>
  );
}

const colors = {
  skin: ["#F8D9BF", "#F2C7A5", "#D9A06F", "#B5754A", "#8A5233"],
  hairColor: ["#1F1A17", "#3B2A20", "#8A5A2B", "#C9A24B", "#B23A48", "#6D4AC9"],
  shirt: ["#2563EB", "#15803D", "#EA580C", "#DB2777", "#7C3AED", "#0F172A"],
  bg: ["none", "#FDE68A", "#BBF7D0", "#BFDBFE", "#FBCFE8", "#DDD6FE"],
};
const lists = {
  gender: ["boy", "girl"],
  hair: ["short", "long", "bob", "pony", "pigtails", "bun", "curly", "spiky", "afro", "none"],
  outfit: ["tee", "hoodie", "shirt", "kurta"],
  acc: ["none", "glasses", "headphones", "hardhat", "cap", "crown", "wizard"],
  mood: ["smile", "grin", "wink", "starry"],
};
const titles = { gender: "I am a", skin: "Skin tone", hair: "Hair style", hairColor: "Hair colour", outfit: "Outfit", shirt: "Outfit colour", acc: "Accessory", mood: "Mood", bg: "Background" };

export function AvatarStudio() {
  const [cfg, setCfg] = useState(loadAvatar());
  const [g, setG] = useState(loadGame());
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const f = () => setG(loadGame());
    window.addEventListener("zgame", f);
    return () => window.removeEventListener("zgame", f);
  }, []);
  const set = (k, v) => { setCfg({ ...cfg, [k]: v }); setMsg(""); };
  const choose = (k, v) => {
    if (k === "gender") {
      const girl = v === "girl";
      const hair = girl && ["short", "spiky"].includes(cfg.hair) ? "long" : !girl && ["long", "pony", "pigtails", "bob"].includes(cfg.hair) ? "short" : cfg.hair;
      setCfg({ ...cfg, gender: v, hair });
      setMsg("");
      return;
    }
    const c = cost[v];
    if (c && !g.owned.includes(v)) {
      if (!buy(v, c)) { setMsg(`You need ${c} tokens to unlock ${v}. Finish missions to earn more.`); return; }
      setCfg({ ...cfg, [k]: v });
      setMsg(`Unlocked ${v}!`);
      return;
    }
    set(k, v);
  };
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(cfg)); } catch {}
    window.dispatchEvent(new Event("zavatar"));
    const r = record("avatar", "saved");
    setMsg("Saved!" + (r ? " " + rewardText(r) : ""));
  };
  return (
    <section className="domain">
      <h1>Your avatar</h1>
      <p className="lead">Make it look like you. Earn tokens from missions to unlock special items.</p>
      <div className="studio">
        <div className="bench prev">
          <Avatar cfg={cfg} size={220} />
          <p className="hint">🪙 {g.tokens} tokens</p>
          <button className="run" onClick={save}>Save avatar</button>
          {msg && <p role="status" className="hint">{msg}</p>}
        </div>
        <div className="bench">
          {Object.keys(titles).map(k => (
            <div key={k} className="opt-row">
              <h2>{titles[k]}</h2>
              {colors[k]
                ? <div className="swatches">{colors[k].map(c => <button key={c} className="sw" style={{ background: c === "none" ? "#fff" : c }} aria-label={`${titles[k]} ${c}`} aria-pressed={cfg[k] === c} onClick={() => set(k, c)} />)}</div>
                : <div className="pills">{lists[k].map(v => <button key={v} className="pillbtn" aria-pressed={cfg[k] === v} onClick={() => choose(k, v)}>{cost[v] && !g.owned.includes(v) ? `🔒 ${v} (${cost[v]})` : v}</button>)}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
