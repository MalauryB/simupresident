"use client";

interface TriSliderProps {
  left: number;
  center: number;
  right: number;
  onChange: (v: { left: number; center: number; right: number }) => void;
}

const AXES = [
  { key: "left" as const, label: "Gauche", color: "#E63946" },
  { key: "center" as const, label: "Centre", color: "#FFB800" },
  { key: "right" as const, label: "Droite", color: "#0066CC" },
];

export function TriSlider({ left, center, right, onChange }: TriSliderProps) {
  const vals = { left, center, right };

  const handleChange = (key: "left" | "center" | "right", v: number) => {
    const clamped = Math.round(Math.min(1, Math.max(0, v)) * 100) / 100;
    const otherKeys = (["left", "center", "right"] as const).filter((k) => k !== key);
    const otherSum = otherKeys.reduce((s, k) => s + vals[k], 0);
    const remaining = Math.round((1 - clamped) * 100) / 100;

    let o0: number, o1: number;
    if (otherSum > 0) {
      o0 = Math.round(((vals[otherKeys[0]] / otherSum) * remaining) * 100) / 100;
      o1 = Math.round((remaining - o0) * 100) / 100;
    } else {
      o0 = Math.round((remaining / 2) * 100) / 100;
      o1 = Math.round((remaining - o0) * 100) / 100;
    }

    const result = { left: vals.left, center: vals.center, right: vals.right };
    result[key] = clamped;
    result[otherKeys[0]] = o0;
    result[otherKeys[1]] = o1;
    onChange(result);
  };

  return (
    <div>
      <div className="mb-2">
        <span className="text-sm font-semibold text-gray-700">
          Profil id&eacute;ologique
        </span>
      </div>

      {/* Tri-color bar */}
      <div className="mb-3.5 flex h-2.5 overflow-hidden rounded-full">
        <div className="transition-all" style={{ width: `${left * 100}%`, backgroundColor: "#E63946" }} />
        <div className="transition-all" style={{ width: `${center * 100}%`, backgroundColor: "#FFB800" }} />
        <div className="transition-all" style={{ width: `${right * 100}%`, backgroundColor: "#0066CC" }} />
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-2.5">
        {AXES.map((axis) => (
          <div key={axis.key} className="flex flex-col items-center">
            <span className="text-[11px] font-semibold" style={{ color: axis.color }}>
              {axis.label}
            </span>
            <div
              className="my-1 w-full rounded-lg py-1.5 text-center font-mono text-lg font-extrabold"
              style={{
                color: "#475465",
                backgroundColor: `${axis.color}12`,
              }}
            >
              {vals[axis.key].toFixed(2)}
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={vals[axis.key]}
              aria-label={`Idéologie ${axis.label}`}
              onChange={(e) => handleChange(axis.key, parseFloat(e.target.value))}
              className="mt-1 w-full cursor-pointer"
              style={{ accentColor: axis.color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
