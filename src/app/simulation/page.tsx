"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/lib/simulation-context";
import { WIZARD_STEPS, ALLIANCE_PRESETS, ELECTION_DATE, DAY_PRESETS } from "@/lib/constants";
import { getSelected, getTrendColor, getStartField } from "@/lib/simulation";
import { StepIndicator } from "@/app/components/ui/StepIndicator";
import { Slider } from "@/app/components/ui/Slider";
import { TrendSlider } from "@/app/components/ui/TrendSlider";
import { TriSlider } from "@/app/components/ui/TriSlider";
import { Avatar } from "@/app/components/ui/Avatar";
import { BackLink } from "@/app/components/ui/BackLink";
import { GuideButton } from "@/app/components/ui/GuideButton";
import {
  TutorialOverlay,
  CANDIDATE_TUTORIAL_STEPS,
  PARAMS_TUTORIAL_STEPS,
  STARTING_POINT_TUTORIAL_STEPS,
  BARRAGE_TUTORIAL_STEPS,
} from "@/app/components/ui/TutorialOverlay";
import type { PartyData } from "@/types/simulation";

/* ------------------------------------------------------------------ */
/*  Shared SVG chevrons                                                */
/* ------------------------------------------------------------------ */
function ChevronLeft() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 0 — Party select card                                         */
/* ------------------------------------------------------------------ */
function PartySelectCard({ party, onToggle }: { party: PartyData; onToggle: () => void }) {
  const { partyColors, switchVariant } = useSimulation();
  const candidate = getSelected(party);
  const colors = partyColors[party.tag];
  const hasVariants = party.variants.length > 1;

  return (
    <div
      className="relative overflow-hidden rounded-xl transition-all duration-200"
      style={{
        background: party.active ? "#fff" : "rgba(243,244,246,0.13)",
        border: party.active ? `2px solid ${colors.accent}` : "2px solid transparent",
        opacity: party.active ? 1 : 0.5,
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-label={`${party.active ? "Désactiver" : "Activer"} ${candidate.name}`}
        aria-pressed={party.active}
        className="w-full cursor-pointer px-4 pt-[18px] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
      >
        <div
          className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-bold text-white"
          style={{ background: party.active ? colors.accent : "rgba(209,213,219,0.5)" }}
        >
          {party.active ? "\u2713" : ""}
        </div>
        <div className="mx-auto mb-2">
          <Avatar candidate={candidate} colors={colors} size={14} grayscale={!party.active} />
        </div>
        <div className="flex min-h-[34px] items-center justify-center text-sm font-bold leading-tight text-primary-dark">
          {candidate.name}
        </div>
        <span
          className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{
            background: party.active ? `${colors.bg}15` : "rgba(209,213,219,0.25)",
            color: party.active ? colors.bg : "#9ca3af",
          }}
        >
          {party.tag}
        </span>
      </button>

      {hasVariants && party.active ? (
        <div className="mt-2 px-2.5 pb-3">
          <div
            className="flex overflow-hidden rounded-[10px]"
            style={{ background: `${colors.bg}10`, border: `1px solid ${colors.accent}20` }}
          >
            {party.variants.map((v, idx) => (
              <button
                key={v.name}
                type="button"
                onClick={(e) => { e.stopPropagation(); switchVariant(party.tag, idx); }}
                aria-label={`Choisir ${v.name}`}
                className="flex-1 truncate py-[7px] px-1 text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                style={{
                  background: party.selectedIdx === idx ? colors.accent : "transparent",
                  color: party.selectedIdx === idx ? colors.fg : colors.bg,
                }}
              >
                {v.name.split(" ").pop()}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-3.5" />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 0 — Candidates                                                */
/* ------------------------------------------------------------------ */
function StepCandidats({ showTutorial, onCloseTutorial }: { showTutorial: boolean; onCloseTutorial: () => void }) {
  const { parties, toggleParty, setPartiesActive } = useSimulation();

  const currentPresetId = useMemo(() => {
    return ALLIANCE_PRESETS.find((preset) =>
      parties.every((p) => preset.inactive.includes(p.tag) ? !p.active : p.active)
    )?.id ?? null;
  }, [parties]);

  const firstVariantIdx = showTutorial
    ? parties.findIndex((p, i) => i !== 0 && p.variants.length > 1 && p.active)
    : -1;

  return (
    <div>
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-bold text-primary-dark">Scénarios d'alliance</h3>
        <div className="flex flex-wrap gap-2">
          {ALLIANCE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setPartiesActive(preset.inactive)}
              aria-label={preset.desc}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                currentPresetId === preset.id
                  ? "bg-accent text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-accent/50 hover:text-accent"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {parties.map((party, i) => {
          const tutoAttr = showTutorial && i === 0
            ? "candidat-carte"
            : showTutorial && i === firstVariantIdx
              ? "candidat-variante"
              : undefined;
          return (
            <div key={party.tag} {...(tutoAttr ? { "data-tuto": tutoAttr } : {})}>
              <PartySelectCard party={party} onToggle={() => toggleParty(party.tag)} />
            </div>
          );
        })}
      </div>

      {showTutorial && (
        <TutorialOverlay steps={CANDIDATE_TUTORIAL_STEPS} storageKey="tutoCandidatsSeen" onClose={onCloseTutorial} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Config card                                               */
/* ------------------------------------------------------------------ */
function ConfigCard({ party, isTutorial }: { party: PartyData; isTutorial?: boolean }) {
  const { updateVariant, partyColors } = useSimulation();
  const candidate = getSelected(party);
  const colors = partyColors[party.tag];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: `3px solid ${colors.accent}` }}>
        <Avatar candidate={candidate} colors={colors} size={10} />
        <div className="flex-1">
          <h3 className="text-sm font-bold text-primary-dark">{candidate.name}</h3>
          <p className="text-xs text-gray-400">{party.party}</p>
        </div>
        <span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ backgroundColor: `${colors.accent}18`, color: colors.accent }}>
          {party.tag}
        </span>
      </div>
      <div className="space-y-4 px-5 py-4">
        <div {...(isTutorial ? { "data-tuto": "attractivite" } : {})}>
          <Slider label="Attractivité" value={candidate.attractivite} onChange={(v) => updateVariant(party.tag, "attractivite", v)} color={colors.accent} />
        </div>
        <div {...(isTutorial ? { "data-tuto": "tendance" } : {})}>
          <TrendSlider value={candidate.tendance} onChange={(v) => updateVariant(party.tag, "tendance", v)} />
        </div>
        <div {...(isTutorial ? { "data-tuto": "ideologie" } : {})}>
          <TriSlider left={candidate.left} center={candidate.center} right={candidate.right} onChange={(v) => updateVariant(party.tag, "ideology", v)} />
        </div>
      </div>
    </div>
  );
}

function StepParams({ showTutorial, onCloseTutorial }: { showTutorial: boolean; onCloseTutorial: () => void }) {
  const { activeParties } = useSimulation();
  return (
    <div className="space-y-6">
      {activeParties.map((party, i) => (
        <ConfigCard key={party.tag} party={party} isTutorial={showTutorial && i === 0} />
      ))}
      {activeParties.length === 0 && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
          <p className="text-gray-400">Aucun candidat sélectionné. Retournez à l'étape précédente.</p>
        </div>
      )}
      {showTutorial && (
        <TutorialOverlay steps={PARAMS_TUTORIAL_STEPS} storageKey="tutoParamsSeen" onClose={onCloseTutorial} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Starting point row                                        */
/* ------------------------------------------------------------------ */
function StartingPointRow({ party, sourceId }: { party: PartyData; sourceId: string }) {
  const { updateVariant, partyColors } = useSimulation();
  const candidate = getSelected(party);
  const colors = partyColors[party.tag];
  const fieldKey = getStartField(sourceId);
  const value = candidate[fieldKey];
  const isCustom = sourceId === "custom";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
      <Avatar candidate={candidate} colors={colors} size={8} />
      <div className="flex-1">
        <span className="text-sm font-medium text-primary-dark">{candidate.name}</span>
      </div>
      {isCustom ? (
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          aria-label={`Point de départ de ${candidate.name}`}
          onChange={(e) => updateVariant(party.tag, fieldKey, Number(e.target.value))}
          className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-right font-mono text-sm font-semibold text-primary-dark focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      ) : (
        <span className="font-mono text-sm font-semibold text-primary-dark">{value}%</span>
      )}
    </div>
  );
}

function StepStartingPoint({ showTutorial, onCloseTutorial, total }: { showTutorial: boolean; onCloseTutorial: () => void; total: number }) {
  const { activeParties, pollSource, pollSources, setPollSource, unpolledActive } = useSimulation();
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3" {...(showTutorial ? { "data-tuto": "source-sondage" } : {})}>
        {pollSources.map((src) => (
          <button
            key={src.id}
            type="button"
            onClick={() => setPollSource(src.id)}
            className={`rounded-xl border-2 p-5 text-left transition-colors duration-200 ${
              pollSource === src.id ? "border-accent bg-white" : "border-gray-200 bg-white/60 hover:border-accent/50"
            }`}
          >
            <div className="mb-2 text-2xl">{src.icon}</div>
            <h3 className="mb-1 text-sm font-bold text-primary-dark">{src.label}</h3>
            <p className="text-xs text-gray-600">{src.desc}</p>
          </button>
        ))}
      </div>

      {unpolledActive.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <div className="flex items-start gap-2">
            <span className="text-lg" aria-hidden="true">&#9888;&#65039;</span>
            <div>
              <p className="text-sm font-medium text-amber-800">Candidats non sondés directement</p>
              <p className="mt-0.5 text-xs text-amber-600">
                {unpolledActive.map((p) => getSelected(p).name).join(", ")} — leurs points de départ sont estimés.
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-bold text-primary-dark" {...(showTutorial ? { "data-tuto": "points-depart" } : {})}>
          Points de départ
        </h3>
        <div className="space-y-2">
          {activeParties.map((p) => (
            <StartingPointRow key={p.tag} party={p} sourceId={pollSource} />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-sm">
          <span className="text-gray-600">Total :</span>
          <span className={`font-mono font-bold ${total === 100 ? "text-green-600" : "text-amber-600"}`}>
            {total}%
          </span>
        </div>
      </div>

      {showTutorial && (
        <TutorialOverlay steps={STARTING_POINT_TUTORIAL_STEPS} storageKey="tutoStartingSeen" onClose={onCloseTutorial} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — Barrage                                                   */
/* ------------------------------------------------------------------ */
function StepBarrage({ showTutorial, onCloseTutorial }: { showTutorial: boolean; onCloseTutorial: () => void }) {
  const { gammaRejetED, gammaRejetEG, setGammaRejetED, setGammaRejetEG } = useSimulation();
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-6">
        <h3 className="mb-1 text-base font-bold text-primary-dark">Vote barrage (second tour)</h3>
        <p className="mb-5 text-sm text-gray-600">
          Ces coefficients pénalisent les candidats extrêmes lorsqu'ils accèdent au second tour.
          La pénalité de chaque candidat est calculée à partir de son vecteur idéologique :
          {" "}&rho;<sub>k</sub> = &gamma;<sub>ED</sub> &times; W<sub>droite</sub> + &gamma;<sub>EG</sub> &times; W<sub>gauche</sub>.
        </p>
        <div className="space-y-4">
          <div {...(showTutorial ? { "data-tuto": "barrage-ed" } : {})}>
            <Slider label="Barrage extrême droite (γ_ED)" value={gammaRejetED} onChange={setGammaRejetED} min={0} max={10} step={0.1} color="#2563eb" />
          </div>
          <div {...(showTutorial ? { "data-tuto": "barrage-eg" } : {})}>
            <Slider label="Barrage extrême gauche (γ_EG)" value={gammaRejetEG} onChange={setGammaRejetEG} min={0} max={10} step={0.1} color="#dc2626" />
          </div>
        </div>
      </div>
      {showTutorial && (
        <TutorialOverlay steps={BARRAGE_TUTORIAL_STEPS} storageKey="tutoBarrageSeen" onClose={onCloseTutorial} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4 — Horizon                                                   */
/* ------------------------------------------------------------------ */
function StepHorizon() {
  const { days, setDays } = useSimulation();
  const daysUntilElection = useMemo(() => {
    return Math.max(7, Math.min(365, Math.round((ELECTION_DATE.getTime() - Date.now()) / 86_400_000)));
  }, []);

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-6">
        <h3 className="mb-1 text-base font-bold text-primary-dark">Horizon de simulation</h3>
        <p className="mb-5 text-sm text-gray-600">
          Nombre de jours avant l'élection sur lesquels la simulation est projetée.
          Un horizon court (30–90 j) donne des résultats plus stables ;
          un horizon long (365 j) capture davantage d'incertitude.
        </p>
        <Slider label="Jours avant l'élection" value={days} onChange={(v) => setDays(Math.round(v))} min={7} max={365} step={1} color="#ea580c" />
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDays(daysUntilElection)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              days === daysUntilElection
                ? "bg-orange-600 text-white"
                : "border border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-100"
            }`}
          >
            Aujourd'hui ({daysUntilElection}j)
          </button>
          {DAY_PRESETS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                days === d
                  ? "bg-orange-600 text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:text-orange-600"
              }`}
            >
              {d} jours
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 5 — Review table                                              */
/* ------------------------------------------------------------------ */
function ReviewTable({ parties }: { parties: PartyData[] }) {
  const { partyColors, pollSource } = useSimulation();
  const field = getStartField(pollSource);
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[500px] text-left text-sm">
        <caption className="sr-only">Résumé de la configuration de simulation</caption>
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-semibold text-gray-600">Candidat</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Parti</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Départ</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Tendance</th>
          </tr>
        </thead>
        <tbody>
          {parties.map((p) => {
            const c = getSelected(p);
            const colors = partyColors[p.tag];
            return (
              <tr key={p.tag} className="border-b border-gray-100 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar candidate={c} colors={colors} size={7} />
                    <span className="font-medium text-primary-dark">{c.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full px-2 py-0.5 text-xs font-bold" style={{ backgroundColor: `${colors.accent}18`, color: colors.accent }}>
                    {p.tag}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-primary-dark">{c[field]}%</td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono font-semibold" style={{ color: getTrendColor(c.tendance) }}>
                    {c.tendance.toFixed(2)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function StepSummary() {
  const { activeParties, pollSources, pollSource } = useSimulation();
  const selectedSource = useMemo(() => pollSources.find((s) => s.id === pollSource), [pollSources, pollSource]);

  return (
    <div className="space-y-6">
      {selectedSource && (
        <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3">
          <span className="text-xl">{selectedSource.icon}</span>
          <div>
            <p className="text-sm font-bold text-primary-dark">{selectedSource.label}</p>
            <p className="text-xs text-gray-600">{selectedSource.desc}</p>
          </div>
        </div>
      )}
      <ReviewTable parties={activeParties} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tutorial step config (indexed by wizard step)                      */
/* ------------------------------------------------------------------ */
const TUTORIAL_STORAGE_KEYS = ["tutoCandidatsSeen", "tutoParamsSeen", "tutoStartingSeen", "tutoBarrageSeen"];

/* ------------------------------------------------------------------ */
/*  Simulation wizard page                                             */
/* ------------------------------------------------------------------ */
export default function SimulationPage() {
  const router = useRouter();
  const { activeParties, pollSource, days } = useSimulation();

  const [step, setStep] = useState(0);
  const [activeTutorial, setActiveTutorial] = useState<number | null>(null);

  useEffect(() => {
    try {
      for (let i = 0; i < TUTORIAL_STORAGE_KEYS.length; i++) {
        if (!localStorage.getItem(TUTORIAL_STORAGE_KEYS[i])) {
          setActiveTutorial(i);
          return;
        }
      }
    } catch {
      // localStorage not available (private browsing)
    }
  }, []);

  const closeTutorial = useCallback(() => setActiveTutorial(null), []);

  const openGuide = useCallback(() => {
    if (step < TUTORIAL_STORAGE_KEYS.length) setActiveTutorial(step);
  }, [step]);

  const goToStep = useCallback((target: number) => {
    setStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const total = useMemo(() => {
    const field = getStartField(pollSource);
    return activeParties.reduce((s, p) => s + getSelected(p)[field], 0);
  }, [activeParties, pollSource]);

  const stepSubtitles = [
    "Sélectionnez les candidats à inclure dans la simulation.",
    "Ajustez les paramètres de chaque candidat.",
    "Choisissez la source de sondages et vérifiez les points de départ.",
    "Configurez l'intensité du vote barrage au second tour.",
    "Choisissez l'horizon temporel de la simulation.",
    "Vérifiez la configuration avant de lancer la simulation.",
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <BackLink href="/" />

      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary-dark sm:text-4xl">
          Configurer la simulation
        </h1>
        <p className="text-gray-600">{stepSubtitles[step]}</p>
        {step <= 3 && (
          <div className="mt-3">
            <GuideButton onClick={openGuide} />
          </div>
        )}
      </div>

      <div className="mb-10">
        <StepIndicator current={step} labels={WIZARD_STEPS} onStepClick={goToStep} />
      </div>

      {step === 0 && <StepCandidats showTutorial={activeTutorial === 0 && step === 0} onCloseTutorial={closeTutorial} />}
      {step === 1 && <StepParams showTutorial={activeTutorial === 1 && step === 1} onCloseTutorial={closeTutorial} />}
      {step === 2 && <StepStartingPoint showTutorial={activeTutorial === 2 && step === 2} onCloseTutorial={closeTutorial} total={total} />}
      {step === 3 && <StepBarrage showTutorial={activeTutorial === 3 && step === 3} onCloseTutorial={closeTutorial} />}
      {step === 4 && <StepHorizon />}
      {step === 5 && <StepSummary />}

      {/* Spacer for sticky footer */}
      <div className="h-20" />

      {/* Sticky bottom navigation card */}
      <div className="fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
        <div className="flex w-full max-w-md items-center justify-between rounded-xl border border-gray-200 bg-white/95 px-5 py-3 shadow-sm backdrop-blur-md">
          <button
            type="button"
            onClick={() => goToStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft />
            Précédent
          </button>

          {step < WIZARD_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => goToStep(Math.min(WIZARD_STEPS.length - 1, step + 1))}
              disabled={step === 2 && pollSource === "custom" && total !== 100}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Suivant
              <ChevronRight />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/resultats")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            >
              Lancer la simulation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
