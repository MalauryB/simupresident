"use client";

import type { PartyData } from "@/types/simulation";
import { useSimulation } from "@/lib/simulation-context";
import { getSelected } from "@/lib/simulation";

interface PartySelectCardProps {
  partyData: PartyData;
  onToggle: () => void;
  onSwitchVariant: (idx: number) => void;
}

export function PartySelectCard({
  partyData,
  onToggle,
  onSwitchVariant,
}: PartySelectCardProps) {
  const { partyColors } = useSimulation();
  const colors = partyColors[partyData.tag] ?? {
    bg: "#556C96",
    fg: "#FFFFFF",
    accent: "#556C96",
    chart: "#556C96",
  };
  const selected = getSelected(partyData);
  const isActive = partyData.active;
  const hasVariants = partyData.variants.length > 1;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border-2 transition-all duration-200 ${
        isActive
          ? "shadow-md"
          : "border-gray-200 bg-white opacity-60 hover:opacity-80"
      }`}
      style={
        isActive
          ? {
              borderColor: colors.accent,
              boxShadow: `0 4px 14px ${colors.accent}25`,
            }
          : undefined
      }
    >
      {/* Main card body - clickable to toggle */}
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
      >
        {/* Avatar circle: photo or initials fallback */}
        <div className="relative h-11 w-11 flex-shrink-0">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold"
            style={{
              background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent})`,
              color: colors.fg,
            }}
          >
            {selected.initials}
          </div>
          {selected.photoUrl && (
            <img
              src={selected.photoUrl}
              alt={selected.name}
              className="absolute inset-0 z-10 h-11 w-11 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
        </div>

        {/* Candidate info */}
        <div className="flex flex-col gap-0.5 overflow-hidden">
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

        {/* Active indicator */}
        <div className="ml-auto flex-shrink-0">
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
              isActive ? "border-transparent" : "border-gray-300"
            }`}
            style={
              isActive
                ? { backgroundColor: colors.accent }
                : undefined
            }
          >
            {isActive && (
              <svg
                className="h-3 w-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </div>
      </button>

      {/* Variant toggle bar */}
      {hasVariants && isActive && (
        <div className="flex border-t border-gray-100">
          {partyData.variants.map((variant, idx) => {
            const isCurrent = idx === partyData.selectedIdx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onSwitchVariant(idx)}
                className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${
                  isCurrent
                    ? "text-white"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
                style={
                  isCurrent
                    ? { backgroundColor: colors.accent }
                    : undefined
                }
              >
                {variant.initials} - {variant.name.split(" ").pop()}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
