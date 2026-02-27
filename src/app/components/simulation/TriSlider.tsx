"use client";

interface TriValues {
  left: number;
  center: number;
  right: number;
}

interface TriSliderProps {
  left: number;
  center: number;
  right: number;
  onChange: (values: TriValues) => void;
}

const COLORS = {
  left: "#E63946",
  center: "#FFB800",
  right: "#0066CC",
} as const;

const LABELS = {
  left: "Gauche",
  center: "Centre",
  right: "Droite",
} as const;

function normalize(values: TriValues): TriValues {
  const sum = values.left + values.center + values.right;
  if (sum === 0) return { left: 1 / 3, center: 1 / 3, right: 1 / 3 };
  return {
    left: values.left / sum,
    center: values.center / sum,
    right: values.right / sum,
  };
}

export function TriSlider({ left, center, right, onChange }: TriSliderProps) {
  const total = left + center + right;
  const norm = normalize({ left, center, right });

  const handleChange = (key: keyof TriValues, raw: number) => {
    const current = { left, center, right };
    current[key] = raw;
    const normalized = normalize(current);
    onChange(normalized);
  };

  const pctLeft = (norm.left * 100).toFixed(0);
  const pctCenter = (norm.center * 100).toFixed(0);
  const pctRight = (norm.right * 100).toFixed(0);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-gray-700">
        Profil idéologique
      </label>

      {/* Stacked color bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        <div
          className="transition-all duration-200"
          style={{
            width: `${norm.left * 100}%`,
            backgroundColor: COLORS.left,
          }}
        />
        <div
          className="transition-all duration-200"
          style={{
            width: `${norm.center * 100}%`,
            backgroundColor: COLORS.center,
          }}
        />
        <div
          className="transition-all duration-200"
          style={{
            width: `${norm.right * 100}%`,
            backgroundColor: COLORS.right,
          }}
        />
      </div>

      {/* Three columns */}
      <div className="grid grid-cols-3 gap-3">
        {(["left", "center", "right"] as const).map((key) => {
          const color = COLORS[key];
          const label = LABELS[key];
          const val = norm[key];
          const pct = (val * 100).toFixed(0);

          return (
            <div key={key} className="flex flex-col items-center gap-1.5">
              {/* Label */}
              <span
                className="text-xs font-semibold uppercase tracking-wide"
                style={{ color }}
              >
                {label}
              </span>

              {/* Large value display */}
              <span
                className="font-mono text-2xl font-bold"
                style={{ color }}
              >
                {pct}
                <span className="text-sm font-normal">%</span>
              </span>

              {/* Range input */}
              <div className="relative h-1.5 w-full rounded-full bg-gray-200">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
                  style={{
                    width: `${val * 100}%`,
                    backgroundColor: color,
                  }}
                />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={val}
                  onChange={(e) =>
                    handleChange(key, parseFloat(e.target.value))
                  }
                  className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent
                    [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:appearance-none
                    [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:bg-white
                    [&::-moz-range-thumb]:shadow-sm
                    [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none
                    [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:bg-white
                    [&::-webkit-slider-thumb]:shadow-sm"
                />
              </div>

              <style>{`
                .tri-slider-${key}::-webkit-slider-thumb {
                  border-color: ${color};
                }
                .tri-slider-${key}::-moz-range-thumb {
                  border-color: ${color};
                }
              `}</style>
            </div>
          );
        })}
      </div>
    </div>
  );
}
