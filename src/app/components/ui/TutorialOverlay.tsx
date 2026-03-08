"use client";

import { useState, useEffect, useCallback } from "react";

export interface TutorialStep {
  target: string;
  title: string;
  desc: string;
}

export const PARAMS_TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: "ideologie",
    title: "Profil id\u00e9ologique",
    desc: "Position du candidat sur l\u2019axe gauche\u2011centre\u2011droite. Ce vecteur d\u00e9termine les reports de voix et le vote barrage au second tour.",
  },
  {
    target: "dynamique",
    title: "Dynamique",
    desc: "Param\u00e8tre unique repr\u00e9sentant la tendance du candidat. Au-dessus de 0, il progresse dans les sondages et capte davantage le vote utile\u00a0; en dessous, il recule et perd des \u00e9lecteurs strat\u00e9giques.",
  },
];

export const STARTING_POINT_TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: "source-sondage",
    title: "Source de sondage",
    desc: "Choisissez comment sont d\u00e9termin\u00e9s les points de d\u00e9part\u00a0: moyenne des sondages ou valeurs personnalis\u00e9es.",
  },
  {
    target: "points-depart",
    title: "Points de d\u00e9part",
    desc: "Intention de vote initiale de chaque candidat, list\u00e9e ci-dessous. Le total doit \u00eatre proche de 100\u00a0%. En mode personnalis\u00e9, vous pouvez ajuster chaque valeur.",
  },
];

export const CANDIDATE_TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: "candidat-carte",
    title: "Sélection des candidats",
    desc: "Cliquez sur une carte pour activer ou désactiver un candidat. Seuls les candidats cochés participeront à la simulation.",
  },
  {
    target: "candidat-variante",
    title: "Variantes",
    desc: "Certains partis proposent plusieurs candidats possibles. Utilisez les onglets en bas de la carte pour choisir lequel inclure.",
  },
];

export const BARRAGE_TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: "barrage-ed",
    title: "Barrage \u00e0 l\u2019extr\u00eame droite",
    desc: "Plus ce coefficient est \u00e9lev\u00e9, plus les candidats \u00e0 forte composante \u00ab\u00a0droite\u00a0\u00bb seront p\u00e9nalis\u00e9s au second tour par le vote barrage.",
  },
  {
    target: "barrage-eg",
    title: "Barrage \u00e0 la gauche radicale",
    desc: "M\u00eame logique pour la composante \u00ab\u00a0gauche\u00a0\u00bb. Un coefficient \u00e9lev\u00e9 simule un fort rejet de la gauche radicale au second tour.",
  },
];

export const RESULTS_TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: "res-trajectoires",
    title: "Trajectoires",
    desc: "Chaque ligne repr\u00e9sente l\u2019\u00e9volution m\u00e9diane d\u2019un candidat sur la p\u00e9riode choisie. Les zones color\u00e9es montrent l\u2019intervalle de confiance \u00e0 80\u00a0% (quantiles 10\u201190\u00a0%).",
  },
  {
    target: "res-qualif",
    title: "P(qualification)",
    desc: "Fr\u00e9quence \u00e0 laquelle le candidat termine dans les deux premiers au 1er tour, sur l\u2019ensemble des simulations. Plus la barre est longue, plus il a de chances d\u2019acc\u00e9der au second tour.",
  },
  {
    target: "res-victoire",
    title: "P(victoire)",
    desc: "Fr\u00e9quence \u00e0 laquelle le candidat remporte le second tour, en tenant compte des reports de voix, de l\u2019abstention et du vote barrage.",
  },
  {
    target: "res-duels",
    title: "Duels probables",
    desc: "Les 5 configurations de second tour les plus fr\u00e9quentes, avec le score moyen sur les \u00e9lecteurs exprim\u00e9s pour chaque duel.",
  },
];

interface TutorialOverlayProps {
  steps: TutorialStep[];
  storageKey: string;
  onClose: () => void;
}

export function TutorialOverlay({ steps, storageKey, onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];

  const updateRect = useCallback(() => {
    const el = document.querySelector(`[data-tuto="${step.target}"]`);
    if (el) {
      setRect(el.getBoundingClientRect());
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [step.target]);

  useEffect(() => {
    updateRect();
    window.addEventListener("resize", updateRect);
    window.addEventListener("scroll", updateRect, true);
    return () => {
      window.removeEventListener("resize", updateRect);
      window.removeEventListener("scroll", updateRect, true);
    };
  }, [updateRect]);

  // Recalculate after scroll settles
  useEffect(() => {
    const timer = setTimeout(updateRect, 350);
    return () => clearTimeout(timer);
  }, [currentStep, updateRect]);

  const handleClose = useCallback(() => {
    localStorage.setItem(storageKey, "1");
    onClose();
  }, [storageKey, onClose]);

  // Escape key to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      handleClose();
    }
  };

  if (!rect) return null;

  const PAD = 8;
  const TOOLTIP_HEIGHT = 160; // estimated max tooltip height
  const highlightStyle = {
    position: "fixed" as const,
    top: rect.top - PAD,
    left: rect.left - PAD,
    width: rect.width + PAD * 2,
    height: rect.height + PAD * 2,
    borderRadius: 12,
    boxShadow: "0 0 0 9999px rgba(0,0,0,0.45)",
    zIndex: 51,
    pointerEvents: "none" as const,
  };

  // Place tooltip below if there's room, otherwise above, clamped to viewport
  const spaceBelow = window.innerHeight - rect.bottom - PAD - 12;
  const spaceAbove = rect.top - PAD - 12;
  const placeAbove = spaceBelow < TOOLTIP_HEIGHT && spaceAbove > spaceBelow;
  const rawTop = placeAbove
    ? rect.top - PAD - TOOLTIP_HEIGHT
    : rect.bottom + PAD + 12;
  const tooltipTop = Math.max(12, Math.min(rawTop, window.innerHeight - TOOLTIP_HEIGHT - 12));
  const tooltipLeft = Math.max(16, Math.min(rect.left, window.innerWidth - 340));
  const arrowLeft = Math.min(Math.max(16, rect.left - tooltipLeft + rect.width / 2), 280);

  return (
    <>
      {/* Backdrop click to skip */}
      <div
        className="fixed inset-0 z-50 cursor-pointer"
        onClick={handleClose}
        role="presentation"
      />

      {/* Highlight ring */}
      <div style={highlightStyle} />

      {/* Tooltip bubble */}
      <div
        className="fixed z-[52] w-80 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl"
        style={{ top: tooltipTop, left: tooltipLeft }}
      >
        {/* Arrow — hidden when tooltip overlaps the highlight */}
        {(placeAbove ? tooltipTop + TOOLTIP_HEIGHT < rect.top : tooltipTop > rect.bottom) && (
          <div
            className={`absolute h-4 w-4 rotate-45 border-gray-200 bg-white ${
              placeAbove
                ? "-bottom-2 border-b border-r"
                : "-top-2 border-l border-t"
            }`}
            style={{ left: arrowLeft }}
          />
        )}

        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-primary-dark">{step.title}</h4>
          <span className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600">
            {currentStep + 1}/{steps.length}
          </span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-gray-600">
          {step.desc}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClose}
            className="text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
          >
            Passer
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-dark"
          >
            {currentStep < steps.length - 1 ? "Suivant \u25B6" : "Compris \u2713"}
          </button>
        </div>
      </div>
    </>
  );
}
