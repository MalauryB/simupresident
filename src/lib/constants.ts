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
  PCF: { bg: "#DD0000", fg: "#FFFFFF", accent: "#BB0000", chart: "#DD0000" },
};

export const DEFAULT_PARTIES: PartyData[] = [
  {
    tag: "LFI", party: "La France Insoumise", active: true, selectedIdx: 0,
    variants: [
      { name: "Jean-Luc Mélenchon", shortName: "Mélenchon", initials: "JLM", polled: true, pollGroup: null, dynamique: 0.5, left: 1.0, center: 0.0, right: 0.0, startAgrege: 13, startCustom: 13, photoUrl: `${PHOTO_BASE}jean-luc-melenchon.jpg` },
      { name: "Clémence Guetté", shortName: "Guetté", initials: "CG", polled: false, pollGroup: null, dynamique: 0.5, left: 1.0, center: 0.0, right: 0.0, startAgrege: 10, startCustom: 10, photoUrl: `${PHOTO_BASE}clemence-guette.jpg` },
      { name: "Manuel Bompard", shortName: "Bompard", initials: "MB", polled: false, pollGroup: null, dynamique: 0.3, left: 1.0, center: 0.0, right: 0.0, startAgrege: 10, startCustom: 10, photoUrl: `${PHOTO_BASE}manuel-bompard.jpg` },
    ],
  },
  {
    tag: "PCF", party: "Parti Communiste Français", active: true, selectedIdx: 0,
    variants: [
      { name: "Fabien Roussel", shortName: "Roussel", initials: "FRo", polled: false, pollGroup: null, dynamique: 0.0, left: 0.8, center: 0.0, right: 0.2, startAgrege: 3, startCustom: 3, photoUrl: `${PHOTO_BASE}fabien-roussel.jpg` },
    ],
  },
  {
    tag: "EELV", party: "Primaire union de la gauche", active: true, selectedIdx: 0,
    variants: [
      { name: "Marine Tondelier", shortName: "Tondelier", initials: "MT", polled: false, pollGroup: "Les Écologistes", dynamique: 0.0, left: 0.7, center: 0.3, right: 0.0, startAgrege: 6, startCustom: 6, photoUrl: `${PHOTO_BASE}marine-tondelier.jpg` },
      { name: "François Ruffin", shortName: "Ruffin", initials: "FR", polled: false, pollGroup: "Debout", dynamique: 0.1, left: 0.8, center: 0.2, right: 0.0, startAgrege: 7, startCustom: 7, photoUrl: `${PHOTO_BASE}francois-ruffin.jpg` },
      { name: "Clémentine Autain", shortName: "Autain", initials: "CA", polled: false, pollGroup: "L'Après", dynamique: 0.0, left: 0.8, center: 0.2, right: 0.0, startAgrege: 5, startCustom: 5, photoUrl: `${PHOTO_BASE}clementine-autain.jpg` },
      { name: "Olivier Faure", shortName: "Faure", initials: "OF", polled: false, pollGroup: "Parti Socialiste", dynamique: 0.1, left: 0.6, center: 0.4, right: 0.0, startAgrege: 7, startCustom: 7, photoUrl: `${PHOTO_BASE}olivier-faure.jpg` },
      { name: "BadMulch", shortName: "BadMulch", initials: "BM", polled: false, pollGroup: null, dynamique: 1.0, left: 1.0, center: 0.0, right: 0.0, startAgrege: 20, startCustom: 20, photoUrl: `${PHOTO_BASE}badmulch.jpg` },
    ],
  },
  {
    tag: "PS", party: "PS / Place Publique", active: true, selectedIdx: 0,
    variants: [
      { name: "Raphaël Glucksmann", shortName: "Glucksmann", initials: "RG", polled: true, pollGroup: "Place Publique", dynamique: -0.2, left: 0.3, center: 0.7, right: 0.0, startAgrege: 13.5, startCustom: 13.5, photoUrl: `${PHOTO_BASE}raphael-glucksmann.jpg` },
      { name: "François Hollande", shortName: "Hollande", initials: "FH", polled: false, pollGroup: "Parti Socialiste", dynamique: 0.3, left: 0.2, center: 0.8, right: 0.0, startAgrege: 10, startCustom: 10, photoUrl: `${PHOTO_BASE}francois-hollande.jpg` },
      { name: "Boris Vallaud", shortName: "Vallaud", initials: "BV", polled: false, pollGroup: "Parti Socialiste", dynamique: 0.3, left: 0.5, center: 0.5, right: 0.0, startAgrege: 10, startCustom: 10, photoUrl: `${PHOTO_BASE}boris-vallaud.jpg` },
    ],
  },
  {
    tag: "REN", party: "Renaissance / Horizons", active: true, selectedIdx: 0,
    variants: [
      { name: "Gabriel Attal", shortName: "Attal", initials: "GA", polled: true, pollGroup: "Renaissance", dynamique: -0.5, left: 0.0, center: 1.0, right: 0.0, startAgrege: 12, startCustom: 12, photoUrl: `${PHOTO_BASE}gabriel-attal.jpg` },
      { name: "Édouard Philippe", shortName: "Philippe", initials: "ÉP", polled: true, pollGroup: "Horizons", dynamique: -0.5, left: 0.0, center: 0.8, right: 0.2, startAgrege: 17, startCustom: 17, photoUrl: `${PHOTO_BASE}edouard-philippe.jpg` },
    ],
  },
  {
    tag: "LR", party: "Les Républicains", active: true, selectedIdx: 0,
    variants: [
      { name: "Bruno Retailleau", shortName: "Retailleau", initials: "BR", polled: true, pollGroup: null, dynamique: 0.5, left: 0.0, center: 0.3, right: 0.7, startAgrege: 8, startCustom: 8, photoUrl: `${PHOTO_BASE}bruno-retailleau.jpg` },
      { name: "Laurent Wauquiez", shortName: "Wauquiez", initials: "LW", polled: true, pollGroup: null, dynamique: 0.1, left: 0.0, center: 0.3, right: 0.7, startAgrege: 3, startCustom: 3, photoUrl: `${PHOTO_BASE}laurent-wauquiez.jpg` },
    ],
  },
  {
    tag: "RN", party: "Rassemblement National", active: true, selectedIdx: 0,
    variants: [
      { name: "Jordan Bardella", shortName: "Bardella", initials: "JB", polled: true, pollGroup: null, dynamique: -0.5, left: 0.0, center: 0.1, right: 0.9, startAgrege: 35.5, startCustom: 35.5, photoUrl: `${PHOTO_BASE}jordan-bardella.jpg` },
      { name: "Marine Le Pen", shortName: "Le Pen", initials: "MLP", polled: true, pollGroup: null, dynamique: 0.2, left: 0.0, center: 0.1, right: 0.9, startAgrege: 34, startCustom: 34, photoUrl: `${PHOTO_BASE}marine-le-pen.jpg` },
    ],
  },
  {
    tag: "REC", party: "Reconquête", active: true, selectedIdx: 0,
    variants: [
      { name: "Éric Zemmour", shortName: "Zemmour", initials: "ÉZ", polled: true, pollGroup: null, dynamique: 0.0, left: 0.0, center: 0.0, right: 1.0, startAgrege: 4, startCustom: 4, photoUrl: `${PHOTO_BASE}eric-zemmour.jpg` },
      { name: "Sarah Knafo", shortName: "Knafo", initials: "SK", polled: false, pollGroup: "Extrême droite", dynamique: 0.3, left: 0.0, center: 0.0, right: 1.0, startAgrege: 6, startCustom: 6, photoUrl: `${PHOTO_BASE}sarah-knafo.jpg` },
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
