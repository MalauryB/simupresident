import type { PartyColors, PartyData, PollSource } from "@/types/simulation";

const PHOTO_BASE = "https://gqaymlbxwlvxcvbunuxp.supabase.co/storage/v1/object/public/photos/";

export const PARTY_COLORS: Record<string, PartyColors> = {
  LFI: { bg: "#CC2443", fg: "#FFFFFF", accent: "#E63946", chart: "#E63946" },
  EELV: { bg: "#00A86B", fg: "#FFFFFF", accent: "#008C57", chart: "#00A86B" },
  PS: { bg: "#FF6B9D", fg: "#FFFFFF", accent: "#E0476E", chart: "#FF6B9D" },
  REN: { bg: "#FFD600", fg: "#1a1a1a", accent: "#FFB800", chart: "#FFB800" },
  LR: { bg: "#0066CC", fg: "#FFFFFF", accent: "#004A99", chart: "#0066CC" },
  RN: { bg: "#1B2A4A", fg: "#EEEDFF", accent: "#002395", chart: "#002395" },
  REC: { bg: "#1a1a2e", fg: "#FFFFFF", accent: "#2D2D5E", chart: "#2D2D5E" },
};

export const DEFAULT_PARTIES: PartyData[] = [
  {
    tag: "LFI", party: "La France Insoumise", active: true, selectedIdx: 0,
    variants: [
      { name: "Jean-Luc Mélenchon", initials: "JLM", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.35, left: 0.8, center: 0.15, right: 0.05, startAgrege: 12, startDebiaise: 13, startCustom: 12, photoUrl: `${PHOTO_BASE}jean-luc-melenchon.jpg` },
    ],
  },
  {
    tag: "EELV", party: "EELV / Debout / L'Après", active: true, selectedIdx: 0,
    variants: [
      { name: "Marine Tondelier", initials: "MT", polled: false, pollGroup: "Les Écologistes", attractivite: 0.5, tendance: 0.55, left: 0.55, center: 0.4, right: 0.05, startAgrege: 8, startDebiaise: 9, startCustom: 8, photoUrl: `${PHOTO_BASE}marine-tondelier.jpg` },
      { name: "François Ruffin", initials: "FR", polled: false, pollGroup: "Debout", attractivite: 0.5, tendance: 0.45, left: 0.7, center: 0.25, right: 0.05, startAgrege: 7, startDebiaise: 7, startCustom: 7, photoUrl: `${PHOTO_BASE}francois-ruffin.jpg` },
      { name: "Clémentine Autain", initials: "CA", polled: false, pollGroup: "L'Après", attractivite: 0.35, tendance: 0.4, left: 0.68, center: 0.27, right: 0.05, startAgrege: 5, startDebiaise: 5, startCustom: 5, photoUrl: `${PHOTO_BASE}clementine-autain.jpg` },
    ],
  },
  {
    tag: "PS", party: "PS / Place Publique", active: true, selectedIdx: 0,
    variants: [
      { name: "Raphaël Glucksmann", initials: "RG", polled: true, pollGroup: "Place Publique", attractivite: 0.5, tendance: 0.6, left: 0.6, center: 0.35, right: 0.05, startAgrege: 10, startDebiaise: 11, startCustom: 10, photoUrl: `${PHOTO_BASE}raphael-glucksmann.jpg` },
      { name: "François Hollande", initials: "FH", polled: false, pollGroup: "Parti Socialiste", attractivite: 0.4, tendance: 0.35, left: 0.55, center: 0.4, right: 0.05, startAgrege: 8, startDebiaise: 9, startCustom: 8, photoUrl: `${PHOTO_BASE}francois-hollande.jpg` },
    ],
  },
  {
    tag: "REN", party: "Renaissance / Horizons", active: true, selectedIdx: 0,
    variants: [
      { name: "Gabriel Attal", initials: "GA", polled: true, pollGroup: "Renaissance", attractivite: 0.5, tendance: 0.4, left: 0.15, center: 0.7, right: 0.15, startAgrege: 16, startDebiaise: 15, startCustom: 16, photoUrl: `${PHOTO_BASE}gabriel-attal.jpg` },
      { name: "Édouard Philippe", initials: "ÉP", polled: true, pollGroup: "Horizons", attractivite: 0.5, tendance: 0.7, left: 0.1, center: 0.6, right: 0.3, startAgrege: 18, startDebiaise: 17, startCustom: 18, photoUrl: `${PHOTO_BASE}edouard-philippe.jpg` },
    ],
  },
  {
    tag: "LR", party: "Les Républicains", active: true, selectedIdx: 0,
    variants: [
      { name: "Bruno Retailleau", initials: "BR", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.55, left: 0.05, center: 0.35, right: 0.6, startAgrege: 10, startDebiaise: 11, startCustom: 10, photoUrl: `${PHOTO_BASE}bruno-retailleau.jpg` },
      { name: "Laurent Wauquiez", initials: "LW", polled: true, pollGroup: null, attractivite: 0.45, tendance: 0.5, left: 0.05, center: 0.4, right: 0.55, startAgrege: 11, startDebiaise: 11, startCustom: 11, photoUrl: `${PHOTO_BASE}laurent-wauquiez.jpg` },
    ],
  },
  {
    tag: "RN", party: "Rassemblement National", active: true, selectedIdx: 0,
    variants: [
      { name: "Jordan Bardella", initials: "JB", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.65, left: 0.1, center: 0.2, right: 0.7, startAgrege: 30, startDebiaise: 28, startCustom: 30, photoUrl: `${PHOTO_BASE}jordan-bardella.jpg` },
      { name: "Marine Le Pen", initials: "MLP", polled: true, pollGroup: null, attractivite: 0.55, tendance: 0.5, left: 0.08, center: 0.22, right: 0.7, startAgrege: 32, startDebiaise: 30, startCustom: 32, photoUrl: `${PHOTO_BASE}marine-le-pen.jpg` },
    ],
  },
  {
    tag: "REC", party: "Reconquête", active: true, selectedIdx: 0,
    variants: [
      { name: "Éric Zemmour", initials: "ÉZ", polled: true, pollGroup: null, attractivite: 0.45, tendance: 0.35, left: 0.02, center: 0.08, right: 0.9, startAgrege: 7, startDebiaise: 6, startCustom: 7, photoUrl: `${PHOTO_BASE}eric-zemmour.jpg` },
      { name: "Sarah Knafo", initials: "SK", polled: false, pollGroup: "Extrême droite", attractivite: 0.3, tendance: 0.35, left: 0.03, center: 0.1, right: 0.87, startAgrege: 5, startDebiaise: 4, startCustom: 5, photoUrl: `${PHOTO_BASE}sarah-knafo.jpg` },
    ],
  },
];

export const POLL_SOURCES: PollSource[] = [
  { id: "agrege", label: "Sondage agrégé", desc: "Moyenne pondérée des derniers sondages publiés par les instituts majeurs.", icon: "📊" },
  { id: "debiaise", label: "Sondage débiaisé", desc: "Sondages corrigés des biais historiques des instituts (house effects).", icon: "🎯" },
  { id: "custom", label: "Personnalisable", desc: "Définissez librement les points de départ de chaque candidat.", icon: "✏️" },
];

export const WIZARD_STEPS = ["Candidats", "Paramètres", "Point de départ", "Barrage", "Horizon", "Résumé"];

export const ALLIANCE_PRESETS = [
  { id: "all", label: "Tous séparés", desc: "Chaque parti présente son candidat", inactive: [] as string[] },
  { id: "union-gauche", label: "Union de la gauche", desc: "EELV se retire au profit de LFI", inactive: ["EELV"] },
  { id: "centre-gauche", label: "Union centre-gauche", desc: "PS se retire au profit de Renaissance", inactive: ["PS"] },
  { id: "union-droites", label: "Union des droites", desc: "Reconquête se retire au profit du RN", inactive: ["REC"] },
];

export const DEFAULT_COLORS: PartyColors = { bg: "#556C96", fg: "#FFFFFF", accent: "#556C96", chart: "#556C96" };

export const ELECTION_DATE = new Date(2027, 3, 10); // 10 avril 2027

export const DAY_PRESETS = [30, 90, 180, 365];

export const SIM_COUNT = 200;
