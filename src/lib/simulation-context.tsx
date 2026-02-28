"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type { PartyData, PartyColors, PollSource } from "@/types/simulation";
import { DEFAULT_PARTIES, PARTY_COLORS, POLL_SOURCES } from "@/lib/constants";
import { getSelected } from "@/lib/simulation";

interface SimulationContextValue {
  parties: PartyData[];
  pollSource: string;
  activeParties: PartyData[];
  partyColors: Record<string, PartyColors>;
  pollSources: PollSource[];
  loading: boolean;
  gammaRejetED: number;
  gammaRejetEG: number;
  toggleParty: (tag: string) => void;
  switchVariant: (tag: string, idx: number) => void;
  updateVariant: (tag: string, field: string, value: number | { left: number; center: number; right: number }) => void;
  setPollSource: (source: string) => void;
  setGammaRejetED: (v: number) => void;
  setGammaRejetEG: (v: number) => void;
  selectAll: () => void;
  unpolledActive: PartyData[];
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [parties, setParties] = useState<PartyData[]>(DEFAULT_PARTIES);
  const [partyColors, setPartyColors] = useState<Record<string, PartyColors>>(PARTY_COLORS);
  const [pollSources, setPollSources] = useState<PollSource[]>(POLL_SOURCES);
  const [pollSource, setPollSource] = useState("agrege");
  const [loading, setLoading] = useState(true);
  const [gammaRejetED, setGammaRejetED] = useState(3.5541198);
  const [gammaRejetEG, setGammaRejetEG] = useState(0.6);

  // Charger les données depuis Supabase au mount
  useEffect(() => {
    fetch("/api/initial-data")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement données");
        return res.json();
      })
      .then((data) => {
        if (data.parties?.length) {
          // Fusionner : garder les photoUrl des constantes si la BDD retourne null
          const fallbackByTag: Record<string, Record<number, string | null>> = {};
          for (const dp of DEFAULT_PARTIES) {
            fallbackByTag[dp.tag] = {};
            dp.variants.forEach((v, i) => { fallbackByTag[dp.tag][i] = v.photoUrl; });
          }
          const merged = (data.parties as PartyData[]).map((p) => ({
            ...p,
            variants: p.variants.map((v, i) => ({
              ...v,
              photoUrl: v.photoUrl ?? fallbackByTag[p.tag]?.[i] ?? null,
            })),
          }));
          setParties(merged);
        }
        if (data.partyColors) setPartyColors(data.partyColors);
        if (data.pollSources?.length) setPollSources(data.pollSources);
      })
      .catch(() => {
        // En cas d'erreur, on garde les fallback (constantes)
      })
      .finally(() => setLoading(false));
  }, []);

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
        partyColors,
        pollSources,
        loading,
        gammaRejetED,
        gammaRejetEG,
        toggleParty,
        switchVariant,
        updateVariant,
        setPollSource,
        setGammaRejetED,
        setGammaRejetEG,
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
