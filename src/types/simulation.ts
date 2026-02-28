export interface CandidatVariant {
  name: string;
  initials: string;
  polled: boolean;
  pollGroup: string | null;
  attractivite: number;
  tendance: number;
  left: number;
  center: number;
  right: number;
  startAgrege: number;
  startDebiaise: number;
  startCustom: number;
  photoUrl: string | null;
}

export interface PartyData {
  tag: string;
  party: string;
  active: boolean;
  selectedIdx: number;
  variants: CandidatVariant[];
}

export interface PartyColors {
  bg: string;
  fg: string;
  accent: string;
  chart: string;
}

export interface PollSource {
  id: string;
  label: string;
  desc: string;
  icon: string;
}

export interface SimCandidate {
  tag: string;
  name: string;
  initials: string;
  start: number;
  tendance: number;
  attractivite: number;
}

export interface TrajectoryPoint {
  jour: number;
  [key: string]: number;
}

export interface ProbabilityResult extends SimCandidate {
  final: number;
  pQualif: number;
  pVictoire: number;
}

export interface DuelProbability {
  tagA: string;
  tagB: string;
  nameA: string;
  nameB: string;
  probability: number;
  avgShareA: number;
  avgShareB: number;
  pWinA: number;
  pWinB: number;
}

export interface QuantileSummary {
  lo: number;
  median: number;
  hi: number;
}

export interface SecondRoundSummary {
  participation: QuantileSummary;
  nonExpr: QuantileSummary;
}

export interface SimulationData {
  trajectory: TrajectoryPoint[];
  probabilities: ProbabilityResult[];
  duels: DuelProbability[];
  secondRound: SecondRoundSummary;
}
