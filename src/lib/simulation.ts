import type {
  PartyData,
  SimulationData,
  CandidatVariant,
  TrajectoryPoint,
  ProbabilityResult,
  DuelProbability,
  SecondRoundSummary,
} from "@/types/simulation";

// ================================================================
// Port TypeScript du modèle R « Monte Carlo : courbes + 2nd tour »
// ================================================================

// ===== PRNG (Linear Congruential Generator) =====
class PRNG {
  private s: number;
  constructor(seed: number) {
    this.s = seed % 2147483647;
    if (this.s <= 0) this.s += 2147483646;
  }
  next(): number {
    this.s = (this.s * 16807) % 2147483647;
    return (this.s - 1) / 2147483646;
  }
  /** Box-Muller transform → N(0,1) */
  randn(): number {
    const u1 = this.next();
    const u2 = this.next();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}

// ===== Math Helpers =====

function softmax(x: number[]): number[] {
  const maxX = Math.max(...x);
  const ex = x.map((v) => Math.exp(v - maxX));
  const sum = ex.reduce((a, b) => a + b, 0);
  return ex.map((v) => v / sum);
}

function cosSim(a: number[], b: number[]): number {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const den = Math.sqrt(na) * Math.sqrt(nb);
  return den === 0 ? 0 : dot / den;
}

function quantile(sorted: number[], p: number): number {
  const n = sorted.length;
  if (n === 0) return 0;
  const idx = p * (n - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (idx - lo) * (sorted[hi] - sorted[lo]);
}

// ===== Simulation Configuration =====

interface SimConfig {
  T: number;
  S: number;
  sigma_f: [number, number, number];
  sigma_eps: number;
  kappa: number;
  // Vote utile (1er tour)
  tau_vote: number;
  s_v: number;
  lambda_cos: number;
  beta_viab: number;
  eps_viab: number;
  T0_offset: number;
  s_tau: number;
  psi_scale: number;
  drift_scale: number;
  // Second tour
  beta_2: number;
  alpha_abst: number;
  kappa_abst: number;
  alpha_bn: number;
  kappa_bn: number;
  gamma_rejet_ED: number;
  gamma_rejet_EG: number;
  lambda_cos_2: number;
}

const DEFAULT_CONFIG: SimConfig = {
  T: 365,
  S: 200,
  sigma_f: [0.01, 0.005, 0.01],
  sigma_eps: 0.01,
  kappa: 0,
  tau_vote: 0.1,
  s_v: 0.5,
  lambda_cos: 6,
  beta_viab: 5,
  eps_viab: 1e-4,
  T0_offset: 10,
  s_tau: 10,
  psi_scale: 16,
  drift_scale: 0.001,
  beta_2: 7,
  alpha_abst: -1.8144596,
  kappa_abst: 0.1,
  alpha_bn: -1.8144596,
  kappa_bn: 0.1,
  gamma_rejet_ED: 3.5541198,
  gamma_rejet_EG: 0.6,
  lambda_cos_2: 3,
};

// ===== Candidate Input =====

interface CandidateInput {
  tag: string;
  name: string;
  initials: string;
  v0: number;
  tendance: number;
  attractivite: number;
  W: number[];
}

// ===== Public Helpers =====

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

// ===== Vote Utile Transform =====
// Mirrors R: vote_utile_transform(v, W, psi, lambda_cos, beta_viab)

function voteUtileTransform(
  v: number[],
  W: number[][],
  psi: number[],
  cfg: SimConfig,
): number[] {
  const K = v.length;

  // Retention douce (logistique)
  const r = v.map((vk) => 1 / (1 + Math.exp(-(vk - cfg.tau_vote) / cfg.s_v)));
  const m = v.map((vk, i) => (1 - r[i]) * vk);
  const v_keep = v.map((vk, i) => r[i] * vk);

  const v_new = [...v_keep];

  for (let j = 0; j < K; j++) {
    const scores: number[] = new Array(K);
    let denom = 0;

    for (let k = 0; k < K; k++) {
      const cs = cosSim(W[j], W[k]);
      const kern = Math.pow(Math.max(0, cs), cfg.lambda_cos);
      const viab = Math.log(v[k] + cfg.eps_viab);
      const att = Math.exp(psi[k] + cfg.beta_viab * viab);
      scores[k] = kern * att;
      denom += scores[k];
    }

    if (denom <= 0) {
      denom = 0;
      for (let k = 0; k < K; k++) {
        scores[k] = Math.exp(
          cfg.beta_viab * Math.log(v[k] + cfg.eps_viab),
        );
        denom += scores[k];
      }
    }

    for (let k = 0; k < K; k++) {
      v_new[k] += m[j] * (scores[k] / denom);
    }
  }

  const vPos = v_new.map((x) => Math.max(x, 0));
  const total = vPos.reduce((a, b) => a + b, 0);
  return vPos.map((x) => x / total);
}

// ===== Simulate One Path (1er tour) =====
// Mirrors R: simulate_one()

function simulateOne(
  candidates: CandidateInput[],
  W: number[][],
  psi: number[],
  cosMat: number[][],
  cfg: SimConfig,
  rng: PRNG,
): number[][] {
  const K = candidates.length;
  const B = 3;
  const T = cfg.T;
  const T0 = T - cfg.T0_offset;
  const tau0 = T - T0;

  // Initialiser logits relatifs (baseline = dernier candidat)
  const v0 = candidates.map((c) => c.v0);
  const eta: number[][] = [];
  const v_obs: number[][] = [];

  // eta[0] = log(v0[k] / v0[K-1]) pour k=0..K-2
  const eta0: number[] = [];
  for (let k = 0; k < K - 1; k++) {
    eta0.push(Math.log(v0[k] / v0[K - 1]));
  }
  eta.push(eta0);
  v_obs.push(softmax([...eta0, 0]));

  // Drift par candidat
  const drift = candidates.map(
    (c) => (c.tendance - 0.5) * cfg.drift_scale,
  );

  for (let t = 1; t < T; t++) {
    // Chocs factoriels: nu ~ N(0, Qf)
    const nu: number[] = [];
    for (let b = 0; b < B; b++) {
      nu.push(rng.randn() * cfg.sigma_f[b]);
    }

    // Chocs idiosyncratiques: eps ~ N(0, D)
    const eps: number[] = [];
    for (let k = 0; k < K; k++) {
      eps.push(rng.randn() * cfg.sigma_eps);
    }

    // u = W * nu + eps
    const u: number[] = [];
    for (let k = 0; k < K; k++) {
      let Wnu = 0;
      for (let b = 0; b < B; b++) {
        Wnu += W[k][b] * nu[b];
      }
      u.push(Wnu + eps[k]);
    }

    // Drift ciblé + compensation par proximité cosinus
    for (let k = 0; k < K; k++) {
      if (Math.abs(drift[k]) < 1e-10) continue;

      u[k] += drift[k];

      let sumSim = 0;
      for (let j = 0; j < K; j++) {
        if (j !== k) sumSim += cosMat[k][j];
      }

      if (sumSim > 0) {
        for (let j = 0; j < K; j++) {
          if (j !== k) {
            u[j] -= drift[k] * (cosMat[k][j] / sumSim);
          }
        }
      }
    }

    // Update logits relatifs (exclure baseline K)
    const u_rel = u.slice(0, K - 1);
    const eta_t: number[] = [];
    for (let k = 0; k < K - 1; k++) {
      eta_t.push((1 - cfg.kappa) * eta[t - 1][k] + u_rel[k]);
    }
    eta.push(eta_t);

    // Parts de base
    const v_base = softmax([...eta_t, 0]);

    // Activation vote utile (sigmoïde temporelle)
    const tau_t = T - t;
    const a_t = 1 / (1 + Math.exp((tau_t - tau0) / cfg.s_tau));

    // Transformation vote utile
    const v_tilde = voteUtileTransform(v_base, W, psi, cfg);

    // Mixture
    const v_mix: number[] = [];
    for (let k = 0; k < K; k++) {
      v_mix.push((1 - a_t) * v_base[k] + a_t * v_tilde[k]);
    }

    // Normalisation
    const total = v_mix.reduce((a, b) => a + b, 0);
    v_obs.push(v_mix.map((x) => x / total));
  }

  return v_obs;
}

// ===== Second tour =====
// Mirrors R: simulate_second_round(v1, W, ...)

interface SecondRoundResult {
  A: number;
  B: number;
  V2_expr: [number, number];
  V2_ins: [number, number, number, number];
}

function simulateSecondRound(
  v1: number[],
  W: number[][],
  rho: number[],
  cfg: SimConfig,
): SecondRoundResult {
  const K = v1.length;

  // Trouver les 2 finalistes
  const indices = v1
    .map((v, i) => ({ v, i }))
    .sort((a, b) => b.v - a.v);
  const A = indices[0].i;
  const B = indices[1].i;

  // Matrice de transition M (K × 4) : [vote A, vote B, abstention, blanc/nul]
  const V2_ins: [number, number, number, number] = [0, 0, 0, 0];

  for (let s = 0; s < K; s++) {
    const simA = Math.pow(
      Math.max(0, cosSim(W[s], W[A])),
      cfg.lambda_cos_2,
    );
    const simB = Math.pow(
      Math.max(0, cosSim(W[s], W[B])),
      cfg.lambda_cos_2,
    );
    const dist = 1 - Math.max(simA, simB);

    const lA = cfg.beta_2 * simA - rho[A];
    const lB = cfg.beta_2 * simB - rho[B];
    const lAbst = cfg.alpha_abst + cfg.kappa_abst * dist;
    const lBN = cfg.alpha_bn + cfg.kappa_bn * dist;

    const probs = softmax([lA, lB, lAbst, lBN]);

    // Pondérer par la part au 1er tour
    for (let c = 0; c < 4; c++) {
      V2_ins[c] += v1[s] * probs[c];
    }
  }

  // Parts exprimées
  const expr = V2_ins[0] + V2_ins[1];
  const V2_expr: [number, number] = [V2_ins[0] / expr, V2_ins[1] / expr];

  return { A, B, V2_expr, V2_ins };
}

// ================================================================
// PIPELINE MONTE CARLO PRINCIPAL
// ================================================================

export function generateSimData(
  activeParties: PartyData[],
  source: string,
  days = 365,
  gammaRejetED?: number,
  gammaRejetEG?: number,
): SimulationData {
  const cfg: SimConfig = {
    ...DEFAULT_CONFIG,
    T: days,
    ...(gammaRejetED !== undefined && { gamma_rejet_ED: gammaRejetED }),
    ...(gammaRejetEG !== undefined && { gamma_rejet_EG: gammaRejetEG }),
  };
  const K = activeParties.length;

  // --- Construire les entrées candidats ---
  const candidates: CandidateInput[] = activeParties.map((p) => {
    const c = getSelected(p);
    const startRaw =
      source === "agrege"
        ? c.startAgrege
        : source === "debiaise"
          ? c.startDebiaise
          : c.startCustom;
    const w = [c.left, c.center, c.right];
    // Fallback si idéologie nulle
    if (w[0] + w[1] + w[2] === 0) {
      w[0] = 0.33;
      w[1] = 0.34;
      w[2] = 0.33;
    }
    return {
      tag: p.tag,
      name: c.name,
      initials: c.initials,
      v0: startRaw / 100,
      tendance: c.tendance,
      attractivite: c.attractivite,
      W: w,
    };
  });

  // Normaliser v0 pour somme = 1
  const totalV0 = candidates.reduce((s, c) => s + c.v0, 0);
  if (totalV0 > 0) {
    candidates.forEach((c) => {
      c.v0 /= totalV0;
    });
  }

  // Matrice W (K × 3)
  const W = candidates.map((c) => c.W);

  // Psi : biais structurel pour le vote utile
  const rawPsi = candidates.map((c) => c.attractivite * cfg.psi_scale);
  const meanPsi = rawPsi.reduce((a, b) => a + b, 0) / K;
  const psi = rawPsi.map((p) => p - meanPsi);

  // Rho : pénalité barrage pour le second tour (modèle R)
  // rho[k] = gamma_rejet_ED * W[k, droite] + gamma_rejet_EG * W[k, gauche]
  const rho = W.map((w) => cfg.gamma_rejet_ED * w[2] + cfg.gamma_rejet_EG * w[0]);

  // Matrice de similarité cosinus (pré-calculée)
  const cosMat: number[][] = [];
  for (let i = 0; i < K; i++) {
    cosMat.push([]);
    for (let j = 0; j < K; j++) {
      cosMat[i].push(cosSim(W[i], W[j]));
    }
  }

  // --- Monte Carlo ---
  const rng = new PRNG(42);
  const S = cfg.S;
  const T = cfg.T;

  // Stockage des trajectoires (S × T × K)
  const vobs_arr: number[][][] = [];

  // Stockage second tour
  const A_ids: number[] = [];
  const B_ids: number[] = [];
  const pA_expr: number[] = [];
  const pB_expr: number[] = [];
  const V2_ins_arr: number[][] = [];

  for (let s = 0; s < S; s++) {
    const v_obs = simulateOne(candidates, W, psi, cosMat, cfg, rng);
    vobs_arr.push(v_obs);

    if (K >= 2) {
      const v1 = v_obs[T - 1];
      const r2 = simulateSecondRound(v1, W, rho, cfg);
      A_ids.push(r2.A);
      B_ids.push(r2.B);
      pA_expr.push(r2.V2_expr[0]);
      pB_expr.push(r2.V2_expr[1]);
      V2_ins_arr.push(r2.V2_ins);
    }
  }

  // ===== Statistiques =====

  // 1. Trajectoire : médiane + IC 80% (quantiles 10%/90%), échantillonné tous les 3 jours
  const trajectory: TrajectoryPoint[] = [];
  const step = 3;

  for (let t = 0; t < T; t += step) {
    const point: TrajectoryPoint = { jour: t };
    for (let k = 0; k < K; k++) {
      const values = vobs_arr
        .map((sim) => sim[t][k])
        .sort((a, b) => a - b);
      point[candidates[k].tag] = +quantile(values, 0.5).toFixed(4);
      point[`${candidates[k].tag}_lo`] = +quantile(values, 0.1).toFixed(4);
      point[`${candidates[k].tag}_hi`] = +quantile(values, 0.9).toFixed(4);
    }
    trajectory.push(point);
  }

  // Inclure le dernier jour s'il n'est pas déjà inclus
  if ((T - 1) % step !== 0) {
    const t = T - 1;
    const point: TrajectoryPoint = { jour: t };
    for (let k = 0; k < K; k++) {
      const values = vobs_arr
        .map((sim) => sim[t][k])
        .sort((a, b) => a - b);
      point[candidates[k].tag] = +quantile(values, 0.5).toFixed(4);
      point[`${candidates[k].tag}_lo`] = +quantile(values, 0.1).toFixed(4);
      point[`${candidates[k].tag}_hi`] = +quantile(values, 0.9).toFixed(4);
    }
    trajectory.push(point);
  }

  // 2. P(qualification) : fraction de simulations où le candidat est dans le top 2
  const qualifCounts = new Array(K).fill(0);
  for (let s = 0; s < S; s++) {
    if (K >= 2) {
      qualifCounts[A_ids[s]]++;
      qualifCounts[B_ids[s]]++;
    }
  }
  const pQualif = K >= 2 ? qualifCounts.map((c: number) => c / S) : candidates.map(() => 1);

  // 3. P(victoire) : fraction de simulations où le candidat gagne
  const winCounts = new Array(K).fill(0);
  for (let s = 0; s < S; s++) {
    if (K >= 2) {
      if (pA_expr[s] > 0.5) {
        winCounts[A_ids[s]]++;
      } else {
        winCounts[B_ids[s]]++;
      }
    }
  }
  const pVictoire = K >= 2 ? winCounts.map((c: number) => c / S) : candidates.map(() => 1);

  // Parts finales (médiane du dernier jour)
  const finalShares = candidates.map((_, k) => {
    const values = vobs_arr
      .map((sim) => sim[T - 1][k])
      .sort((a, b) => a - b);
    return quantile(values, 0.5);
  });

  // Construire ProbabilityResult[]
  const probabilities: ProbabilityResult[] = candidates.map((c, k) => ({
    tag: c.tag,
    name: c.name,
    initials: c.initials,
    start: c.v0,
    tendance: c.tendance,
    attractivite: c.attractivite,
    final: finalShares[k],
    pQualif: pQualif[k],
    pVictoire: pVictoire[k],
  }));

  // 4. Duels les plus probables
  const duels: DuelProbability[] = [];
  if (K >= 2) {
    const duelMap = new Map<
      string,
      { count: number; sharesA: number[]; sharesB: number[]; a: number; b: number }
    >();

    for (let s = 0; s < S; s++) {
      const a = Math.min(A_ids[s], B_ids[s]);
      const b = Math.max(A_ids[s], B_ids[s]);
      const key = `${a}-${b}`;

      if (!duelMap.has(key)) {
        duelMap.set(key, { count: 0, sharesA: [], sharesB: [], a, b });
      }
      const d = duelMap.get(key)!;
      d.count++;

      if (A_ids[s] === a) {
        d.sharesA.push(pA_expr[s]);
        d.sharesB.push(pB_expr[s]);
      } else {
        d.sharesA.push(pB_expr[s]);
        d.sharesB.push(pA_expr[s]);
      }
    }

    for (const [, d] of duelMap) {
      duels.push({
        tagA: candidates[d.a].tag,
        tagB: candidates[d.b].tag,
        nameA: candidates[d.a].name,
        nameB: candidates[d.b].name,
        probability: d.count / S,
        avgShareA:
          d.sharesA.reduce((a, b) => a + b, 0) / d.sharesA.length,
        avgShareB:
          d.sharesB.reduce((a, b) => a + b, 0) / d.sharesB.length,
      });
    }

    duels.sort((a, b) => b.probability - a.probability);
  }

  // 5. Résumé second tour
  let secondRound: SecondRoundSummary;

  if (K >= 2 && V2_ins_arr.length > 0) {
    const turnout = V2_ins_arr
      .map((v) => 1 - v[2])
      .sort((a, b) => a - b);
    const blancNul = V2_ins_arr
      .map((v) => v[3])
      .sort((a, b) => a - b);

    secondRound = {
      participation: {
        lo: quantile(turnout, 0.125),
        median: quantile(turnout, 0.5),
        hi: quantile(turnout, 0.875),
      },
      blancNul: {
        lo: quantile(blancNul, 0.125),
        median: quantile(blancNul, 0.5),
        hi: quantile(blancNul, 0.875),
      },
    };
  } else {
    secondRound = {
      participation: { lo: 0, median: 0, hi: 0 },
      blancNul: { lo: 0, median: 0, hi: 0 },
    };
  }

  return { trajectory, probabilities, duels, secondRound };
}
