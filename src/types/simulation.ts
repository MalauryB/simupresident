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
  barrage: number;
  startAgrege: number;
  startDebiaise: number;
  startCustom: number;
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
  barrage: number;
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

export interface SimulationData {
  trajectory: TrajectoryPoint[];
  probabilities: ProbabilityResult[];
}
