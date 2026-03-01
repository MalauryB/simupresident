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
      { name: "Jean-Luc Mélenchon", initials: "JLM", polled: true, pollGroup: null, attractivite: 0.8, tendance: 0.2, left: 1.0, center: 0.0, right: 0.0, startAgrege: 12, startCustom: 12, photoUrl: `${PHOTO_BASE}jean-luc-melenchon.jpg` },
      { name: "Clémence Guetté", initials: "CG", polled: false, pollGroup: null, attractivite: 0.8, tendance: 0.2, left: 1.0, center: 0.0, right: 0.0, startAgrege: 12, startCustom: 12, photoUrl: `${PHOTO_BASE}clemence-guette.jpg` },
      { name: "Manuel Bompard", initials: "MB", polled: false, pollGroup: null, attractivite: 0.8, tendance: 0.2, left: 1.0, center: 0.0, right: 0.0, startAgrege: 12, startCustom: 12, photoUrl: `${PHOTO_BASE}manuel-bompard.jpg` },
    ],
  },
  {
    tag: "EELV", party: "Primaire union de la gauche", active: true, selectedIdx: 0,
    variants: [
      { name: "Marine Tondelier", initials: "MT", polled: false, pollGroup: "Les Écologistes", attractivite: 0.2, tendance: 0.0, left: 0.8, center: 0.2, right: 0.0, startAgrege: 9, startCustom: 9, photoUrl: `${PHOTO_BASE}marine-tondelier.jpg` },
      { name: "François Ruffin", initials: "FR", polled: false, pollGroup: "Debout", attractivite: 0.2, tendance: 0.0, left: 0.8, center: 0.2, right: 0.0, startAgrege: 7, startCustom: 7, photoUrl: `${PHOTO_BASE}francois-ruffin.jpg` },
      { name: "Clémentine Autain", initials: "CA", polled: false, pollGroup: "L'Après", attractivite: 0.2, tendance: 0.0, left: 0.8, center: 0.2, right: 0.0, startAgrege: 5, startCustom: 5, photoUrl: `${PHOTO_BASE}clementine-autain.jpg` },
      { name: "Olivier Faure", initials: "OF", polled: false, pollGroup: "Parti Socialiste", attractivite: 0.2, tendance: 0.0, left: 0.8, center: 0.2, right: 0.0, startAgrege: 5, startCustom: 5, photoUrl: `${PHOTO_BASE}olivier-faure.jpg` },
      { name: "BadMulch", initials: "BM", polled: false, pollGroup: null, attractivite: 0.2, tendance: 0.0, left: 0.8, center: 0.2, right: 0.0, startAgrege: 5, startCustom: 5, photoUrl: `${PHOTO_BASE}badmulch.jpg` },
    ],
  },
  {
    tag: "PS", party: "PS / Place Publique", active: true, selectedIdx: 0,
    variants: [
      { name: "Raphaël Glucksmann", initials: "RG", polled: true, pollGroup: "Place Publique", attractivite: 0.5, tendance: 0.0, left: 0.5, center: 0.5, right: 0.0, startAgrege: 13.5, startCustom: 13.5, photoUrl: `${PHOTO_BASE}raphael-glucksmann.jpg` },
      { name: "François Hollande", initials: "FH", polled: false, pollGroup: "Parti Socialiste", attractivite: 0.5, tendance: 0.0, left: 0.5, center: 0.5, right: 0.0, startAgrege: 9, startCustom: 9, photoUrl: `${PHOTO_BASE}francois-hollande.jpg` },
      { name: "Boris Vallaud", initials: "BV", polled: false, pollGroup: "Parti Socialiste", attractivite: 0.5, tendance: 0.0, left: 0.5, center: 0.5, right: 0.0, startAgrege: 5, startCustom: 5, photoUrl: `${PHOTO_BASE}boris-vallaud.jpg` },
    ],
  },
  {
    tag: "REN", party: "Renaissance / Horizons", active: true, selectedIdx: 0,
    variants: [
      { name: "Gabriel Attal", initials: "GA", polled: true, pollGroup: "Renaissance", attractivite: 0.0, tendance: -0.6, left: 0.0, center: 1.0, right: 0.0, startAgrege: 16, startCustom: 16, photoUrl: `${PHOTO_BASE}gabriel-attal.jpg` },
      { name: "Édouard Philippe", initials: "ÉP", polled: true, pollGroup: "Horizons", attractivite: 0.0, tendance: -0.6, left: 0.0, center: 1.0, right: 0.0, startAgrege: 18, startCustom: 18, photoUrl: `${PHOTO_BASE}edouard-philippe.jpg` },
    ],
  },
  {
    tag: "LR", party: "Les Républicains", active: true, selectedIdx: 0,
    variants: [
      { name: "Bruno Retailleau", initials: "BR", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.0, left: 0.0, center: 0.3, right: 0.7, startAgrege: 8, startCustom: 8, photoUrl: `${PHOTO_BASE}bruno-retailleau.jpg` },
      { name: "Laurent Wauquiez", initials: "LW", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.0, left: 0.0, center: 0.3, right: 0.7, startAgrege: 9, startCustom: 9, photoUrl: `${PHOTO_BASE}laurent-wauquiez.jpg` },
    ],
  },
  {
    tag: "RN", party: "Rassemblement National", active: true, selectedIdx: 0,
    variants: [
      { name: "Jordan Bardella", initials: "JB", polled: true, pollGroup: null, attractivite: 0.0, tendance: -0.2, left: 0.0, center: 0.0, right: 1.0, startAgrege: 33, startCustom: 33, photoUrl: `${PHOTO_BASE}jordan-bardella.jpg` },
      { name: "Marine Le Pen", initials: "MLP", polled: true, pollGroup: null, attractivite: 0.0, tendance: -0.2, left: 0.0, center: 0.0, right: 1.0, startAgrege: 35, startCustom: 35, photoUrl: `${PHOTO_BASE}marine-le-pen.jpg` },
    ],
  },
  {
    tag: "REC", party: "Reconquête", active: true, selectedIdx: 0,
    variants: [
      { name: "Éric Zemmour", initials: "ÉZ", polled: true, pollGroup: null, attractivite: 0.0, tendance: 0.0, left: 0.0, center: 0.0, right: 1.0, startAgrege: 5.5, startCustom: 5.5, photoUrl: `${PHOTO_BASE}eric-zemmour.jpg` },
      { name: "Sarah Knafo", initials: "SK", polled: false, pollGroup: "Extrême droite", attractivite: 0.0, tendance: 0.0, left: 0.0, center: 0.0, right: 1.0, startAgrege: 4, startCustom: 4, photoUrl: `${PHOTO_BASE}sarah-knafo.jpg` },
    ],
  },
];

export const POLL_SOURCES: PollSource[] = [
  { id: "agrege", label: "Sondage agrégé", desc: "Moyenne pondérée des derniers sondages publiés par les instituts majeurs.", icon: "📊" },
  { id: "custom", label: "Personnalisable", desc: "Définissez librement les points de départ de chaque candidat.", icon: "✏️" },
];

export const WIZARD_STEPS = ["Candidats", "Paramètres", "Point de départ", "Barrage", "Résumé"];

export const ALLIANCE_PRESETS = [
  { id: "all", label: "Tous séparés", desc: "Chaque parti présente son candidat", inactive: [] as string[] },
  { id: "union-gauche", label: "Union de la gauche", desc: "EELV se retire au profit de LFI", inactive: ["EELV"] },
  { id: "centre-gauche", label: "Union centre-gauche", desc: "PS se retire au profit de Renaissance", inactive: ["PS"] },
  { id: "union-droites", label: "Union des droites", desc: "Reconquête se retire au profit du RN", inactive: ["REC"] },
];

export const DEFAULT_COLORS: PartyColors = { bg: "#556C96", fg: "#FFFFFF", accent: "#556C96", chart: "#556C96" };

export const ELECTION_DATE = new Date(2027, 3, 10); // 10 avril 2027


export const SIM_COUNT = 500;
