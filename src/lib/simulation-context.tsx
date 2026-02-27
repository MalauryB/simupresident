"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { PartyData } from "@/types/simulation";
import { DEFAULT_PARTIES } from "@/lib/constants";
import { getSelected } from "@/lib/simulation";

interface SimulationContextValue {
  parties: PartyData[];
  pollSource: string;
  activeParties: PartyData[];
  toggleParty: (tag: string) => void;
  switchVariant: (tag: string, idx: number) => void;
  updateVariant: (tag: string, field: string, value: number | { left: number; center: number; right: number }) => void;
  setPollSource: (source: string) => void;
  selectAll: () => void;
  unpolledActive: PartyData[];
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [parties, setParties] = useState<PartyData[]>(DEFAULT_PARTIES);
  const [pollSource, setPollSource] = useState("agrege");

  const activeParties = parties.filter((p) => p.active);
  const unpolledActive = activeParties.filter((p) => !getSelected(p).polled);

  const toggleParty = useCallback((tag: string) => {
    setParties((prev) => prev.map((p) => (p.tag === tag ? { ...p, active: !p.active } : p)));
  }, []);

  const switchVariant = useCallback((tag: string, idx: number) => {
    setParties((prev) => prev.map((p) => (p.tag === tag ? { ...p, selectedIdx: idx } : p)));
  }, []);

  const updateVariant = useCallback(
    (tag: string, field: string, value: number | { left: number; center: number; right: number }) => {
      setParties((prev) =>
        prev.map((p) => {
          if (p.tag !== tag) return p;
          const nv = [...p.variants];
          if (field === "ideology" && typeof value === "object") {
            nv[p.selectedIdx] = { ...nv[p.selectedIdx], left: value.left, center: value.center, right: value.right };
          } else if (typeof value === "number") {
            nv[p.selectedIdx] = { ...nv[p.selectedIdx], [field]: value };
          }
          return { ...p, variants: nv };
        })
      );
    },
    []
  );

  const selectAll = useCallback(() => {
    setParties((prev) => prev.map((p) => ({ ...p, active: true })));
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        parties,
        pollSource,
        activeParties,
        toggleParty,
        switchVariant,
        updateVariant,
        setPollSource,
        selectAll,
        unpolledActive,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error("useSimulation must be used within SimulationProvider");
  return ctx;
}
