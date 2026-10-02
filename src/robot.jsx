export function Robot({ size = 60, mood = "idle" }) {
  const eyes = mood === "think"
    ? <><rect x="42" y="53" width="12" height="4" rx="2" fill="#22D3EE" /><rect x="66" y="53" width="12" height="4" rx="2" fill="#22D3EE" /></>
    : <><circle cx="48" cy="55" r="5" fill="#22D3EE" /><circle cx="72" cy="55" r="5" fill="#22D3EE" /></>;
  return (
    <svg className={"robot " + mood} viewBox="0 0 120 120" width={size} height={size} role="img" aria-label="Helper robot">
      <circle cx="60" cy="12" r="6" fill="#F59E0B" /><rect x="58" y="16" width="4" height="14" fill="#64748B" />
      <rect x="22" y="30" width="76" height="58" rx="16" fill="#E2E8F0" stroke="#475569" strokeWidth="4" />
      <rect x="12" y="48" width="10" height="22" rx="5" fill="#94A3B8" /><rect x="98" y="48" width="10" height="22" rx="5" fill="#94A3B8" />
      <rect x="32" y="40" width="56" height="34" rx="12" fill="#0F172A" />
      {eyes}
      {mood === "talk"
        ? <ellipse cx="60" cy="66" rx="8" ry="4" fill="#22D3EE" />
        : <path d="M50 65 Q60 71 70 65" fill="none" stroke="#22D3EE" strokeWidth="3" strokeLinecap="round" />}
      <rect x="38" y="92" width="44" height="22" rx="8" fill="#94A3B8" stroke="#475569" strokeWidth="3" />
      <circle cx="60" cy="103" r="4" fill="#22D3EE" />
    </svg>
  );
}
