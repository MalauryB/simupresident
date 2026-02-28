"use client";

import { useState } from "react";
import type { PartyData } from "@/types/simulation";
import { useSimulation } from "@/lib/simulation-context";
import { getSelected } from "@/lib/simulation";
import { Slider } from "../ui/Slider";
import { TrendSlider } from "./TrendSlider";
import { TriSlider } from "./TriSlider";

interface ConfigCardProps {
  partyData: PartyData;
  isActive: boolean;
  onClick: () => void;
  onUpdate: (field: string, value: number | { left: number; center: number; right: number }) => void;
}

export function ConfigCard({
  partyData,
  isActive,
  onClick,
  onUpdate,
}: ConfigCardProps) {
  const { partyColors } = useSimulation();
  const colors = partyColors[partyData.tag] ?? {
    bg: "#556C96",
    fg: "#FFFFFF",
    accent: "#556C96",
    chart: "#556C96",
  };
  const selected = getSelected(partyData);

  return (
    <div
      className={`overflow-hidden rounded-xl border transition-all duration-200 ${
        isActive
          ? "border-gray-300 bg-white shadow-sm"
          : "border-gray-200 bg-white"
      }`}
    >
      {/* Header - clickable to expand/collapse */}
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
      >
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

        {/* Name and party */}
        <div className="flex flex-col gap-0.5 overflow-hidden">
          <span className="truncate text-sm font-semibold text-gray-900">
            {selected.name}
          </span>
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: colors.accent }}
          >
            {partyData.tag}
          </span>
        </div>

        {/* Expand/collapse chevron */}
        <div className="ml-auto flex-shrink-0">
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
              isActive ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      {isActive && (
        <div className="flex flex-col gap-5 border-t border-gray-100 px-4 py-4">
          {/* Attractivite slider */}
          <Slider
            value={selected.attractivite}
            onChange={(v) => onUpdate("attractivite", v)}
            label="Attractivit\u00e9"
            color={colors.accent}
          />

          {/* Barrage slider */}
          <Slider
            value={selected.barrage}
            onChange={(v) => onUpdate("barrage", v)}
            label="Taux de barrage"
            color="#FF584D"
          />

          {/* Tendance slider */}
          <TrendSlider
            value={selected.tendance}
            onChange={(v) => onUpdate("tendance", v)}
          />

          {/* Ideology tri-slider */}
          <TriSlider
            left={selected.left}
            center={selected.center}
            right={selected.right}
            onChange={(values) => onUpdate("ideology", values)}
          />
        </div>
      )}
    </div>
  );
}
