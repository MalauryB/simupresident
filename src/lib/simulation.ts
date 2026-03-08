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
// Port TypeScript du modèle R « simulations : courbes + 2nd tour »
// Version 2 : paramètre unique delta (dynamique)
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
    const u1 = Math.max(this.next(), Number.EPSILON);
    const u2 = this.next();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }
}

// ===== Math Helpers =====

function softmax(x: number[]): number[] {
  if (x.length === 0) return [];
  const maxX = Math.max(...x);
  const ex = x.map((v) => Math.exp(v - maxX));
  const sum = ex.reduce((a, b) => a + b, 0);
  if (sum <= 0) return x.map(() => 1 / x.length);
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
  if (den < 1e-12) return 0;
  return Math.max(-1, Math.min(1, dot / den));
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

/** Logistic function (R: plogis) */
function plogis(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/** Logit function (R: qlogis) */
function qlogis(p: number): number {
  return Math.log(p / (1 - p));
}

// ===== Simulation Configuration =====

interface SimConfig {
  T: number;
  S: number;
  sigma_f: number;
  sigma_eps: number;
  // Vote utile (1er tour)
  days_on: number;
  s_tau: number;
  lambda_cos: number;
  beta_utile: number;
  sig_q: number;
  sig_r: number;
  r_min: number;
  r_max: number;
  // Drift
  drift_scale: number;
  lambda_drift: number;
  // Second tour (3 issues : A, B, non-exprimés)
  beta_2: number;
  alpha_nonexpr: number;
  gamma_rejet_ED: number;
  gamma_rejet_EG: number;
  lambda_cos_2: number;
}

const DEFAULT_CONFIG: SimConfig = {
  T: 365,
  S: 500,
  sigma_f: 0.01368569,
  sigma_eps: 0.01910283,
  days_on: 10,
  s_tau: 7,
  lambda_cos: 5,
  beta_utile: 10,
  sig_q: 0.05,
  sig_r: 0.01,
  r_min: 0.5,
  r_max: 0.9,
  drift_scale: 0.001,
  lambda_drift: 5,
  beta_2: 7,
  alpha_nonexpr: -2.259515,
  gamma_rejet_ED: 4.909898,
  gamma_rejet_EG: 2.240084,
  lambda_cos_2: 3,
};

// ===== Candidate Input =====

interface CandidateInput {
  tag: string;
  name: string;
  initials: string;
  v0: number;
  dynamique: number;
  W: number[];
}

// ===== Public Helpers =====

export function getSelected(p: PartyData): CandidatVariant {
  return p.variants[p.selectedIdx] ?? p.variants[0];
}

export function getStartField(source: string): "startAgrege" | "startCustom" {
  if (source === "agrege") return "startAgrege";
  return "startCustom";
}

export function getTrendColor(v: number): string {
  if (v >= 0.3) return "#16a34a";
  if (v >= 0.1) return "#65a30d";
  if (v >= -0.1) return "#ca8a04";
  if (v >= -0.3) return "#ea580c";
  return "#dc2626";
}

export function getTrendLabel(v: number): string {
  if (v >= 0.5) return "Forte hausse";
  if (v >= 0.2) return "Hausse";
  if (v >= -0.1) return "Stable";
  if (v >= -0.4) return "Baisse";
  return "Forte baisse";
}

// ===== Drift vectorisé =====
// Mirrors R: apply_drift_vec(u, W, delta, lambda_drift, ...)

function applyDriftVec(
  u: number[],
  cosMat: number[][],
  drift: number[],
  cfg: SimConfig,
): number[] {
  const K = u.length;

  // drift est déjà pré-scalé par drift_scale (= 1e-3 * raw_delta)
  // Centrer
  const meanDrift = drift.reduce((a, b) => a + b, 0) / K;
  const delta0 = drift.map((d) => d - meanDrift);

  // S = max(cosMat, 0)^lambda_drift, diag = 0
  const S: number[][] = [];
  for (let i = 0; i < K; i++) {
    S.push([]);
    for (let j = 0; j < K; j++) {
      S[i].push(
        i === j
          ? 0
          : Math.pow(Math.max(cosMat[i][j], 0), cfg.lambda_drift),
      );
    }
  }

  // Normaliser par ligne (fallback uniforme si dégénéré)
  for (let i = 0; i < K; i++) {
    const den = S[i].reduce((a, b) => a + b, 0);
    if (den < 1e-12) {
      for (let j = 0; j < K; j++) S[i][j] = j === i ? 0 : 1 / (K - 1);
    } else {
      for (let j = 0; j < K; j++) S[i][j] /= den;
    }
  }

  // comp[k] = Σ_i S[i][k] * (-delta0[i])  →  t(S) %*% (-delta0)
  const comp = new Array<number>(K).fill(0);
  for (let i = 0; i < K; i++) {
    for (let k = 0; k < K; k++) {
      comp[k] += S[i][k] * -delta0[i];
    }
  }

  return u.map((uk, k) => uk + delta0[k] + comp[k]);
}

// ===== Vote Utile Transform =====
// Mirrors R: vote_utile_transform_vec2(v, W, delta, v_ref, ...)

function voteUtileTransform(
  v: number[],
  cosMat: number[][],
  delta: number[],
  v_ref: number[],
  cfg: SimConfig,
): number[] {
  const K = v.length;

  // 1) Seuil endogène : 2ème plus haut score de v_ref
  const sorted_ref = [...v_ref].sort((a, b) => b - a);
  const q0 = Math.max(sorted_ref[1] ?? 0, 1e-12);

  // Enjeu gaussien (plus grand près de q0), normalisé
  const enjeuRaw = v.map(
    (vk) => Math.exp(-0.5 * ((vk - q0) / cfg.sig_q) ** 2),
  );
  const enjeuSum = enjeuRaw.reduce((a, b) => a + b, 0);
  const enjeu = enjeuSum > 0 ? enjeuRaw.map((e) => e / enjeuSum) : enjeuRaw.map(() => 1 / K);

  // 2) Rétention logistique (R: plogis(((q0 - v) / sig_r) + b))
  const b = qlogis(0.05);
  const r = v.map((vk) => {
    const raw = plogis((q0 - vk) / cfg.sig_r + b);
    return Math.min(Math.max(cfg.r_max - (cfg.r_max - cfg.r_min) * raw, 0), 1);
  });

  const m = v.map((vk, i) => (1 - r[i]) * vk);
  const v_keep = v.map((vk, i) => r[i] * vk);

  // Similarité / noyau
  // Kern = max(cosMat, 0)^lambda_cos

  // Attractivité : exp(beta_utile * enjeu + 5 * delta * enjeu)
  const attRaw = delta.map((d, k) =>
    Math.exp(cfg.beta_utile * enjeu[k] + 5 * d * enjeu[k]),
  );
  const attSum = attRaw.reduce((a, b) => a + b, 0);
  const att = attSum > 0 ? attRaw.map((a) => a / attSum) : attRaw.map(() => 1 / K);

  // Scores[j][k] = Kern[j][k] * att[k], normalisé par ligne
  const v_new = [...v_keep];

  for (let j = 0; j < K; j++) {
    const scores: number[] = new Array(K);
    let denom = 0;

    for (let k = 0; k < K; k++) {
      const kern = Math.pow(Math.max(cosMat[j][k], 0), cfg.lambda_cos);
      scores[k] = kern * att[k];
      denom += scores[k];
    }

    if (denom <= 0) {
      for (let k = 0; k < K; k++) scores[k] = 1;
      denom = K;
    }

    for (let k = 0; k < K; k++) {
      v_new[k] += m[j] * (scores[k] / denom);
    }
  }

  const vPos = v_new.map((x) => Math.max(x, 0));
  const total = vPos.reduce((a, b) => a + b, 0);
  if (total <= 0) return v.map(() => 1 / K);
  return vPos.map((x) => x / total);
}

// ===== Simulate One Path (1er tour) =====
// Mirrors R: simulate_one() — two-pass structure

function simulateOne(
  candidates: CandidateInput[],
  ideoW: number[][],
  cosMat: number[][],
  cfg: SimConfig,
  rng: PRNG,
): number[][] {
  const K = candidates.length;
  const B = 3;
  const T = cfg.T;

  // Initialiser logits relatifs (baseline = dernier candidat)
  const v0 = candidates.map((c) => c.v0);
  const eta: number[][] = [];
  const v_base: number[][] = [];

  // eta[0] = log(v0[k] / v0[K-1]) pour k=0..K-2
  const eta0: number[] = [];
  const baselineV0 = Math.max(v0[K - 1], 1e-8);
  for (let k = 0; k < K - 1; k++) {
    eta0.push(Math.log(Math.max(v0[k], 1e-8) / baselineV0));
  }
  eta.push(eta0);
  v_base.push(softmax([...eta0, 0]));

  // Drift par candidat (delta * drift_scale)
  const drift = candidates.map((c) => c.dynamique * cfg.drift_scale);
  // Raw delta for vote utile
  const delta = candidates.map((c) => c.dynamique);

  // === PASS 1 : trajectoires de base (sans vote utile) ===
  for (let t = 1; t < T; t++) {
    // Chocs factoriels: nu ~ N(0, sigma_f²·I_B)
    const nu: number[] = [];
    for (let b = 0; b < B; b++) {
      nu.push(rng.randn() * cfg.sigma_f);
    }

    // Chocs idiosyncratiques: eps ~ N(0, sigma_eps²·I_K)
    const eps: number[] = [];
    for (let k = 0; k < K; k++) {
      eps.push(rng.randn() * cfg.sigma_eps);
    }

    // u = Ideo * nu + eps
    const u: number[] = [];
    for (let k = 0; k < K; k++) {
      let Wnu = 0;
      for (let b = 0; b < B; b++) {
        Wnu += ideoW[k][b] * nu[b];
      }
      u.push(Wnu + eps[k]);
    }

    // Drift vectorisé (centré + compensation via matrice de similarité)
    const u_drifted = applyDriftVec(u, cosMat, drift, cfg);

    // Update logits relatifs (relative innovation: subtract baseline shock)
    const eta_t: number[] = [];
    for (let k = 0; k < K - 1; k++) {
      eta_t.push(eta[t - 1][k] + (u_drifted[k] - u_drifted[K - 1]));
    }
    eta.push(eta_t);

    v_base.push(softmax([...eta_t, 0]));
  }

  // === PASS 2 : application du vote utile ===
  const t0 = Math.max(0, T - 1 - cfg.days_on);
  const v_ref = v_base[t0];
  const T0 = T - cfg.days_on;
  const tau0 = T - T0;

  const v_obs: number[][] = [v_base[0]];

  for (let t = 1; t < T; t++) {
    // Activation vote utile (sigmoïde temporelle)
    const tau_t = T - t;
    const a_t = 1 / (1 + Math.exp((tau_t - tau0) / cfg.s_tau));

    // Transformation vote utile
    const v_tilde = voteUtileTransform(v_base[t], cosMat, delta, v_ref, cfg);

    // Mixture
    const v_mix: number[] = [];
    for (let k = 0; k < K; k++) {
      v_mix.push((1 - a_t) * v_base[t][k] + a_t * v_tilde[k]);
    }

    // Normalisation
    const total = v_mix.reduce((a, b) => a + b, 0);
    v_obs.push(total > 0 ? v_mix.map((x) => x / total) : v_mix.map(() => 1 / K));
  }

  return v_obs;
}

// ===== Second tour =====
// Mirrors R: simulate_second_round(v1, W, ...)

interface SecondRoundResult {
  A: number;
  B: number;
  V2_expr: [number, number];
  V2_ins: [number, number, number]; // [A, B, nonexpr]
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

  // Matrice de transition M (K × 3) : [vote A, vote B, non-exprimés]
  const V2_ins: [number, number, number] = [0, 0, 0];

  for (let s = 0; s < K; s++) {
    const simA = Math.pow(
      Math.max(0, cosSim(W[s], W[A])),
      cfg.lambda_cos_2,
    );
    const simB = Math.pow(
      Math.max(0, cosSim(W[s], W[B])),
      cfg.lambda_cos_2,
    );

    const lA = cfg.beta_2 * simA - rho[A];
    const lB = cfg.beta_2 * simB - rho[B];
    const lNonExpr = cfg.alpha_nonexpr;

    const probs = softmax([lA, lB, lNonExpr]);

    // Pondérer par la part au 1er tour
    for (let c = 0; c < 3; c++) {
      V2_ins[c] += v1[s] * probs[c];
    }
  }

  // Parts exprimées
  const expr = V2_ins[0] + V2_ins[1];
  const V2_expr: [number, number] = expr > 0
    ? [V2_ins[0] / expr, V2_ins[1] / expr]
    : [0.5, 0.5];

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
  const safeDays = Math.max(1, days);
  const cfg: SimConfig = {
    ...DEFAULT_CONFIG,
    T: safeDays,
    ...(gammaRejetED !== undefined && { gamma_rejet_ED: gammaRejetED }),
    ...(gammaRejetEG !== undefined && { gamma_rejet_EG: gammaRejetEG }),
  };
  const K = activeParties.length;
  if (K === 0) {
    return { trajectory: [], probabilities: [], duels: [], secondRound: { participation: { lo: 0, median: 0, hi: 0 }, nonExpr: { lo: 0, median: 0, hi: 0 } } };
  }

  // --- Construire les entrées candidats ---
  const candidates: CandidateInput[] = activeParties.map((p) => {
    const c = getSelected(p);
    const startRaw = c[getStartField(source)];
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
      dynamique: c.dynamique,
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

  // Rho : pénalité barrage pour le second tour
  const rho = W.map((w) => cfg.gamma_rejet_ED * w[2] + cfg.gamma_rejet_EG * w[0]);

  // Matrice de similarité cosinus (pré-calculée)
  const cosMat: number[][] = [];
  for (let i = 0; i < K; i++) {
    cosMat.push([]);
    for (let j = 0; j < K; j++) {
      cosMat[i].push(cosSim(W[i], W[j]));
    }
  }

  // --- Simulations ---
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
    const v_obs = simulateOne(candidates, W, cosMat, cfg, rng);
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
    dynamique: c.dynamique,
    final: finalShares[k],
    pQualif: pQualif[k],
    pVictoire: pVictoire[k],
  }));

  // 4. Duels les plus probables
  const duels: DuelProbability[] = [];
  if (K >= 2) {
    const duelMap = new Map<
      string,
      { count: number; winsA: number; sharesA: number[]; sharesB: number[]; a: number; b: number }
    >();

    for (let s = 0; s < S; s++) {
      const a = Math.min(A_ids[s], B_ids[s]);
      const b = Math.max(A_ids[s], B_ids[s]);
      const key = `${a}-${b}`;

      if (!duelMap.has(key)) {
        duelMap.set(key, { count: 0, winsA: 0, sharesA: [], sharesB: [], a, b });
      }
      const d = duelMap.get(key)!;
      d.count++;

      if (A_ids[s] === a) {
        d.sharesA.push(pA_expr[s]);
        d.sharesB.push(pB_expr[s]);
        if (pA_expr[s] > pB_expr[s]) d.winsA++;
      } else {
        d.sharesA.push(pB_expr[s]);
        d.sharesB.push(pA_expr[s]);
        if (pB_expr[s] > pA_expr[s]) d.winsA++;
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
        pWinA: d.winsA / d.count,
        pWinB: 1 - d.winsA / d.count,
      });
    }

    duels.sort((a, b) => b.probability - a.probability);
  }

  // 5. Résumé second tour
  let secondRound: SecondRoundSummary;

  if (K >= 2 && V2_ins_arr.length > 0) {
    const turnout = V2_ins_arr
      .map((v) => v[0] + v[1])
      .sort((a, b) => a - b);
    const nonExpr = V2_ins_arr
      .map((v) => v[2])
      .sort((a, b) => a - b);

    secondRound = {
      participation: {
        lo: quantile(turnout, 0.125),
        median: quantile(turnout, 0.5),
        hi: quantile(turnout, 0.875),
      },
      nonExpr: {
        lo: quantile(nonExpr, 0.125),
        median: quantile(nonExpr, 0.5),
        hi: quantile(nonExpr, 0.875),
      },
    };
  } else {
    secondRound = {
      participation: { lo: 0, median: 0, hi: 0 },
      nonExpr: { lo: 0, median: 0, hi: 0 },
    };
  }

  return { trajectory, probabilities, duels, secondRound };
}
