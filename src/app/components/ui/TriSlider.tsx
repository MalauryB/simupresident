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

function normalize(l: number, c: number, r: number) {
  const s = l + c + r;
  if (s === 0) return { left: 0.33, center: 0.34, right: 0.33 };
  return {
    left: +((l / s).toFixed(2)),
    center: +((c / s).toFixed(2)),
    right: +((r / s).toFixed(2)),
  };
}

export function TriSlider({ left, center, right, onChange }: TriSliderProps) {
  const vals = { left, center, right };

  const handleChange = (key: "left" | "center" | "right", v: number) => {
    const raw = { ...vals, [key]: v };
    onChange(normalize(raw.left, raw.center, raw.right));
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
