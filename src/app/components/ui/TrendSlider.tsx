"use client";

import { getTrendColor, getTrendLabel } from "@/lib/simulation";

/* ── Sparkline mini-graph ── */
function TrendSparkline({ value, width = 64, height = 28 }: { value: number; width?: number; height?: number }) {
  const color = getTrendColor(value);
  const slope = (value - 0.5) * 2;
  const sY = height / 2 + slope * (height * 0.35);
  const eY = height / 2 - slope * (height * 0.35);
  const m1 = sY + (eY - sY) * 0.3 + Math.sin(value * 5) * 4;
  const m2 = sY + (eY - sY) * 0.65 - Math.cos(value * 3) * 3;
  const id = `tg-${Math.round(value * 100)}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.25} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path
        d={`M 4 ${sY} C ${width * 0.3} ${m1}, ${width * 0.55} ${m2}, ${width - 4} ${eY} L ${width - 4} ${height} L 4 ${height} Z`}
        fill={`url(#${id})`}
      />
      <path
        d={`M 4 ${sY} C ${width * 0.3} ${m1}, ${width * 0.55} ${m2}, ${width - 4} ${eY}`}
        stroke={color}
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={width - 4} cy={eY} r={3} fill={color} />
    </svg>
  );
}

/* ── Rotating arrow indicator ── */
function TrendArrow({ value, size = 20 }: { value: number; size?: number }) {
  const color = getTrendColor(value);
  const rot = (1 - value) * 180 - 90;

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{ width: size + 8, height: size + 8, backgroundColor: `${color}18` }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        style={{ transform: `rotate(${rot}deg)`, transition: "transform 0.4s ease" }}
      >
        <path
          d="M5 12h14M13 6l6 6-6 6"
          stroke={color}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/* ── Main TrendSlider ── */
interface TrendSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export function TrendSlider({ value, onChange }: TrendSliderProps) {
  const color = getTrendColor(value);
  const pct = value * 100;
  const label = getTrendLabel(value);
  const arrow = value >= 0.6 ? "\u2197" : value >= 0.45 ? "\u2192" : "\u2198";

  return (
    <div>
      {/* Header row */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-700">
          Tendance long terme
        </span>
        <div className="flex items-center gap-2">
          <span
            className="rounded-md px-2 py-0.5 text-[11px] font-bold"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {label}
          </span>
          <span className="font-mono text-sm font-bold" style={{ color }}>
            {value.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div
        className="flex items-center gap-3 rounded-xl border px-4 py-3"
        style={{ backgroundColor: `${color}08`, borderColor: `${color}20` }}
      >
        <TrendArrow value={value} size={20} />
        <TrendSparkline value={value} width={64} height={28} />

        {/* Gradient slider */}
        <div className="relative flex flex-1 items-center" style={{ height: 32 }}>
          {/* Background gradient track */}
          <div
            className="absolute h-2.5 w-full rounded-full"
            style={{
              background: "linear-gradient(90deg,#dc2626,#ea580c,#ca8a04,#65a30d,#16a34a)",
              opacity: 0.3,
            }}
          />
          {/* Active fill */}
          <div
            className="absolute h-2.5 rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg,#dc2626,${color})`,
              opacity: 0.6,
            }}
          />
          {/* Invisible range input */}
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="absolute z-10 h-full w-full cursor-pointer appearance-none bg-transparent
              [&::-moz-range-thumb]:h-0 [&::-moz-range-thumb]:w-0 [&::-moz-range-thumb]:appearance-none
              [&::-webkit-slider-thumb]:h-0 [&::-webkit-slider-thumb]:w-0 [&::-webkit-slider-thumb]:appearance-none"
          />
          {/* Custom thumb */}
          <div
            className="pointer-events-none absolute flex h-6 w-6 items-center justify-center rounded-full border-[3px] bg-white"
            style={{
              left: `calc(${pct}% - 12px)`,
              borderColor: color,
              boxShadow: `0 2px 10px ${color}50`,
            }}
          >
            <span className="text-[11px] font-black" style={{ color }}>
              {arrow}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
