import type { PartyColors, PartyData, PollSource } from "@/types/simulation";

const PHOTO_BASE = "https://gqaymlbxwlvxcvbunuxp.supabase.co/storage/v1/object/public/photos/";

export const PARTY_COLORS: Record<string, PartyColors> = {
  RN: { bg: "#1B2A4A", fg: "#EEEDFF", accent: "#002395", chart: "#002395" },
  LFI: { bg: "#CC2443", fg: "#FFFFFF", accent: "#E63946", chart: "#E63946" },
  REN: { bg: "#FFD600", fg: "#1a1a1a", accent: "#FFB800", chart: "#FFB800" },
  LR: { bg: "#0066CC", fg: "#FFFFFF", accent: "#004A99", chart: "#0066CC" },
  PS: { bg: "#FF6B9D", fg: "#FFFFFF", accent: "#E0476E", chart: "#FF6B9D" },
  EELV: { bg: "#00A86B", fg: "#FFFFFF", accent: "#008C57", chart: "#00A86B" },
  HOR: { bg: "#00C2D1", fg: "#FFFFFF", accent: "#009DAA", chart: "#00C2D1" },
  REC: { bg: "#8B5CF6", fg: "#FFFFFF", accent: "#7C3AED", chart: "#8B5CF6" },
};

export const DEFAULT_PARTIES: PartyData[] = [
  {
    tag: "RN", party: "Rassemblement National", active: true, selectedIdx: 0,
    variants: [
      { name: "Jordan Bardella", initials: "JB", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.65, left: 0.1, center: 0.2, right: 0.7, barrage: 0.4, startAgrege: 28, startDebiaise: 26, startCustom: 28, photoUrl: `${PHOTO_BASE}jordan-bardella.jpg` },
      { name: "Marine Le Pen", initials: "MLP", polled: true, pollGroup: null, attractivite: 0.55, tendance: 0.5, left: 0.08, center: 0.22, right: 0.7, barrage: 0.45, startAgrege: 30, startDebiaise: 28, startCustom: 30, photoUrl: `${PHOTO_BASE}marine-le-pen.jpg` },
      { name: "Louis Aliot", initials: "LA", polled: false, pollGroup: "RN / Extrême droite", attractivite: 0.35, tendance: 0.4, left: 0.05, center: 0.25, right: 0.7, barrage: 0.38, startAgrege: 24, startDebiaise: 22, startCustom: 24, photoUrl: `${PHOTO_BASE}louis-aliot.jpg` },
      { name: "Sébastien Chenu", initials: "SC", polled: false, pollGroup: "RN / Extrême droite", attractivite: 0.3, tendance: 0.35, left: 0.08, center: 0.2, right: 0.72, barrage: 0.4, startAgrege: 22, startDebiaise: 20, startCustom: 22, photoUrl: `${PHOTO_BASE}sebastien-chenu.jpg` },
    ],
  },
  {
    tag: "LFI", party: "La France Insoumise", active: true, selectedIdx: 0,
    variants: [
      { name: "Jean-Luc Mélenchon", initials: "JLM", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.35, left: 0.8, center: 0.15, right: 0.05, barrage: 0.35, startAgrege: 12, startDebiaise: 14, startCustom: 12, photoUrl: `${PHOTO_BASE}jean-luc-melenchon.jpg` },
      { name: "Mathilde Panot", initials: "MP", polled: false, pollGroup: "LFI / NUPES", attractivite: 0.4, tendance: 0.45, left: 0.75, center: 0.2, right: 0.05, barrage: 0.3, startAgrege: 9, startDebiaise: 10, startCustom: 9, photoUrl: `${PHOTO_BASE}mathilde-panot.jpg` },
      { name: "Manuel Bompard", initials: "MB", polled: false, pollGroup: "LFI / NUPES", attractivite: 0.35, tendance: 0.4, left: 0.78, center: 0.17, right: 0.05, barrage: 0.32, startAgrege: 8, startDebiaise: 9, startCustom: 8, photoUrl: `${PHOTO_BASE}manuel-bompard.jpg` },
      { name: "Clémence Guetté", initials: "CG", polled: false, pollGroup: "LFI / NUPES", attractivite: 0.3, tendance: 0.45, left: 0.75, center: 0.2, right: 0.05, barrage: 0.28, startAgrege: 7, startDebiaise: 8, startCustom: 7, photoUrl: `${PHOTO_BASE}clemence-guette.jpg` },
    ],
  },
  {
    tag: "REN", party: "Renaissance", active: true, selectedIdx: 0,
    variants: [
      { name: "Gabriel Attal", initials: "GA", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.4, left: 0.15, center: 0.7, right: 0.15, barrage: 0.1, startAgrege: 18, startDebiaise: 16, startCustom: 18, photoUrl: `${PHOTO_BASE}gabriel-attal.jpg` },
      { name: "Gérald Darmanin", initials: "GD", polled: false, pollGroup: "Majorité présidentielle", attractivite: 0.35, tendance: 0.35, left: 0.1, center: 0.55, right: 0.35, barrage: 0.2, startAgrege: 15, startDebiaise: 14, startCustom: 15, photoUrl: `${PHOTO_BASE}gerald-darmanin.jpg` },
      { name: "Élisabeth Borne", initials: "EB", polled: false, pollGroup: "Majorité présidentielle", attractivite: 0.35, tendance: 0.3, left: 0.2, center: 0.65, right: 0.15, barrage: 0.15, startAgrege: 12, startDebiaise: 11, startCustom: 12, photoUrl: `${PHOTO_BASE}elisabeth-borne.jpg` },
      { name: "François Bayrou", initials: "FB", polled: true, pollGroup: null, attractivite: 0.4, tendance: 0.45, left: 0.15, center: 0.7, right: 0.15, barrage: 0.12, startAgrege: 10, startDebiaise: 10, startCustom: 10, photoUrl: `${PHOTO_BASE}francois-bayrou.jpg` },
    ],
  },
  {
    tag: "LR", party: "Les Républicains", active: true, selectedIdx: 0,
    variants: [
      { name: "Bruno Retailleau", initials: "BR", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.55, left: 0.05, center: 0.35, right: 0.6, barrage: 0.25, startAgrege: 8, startDebiaise: 9, startCustom: 8, photoUrl: `${PHOTO_BASE}bruno-retailleau.jpg` },
      { name: "Laurent Wauquiez", initials: "LW", polled: true, pollGroup: null, attractivite: 0.45, tendance: 0.5, left: 0.05, center: 0.4, right: 0.55, barrage: 0.2, startAgrege: 9, startDebiaise: 9, startCustom: 9, photoUrl: `${PHOTO_BASE}laurent-wauquiez.jpg` },
      { name: "Xavier Bertrand", initials: "XB", polled: false, pollGroup: "Droite républicaine", attractivite: 0.45, tendance: 0.5, left: 0.1, center: 0.45, right: 0.45, barrage: 0.15, startAgrege: 7, startDebiaise: 8, startCustom: 7, photoUrl: `${PHOTO_BASE}xavier-bertrand.jpg` },
      { name: "Valérie Pécresse", initials: "VP", polled: false, pollGroup: "Droite républicaine", attractivite: 0.3, tendance: 0.3, left: 0.08, center: 0.45, right: 0.47, barrage: 0.2, startAgrege: 5, startDebiaise: 6, startCustom: 5, photoUrl: `${PHOTO_BASE}valerie-pecresse.jpg` },
    ],
  },
  {
    tag: "PS", party: "Place Publique / PS", active: true, selectedIdx: 0,
    variants: [
      { name: "Raphaël Glucksmann", initials: "RG", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.6, left: 0.6, center: 0.35, right: 0.05, barrage: 0.08, startAgrege: 10, startDebiaise: 11, startCustom: 10, photoUrl: `${PHOTO_BASE}raphael-glucksmann.jpg` },
      { name: "François Hollande", initials: "FH", polled: false, pollGroup: "Gauche sociale-démocrate", attractivite: 0.4, tendance: 0.35, left: 0.55, center: 0.4, right: 0.05, barrage: 0.15, startAgrege: 7, startDebiaise: 8, startCustom: 7, photoUrl: `${PHOTO_BASE}francois-hollande.jpg` },
      { name: "Olivier Faure", initials: "OF", polled: false, pollGroup: "Gauche sociale-démocrate", attractivite: 0.25, tendance: 0.3, left: 0.6, center: 0.35, right: 0.05, barrage: 0.1, startAgrege: 4, startDebiaise: 5, startCustom: 4, photoUrl: `${PHOTO_BASE}olivier-faure.jpg` },
    ],
  },
  {
    tag: "EELV", party: "Les Écologistes", active: true, selectedIdx: 0,
    variants: [
      { name: "Marine Tondelier", initials: "MT", polled: false, pollGroup: "EELV / Pôle écologiste", attractivite: 0.5, tendance: 0.55, left: 0.55, center: 0.4, right: 0.05, barrage: 0.1, startAgrege: 5, startDebiaise: 6, startCustom: 5, photoUrl: `${PHOTO_BASE}marine-tondelier.jpg` },
      { name: "Yannick Jadot", initials: "YJ", polled: false, pollGroup: "EELV / Pôle écologiste", attractivite: 0.4, tendance: 0.35, left: 0.5, center: 0.45, right: 0.05, barrage: 0.12, startAgrege: 4, startDebiaise: 5, startCustom: 4, photoUrl: `${PHOTO_BASE}yannick-jadot.jpg` },
      { name: "Sandrine Rousseau", initials: "SR", polled: false, pollGroup: "EELV / Pôle écologiste", attractivite: 0.35, tendance: 0.4, left: 0.65, center: 0.3, right: 0.05, barrage: 0.18, startAgrege: 3, startDebiaise: 4, startCustom: 3, photoUrl: `${PHOTO_BASE}sandrine-rousseau.jpg` },
    ],
  },
  {
    tag: "HOR", party: "Horizons", active: true, selectedIdx: 0,
    variants: [
      { name: "Édouard Philippe", initials: "ÉP", polled: true, pollGroup: null, attractivite: 0.5, tendance: 0.7, left: 0.1, center: 0.6, right: 0.3, barrage: 0.08, startAgrege: 14, startDebiaise: 13, startCustom: 14, photoUrl: `${PHOTO_BASE}edouard-philippe.jpg` },
      { name: "Antoine Armand", initials: "AA", polled: false, pollGroup: "Majorité présidentielle", attractivite: 0.3, tendance: 0.35, left: 0.15, center: 0.6, right: 0.25, barrage: 0.08, startAgrege: 8, startDebiaise: 7, startCustom: 8, photoUrl: `${PHOTO_BASE}antoine-armand.jpg` },
    ],
  },
  {
    tag: "REC", party: "Picardie Debout!", active: true, selectedIdx: 0,
    variants: [
      { name: "François Ruffin", initials: "FR", polled: false, pollGroup: "Gauche dissidente / ex-LFI", attractivite: 0.5, tendance: 0.45, left: 0.7, center: 0.25, right: 0.05, barrage: 0.12, startAgrege: 5, startDebiaise: 5, startCustom: 5, photoUrl: `${PHOTO_BASE}francois-ruffin.jpg` },
      { name: "Clémentine Autain", initials: "CA", polled: false, pollGroup: "Gauche dissidente / ex-LFI", attractivite: 0.35, tendance: 0.4, left: 0.68, center: 0.27, right: 0.05, barrage: 0.1, startAgrege: 4, startDebiaise: 4, startCustom: 4, photoUrl: `${PHOTO_BASE}clementine-autain.jpg` },
    ],
  },
];

export const POLL_SOURCES: PollSource[] = [
  { id: "agrege", label: "Sondage agrégé", desc: "Moyenne pondérée des derniers sondages publiés par les instituts majeurs.", icon: "📊" },
  { id: "debiaise", label: "Sondage débiaisé", desc: "Sondages corrigés des biais historiques des instituts (house effects).", icon: "🎯" },
  { id: "custom", label: "Personnalisable", desc: "Définissez librement les points de départ de chaque candidat.", icon: "✏️" },
];

export const WIZARD_STEPS = ["Candidats", "Paramètres", "Contexte", "Résumé"];
