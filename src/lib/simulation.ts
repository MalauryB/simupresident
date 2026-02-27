import type { PartyData, SimulationData, CandidatVariant, TrajectoryPoint } from "@/types/simulation";

export function getSelected(p: PartyData): CandidatVariant {
  return p.variants[p.selectedIdx];
}

export function getTrendColor(v: number): string {
  if (v >= 0.65) return "#16a34a";
  if (v >= 0.55) return "#65a30d";
  if (v >= 0.45) return "#ca8a04";
  if (v >= 0.35) return "#ea580c";
  return "#dc2626";
}

export function getTrendLabel(v: number): string {
  if (v >= 0.75) return "Forte hausse";
  if (v >= 0.6) return "Hausse";
  if (v >= 0.45) return "Stable";
  if (v >= 0.3) return "Baisse";
  return "Forte baisse";
}

export function generateSimData(
  activeParties: PartyData[],
  source: string,
  days = 365
): SimulationData {
  const rng = (seed: number) => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  };
  const r = rng(42);

  const candidates = activeParties.map((p) => {
    const c = getSelected(p);
    const start =
      (source === "agrege"
        ? c.startAgrege
        : source === "debiaise"
          ? c.startDebiaise
          : c.startCustom) / 100;
    return {
      tag: p.tag,
      name: c.name,
      initials: c.initials,
      start,
      tendance: c.tendance,
      attractivite: c.attractivite,
      barrage: c.barrage,
    };
  });

  const trajectory: TrajectoryPoint[] = [];
  const current = candidates.map((c) => c.start);

  for (let d = 0; d <= days; d += 3) {
    const point: TrajectoryPoint = { jour: d };
    candidates.forEach((c, idx) => {
      const drift = (c.tendance - 0.5) * 0.0003;
      const noise = (r() - 0.5) * 0.008;
      current[idx] = Math.max(0.01, Math.min(0.55, current[idx] + drift + noise));
      const spread = 0.02 + (d / days) * 0.06 * (1 - c.attractivite);
      point[c.tag] = +current[idx].toFixed(4);
      point[`${c.tag}_hi`] = +(current[idx] + spread).toFixed(4);
      point[`${c.tag}_lo`] = +Math.max(0, current[idx] - spread).toFixed(4);
    });
    trajectory.push(point);
  }

  const finals = candidates.map((c, idx) => ({ ...c, final: current[idx] }));
  finals.sort((a, b) => b.final - a.final);

  const totalFinal = finals.reduce((s, f) => s + f.final, 0);
  const pQualif = finals.map((f, i) => {
    let p: number;
    if (i === 0) p = 0.75 + f.final * 0.3;
    else if (i === 1) p = 0.55 + f.final * 0.4;
    else p = Math.max(0.01, (f.final / totalFinal) * 1.5 - i * 0.08);
    return { ...f, pQualif: Math.min(0.99, Math.max(0.01, p)) };
  });

  const pVictoire = pQualif.map((f, i) => {
    let pv: number;
    if (i === 0) pv = f.pQualif * (1 - f.barrage) * 0.6;
    else if (i === 1) pv = f.pQualif * (1 - f.barrage) * 0.45;
    else pv = f.pQualif * (1 - f.barrage) * 0.15;
    return { ...f, pVictoire: Math.min(0.95, Math.max(0.01, pv)) };
  });

  const totalPV = pVictoire.reduce((s, f) => s + f.pVictoire, 0);
  pVictoire.forEach((f) => {
    f.pVictoire = +(f.pVictoire / totalPV).toFixed(3);
  });

  return { trajectory, probabilities: pVictoire };
}
