"use client";

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from "react";
import type { PartyData, PartyColors, PollSource } from "@/types/simulation";
import { DEFAULT_PARTIES, PARTY_COLORS, POLL_SOURCES, ELECTION_DATE } from "@/lib/constants";
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
  days: number;
  toggleParty: (tag: string) => void;
  switchVariant: (tag: string, idx: number) => void;
  updateVariant: (tag: string, field: string, value: number | { left: number; center: number; right: number }) => void;
  setPollSource: (source: string) => void;
  setGammaRejetED: (v: number) => void;
  setGammaRejetEG: (v: number) => void;
  selectAll: () => void;
  setPartiesActive: (inactiveTags: string[]) => void;
  unpolledActive: PartyData[];
}

const SimulationContext = createContext<SimulationContextValue | null>(null);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [parties, setParties] = useState<PartyData[]>(DEFAULT_PARTIES);
  const [partyColors, setPartyColors] = useState<Record<string, PartyColors>>(PARTY_COLORS);
  const [pollSources, setPollSources] = useState<PollSource[]>(POLL_SOURCES);
  const [pollSource, setPollSource] = useState("agrege");
  const [loading, setLoading] = useState(true);
  const [gammaRejetED, setGammaRejetED] = useState(4.909881);
  const [gammaRejetEG, setGammaRejetEG] = useState(2.240084);
  const days = useMemo(() => Math.max(7, Math.min(365, Math.round((ELECTION_DATE.getTime() - Date.now()) / 86_400_000))), []);

  // Charger les données depuis Supabase au mount
  useEffect(() => {
    fetch("/api/initial-data")
      .then((res) => {
        if (!res.ok) throw new Error("Erreur chargement données");
        return res.json();
      })
      .then((data) => {
        if (data.parties?.length) {
          // Construire un lookup des données BDD par tag
          const dbByTag: Record<string, PartyData> = {};
          for (const p of data.parties as PartyData[]) {
            dbByTag[p.tag] = p;
          }
          // DEFAULT_PARTIES est la structure de référence.
          // On met à jour les valeurs depuis la BDD par correspondance tag + nom de candidat.
          const merged = DEFAULT_PARTIES.map((dp) => {
            const dbParty = dbByTag[dp.tag];
            if (!dbParty) return dp; // Parti absent de la BDD (ex: nouveau PP) → garder le défaut
            return {
              ...dp,
              variants: dp.variants.map((v) => {
                const dbV = dbParty.variants.find((dv) => dv.name === v.name);
                if (!dbV) return v; // Candidat absent de la BDD → garder le défaut
                return {
                  ...dbV,
                  ...v,
                  photoUrl: dbV.photoUrl ?? v.photoUrl,
                };
              }),
            };
          });
          setParties(merged);
        }
        if (data.partyColors) setPartyColors((prev) => ({ ...prev, ...data.partyColors }));
        if (data.pollSources?.length) {
          const validIds = new Set(POLL_SOURCES.map((s) => s.id));
          setPollSources(data.pollSources.filter((s: PollSource) => validIds.has(s.id)));
        }
      })
      .catch(() => {
        // En cas d'erreur, on garde les fallback (constantes)
      })
      .finally(() => setLoading(false));
  }, []);

  const activeParties = useMemo(() => parties.filter((p) => p.active), [parties]);
  const unpolledActive = useMemo(() => activeParties.filter((p) => !getSelected(p).polled), [activeParties]);

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

  const setPartiesActive = useCallback((inactiveTags: string[]) => {
    setParties((prev) => prev.map((p) => ({ ...p, active: !inactiveTags.includes(p.tag) })));
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
        days,
        toggleParty,
        switchVariant,
        updateVariant,
        setPollSource,
        setGammaRejetED,
        setGammaRejetEG,
        selectAll,
        setPartiesActive,
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
