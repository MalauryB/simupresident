import { useState, useMemo } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = { dark: "#475465", mid: "#556C96", light: "#B6CDE8", cream: "#EEEDFF", accent: "#FF584D" };

const PARTY_COLORS = {
  RN: { bg: "#1B2A4A", fg: "#EEEDFF", accent: "#002395", chart: "#002395" },
  LFI: { bg: "#CC2443", fg: "#FFFFFF", accent: "#E63946", chart: "#E63946" },
  REN: { bg: "#FFD600", fg: "#1a1a1a", accent: "#FFB800", chart: "#FFB800" },
  LR: { bg: "#0066CC", fg: "#FFFFFF", accent: "#004A99", chart: "#0066CC" },
  PS: { bg: "#FF6B9D", fg: "#FFFFFF", accent: "#E0476E", chart: "#FF6B9D" },
  EELV: { bg: "#00A86B", fg: "#FFFFFF", accent: "#008C57", chart: "#00A86B" },
  HOR: { bg: "#00C2D1", fg: "#FFFFFF", accent: "#009DAA", chart: "#00C2D1" },
  REC: { bg: "#8B5CF6", fg: "#FFFFFF", accent: "#7C3AED", chart: "#8B5CF6" },
};

const PARTIES = [
  {
    tag: "RN", party: "Rassemblement National", active: true, selectedIdx: 0, variants: [
      { name: "Jordan Bardella", initials: "JB", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.65, left: 0.1, center: 0.2, right: 0.7, barrage: 0.4, startAgrege: 28, startDebiaise: 26, startCustom: 28 },
      { name: "Marine Le Pen", initials: "MLP", polled: true, pollGroup: null, attractivite: 0.55, tendance: 0.5, left: 0.08, center: 0.22, right: 0.7, barrage: 0.45, startAgrege: 30, startDebiaise: 28, startCustom: 30 },
    ]
  },
  {
    tag: "LFI", party: "La France Insoumise", active: true, selectedIdx: 0, variants: [
      { name: "Jean-Luc Mélenchon", initials: "JLM", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.35, left: 0.8, center: 0.15, right: 0.05, barrage: 0.35, startAgrege: 12, startDebiaise: 14, startCustom: 12 },
      { name: "Mathilde Panot", initials: "MP", polled: false, pollGroup: "LFI / NUPES", attractivite: 0.4, tendance: 0.45, left: 0.75, center: 0.2, right: 0.05, barrage: 0.3, startAgrege: 9, startDebiaise: 10, startCustom: 9 },
    ]
  },
  {
    tag: "REN", party: "Renaissance", active: true, selectedIdx: 0, variants: [
      { name: "Gabriel Attal", initials: "GA", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.4, left: 0.15, center: 0.7, right: 0.15, barrage: 0.1, startAgrege: 18, startDebiaise: 16, startCustom: 18 },
      { name: "Gérald Darmanin", initials: "GD", polled: false, pollGroup: "Majorité présidentielle", attractivite: 0.35, tendance: 0.35, left: 0.1, center: 0.55, right: 0.35, barrage: 0.2, startAgrege: 15, startDebiaise: 14, startCustom: 15 },
    ]
  },
  {
    tag: "LR", party: "Les Républicains", active: true, selectedIdx: 0, variants: [
      { name: "Bruno Retailleau", initials: "BR", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.55, left: 0.05, center: 0.35, right: 0.6, barrage: 0.25, startAgrege: 8, startDebiaise: 9, startCustom: 8 },
      { name: "Laurent Wauquiez", initials: "LW", polled: true, pollGroup: null, attractivite: 0.45, tendance: 0.5, left: 0.05, center: 0.4, right: 0.55, barrage: 0.2, startAgrege: 9, startDebiaise: 9, startCustom: 9 },
    ]
  },
  {
    tag: "PS", party: "Place Publique / PS", active: true, selectedIdx: 0, variants: [
      { name: "Raphaël Glucksmann", initials: "RG", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.6, left: 0.6, center: 0.35, right: 0.05, barrage: 0.08, startAgrege: 10, startDebiaise: 11, startCustom: 10 },
    ]
  },
  {
    tag: "EELV", party: "Les Écologistes", active: true, selectedIdx: 0, variants: [
      { name: "Marine Tondelier", initials: "MT", polled: false, pollGroup: "EELV / Pôle écologiste", attractivite: 0.5, tendance: 0.55, left: 0.55, center: 0.4, right: 0.05, barrage: 0.1, startAgrege: 5, startDebiaise: 6, startCustom: 5 },
    ]
  },
  {
    tag: "HOR", party: "Horizons", active: true, selectedIdx: 0, variants: [
      { name: "Édouard Philippe", initials: "ÉP", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.7, left: 0.1, center: 0.6, right: 0.3, barrage: 0.08, startAgrege: 14, startDebiaise: 13, startCustom: 14 },
    ]
  },
  {
    tag: "REC", party: "Picardie Debout!", active: true, selectedIdx: 0, variants: [
      { name: "François Ruffin", initials: "FR", polled: false, pollGroup: "Gauche dissidente / ex-LFI", attractivite: 0.5, tendance: 0.45, left: 0.7, center: 0.25, right: 0.05, barrage: 0.12, startAgrege: 5, startDebiaise: 5, startCustom: 5 },
    ]
  },
];

const POLL_SOURCES = [
  { id: "agrege", label: "Sondage agrégé", desc: "Moyenne pondérée des derniers sondages publiés par les instituts majeurs.", icon: "📊" },
  { id: "debiaise", label: "Sondage débiaisé", desc: "Sondages corrigés des biais historiques des instituts (house effects).", icon: "🎯" },
  { id: "custom", label: "Personnalisable", desc: "Définissez librement les points de départ de chaque candidat.", icon: "✏️" },
];

function getTrendColor(v) { return v >= 0.65 ? "#16a34a" : v >= 0.55 ? "#65a30d" : v >= 0.45 ? "#ca8a04" : v >= 0.35 ? "#ea580c" : "#dc2626"; }
function getTrendLabel(v) { return v >= 0.75 ? "Forte hausse" : v >= 0.6 ? "Hausse" : v >= 0.45 ? "Stable" : v >= 0.3 ? "Baisse" : "Forte baisse"; }
function getSelected(p) { return p.variants[p.selectedIdx]; }

function TrendSparkline({ value, width = 64, height = 28 }) {
  const color = getTrendColor(value);
  const slope = (value - 0.5) * 2;
  const sY = height / 2 + slope * (height * 0.35), eY = height / 2 - slope * (height * 0.35);
  const m1 = sY + (eY - sY) * 0.3 + Math.sin(value * 5) * 4, m2 = sY + (eY - sY) * 0.65 - Math.cos(value * 3) * 3;
  return (<svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: "block" }}>
    <defs><linearGradient id={`tg-${Math.round(value * 100)}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0.02" /></linearGradient></defs>
    <path d={`M 4 ${sY} C ${width * .3} ${m1}, ${width * .55} ${m2}, ${width - 4} ${eY} L ${width - 4} ${height} L 4 ${height} Z`} fill={`url(#tg-${Math.round(value * 100)})`} />
    <path d={`M 4 ${sY} C ${width * .3} ${m1}, ${width * .55} ${m2}, ${width - 4} ${eY}`} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
    <circle cx={width - 4} cy={eY} r="3" fill={color} />
  </svg>);
}
function TrendArrow({ value, size = 18 }) {
  const color = getTrendColor(value), rot = (1 - value) * 180 - 90;
  return (<div style={{ width: size + 8, height: size + 8, borderRadius: "50%", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ transform: `rotate(${rot}deg)`, transition: "transform 0.4s ease" }}><path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
  </div>);
}

/* ─── Reusable UI ─── */
function Slider({ value, onChange, label, color, min = 0, max = 1, step = 0.01 }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (<div style={{ marginBottom: "16px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: COLORS.dark, fontFamily: "'Outfit'" }}>{label}</span>
      <span style={{ fontSize: "13px", fontWeight: 700, color: color || COLORS.accent, fontFamily: "'Space Mono'" }}>{max > 1 ? Math.round(value) : value.toFixed(2)}</span>
    </div>
    <div style={{ position: "relative", height: "28px", display: "flex", alignItems: "center" }}>
      <div style={{ position: "absolute", width: "100%", height: "6px", background: `${COLORS.light}80`, borderRadius: "3px" }} />
      <div style={{ position: "absolute", width: `${pct}%`, height: "6px", background: color || COLORS.accent, borderRadius: "3px" }} />
      <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))} style={{ position: "absolute", width: "100%", height: "28px", opacity: 0, cursor: "pointer", margin: 0, zIndex: 2 }} />
      <div style={{ position: "absolute", left: `calc(${pct}% - 10px)`, width: "20px", height: "20px", borderRadius: "50%", background: "#fff", border: `3px solid ${color || COLORS.accent}`, boxShadow: `0 2px 8px ${(color || COLORS.accent)}40`, pointerEvents: "none" }} />
    </div>
  </div>);
}
function TrendSlider({ value, onChange }) {
  const color = getTrendColor(value), pct = value * 100;
  return (<div style={{ marginBottom: "16px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
      <span style={{ fontSize: "13px", fontWeight: 600, color: COLORS.dark, fontFamily: "'Outfit'" }}>Tendance long terme</span>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color, fontFamily: "'Outfit'", padding: "2px 8px", borderRadius: "6px", background: `${color}15` }}>{getTrendLabel(value)}</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color, fontFamily: "'Space Mono'" }}>{value.toFixed(2)}</span>
      </div>
    </div>
    <div style={{ position: "relative", background: `${color}08`, borderRadius: "14px", padding: "12px 16px", border: `1px solid ${color}20` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <TrendArrow value={value} size={20} />
        <TrendSparkline value={value} width={64} height={28} />
        <div style={{ flex: 1, position: "relative", height: "32px", display: "flex", alignItems: "center" }}>
          <div style={{ position: "absolute", width: "100%", height: "10px", borderRadius: "5px", background: "linear-gradient(90deg,#dc2626,#ea580c,#ca8a04,#65a30d,#16a34a)", opacity: 0.3 }} />
          <div style={{ position: "absolute", width: `${pct}%`, height: "10px", borderRadius: "5px", background: `linear-gradient(90deg,#dc2626,${color})`, opacity: 0.6 }} />
          <div style={{ position: "absolute", left: `calc(${pct}% - 12px)`, width: "24px", height: "24px", borderRadius: "50%", background: "#fff", border: `3px solid ${color}`, boxShadow: `0 2px 10px ${color}50`, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "11px", color, fontWeight: 900 }}>{value >= 0.6 ? "↗" : value >= 0.45 ? "→" : "↘"}</span>
          </div>
          <input type="range" min={0} max={1} step={0.01} value={value} onChange={e => onChange(parseFloat(e.target.value))} style={{ position: "absolute", width: "100%", height: "32px", opacity: 0, cursor: "pointer", margin: 0, zIndex: 2 }} />
        </div>
      </div>
    </div>
  </div>);
}
function TriSlider({ left, center, right, onChange }) {
  const norm = (l, c, r) => { const s = l + c + r; return s === 0 ? { left: .33, center: .34, right: .33 } : { left: +(l / s).toFixed(2), center: +(c / s).toFixed(2), right: +(r / s).toFixed(2) }; };
  const hc = (k, v) => { let l = k === "left" ? v : left, c = k === "center" ? v : center, r = k === "right" ? v : right; onChange(norm(l, c, r)); };
  return (<div>
    <div style={{ marginBottom: "8px" }}><span style={{ fontSize: "13px", fontWeight: 600, color: COLORS.dark, fontFamily: "'Outfit'" }}>Profil idéologique</span></div>
    <div style={{ display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden", marginBottom: "14px" }}>
      <div style={{ width: `${left * 100}%`, background: "#E63946" }} /><div style={{ width: `${center * 100}%`, background: "#FFB800" }} /><div style={{ width: `${right * 100}%`, background: "#0066CC" }} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
      {[{ label: "Gauche", value: left, key: "left", color: "#E63946" }, { label: "Centre", value: center, key: "center", color: "#FFB800" }, { label: "Droite", value: right, key: "right", color: "#0066CC" }].map(i => (<div key={i.key} style={{ textAlign: "center" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: i.color, fontFamily: "'Outfit'" }}>{i.label}</div>
        <div style={{ fontSize: "18px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Space Mono'", background: `${i.color}12`, borderRadius: "10px", padding: "6px 0" }}>{i.value.toFixed(2)}</div>
        <input type="range" min={0} max={1} step={0.01} value={i.value} onChange={e => hc(i.key, parseFloat(e.target.value))} style={{ width: "100%", marginTop: "6px", cursor: "pointer", accentColor: i.color }} />
      </div>))}
    </div>
  </div>);
}
function StepIndicator({ current, labels }) {
  return (<div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
    {labels.map((l, i) => (<div key={i} style={{ display: "flex", alignItems: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: i <= current ? COLORS.accent : `${COLORS.light}60`, color: i <= current ? "#fff" : COLORS.mid, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, fontFamily: "'Outfit'", boxShadow: i === current ? `0 4px 16px ${COLORS.accent}40` : "none" }}>{i < current ? "✓" : i + 1}</div>
        <span style={{ fontSize: "11px", fontWeight: i === current ? 700 : 500, color: i <= current ? COLORS.dark : COLORS.mid, fontFamily: "'Outfit'", whiteSpace: "nowrap" }}>{l}</span>
      </div>
      {i < labels.length - 1 && <div style={{ width: "40px", height: "3px", margin: "0 6px", marginBottom: "20px", background: i < current ? COLORS.accent : `${COLORS.light}60`, borderRadius: "2px" }} />}
    </div>))}
  </div>);
}
function PartySelectCard({ partyData, onToggle, onSwitchVariant }) {
  const pc = PARTY_COLORS[partyData.tag], c = getSelected(partyData), hv = partyData.variants.length > 1;
  return (<div style={{ background: partyData.active ? "#fff" : `${COLORS.light}20`, borderRadius: "16px", overflow: "hidden", border: partyData.active ? `2.5px solid ${pc.accent}` : "2.5px solid transparent", opacity: partyData.active ? 1 : 0.5, transform: partyData.active ? "scale(1)" : "scale(0.97)", boxShadow: partyData.active ? `0 4px 20px ${pc.accent}20` : "0 2px 8px rgba(0,0,0,0.04)", position: "relative", transition: "all 0.3s ease" }}>
    <div onClick={onToggle} style={{ cursor: "pointer", padding: "18px 16px 0", textAlign: "center" }}>
      <div style={{ position: "absolute", top: "10px", right: "10px", width: "24px", height: "24px", borderRadius: "50%", background: partyData.active ? pc.accent : `${COLORS.light}80`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#fff", fontSize: "13px", fontWeight: 700 }}>{partyData.active ? "✓" : ""}</span></div>
      <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `linear-gradient(135deg,${pc.bg},${pc.accent})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", filter: partyData.active ? "none" : "grayscale(0.8)" }}><span style={{ color: pc.fg, fontSize: c.initials.length > 2 ? "14px" : "18px", fontWeight: 800, fontFamily: "'Outfit'" }}>{c.initials}</span></div>
      <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'", lineHeight: 1.2, minHeight: "34px", display: "flex", alignItems: "center", justifyContent: "center" }}>{c.name}</div>
      <div style={{ display: "inline-block", marginTop: "4px", padding: "3px 10px", borderRadius: "100px", fontSize: "11px", fontWeight: 600, fontFamily: "'Outfit'", background: partyData.active ? `${pc.bg}15` : `${COLORS.light}40`, color: partyData.active ? pc.bg : COLORS.mid }}>{partyData.tag}</div>
    </div>
    {hv && partyData.active ? (<div style={{ padding: "10px 10px 12px", marginTop: "8px" }}><div style={{ display: "flex", borderRadius: "10px", overflow: "hidden", background: `${pc.bg}10`, border: `1px solid ${pc.accent}20` }}>
      {partyData.variants.map((v, idx) => { const a = partyData.selectedIdx === idx; return (<button key={idx} onClick={e => { e.stopPropagation(); onSwitchVariant(idx); }} style={{ flex: 1, padding: "7px 4px", border: "none", cursor: "pointer", background: a ? pc.accent : "transparent", color: a ? pc.fg : pc.bg, fontSize: "11px", fontWeight: 700, fontFamily: "'Outfit'", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.name.split(" ").pop()}</button>); })}
    </div></div>) : <div style={{ height: "14px" }} />}
  </div>);
}
function ConfigCard({ partyData, isActive, onClick, onUpdate }) {
  const pc = PARTY_COLORS[partyData.tag], c = getSelected(partyData);
  return (<div style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", border: isActive ? `2.5px solid ${pc.accent}` : "2.5px solid transparent", boxShadow: isActive ? `0 8px 30px ${pc.accent}20` : "0 2px 12px rgba(0,0,0,0.05)" }}>
    <div onClick={onClick} style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: "14px", background: isActive ? `${pc.bg}08` : "transparent", cursor: "pointer" }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `linear-gradient(135deg,${pc.bg},${pc.accent})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: pc.fg, fontSize: c.initials.length > 2 ? "13px" : "16px", fontWeight: 800, fontFamily: "'Outfit'" }}>{c.initials}</span></div>
      <div style={{ flex: 1 }}><div style={{ fontSize: "15px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'" }}>{c.name}</div><div style={{ fontSize: "12px", color: COLORS.mid, fontFamily: "'Outfit'" }}>{partyData.party}</div></div>
      {!isActive && <TrendSparkline value={c.tendance} width={40} height={20} />}
      <div style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease", fontSize: "18px", color: COLORS.mid }}>▾</div>
    </div>
    <div style={{ maxHeight: isActive ? "650px" : "0", overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
      <div style={{ padding: "4px 20px 20px", borderTop: `1px solid ${COLORS.light}40` }}>
        <div style={{ height: "16px" }} />
        <Slider label="Attractivité" value={c.attractivite} color={pc.accent} onChange={v => onUpdate("attractivite", v)} />
        <Slider label="Taux de barrage" value={c.barrage} color={COLORS.accent} onChange={v => onUpdate("barrage", v)} />
        <TrendSlider value={c.tendance} onChange={v => onUpdate("tendance", v)} />
        <div style={{ height: "4px" }} />
        <TriSlider left={c.left} center={c.center} right={c.right} onChange={({ left, center, right }) => onUpdate("ideology", { left, center, right })} />
      </div>
    </div>
  </div>);
}
function StartingPointRow({ partyData, source, onUpdate }) {
  const pc = PARTY_COLORS[partyData.tag], c = getSelected(partyData), isC = source === "custom";
  const val = source === "agrege" ? c.startAgrege : source === "debiaise" ? c.startDebiaise : c.startCustom;
  return (<div style={{ background: "#fff", borderRadius: "16px", padding: "16px 20px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "14px", border: !c.polled ? "1.5px solid #FFB80040" : "1.5px solid transparent" }}>
    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `linear-gradient(135deg,${pc.bg},${pc.accent})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><span style={{ color: pc.fg, fontSize: c.initials.length > 2 ? "12px" : "15px", fontWeight: 800, fontFamily: "'Outfit'" }}>{c.initials}</span></div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}><span style={{ fontSize: "14px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'" }}>{c.name}</span>{!c.polled && <span style={{ padding: "2px 8px", borderRadius: "6px", background: "#FFF3CD", fontSize: "10px", fontWeight: 700, color: "#856404", fontFamily: "'Outfit'" }}>⚠ estimation</span>}</div>
      <div style={{ fontSize: "11px", color: COLORS.mid, fontFamily: "'Outfit'" }}>{partyData.tag}</div>
    </div>
    {isC ? (<div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "160px" }}>
      <input type="range" min={0} max={50} step={0.5} value={c.startCustom} onChange={e => onUpdate("startCustom", parseFloat(e.target.value))} style={{ flex: 1, cursor: "pointer", accentColor: pc.accent }} />
      <span style={{ fontFamily: "'Space Mono'", fontSize: "15px", fontWeight: 800, color: COLORS.dark, minWidth: "48px", textAlign: "right" }}>{c.startCustom.toFixed(1)}%</span>
    </div>) : (<div style={{ padding: "6px 16px", borderRadius: "10px", background: `${pc.accent}12`, fontFamily: "'Space Mono'", fontSize: "16px", fontWeight: 800, color: pc.accent }}>{val}%</div>)}
  </div>);
}
function ReviewTable({ activeParties, source }) {
  const cs = { fontSize: "10px", fontWeight: 700, color: COLORS.mid, fontFamily: "'Outfit'", textTransform: "uppercase", letterSpacing: "0.5px", padding: "0 4px", textAlign: "center" };
  const cl = { padding: "3px 6px", borderRadius: "6px", fontSize: "11px", fontFamily: "'Space Mono'", fontWeight: 700, textAlign: "center", whiteSpace: "nowrap" };
  return (<div style={{ background: "#fff", borderRadius: "20px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}>
    <div style={{ display: "grid", gridTemplateColumns: "44px 1fr 50px 56px 56px 56px 56px 90px", gap: "6px", alignItems: "center", padding: "14px 18px 10px", borderBottom: `1.5px solid ${COLORS.light}30` }}>
      <div /><div style={{ ...cs, textAlign: "left" }}>Candidat</div><div style={cs}>Départ</div><div style={cs}>Attrac.</div><div style={cs}>Barrage</div><div style={cs}>Tend.</div><div style={{ ...cs, fontSize: "9px" }}>Tendance</div><div style={cs}>Idéologie</div>
    </div>
    {activeParties.map((p, i) => {
      const pc = PARTY_COLORS[p.tag], c = getSelected(p), sv = source === "agrege" ? c.startAgrege : source === "debiaise" ? c.startDebiaise : c.startCustom, tc = getTrendColor(c.tendance); return (
        <div key={p.tag} style={{ display: "grid", gridTemplateColumns: "44px 1fr 50px 56px 56px 56px 56px 90px", gap: "6px", alignItems: "center", padding: "12px 18px", borderBottom: i === activeParties.length - 1 ? "none" : `1px solid ${COLORS.light}18` }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg,${pc.bg},${pc.accent})`, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: pc.fg, fontSize: c.initials.length > 2 ? "11px" : "13px", fontWeight: 800, fontFamily: "'Outfit'" }}>{c.initials}</span></div>
          <div><div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'" }}>{c.name}</div><div style={{ fontSize: "10px", color: COLORS.mid }}>{p.tag}</div></div>
          <div style={{ ...cl, background: `${pc.accent}12`, color: pc.accent }}>{typeof sv === "number" && sv % 1 !== 0 ? sv.toFixed(1) : sv}%</div>
          <div style={{ ...cl, background: `${pc.accent}10`, color: pc.accent }}>{c.attractivite.toFixed(2)}</div>
          <div style={{ ...cl, background: `${COLORS.accent}10`, color: COLORS.accent }}>{c.barrage.toFixed(2)}</div>
          <div style={{ ...cl, background: `${tc}10`, color: tc }}>{c.tendance.toFixed(2)}</div>
          <div style={{ display: "flex", justifyContent: "center" }}><TrendSparkline value={c.tendance} width={40} height={20} /></div>
          <div style={{ display: "flex", gap: "2px", justifyContent: "center" }}>
            <div style={{ ...cl, background: "#E6394610", color: "#E63946", padding: "3px 5px", fontSize: "10px" }}>G{c.left.toFixed(1)}</div>
            <div style={{ ...cl, background: "#FFB80010", color: "#B8860B", padding: "3px 5px", fontSize: "10px" }}>C{c.center.toFixed(1)}</div>
            <div style={{ ...cl, background: "#0066CC10", color: "#0066CC", padding: "3px 5px", fontSize: "10px" }}>D{c.right.toFixed(1)}</div>
          </div>
        </div>);
    })}
  </div>);
}
function FloatingShape({ top, left, size, color, delay, shape }) {
  return <div style={{ position: "absolute", top, left, width: size, height: size, background: color, opacity: 0.07, pointerEvents: "none", borderRadius: shape === "circle" ? "50%" : shape === "square" ? "16px" : "50% 0 50% 0", animation: `float ${6 + delay}s ease-in-out infinite ${delay}s`, transform: `rotate(${delay * 30}deg)` }} />;
}

/* ─── Fake Monte Carlo data generator ─── */
function generateSimData(activeParties, source, days = 365) {
  const rng = (seed) => { let s = seed; return () => { s = (s * 16807 + 0) % 2147483647; return s / 2147483647; }; };
  const r = rng(42);
  const candidates = activeParties.map(p => {
    const c = getSelected(p);
    const start = (source === "agrege" ? c.startAgrege : source === "debiaise" ? c.startDebiaise : c.startCustom) / 100;
    return { tag: p.tag, name: c.name, initials: c.initials, start, tendance: c.tendance, attractivite: c.attractivite, barrage: c.barrage };
  });

  // Generate trajectory data
  const trajectory = [];
  const current = candidates.map(c => c.start);
  for (let d = 0; d <= days; d += 3) {
    const point = { jour: d };
    candidates.forEach((c, idx) => {
      const drift = (c.tendance - 0.5) * 0.0003;
      const noise = (r() - 0.5) * 0.008;
      current[idx] = Math.max(0.01, Math.min(0.55, current[idx] + drift + noise));
      const spread = 0.02 + (d / days) * 0.06 * (1 - c.attractivite);
      point[`${c.tag}`] = +(current[idx]).toFixed(4);
      point[`${c.tag}_hi`] = +(current[idx] + spread).toFixed(4);
      point[`${c.tag}_lo`] = +Math.max(0, current[idx] - spread).toFixed(4);
    });
    trajectory.push(point);
  }

  // Compute final probabilities from last values + randomness
  const finals = candidates.map((c, idx) => ({ ...c, final: current[idx] }));
  finals.sort((a, b) => b.final - a.final);

  // P(qualification 2nd tour) — top 2 probability
  const totalFinal = finals.reduce((s, f) => s + f.final, 0);
  const pQualif = finals.map((f, i) => {
    let p;
    if (i === 0) p = 0.75 + f.final * 0.3;
    else if (i === 1) p = 0.55 + f.final * 0.4;
    else p = Math.max(0.01, (f.final / totalFinal) * 1.5 - (i * 0.08));
    return { ...f, pQualif: Math.min(0.99, Math.max(0.01, p)) };
  });

  // P(victoire)
  const pVictoire = pQualif.map((f, i) => {
    let pv;
    if (i === 0) pv = f.pQualif * (1 - f.barrage) * 0.6;
    else if (i === 1) pv = f.pQualif * (1 - f.barrage) * 0.45;
    else pv = f.pQualif * (1 - f.barrage) * 0.15;
    return { ...f, pVictoire: Math.min(0.95, Math.max(0.01, pv)) };
  });

  // Normalize pVictoire so they sum to ~1
  const totalPV = pVictoire.reduce((s, f) => s + f.pVictoire, 0);
  pVictoire.forEach(f => { f.pVictoire = +(f.pVictoire / totalPV).toFixed(3); });

  return { trajectory, probabilities: pVictoire };
}

/* ─── Custom Tooltip ─── */
function ChartTooltip({ active, payload, label, suffix = "" }) {
  if (!active || !payload?.length) return null;
  return (<div style={{ background: "#fff", borderRadius: "12px", padding: "12px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)", border: `1px solid ${COLORS.light}40` }}>
    <div style={{ fontSize: "12px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "8px" }}>Jour {label}</div>
    {payload.filter(p => !p.dataKey.includes("_")).map(p => (
      <div key={p.dataKey} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: p.color }} />
        <span style={{ fontSize: "11px", fontFamily: "'Outfit'", color: COLORS.mid, fontWeight: 600 }}>{p.dataKey}</span>
        <span style={{ fontSize: "11px", fontFamily: "'Space Mono'", fontWeight: 700, color: COLORS.dark, marginLeft: "auto" }}>{(p.value * 100).toFixed(1)}%{suffix}</span>
      </div>
    ))}
  </div>);
}

/* ─── Results Screen ─── */
function ResultsScreen({ activeParties, source, onBack }) {
  const simData = useMemo(() => generateSimData(activeParties, source), [activeParties, source]);
  const { trajectory, probabilities } = simData;

  const barQualif = probabilities.map(p => ({ name: p.initials, tag: p.tag, fullName: p.name, value: p.pQualif }));
  const barVictoire = probabilities.map(p => ({ name: p.initials, tag: p.tag, fullName: p.name, value: p.pVictoire }));

  // Find top candidates
  const top2Qualif = [...barQualif].sort((a, b) => b.value - a.value).slice(0, 2);
  const topVictoire = [...barVictoire].sort((a, b) => b.value - a.value)[0];
  const lastDay = trajectory[trajectory.length - 1];

  const handlePDF = () => {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        body * { visibility: hidden !important; }
        #results-printable, #results-printable * { visibility: visible !important; }
        #results-printable { position: absolute; left: 0; top: 0; width: 100%; padding: 20px !important; }
        nav, button, .no-print { display: none !important; }
        .print-break { page-break-before: always; }
        @page { size: A4 landscape; margin: 15mm; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 500);
  };

  const sT = { fontSize: "18px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Outfit'", letterSpacing: "-0.5px", marginBottom: "4px" };
  const sSub = { fontSize: "13px", color: COLORS.mid, fontFamily: "'Outfit'", marginBottom: "16px" };
  const card = { background: "#fff", borderRadius: "20px", padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)" };
  const explainBox = { background: `${COLORS.mid}08`, borderRadius: "14px", padding: "18px 20px", border: `1px solid ${COLORS.mid}12` };
  const explainTitle = { fontSize: "13px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" };
  const explainText = { fontSize: "12.5px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.65 };
  const keyNumber = { fontFamily: "'Space Mono'", fontWeight: 700, color: COLORS.accent };

  return (
    <div id="results-printable" style={{ maxWidth: "1050px", margin: "0 auto", padding: "30px 30px 60px" }}>
      {/* Header */}
      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: COLORS.mid, fontSize: "14px", fontWeight: 600, fontFamily: "'Outfit'", padding: "8px 0" }}>
          ← Nouvelle simulation
        </button>
        <button onClick={handlePDF} style={{
          background: "#fff", border: `2px solid ${COLORS.mid}30`, borderRadius: "12px",
          padding: "10px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
          fontSize: "13px", fontWeight: 700, fontFamily: "'Outfit'", color: COLORS.dark,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)", transition: "all 0.2s ease",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = COLORS.dark; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = COLORS.dark; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
          Télécharger PDF
        </button>
      </div>

      <div style={{ marginBottom: "8px" }}>
        <div style={{ display: "inline-block", padding: "5px 14px", background: "#16a34a18", borderRadius: "100px", marginBottom: "12px" }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: "12px", color: "#16a34a", fontWeight: 700, letterSpacing: "1px" }}>✓ SIMULATION TERMINÉE</span>
        </div>
      </div>
      <h2 style={{ fontSize: "32px", fontWeight: 900, color: COLORS.dark, fontFamily: "'Outfit'", letterSpacing: "-1.5px", marginBottom: "6px" }}>Résultats de la simulation</h2>
      <p style={{ fontSize: "15px", color: COLORS.mid, fontFamily: "'Outfit'", marginBottom: "36px" }}>10 000 simulations Monte Carlo · Intervalle de confiance à 75%</p>

      {/* ─── 1) Trajectories ─── */}
      <div style={card}>
        <h3 style={sT}>Moyenne Monte Carlo (IC 75%)</h3>
        <p style={sSub}>Évolution des intentions de vote sur 365 jours</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px", alignItems: "start" }}>
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={trajectory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.light}60`} />
              <XAxis dataKey="jour" tick={{ fontSize: 11, fill: COLORS.mid, fontFamily: "'Space Mono'" }} axisLine={{ stroke: COLORS.light }} tickLine={false} label={{ value: "Jour", position: "insideBottomRight", offset: -5, style: { fontSize: 11, fill: COLORS.mid, fontFamily: "'Outfit'" } }} />
              <YAxis tick={{ fontSize: 11, fill: COLORS.mid, fontFamily: "'Space Mono'" }} axisLine={{ stroke: COLORS.light }} tickLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} domain={[0, 'auto']} />
              <Tooltip content={<ChartTooltip />} />
              {activeParties.map(p => <Area key={`${p.tag}_band`} dataKey={`${p.tag}_hi`} stroke="none" fill={PARTY_COLORS[p.tag].chart} fillOpacity={0.1} stackId={`band_${p.tag}`} type="monotone" dot={false} activeDot={false} legendType="none" />)}
              {activeParties.map(p => <Area key={`${p.tag}_lo`} dataKey={`${p.tag}_lo`} stroke="none" fill="#fff" fillOpacity={1} stackId={`band_${p.tag}`} type="monotone" dot={false} activeDot={false} legendType="none" />)}
              {activeParties.map(p => <Line key={p.tag} dataKey={p.tag} stroke={PARTY_COLORS[p.tag].chart} strokeWidth={2.5} dot={false} type="monotone" name={getSelected(p).name} />)}
            </AreaChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={explainBox}>
              <div style={explainTitle}>📖 Comment lire ce graphique</div>
              <p style={explainText}>
                Chaque <strong>ligne</strong> représente la trajectoire moyenne des intentions de vote d'un candidat, calculée sur <span style={keyNumber}>10 000</span> simulations.
              </p>
              <p style={{ ...explainText, marginTop: "8px" }}>
                La <strong>zone colorée</strong> autour de chaque courbe indique l'<strong>intervalle de confiance à 75%</strong> : dans 3 simulations sur 4, le candidat se trouve dans cette zone.
              </p>
            </div>
            <div style={{ ...explainBox, background: `${COLORS.accent}06`, border: `1px solid ${COLORS.accent}15` }}>
              <div style={explainTitle}>🔍 Points clés</div>
              <p style={explainText}>
                {activeParties.map(p => {
                  const c = getSelected(p);
                  const val = lastDay[p.tag];
                  return val;
                }).sort((a, b) => b - a)[0] && (() => {
                  const sorted = activeParties.map(p => ({ tag: p.tag, name: getSelected(p).name, val: lastDay[p.tag] })).sort((a, b) => b.val - a.val);
                  const leader = sorted[0];
                  const second = sorted[1];
                  const gap = ((leader.val - second.val) * 100).toFixed(1);
                  return (<>
                    <strong>{leader.name}</strong> termine en tête à <span style={keyNumber}>{(leader.val * 100).toFixed(1)}%</span> avec une avance de <span style={keyNumber}>{gap} pts</span> sur <strong>{second.name}</strong>.
                    {parseFloat(gap) < 3 && <span style={{ display: "block", marginTop: "6px" }}>⚡ L'écart est serré — un scénario d'inversion est plausible.</span>}
                  </>);
                })()}
              </p>
              <p style={{ ...explainText, marginTop: "8px", opacity: 0.8 }}>
                Plus un IC est <strong>large</strong>, plus l'issue est incertaine pour ce candidat.
              </p>
            </div>
          </div>
        </div>
        {/* Legend */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "14px", justifyContent: "center" }}>
          {activeParties.map(p => {
            const pc = PARTY_COLORS[p.tag], c = getSelected(p);
            return (<div key={p.tag} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: pc.chart }} />
              <span style={{ fontSize: "12px", fontFamily: "'Outfit'", fontWeight: 600, color: COLORS.dark }}>{c.name}</span>
            </div>);
          })}
        </div>
      </div>

      {/* ─── 2 & 3) Probability bar charts ─── */}
      <div className="print-break" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "20px" }}>
        {/* P(qualification) */}
        <div style={card}>
          <h3 style={sT}>P(qualification 2ᵉ tour)</h3>
          <p style={sSub}>Probabilité d'accéder au second tour</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barQualif} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.light}40`} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.mid, fontFamily: "'Space Mono'", fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: COLORS.mid, fontFamily: "'Space Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} domain={[0, 1]} />
              <Tooltip formatter={(v, name, props) => [`${(v * 100).toFixed(1)}%`, props.payload.fullName]} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontFamily: "'Outfit'" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {barQualif.map(e => <Cell key={e.tag} fill={PARTY_COLORS[e.tag].chart} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ ...explainBox, marginTop: "16px" }}>
            <div style={explainTitle}>📖 Lecture</div>
            <p style={explainText}>
              Ce graphique indique la probabilité pour chaque candidat de figurer dans les <strong>deux premiers</strong> du premier tour et donc d'accéder au second tour.
            </p>
            <p style={{ ...explainText, marginTop: "8px" }}>
              <strong>{top2Qualif[0].fullName}</strong> a la plus forte probabilité de qualification à <span style={keyNumber}>{(top2Qualif[0].value * 100).toFixed(1)}%</span>, suivi de <strong>{top2Qualif[1].fullName}</strong> à <span style={keyNumber}>{(top2Qualif[1].value * 100).toFixed(1)}%</span>.
            </p>
            <p style={{ ...explainText, marginTop: "8px", opacity: 0.8 }}>
              Une probabilité de <span style={keyNumber}>50%</span> signifie que le candidat se qualifie dans la moitié des simulations. Les petites barres indiquent des candidats qui ne se qualifient que dans des scénarios favorables exceptionnels.
            </p>
          </div>
        </div>

        {/* P(victoire) */}
        <div style={card}>
          <h3 style={sT}>Probabilité de victoire</h3>
          <p style={sSub}>Probabilité de remporter l'élection</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barVictoire} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={`${COLORS.light}40`} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: COLORS.mid, fontFamily: "'Space Mono'", fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: COLORS.mid, fontFamily: "'Space Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v * 100).toFixed(0)}%`} domain={[0, 'auto']} />
              <Tooltip formatter={(v, name, props) => [`${(v * 100).toFixed(1)}%`, props.payload.fullName]} contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontFamily: "'Outfit'" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                {barVictoire.map(e => <Cell key={e.tag} fill={PARTY_COLORS[e.tag].chart} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ ...explainBox, marginTop: "16px" }}>
            <div style={explainTitle}>📖 Lecture</div>
            <p style={explainText}>
              Ce graphique montre la probabilité de <strong>victoire finale</strong>, c'est-à-dire de remporter le second tour face à tout adversaire possible.
            </p>
            <p style={{ ...explainText, marginTop: "8px" }}>
              <strong>{topVictoire.fullName}</strong> est le favori avec <span style={keyNumber}>{(topVictoire.value * 100).toFixed(1)}%</span> de chances de victoire.
              Le <strong>taux de barrage</strong> joue ici un rôle majeur : un candidat peut se qualifier souvent mais perdre systématiquement au second tour si l'électorat se mobilise contre lui.
            </p>
            <p style={{ ...explainText, marginTop: "8px", opacity: 0.8 }}>
              💡 <em>Se qualifier ≠ gagner</em> — comparez les deux graphiques pour repérer les candidats qui accèdent souvent au 2ᵉ tour mais peinent à l'emporter.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Methodology note ─── */}
      <div style={{ ...card, marginTop: "20px", display: "grid", gridTemplateColumns: "auto 1fr", gap: "16px", alignItems: "start" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${COLORS.mid}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>🧮</div>
        <div>
          <h3 style={{ ...sT, fontSize: "15px" }}>Note méthodologique</h3>
          <p style={{ ...explainText, marginTop: "4px" }}>
            Les résultats sont issus de <span style={keyNumber}>10 000</span> simulations Monte Carlo. Chaque simulation fait évoluer les intentions de vote quotidiennement en intégrant l'<strong>attractivité</strong> des candidats, leur <strong>tendance long terme</strong>, leur <strong>profil idéologique</strong> (qui détermine les reports de voix), et un facteur de bruit aléatoire modélisant l'incertitude sondagière.
          </p>
          <p style={{ ...explainText, marginTop: "8px" }}>
            Le <strong>taux de barrage</strong> intervient au second tour : il représente la proportion maximale de l'électorat opposé qui refuse de voter pour un candidat, même face à un adversaire moins préféré. Les intervalles de confiance à 75% signifient qu'on exclut les 12.5% de simulations les plus extrêmes dans chaque direction.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Méthodologie Page ─── */
function MethodologiePage({ onBack }) {
  const card = { background: "#fff", borderRadius: "20px", padding: "28px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: "20px" };
  const h3 = { fontSize: "18px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Outfit'", letterSpacing: "-0.5px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" };
  const p = { fontSize: "14px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.75, marginBottom: "12px" };
  const strong = { color: COLORS.dark, fontWeight: 700 };
  const mono = { fontFamily: "'Space Mono'", fontWeight: 700, color: COLORS.accent, fontSize: "13px" };
  const formula = { background: `${COLORS.mid}08`, borderRadius: "12px", padding: "16px 20px", fontFamily: "'Space Mono'", fontSize: "13px", color: COLORS.dark, lineHeight: 1.8, marginBottom: "14px", border: `1px solid ${COLORS.mid}12`, overflowX: "auto" };
  const paramCard = { background: `${COLORS.cream}`, borderRadius: "14px", padding: "16px 20px", marginBottom: "10px", border: `1px solid ${COLORS.light}40` };
  const paramTitle = { fontSize: "14px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" };
  const paramDesc = { fontSize: "13px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.6 };
  const tag = (color, text) => <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "6px", background: `${color}15`, color, fontSize: "12px", fontWeight: 700, fontFamily: "'Space Mono'" }}>{text}</span>;

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "30px 30px 60px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: COLORS.mid, fontSize: "14px", fontWeight: 600, fontFamily: "'Outfit'", marginBottom: "24px", padding: "8px 0" }}>← Retour à l'accueil</button>

      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "inline-block", padding: "5px 14px", background: `${COLORS.mid}12`, borderRadius: "100px", marginBottom: "14px" }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: "12px", color: COLORS.mid, fontWeight: 700, letterSpacing: "1px" }}>DOCUMENTATION</span>
        </div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, color: COLORS.dark, fontFamily: "'Outfit'", letterSpacing: "-1.5px", marginBottom: "8px" }}>Méthodologie</h1>
        <p style={{ fontSize: "16px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.6 }}>Comprendre le modèle de simulation utilisé pour estimer les probabilités de l'élection présidentielle 2027.</p>
      </div>

      {/* 1. Overview */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>🎲</span> Principe général</h3>
        <p style={p}>Notre modèle repose sur une <span style={strong}>simulation de Monte Carlo</span> : plutôt que de prédire un résultat unique, nous simulons <span style={mono}>10 000</span> scénarios d'élection possibles en faisant varier les paramètres dans leurs marges d'incertitude.</p>
        <p style={p}>Chaque simulation fait évoluer les intentions de vote <span style={strong}>jour par jour</span> sur une période de 365 jours, du point de départ (basé sur les sondages) jusqu'au jour de l'élection. On obtient ainsi une distribution statistique des résultats possibles.</p>
        <p style={p}>L'élection est simulée en <span style={strong}>deux tours</span> : le premier tour classe les candidats, puis le second oppose les deux premiers en tenant compte des reports de voix et du phénomène de barrage.</p>
      </div>

      {/* 2. Parameters */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>⚙️</span> Les paramètres du modèle</h3>
        <p style={p}>Chaque candidat est décrit par cinq paramètres qui influencent la dynamique de la simulation :</p>

        <div style={paramCard}>
          <div style={paramTitle}>{tag(COLORS.accent, "0 → 1")} Attractivité</div>
          <p style={paramDesc}>Mesure la capacité d'un candidat à <strong>conquérir de nouveaux électeurs</strong> au fil de la campagne. Un score élevé signifie que le candidat a un potentiel de progression important : charisme, capacité à convaincre au-delà de sa base, qualité de campagne. Ce paramètre influence le <strong>drift positif</strong> dans la simulation.</p>
        </div>
        <div style={paramCard}>
          <div style={paramTitle}>{tag("#16a34a", "0 → 1")} Tendance long terme</div>
          <p style={paramDesc}>Capture la <strong>dynamique de fond</strong> d'un candidat sur les derniers mois. Une valeur supérieure à 0.5 indique une tendance haussière (le candidat monte dans les sondages), inférieure à 0.5 une tendance baissière. Ce paramètre modélise l'inertie des mouvements d'opinion et amplifie ou atténue les fluctuations quotidiennes.</p>
        </div>
        <div style={paramCard}>
          <div style={paramTitle}>{tag("#E63946", "G")} {tag("#FFB800", "C")} {tag("#0066CC", "D")} Profil idéologique</div>
          <p style={paramDesc}>Vecteur à trois composantes (Gauche, Centre, Droite) normalisé à 1. Il détermine les <strong>reports de voix</strong> entre candidats : quand un candidat perd du terrain, ses électeurs migrent en priorité vers les candidats au profil idéologique proche. Ce mécanisme est essentiel pour modéliser la recomposition de l'électorat entre les tours.</p>
        </div>
        <div style={paramCard}>
          <div style={paramTitle}>{tag(COLORS.accent, "0 → 1")} Taux de barrage</div>
          <p style={paramDesc}>Proportion de l'électorat qui <strong>refuse catégoriquement</strong> de voter pour un candidat au second tour, quel que soit l'adversaire. Un taux de barrage élevé (ex : 0.45) signifie que près de la moitié des électeurs ferait barrage. Ce paramètre est déterminant pour la probabilité de victoire finale — un candidat peut se qualifier souvent mais perdre systématiquement au second tour.</p>
        </div>
        <div style={paramCard}>
          <div style={paramTitle}>{tag(COLORS.mid, "%")} Point de départ</div>
          <p style={paramDesc}>Intention de vote initiale du candidat. Trois sources sont possibles : le <strong>sondage agrégé</strong> (moyenne pondérée des derniers sondages), le <strong>sondage débiaisé</strong> (corrigé des biais historiques des instituts), ou une <strong>valeur personnalisée</strong>. Ce point de départ est la base de toutes les simulations.</p>
        </div>
      </div>

      {/* 3. Simulation process */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>📈</span> Processus de simulation</h3>
        <p style={p}>Pour chaque simulation <span style={mono}>k ∈ [1, 10 000]</span>, le modèle applique la dynamique suivante pour chaque jour <span style={mono}>t</span> :</p>
        <div style={formula}>
          V<sub>i</sub>(t+1) = V<sub>i</sub>(t) + drift<sub>i</sub> + noise<sub>i</sub>(t) + transfers<sub>i</sub>(t)
        </div>
        <p style={p}>Où :</p>
        <div style={{ ...formula, lineHeight: 2 }}>
          drift<sub>i</sub> = f(attractivité<sub>i</sub>, tendance<sub>i</sub>)<br />
          noise<sub>i</sub>(t) ~ N(0, σ²) &nbsp;&nbsp;(bruit aléatoire gaussien)<br />
          transfers<sub>i</sub>(t) = Σ<sub>j≠i</sub> sim(profil<sub>i</sub>, profil<sub>j</sub>) × ΔV<sub>j</sub>(t)
        </div>
        <p style={p}>Les <span style={strong}>transferts de voix</span> sont calculés par similarité cosinus entre les profils idéologiques : quand un candidat recule, ses électeurs se redistribuent proportionnellement vers les candidats idéologiquement proches.</p>
        <p style={p}>À chaque pas de temps, les intentions de vote sont <span style={strong}>renormalisées</span> pour sommer à 100%, garantissant la cohérence du modèle.</p>
      </div>

      {/* 4. Two rounds */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>🗳️</span> Simulation des deux tours</h3>
        <p style={p}><span style={strong}>Premier tour</span> — Au jour 365, les intentions de vote finales déterminent le classement. Les deux candidats en tête accèdent au second tour.</p>
        <p style={p}><span style={strong}>Second tour</span> — Les voix des candidats éliminés sont redistribuées selon la proximité idéologique, pondérée par le taux de barrage du candidat bénéficiaire. Plus le barrage est élevé, plus une partie de ces reports se transforme en abstention plutôt qu'en vote utile.</p>
        <div style={formula}>
          Score<sub>2nd tour</sub>(i) = V<sub>1er tour</sub>(i) + Σ reports<sub>j→i</sub> × (1 - barrage<sub>i</sub>)
        </div>
      </div>

      {/* 5. Outputs */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>📊</span> Résultats et intervalles de confiance</h3>
        <p style={p}>Les 10 000 simulations produisent trois types de résultats :</p>
        <p style={p}><span style={strong}>1. Trajectoires moyennes</span> — La courbe centrale représente la médiane des 10 000 trajectoires. L'<span style={strong}>intervalle de confiance à 75%</span> (bande colorée) exclut les 12.5% les plus extrêmes dans chaque direction, donnant une vision réaliste des scénarios les plus probables.</p>
        <p style={p}><span style={strong}>2. P(qualification)</span> — Nombre de simulations où le candidat termine dans le top 2 au premier tour, divisé par 10 000. C'est une probabilité empirique directe.</p>
        <p style={p}><span style={strong}>3. P(victoire)</span> — Nombre de simulations où le candidat remporte le second tour, divisé par 10 000. Intègre à la fois la qualification et le résultat du second tour.</p>
      </div>

      {/* 6. Sources */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>📚</span> Sources des données</h3>
        <p style={p}>Les sondages utilisés proviennent des instituts majeurs publiant régulièrement des intentions de vote pour la présidentielle 2027. Notre agrégation pondère les sondages en fonction de :</p>
        <p style={p}>• La <span style={strong}>récence</span> — les sondages les plus récents ont un poids plus élevé (décroissance exponentielle avec un facteur de demi-vie de 14 jours).</p>
        <p style={p}>• La <span style={strong}>taille de l'échantillon</span> — un sondage sur 2 000 personnes pèse davantage qu'un sondage sur 1 000.</p>
        <p style={p}>• Le <span style={strong}>biais historique</span> de l'institut (pour le mode débiaisé) — calculé en comparant les prédictions passées de l'institut aux résultats réels des élections précédentes.</p>
        <p style={{ ...p, opacity: 0.7, fontSize: "13px" }}>Les données pour les candidats non sondés individuellement sont estimées à partir des scores de leur formation politique ou courant, avec une marge d'incertitude plus large reflétée dans l'IC.</p>
      </div>

      {/* 7. Limitations */}
      <div style={{ ...card, background: `${COLORS.accent}04`, border: `1px solid ${COLORS.accent}15` }}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>⚠️</span> Limites du modèle</h3>
        <p style={p}>Ce modèle est un <span style={strong}>outil d'exploration de scénarios</span>, pas une prédiction. Ses principales limites sont :</p>
        <p style={p}>• Il ne modélise pas les <span style={strong}>événements exogènes</span> (scandales, crises, retraits de candidature) qui peuvent bouleverser la course.</p>
        <p style={p}>• Les <span style={strong}>reports de voix</span> au second tour sont simplifiés par le modèle de proximité idéologique, alors qu'en réalité ils dépendent de nombreux facteurs socio-démographiques.</p>
        <p style={p}>• La <span style={strong}>volatilité</span> est supposée constante, alors qu'elle tend à augmenter en période de campagne active.</p>
        <p style={p}>• Les paramètres (attractivité, barrage, tendance) sont des estimations subjectives qui influencent fortement les résultats — c'est justement pourquoi le site vous permet de les ajuster librement.</p>
      </div>
    </div>
  );
}

/* ─── À propos Page ─── */
function AProposPage({ onBack }) {
  const card = { background: "#fff", borderRadius: "20px", padding: "28px 32px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", marginBottom: "20px" };
  const h3 = { fontSize: "18px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Outfit'", letterSpacing: "-0.5px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" };
  const p = { fontSize: "14px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.75, marginBottom: "12px" };
  const strong = { color: COLORS.dark, fontWeight: 700 };

  const profileCard = (emoji, name, role, desc) => (
    <div style={{ background: COLORS.cream, borderRadius: "16px", padding: "24px", border: `1px solid ${COLORS.light}30`, flex: 1 }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>{emoji}</div>
      <div style={{ fontSize: "17px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "2px" }}>{name}</div>
      <div style={{ fontSize: "13px", fontWeight: 600, color: COLORS.accent, fontFamily: "'Outfit'", marginBottom: "10px" }}>{role}</div>
      <p style={{ fontSize: "13px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );

  const faqItem = (q, a) => (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ fontSize: "14px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "6px" }}>{q}</div>
      <p style={{ fontSize: "13px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.65 }}>{a}</p>
    </div>
  );

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "30px 30px 60px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: COLORS.mid, fontSize: "14px", fontWeight: 600, fontFamily: "'Outfit'", marginBottom: "24px", padding: "8px 0" }}>← Retour à l'accueil</button>

      <div style={{ marginBottom: "36px" }}>
        <div style={{ display: "inline-block", padding: "5px 14px", background: `${COLORS.accent}12`, borderRadius: "100px", marginBottom: "14px" }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: "12px", color: COLORS.accent, fontWeight: 700, letterSpacing: "1px" }}>QUI SOMMES-NOUS</span>
        </div>
        <h1 style={{ fontSize: "36px", fontWeight: 900, color: COLORS.dark, fontFamily: "'Outfit'", letterSpacing: "-1.5px", marginBottom: "8px" }}>À propos</h1>
        <p style={{ fontSize: "16px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.6 }}>Un projet indépendant pour rendre les modèles électoraux accessibles à tous.</p>
      </div>

      {/* Mission */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>🎯</span> Notre mission</h3>
        <p style={p}>L'élection présidentielle est un moment démocratique majeur, mais les sondages seuls donnent une image figée et parfois trompeuse de la réalité. Notre objectif est de proposer un outil qui va au-delà du simple "X est à 28%, Y est à 15%".</p>
        <p style={p}>En combinant <span style={strong}>modélisation statistique</span> et <span style={strong}>interactivité</span>, nous permettons à chacun d'explorer des scénarios, de comprendre l'impact de chaque paramètre, et de se poser les bonnes questions sur les dynamiques électorales.</p>
        <p style={p}>Ce projet est <span style={strong}>100% indépendant</span>, sans affiliation politique, sans financement partisan. Nous croyons que l'accès à des outils d'analyse quantitative contribue à une meilleure compréhension du débat démocratique.</p>
      </div>

      {/* Team */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>👥</span> L'équipe</h3>
        <p style={{ ...p, marginBottom: "20px" }}>Ce projet est né de la rencontre de deux cousins passionnés par les maths et la politique :</p>
        <div style={{ display: "flex", gap: "16px" }}>
          {profileCard(
            "📊",
            "Le statisticien",
            "Modélisation & Data",
            "Passionné de statistiques appliquées, il a développé le modèle de simulation en R, calibré les paramètres à partir des données historiques, et conçu la méthodologie de correction des biais sondagiers."
          )}
          {profileCard(
            "💻",
            "L'ingénieure",
            "Développement & Design",
            "Ingénieure logiciel, elle a conçu et développé l'interface web, l'expérience utilisateur du configurateur, et les visualisations interactives des résultats. Elle s'assure que le modèle soit accessible à tous."
          )}
        </div>
      </div>

      {/* How it works (simplified) */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>🔧</span> Comment ça marche</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            { step: "1", icon: "⚙️", title: "Configurez", desc: "Choisissez les candidats, ajustez leurs paramètres, et sélectionnez votre source de sondages." },
            { step: "2", icon: "🎲", title: "Simulez", desc: "Le modèle lance 10 000 simulations Monte Carlo avec vos paramètres et une part d'aléatoire." },
            { step: "3", icon: "📊", title: "Analysez", desc: "Explorez les trajectoires, probabilités de qualification et de victoire pour chaque candidat." },
          ].map(s => (
            <div key={s.step} style={{ background: COLORS.cream, borderRadius: "16px", padding: "22px 18px", textAlign: "center", border: `1px solid ${COLORS.light}30` }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>{s.icon}</div>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "50%", background: COLORS.accent, color: "#fff", fontSize: "12px", fontWeight: 800, fontFamily: "'Space Mono'", marginBottom: "8px" }}>{s.step}</div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "6px" }}>{s.title}</div>
              <p style={{ fontSize: "12.5px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.5 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>❓</span> Questions fréquentes</h3>
        {faqItem(
          "Est-ce que ce simulateur prédit le résultat de l'élection ?",
          "Non. C'est un outil d'exploration de scénarios, pas une boule de cristal. Les résultats dépendent des paramètres que vous choisissez et des hypothèses du modèle. Aucun modèle statistique ne peut prédire avec certitude le résultat d'une élection."
        )}
        {faqItem(
          "D'où viennent les valeurs par défaut des paramètres ?",
          "Les points de départ sont issus de l'agrégation des sondages publiés. Les autres paramètres (attractivité, tendance, barrage, profil idéologique) sont des estimations basées sur les données historiques, les analyses qualitatives, et le jugement expert. Vous êtes libre de les modifier."
        )}
        {faqItem(
          "Pourquoi certains candidats sont marqués comme 'estimés' ?",
          "Certains candidats potentiels ne sont pas encore sondés individuellement par les instituts. Leurs données de départ sont estimées à partir des scores de leur formation politique, avec une marge d'incertitude plus large."
        )}
        {faqItem(
          "Le code source est-il disponible ?",
          "Nous prévoyons d'ouvrir le code source du modèle R et de l'interface web. Restez informés en suivant le projet."
        )}
        {faqItem(
          "Comment signaler un bug ou suggérer une amélioration ?",
          "Vous pouvez nous contacter directement par email. Nous sommes ouverts à toute suggestion pour améliorer le modèle ou l'interface."
        )}
      </div>

      {/* Contact & Services */}
      <div style={card}>
        <h3 style={h3}><span style={{ fontSize: "22px" }}>💬</span> Nous contacter</h3>
        <p style={{ ...p, marginBottom: "20px" }}>Une idée d'amélioration ? Un bug à signaler ? Ou un projet tech en tête ? N'hésitez pas à nous écrire.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          <div style={{ background: `${COLORS.mid}08`, borderRadius: "16px", padding: "22px 20px", border: `1px solid ${COLORS.mid}12` }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>💡</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "6px" }}>Proposer une amélioration</div>
            <p style={{ fontSize: "13px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.6, marginBottom: "14px" }}>
              Vous avez une idée pour rendre le simulateur plus précis, plus clair ou plus complet ? Nous sommes preneurs de tous les retours : nouveaux paramètres, corrections de données, suggestions UX, idées de visualisation…
            </p>
            <a href="mailto:contact@quipresident.fr?subject=Suggestion d'amélioration" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "10px", background: `${COLORS.mid}15`, color: COLORS.dark, fontSize: "13px", fontWeight: 700, fontFamily: "'Outfit'", textDecoration: "none", transition: "all 0.2s" }}>
              ✉️ Envoyer une suggestion
            </a>
          </div>
          <div style={{ background: `${COLORS.accent}06`, borderRadius: "16px", padding: "22px 20px", border: `1px solid ${COLORS.accent}12` }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>🚀</div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "6px" }}>Vous avez un projet IT ?</div>
            <p style={{ fontSize: "13px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.6, marginBottom: "14px" }}>
              L'équipe derrière ce simulateur conçoit aussi des applications web, des outils data et des solutions sur mesure pour les entreprises et les indépendants. Site vitrine, appli métier, dashboard, automatisation… parlons-en !
            </p>
            <a href="mailto:contact@quipresident.fr?subject=Projet informatique" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", borderRadius: "10px", background: `${COLORS.accent}15`, color: COLORS.accent, fontSize: "13px", fontWeight: 700, fontFamily: "'Outfit'", textDecoration: "none", transition: "all 0.2s" }}>
              💻 Discuter d'un projet
            </a>
          </div>
        </div>
      </div>

      {/* Bottom banner */}
      <div style={{ ...card, background: `linear-gradient(135deg, ${COLORS.dark}, ${COLORS.mid})`, border: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", flexShrink: 0 }}>📬</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#fff", fontFamily: "'Outfit'", marginBottom: "6px" }}>Restons en contact</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", fontFamily: "'Outfit'", lineHeight: 1.5 }}>
              Pour toute question : <span style={{ color: "#fff", fontWeight: 700 }}>contact@quipresident.fr</span> — réponse sous 48h.
            </p>
          </div>
          <a href="mailto:contact@quipresident.fr" style={{ padding: "10px 24px", borderRadius: "10px", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "13px", fontWeight: 700, fontFamily: "'Outfit'", textDecoration: "none", whiteSpace: "nowrap", border: "1px solid rgba(255,255,255,0.2)", transition: "all 0.2s" }}>
            Écrire un email →
          </a>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════ MAIN ═══════════════ */
export default function QuiPresident() {
  const [view, setView] = useState("home");
  const [step, setStep] = useState(0);
  const [parties, setParties] = useState(PARTIES);
  const [activeConfig, setActiveConfig] = useState(null);
  const [pollSource, setPollSource] = useState("agrege");
  const [buttonHovered, setButtonHovered] = useState(false);
  const [transition, setTransition] = useState(false);

  const activeParties = parties.filter(p => p.active);
  const unpolledActive = activeParties.filter(p => !getSelected(p).polled);
  const STEPS = ["Candidats", "Paramètres", "Contexte", "Résumé"];

  const toggleParty = t => setParties(p => p.map(x => x.tag === t ? { ...x, active: !x.active } : x));
  const switchVariant = (t, i) => setParties(p => p.map(x => x.tag === t ? { ...x, selectedIdx: i } : x));
  const updateVariant = (tag, field, value) => {
    setParties(prev => prev.map(p => {
      if (p.tag !== tag) return p;
      const nv = [...p.variants];
      if (field === "ideology") nv[p.selectedIdx] = { ...nv[p.selectedIdx], left: value.left, center: value.center, right: value.right };
      else nv[p.selectedIdx] = { ...nv[p.selectedIdx], [field]: value };
      return { ...p, variants: nv };
    }));
  };

  const goToWizard = () => { setTransition(true); setTimeout(() => { setView("wizard"); setStep(0); setTransition(false); }, 400); };
  const goHome = () => { setTransition(true); setTimeout(() => { setView("home"); setStep(0); setTransition(false); }, 400); };
  const launchSim = () => {
    setTransition(true);
    setTimeout(() => { setView("results"); setTransition(false); }, 600);
  };

  const renderHome = () => (
    <div style={{ opacity: transition ? 0 : 1, transform: transition ? "translateY(20px)" : "none", transition: "all 0.4s ease" }}>
      <div style={{ textAlign: "center", padding: "40px 40px 0" }}>
        <div style={{ display: "inline-block", padding: "6px 18px", background: `${COLORS.mid}15`, borderRadius: "100px", marginBottom: "20px", border: `1px solid ${COLORS.mid}20` }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: "13px", color: COLORS.mid, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase" }}>Présidentielle 2027</span>
        </div>
        <h1 style={{ fontSize: "clamp(40px,6vw,72px)", fontWeight: 900, color: COLORS.dark, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: "16px" }}>
          Qui sera{" "}<span style={{ color: COLORS.accent, position: "relative", display: "inline-block" }}>président<svg style={{ position: "absolute", bottom: "-4px", left: 0, width: "100%", height: "12px" }} viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M0 8 Q50 0 100 6 T200 4" stroke={COLORS.accent} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.4" /></svg></span><span style={{ color: COLORS.mid }}> ?</span>
        </h1>
        <p style={{ fontSize: "18px", color: COLORS.mid, maxWidth: "520px", margin: "0 auto", lineHeight: 1.6 }}>Simulez l'élection présidentielle grâce à notre modèle mathématique. Lancez des scénarios et explorez les résultats.</p>
        <div style={{ marginTop: "32px" }}>
          <button onClick={goToWizard} onMouseEnter={() => setButtonHovered(true)} onMouseLeave={() => setButtonHovered(false)} style={{ background: `linear-gradient(135deg,${COLORS.accent},#FF7B73)`, color: "#FFFFFF", border: "none", padding: "20px 56px", fontSize: "20px", fontWeight: 700, fontFamily: "'Outfit'", borderRadius: "16px", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.175,0.885,0.32,1.275)", transform: buttonHovered ? "translateY(-3px) scale(1.03)" : "scale(1)", boxShadow: buttonHovered ? `0 16px 40px ${COLORS.accent}50` : `0 8px 30px ${COLORS.accent}30`, animation: "pulse 2.5s ease-in-out infinite", letterSpacing: "-0.5px", display: "inline-flex", alignItems: "center", gap: "12px" }}>🚀  Lancer une simulation</button>
          <p style={{ marginTop: "14px", fontSize: "13px", color: COLORS.light, fontWeight: 500 }}>Modèle basé sur les données de sondages et analyses statistiques</p>
        </div>
      </div>
      <div style={{ maxWidth: "1100px", margin: "30px auto 0", padding: "0 30px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "20px" }}>
          {parties.map((p, i) => {
            const pc = PARTY_COLORS[p.tag], c = getSelected(p); return (
              <div key={p.tag} style={{ background: "#fff", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 20px rgba(69,84,101,0.08)", animation: `slideUp 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 80}ms both` }}>
                <div style={{ height: "6px", background: `linear-gradient(90deg,${pc.accent},${pc.bg})` }} />
                <div style={{ padding: "28px 24px 24px", textAlign: "center" }}>
                  <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `linear-gradient(135deg,${pc.bg},${pc.accent})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", boxShadow: `0 4px 12px ${pc.accent}30` }}><span style={{ color: pc.fg, fontSize: c.initials.length > 2 ? "18px" : "22px", fontWeight: 800, fontFamily: "'Outfit'", letterSpacing: "1px" }}>{c.initials}</span></div>
                  <h3 style={{ margin: "0 0 6px", fontSize: "17px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'", lineHeight: 1.2 }}>{c.name}</h3>
                  <span style={{ display: "inline-block", padding: "5px 14px", borderRadius: "100px", fontSize: "12px", fontWeight: 600, fontFamily: "'Outfit'", background: `${pc.bg}15`, color: pc.bg }}>{p.tag}</span>
                  <p style={{ margin: "8px 0 0", fontSize: "12.5px", color: COLORS.mid, fontFamily: "'Outfit'", opacity: 0.8 }}>{p.party}</p>
                </div>
              </div>);
          })}
        </div>
      </div>
      <div style={{ height: "20px" }} />

      {/* Contact / Services banner */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 30px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ background: "#fff", borderRadius: "20px", padding: "24px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${COLORS.mid}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>💡</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "4px" }}>Une idée d'amélioration ?</div>
              <p style={{ fontSize: "12px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.5 }}>Proposez de nouveaux paramètres, des corrections ou des idées de visualisation.</p>
            </div>
            <a href="mailto:contact@quipresident.fr?subject=Suggestion" style={{ padding: "8px 16px", borderRadius: "10px", background: `${COLORS.mid}12`, color: COLORS.dark, fontSize: "12px", fontWeight: 700, fontFamily: "'Outfit'", textDecoration: "none", whiteSpace: "nowrap" }}>Écrire →</a>
          </div>
          <div style={{ background: `linear-gradient(135deg, ${COLORS.dark}, ${COLORS.mid})`, borderRadius: "20px", padding: "24px 28px", boxShadow: "0 2px 16px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0 }}>🚀</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#fff", fontFamily: "'Outfit'", marginBottom: "4px" }}>Un projet informatique ?</div>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", fontFamily: "'Outfit'", lineHeight: 1.5 }}>Appli web, dashboard, outil métier… on peut en discuter.</p>
            </div>
            <a href="mailto:contact@quipresident.fr?subject=Projet informatique" style={{ padding: "8px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "12px", fontWeight: 700, fontFamily: "'Outfit'", textDecoration: "none", whiteSpace: "nowrap", border: "1px solid rgba(255,255,255,0.2)" }}>Discuter →</a>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWizard = () => (
    <div style={{ maxWidth: "840px", margin: "0 auto", padding: "30px 30px 60px", opacity: transition ? 0 : 1, transform: transition ? "translateY(20px)" : "none", transition: "all 0.4s ease" }}>
      <button onClick={goHome} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", color: COLORS.mid, fontSize: "14px", fontWeight: 600, fontFamily: "'Outfit'", marginBottom: "24px", padding: "8px 0" }}>← Retour à l'accueil</button>
      <h2 style={{ fontSize: "28px", fontWeight: 800, color: COLORS.dark, fontFamily: "'Outfit'", marginBottom: "8px", letterSpacing: "-1px" }}>Configurer la simulation</h2>
      <p style={{ fontSize: "15px", color: COLORS.mid, fontFamily: "'Outfit'", marginBottom: "32px" }}>
        {step === 0 && "Sélectionnez les partis et choisissez leur représentant."}{step === 1 && "Ajustez les paramètres de chaque candidat."}{step === 2 && "Choisissez la base de départ des intentions de vote."}{step === 3 && "Vérifiez la configuration avant de lancer."}
      </p>
      <StepIndicator current={step} labels={STEPS} />

      {step === 0 && (<div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <span style={{ fontSize: "13px", color: COLORS.mid, fontFamily: "'Outfit'" }}>{activeParties.length} parti{activeParties.length > 1 ? "s" : ""} sélectionné{activeParties.length > 1 ? "s" : ""}</span>
          <button onClick={() => setParties(p => p.map(x => ({ ...x, active: true })))} style={{ background: "none", border: `1.5px solid ${COLORS.light}`, borderRadius: "8px", padding: "6px 14px", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: COLORS.mid, fontFamily: "'Outfit'" }}>Tout sélectionner</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
          {parties.map(p => <PartySelectCard key={p.tag} partyData={p} onToggle={() => toggleParty(p.tag)} onSwitchVariant={idx => switchVariant(p.tag, idx)} />)}
        </div>
      </div>)}

      {step === 1 && (<div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {activeParties.map(p => <ConfigCard key={p.tag} partyData={p} isActive={activeConfig === p.tag} onClick={() => setActiveConfig(activeConfig === p.tag ? null : p.tag)} onUpdate={(f, v) => updateVariant(p.tag, f, v)} />)}
      </div>)}

      {step === 2 && (<div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", marginBottom: "28px" }}>
          {POLL_SOURCES.map(src => {
            const a = pollSource === src.id; return (<div key={src.id} onClick={() => setPollSource(src.id)} style={{ background: a ? "#fff" : `${COLORS.light}15`, borderRadius: "16px", padding: "20px 18px", cursor: "pointer", border: a ? `2.5px solid ${COLORS.accent}` : "2.5px solid transparent", boxShadow: a ? `0 6px 24px ${COLORS.accent}18` : "0 2px 8px rgba(0,0,0,0.04)", textAlign: "center" }}>
              <div style={{ fontSize: "28px", marginBottom: "10px" }}>{src.icon}</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: a ? COLORS.dark : COLORS.mid, fontFamily: "'Outfit'", marginBottom: "6px" }}>{src.label}</div>
              <div style={{ fontSize: "12px", color: COLORS.mid, fontFamily: "'Outfit'", lineHeight: 1.4, opacity: a ? 1 : 0.7 }}>{src.desc}</div>
            </div>);
          })}
        </div>
        {unpolledActive.length > 0 && pollSource !== "custom" && (<div style={{ background: "#FFF8E1", border: "1.5px solid #FFE082", borderRadius: "14px", padding: "16px 20px", marginBottom: "20px", display: "flex", gap: "12px" }}>
          <span style={{ fontSize: "20px", flexShrink: 0 }}>⚠️</span>
          <div><div style={{ fontSize: "13px", fontWeight: 700, color: "#5D4037", fontFamily: "'Outfit'", marginBottom: "4px" }}>Données estimées pour {unpolledActive.length} candidat{unpolledActive.length > 1 ? "s" : ""}</div>
            <div style={{ fontSize: "12px", color: "#795548", fontFamily: "'Outfit'", lineHeight: 1.5 }}>{unpolledActive.map((p, i) => { const c = getSelected(p); return <span key={p.tag}><strong>{c.name}</strong> — données basées sur <em>{c.pollGroup}</em>{i < unpolledActive.length - 1 ? ". " : "."}</span>; })}</div>
          </div>
        </div>)}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'" }}>Points de départ</span>
          <span style={{ fontSize: "12px", fontFamily: "'Space Mono'", fontWeight: 600, padding: "4px 10px", borderRadius: "8px", background: `${COLORS.light}30`, color: COLORS.mid }}>
            Total : {pollSource === "custom" ? activeParties.reduce((s, p) => s + getSelected(p).startCustom, 0).toFixed(1) : activeParties.reduce((s, p) => s + (pollSource === "agrege" ? getSelected(p).startAgrege : getSelected(p).startDebiaise), 0)}%
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {activeParties.map(p => <StartingPointRow key={p.tag} partyData={p} source={pollSource} onUpdate={(f, v) => updateVariant(p.tag, f, v)} />)}
        </div>
      </div>)}

      {step === 3 && (<div>
        <div style={{ background: "#fff", borderRadius: "14px", padding: "16px 20px", marginBottom: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "22px" }}>{POLL_SOURCES.find(s => s.id === pollSource).icon}</span>
          <div><div style={{ fontSize: "13px", fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'" }}>Source : {POLL_SOURCES.find(s => s.id === pollSource).label}</div>
            <div style={{ fontSize: "11px", color: COLORS.mid, fontFamily: "'Outfit'" }}>{activeParties.length} candidats · {unpolledActive.length > 0 ? `${unpolledActive.length} estimation(s)` : "tous sondés"}</div>
          </div>
        </div>
        <ReviewTable activeParties={activeParties} source={pollSource} />
      </div>)}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", gap: "12px" }}>
        <button onClick={() => setStep(Math.max(0, step - 1))} style={{ background: "#fff", border: `2px solid ${COLORS.light}`, borderRadius: "12px", padding: "14px 28px", fontSize: "15px", fontWeight: 600, fontFamily: "'Outfit'", color: COLORS.mid, cursor: "pointer", opacity: step === 0 ? 0.4 : 1, pointerEvents: step === 0 ? "none" : "auto" }}>← Précédent</button>
        {step < 3 ? (<button onClick={() => { setStep(step + 1); setActiveConfig(null); }} disabled={step === 0 && activeParties.length < 2} style={{ background: activeParties.length < 2 && step === 0 ? COLORS.light : `linear-gradient(135deg,${COLORS.mid},${COLORS.dark})`, border: "none", borderRadius: "12px", padding: "14px 32px", fontSize: "15px", fontWeight: 700, fontFamily: "'Outfit'", color: "#fff", cursor: activeParties.length < 2 && step === 0 ? "not-allowed" : "pointer", boxShadow: `0 4px 16px ${COLORS.dark}30` }}>Suivant →</button>
        ) : (<button onClick={launchSim} style={{ background: `linear-gradient(135deg,${COLORS.accent},#FF7B73)`, border: "none", borderRadius: "12px", padding: "14px 40px", fontSize: "16px", fontWeight: 700, fontFamily: "'Outfit'", color: "#fff", cursor: "pointer", boxShadow: `0 6px 24px ${COLORS.accent}40`, display: "flex", alignItems: "center", gap: "10px" }}>🗳️  Lancer la simulation</button>)}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: COLORS.cream, fontFamily: "'Outfit', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Space+Mono:wght@400;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes pulse { 0%, 100% { box-shadow: 0 8px 30px rgba(255,88,77,0.3); } 50% { box-shadow: 0 8px 50px rgba(255,88,77,0.5); } }
        @keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        body { background: ${COLORS.cream}; }
        input[type="range"] { -webkit-appearance: auto; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: ${COLORS.cream}; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.light}; border-radius: 4px; }
        .recharts-cartesian-grid-horizontal line, .recharts-cartesian-grid-vertical line { stroke-opacity: 0.5; }
      `}</style>
      <FloatingShape top="5%" left="5%" size="120px" color={COLORS.light} delay={0} shape="circle" />
      <FloatingShape top="15%" left="80%" size="80px" color={COLORS.mid} delay={1} shape="square" />
      <FloatingShape top="60%" left="3%" size="60px" color={COLORS.accent} delay={2} shape="blob" />
      <FloatingShape top="70%" left="85%" size="100px" color={COLORS.light} delay={1.5} shape="circle" />

      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", position: "relative", zIndex: 10 }}>
        <div onClick={goHome} style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: `linear-gradient(135deg,${COLORS.accent},#FF7B73)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${COLORS.accent}40` }}><span style={{ fontSize: "20px" }}>🗳️</span></div>
          <span style={{ fontWeight: 800, fontSize: "18px", color: COLORS.dark, letterSpacing: "-0.5px" }}>quiprésident<span style={{ color: COLORS.accent }}>.fr</span></span>
        </div>
        <div style={{ display: "flex", gap: "32px" }}>
          {[{ label: "Méthodologie", view: "methodologie" }, { label: "Résultats", view: "results" }, { label: "À propos", view: "apropos" }].map(i => <a key={i.label} href="#" onClick={e => { e.preventDefault(); setTransition(true); setTimeout(() => { setView(i.view); setTransition(false); }, 400); }} style={{ color: view === i.view ? COLORS.dark : COLORS.mid, textDecoration: "none", fontSize: "14px", fontWeight: view === i.view ? 700 : 500, fontFamily: "'Outfit'", transition: "color 0.2s" }}>{i.label}</a>)}
        </div>
      </nav>

      <div style={{ position: "relative", zIndex: 5 }}>
        {view === "home" && renderHome()}
        {view === "wizard" && renderWizard()}
        {view === "results" && <ResultsScreen activeParties={activeParties} source={pollSource} onBack={goHome} />}
        {view === "methodologie" && <MethodologiePage onBack={goHome} />}
        {view === "apropos" && <AProposPage onBack={goHome} />}
      </div>

      <div style={{ height: "4px", background: `linear-gradient(90deg,${COLORS.accent},${COLORS.mid},${COLORS.light},${COLORS.accent})`, backgroundSize: "200% 100%", animation: "shimmer 4s linear infinite" }} />
    </div>
  );
}
