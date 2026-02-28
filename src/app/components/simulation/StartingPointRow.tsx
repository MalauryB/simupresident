"use client";

import type { PartyData } from "@/types/simulation";
import { useSimulation } from "@/lib/simulation-context";
import { getSelected } from "@/lib/simulation";

interface StartingPointRowProps {
  partyData: PartyData;
  source: string;
  onUpdate: (value: number) => void;
}

export function StartingPointRow({
  partyData,
  source,
  onUpdate,
}: StartingPointRowProps) {
  const { partyColors } = useSimulation();
  const colors = partyColors[partyData.tag] ?? {
    bg: "#556C96",
    fg: "#FFFFFF",
    accent: "#556C96",
    chart: "#556C96",
  };
  const selected = getSelected(partyData);

  const startValue =
    source === "agrege"
      ? selected.startAgrege
      : source === "debiaise"
        ? selected.startDebiaise
        : selected.startCustom;

  const isCustom = source === "custom";
  const isNotPolled = !selected.polled;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 transition-colors hover:bg-gray-50/50">
      {/* Avatar */}
      <div
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
        style={{
          background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent})`,
          color: colors.fg,
        }}
      >
        {selected.initials}
      </div>

      {/* Name + party tag */}
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-sm font-semibold text-gray-900">
          {selected.name}
        </span>
        <span
          className="inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{
            backgroundColor: `${colors.accent}15`,
            color: colors.accent,
          }}
        >
          {partyData.tag}
        </span>
      </div>

      {/* Warning badge for non-polled candidates */}
      {isNotPolled && (
        <div className="flex flex-shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5">
          <svg
            className="h-3.5 w-3.5 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-[10px] font-medium text-amber-600">
            {selected.pollGroup ?? "Non sond\u00e9"}
          </span>
        </div>
      )}

      {/* Value display or editable slider */}
      <div className="ml-auto flex flex-shrink-0 items-center gap-3">
        {isCustom ? (
          <>
            <input
              type="range"
              min={0}
              max={50}
              step={0.5}
              value={startValue}
              onChange={(e) => onUpdate(parseFloat(e.target.value))}
              className="h-1.5 w-24 cursor-pointer appearance-none rounded-full bg-gray-200
                [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:appearance-none
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:bg-white
                [&::-moz-range-thumb]:shadow-sm
                [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:shadow-sm"
              style={
                {
                  "--thumb-color": colors.accent,
                } as React.CSSProperties
              }
            />
            <style>{`
              input[type="range"]::-webkit-slider-thumb {
                border-color: ${colors.accent};
              }
              input[type="range"]::-moz-range-thumb {
                border-color: ${colors.accent};
              }
            `}</style>
          </>
        ) : null}

        <span
          className="min-w-[3rem] rounded-md px-2 py-1 text-center font-mono text-sm font-bold"
          style={{
            color: colors.accent,
            backgroundColor: `${colors.accent}12`,
          }}
        >
          {startValue}%
        </span>
      </div>
    </div>
  );
}
