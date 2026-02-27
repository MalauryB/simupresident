"use client";

import { getTrendColor, getTrendLabel } from "@/lib/simulation";
import { TrendArrow } from "../ui/TrendArrow";
import { TrendSparkline } from "../ui/TrendSparkline";

interface TrendSliderProps {
  value: number;
  onChange: (v: number) => void;
}

export function TrendSlider({ value, onChange }: TrendSliderProps) {
  const color = getTrendColor(value);
  const label = getTrendLabel(value);
  const percentage = value * 100;

  return (
    <div className="flex flex-col gap-2">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Tendance long terme
          </label>
          <TrendArrow value={value} />
        </div>

        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ color, backgroundColor: `${color}18` }}
          >
            {label}
          </span>
          <span
            className="rounded-md px-2 py-0.5 font-mono text-sm font-semibold"
            style={{ color, backgroundColor: `${color}15` }}
          >
            {value.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Sparkline preview */}
      <div className="flex justify-end">
        <TrendSparkline value={value} width={64} height={20} />
      </div>

      {/* Gradient slider track */}
      <div className="relative h-2.5 w-full rounded-full">
        {/* Gradient background: red to yellow to green */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(to right, #dc2626, #ea580c, #ca8a04, #65a30d, #16a34a)",
          }}
        />

        {/* Filled overlay to show position */}
        <div
          className="absolute right-0 top-0 h-full rounded-r-full bg-gray-200/70"
          style={{ width: `${100 - percentage}%` }}
        />

        {/* Range input */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent
            [&::-moz-range-thumb]:h-4.5 [&::-moz-range-thumb]:w-4.5 [&::-moz-range-thumb]:appearance-none
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-shadow
            [&::-moz-range-thumb]:hover:shadow-lg
            [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-shadow
            [&::-webkit-slider-thumb]:hover:shadow-lg"
          style={
            {
              "--thumb-bg": color,
            } as React.CSSProperties
          }
        />
      </div>

      {/* Gradient labels */}
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>Forte baisse</span>
        <span>Stable</span>
        <span>Forte hausse</span>
      </div>

      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          background-color: ${color};
        }
        input[type="range"]::-moz-range-thumb {
          background-color: ${color};
        }
      `}</style>
    </div>
  );
}
