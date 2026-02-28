"use client";

interface SliderProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
  color?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function Slider({
  value,
  onChange,
  label,
  color = "#FF584D",
  min = 0,
  max = 1,
  step = 0.01,
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  const displayValue = max <= 1 ? value.toFixed(2) : step >= 1 ? Math.round(value) : value.toFixed(1);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span
          className="rounded-md px-2 py-0.5 font-mono text-sm font-semibold"
          style={{ color, backgroundColor: `${color}15` }}
        >
          {displayValue}
        </span>
      </div>

      <div className="relative h-2 w-full rounded-full bg-gray-200">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-150"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent
            [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:shadow-sm [&::-moz-range-thumb]:transition-shadow
            [&::-moz-range-thumb]:hover:shadow-md
            [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:transition-shadow
            [&::-webkit-slider-thumb]:hover:shadow-md"
          style={
            {
              "--thumb-border-color": color,
            } as React.CSSProperties
          }
        />
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          border-color: ${color};
        }
        input[type="range"]::-moz-range-thumb {
          border-color: ${color};
        }
      `}</style>
    </div>
  );
}
