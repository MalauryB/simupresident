"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/lib/simulation-context";
import { WIZARD_STEPS, ALLIANCE_PRESETS } from "@/lib/constants";
import { getSelected, getTrendColor, getStartField } from "@/lib/simulation";
import { StepIndicator } from "@/app/components/ui/StepIndicator";
import { Slider } from "@/app/components/ui/Slider";
import { TrendSlider } from "@/app/components/ui/TrendSlider";
import { TriSlider } from "@/app/components/ui/TriSlider";
import { Avatar } from "@/app/components/ui/Avatar";
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
        className="w-full px-4 pt-[18px] text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
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
          {party.party}
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
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
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
/*  Step 1 — Parameters (tabbed)                                       */
/* ------------------------------------------------------------------ */
function StepParams({ showTutorial, onCloseTutorial }: { showTutorial: boolean; onCloseTutorial: () => void }) {
  const { activeParties, updateVariant, partyColors } = useSimulation();
  const [selectedIdx, setSelectedIdx] = useState(0);

  // Clamp index if candidates change
  const idx = Math.min(selectedIdx, Math.max(0, activeParties.length - 1));
  const party = activeParties[idx];
  const candidate = party ? getSelected(party) : null;
  const colors = party ? partyColors[party.tag] : null;
  const isTutorial = showTutorial && idx === 0;

  if (activeParties.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-gray-200 py-12 text-center">
        <p className="text-gray-400">Aucun candidat sélectionné. Retournez à l&apos;étape précédente.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Candidate tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {activeParties.map((p, i) => {
          const c = getSelected(p);
          const col = partyColors[p.tag];
          const isActive = i === idx;
          return (
            <button
              key={p.tag}
              type="button"
              onClick={() => setSelectedIdx(i)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left transition-all duration-200 ${
                isActive
                  ? "bg-white shadow-sm"
                  : "bg-transparent hover:bg-white/60"
              }`}
              style={{
                border: isActive ? `2px solid ${col.accent}` : "2px solid transparent",
              }}
            >
              <Avatar candidate={c} colors={col} size={8} grayscale={!isActive} />
              <div className="min-w-0">
                <div className={`truncate text-xs font-bold ${isActive ? "text-primary-dark" : "text-gray-500"}`}>
                  {c.name.split(" ").pop()}
                </div>
                <div
                  className="truncate text-[10px] font-semibold"
                  style={{ color: isActive ? col.accent : "#9ca3af" }}
                >
                  {p.tag}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected candidate parameters */}
      {party && candidate && colors && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ borderBottom: `3px solid ${colors.accent}` }}
          >
            <Avatar candidate={candidate} colors={colors} size={10} />
            <div className="flex-1">
              <h3 className="text-sm font-bold text-primary-dark">{candidate.name}</h3>
              <p className="text-xs text-gray-400">{party.party}</p>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 text-xs font-bold"
              style={{ backgroundColor: `${colors.accent}18`, color: colors.accent }}
            >
              {party.tag}
            </span>
          </div>

          {/* Controls */}
          <div className="space-y-4 px-5 py-4">
            <div {...(isTutorial ? { "data-tuto": "ideologie" } : {})}>
              <TriSlider
                left={candidate.left}
                center={candidate.center}
                right={candidate.right}
                onChange={(v) => updateVariant(party.tag, "ideology", v)}
              />
            </div>
            <div {...(isTutorial ? { "data-tuto": "tendance" } : {})}>
              <TrendSlider
                value={candidate.tendance}
                onChange={(v) => updateVariant(party.tag, "tendance", v)}
              />
            </div>
            <div {...(isTutorial ? { "data-tuto": "attractivite" } : {})}>
              <Slider
                label="Effet vote utile"
                value={candidate.attractivite}
                onChange={(v) => updateVariant(party.tag, "attractivite", v)}
                color={colors.accent}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation hint */}
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setSelectedIdx(Math.max(0, idx - 1))}
          disabled={idx === 0}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-white hover:text-primary-dark disabled:opacity-0"
        >
          <ChevronLeft />
          {idx > 0 ? getSelected(activeParties[idx - 1]).name.split(" ").pop() : ""}
        </button>
        <span className="text-xs text-gray-400">
          {idx + 1} / {activeParties.length}
        </span>
        <button
          type="button"
          onClick={() => setSelectedIdx(Math.min(activeParties.length - 1, idx + 1))}
          disabled={idx === activeParties.length - 1}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-500 transition-colors hover:bg-white hover:text-primary-dark disabled:opacity-0"
        >
          {idx < activeParties.length - 1 ? getSelected(activeParties[idx + 1]).name.split(" ").pop() : ""}
          <ChevronRight />
        </button>
      </div>

      {showTutorial && (
        <TutorialOverlay steps={PARAMS_TUTORIAL_STEPS} storageKey="tutoParamsSeen" onClose={onCloseTutorial} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Starting point row                                        */
/* ------------------------------------------------------------------ */
function StartingPointRow({ party, sourceId, total }: { party: PartyData; sourceId: string; total: number }) {
  const { updateVariant, partyColors } = useSimulation();
  const candidate = getSelected(party);
  const colors = partyColors[party.tag];
  const fieldKey = getStartField(sourceId);
  const value = candidate[fieldKey];
  const isCustom = sourceId === "custom";
  const normalized = total > 0 ? (value / total * 100).toFixed(1) : "0.0";

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
        <span className="font-mono text-sm font-semibold text-primary-dark">{normalized}%</span>
      )}
    </div>
  );
}

function StepStartingPoint({ showTutorial, onCloseTutorial, total }: { showTutorial: boolean; onCloseTutorial: () => void; total: number }) {
  const { activeParties, pollSource, pollSources, setPollSource, unpolledActive, updateVariant } = useSimulation();
  const isCustom = pollSource === "custom";

  const normalizeCustom = useCallback(() => {
    if (total <= 0) return;
    const entries = activeParties.map((p) => ({ tag: p.tag, val: getSelected(p).startCustom }));
    const normalized = entries.map((e) => Math.round((e.val / total) * 1000) / 10);
    const sumTenths = normalized.reduce((s, v) => s + Math.round(v * 10), 0);
    const diff = 1000 - sumTenths;
    if (diff !== 0) {
      const maxIdx = normalized.indexOf(Math.max(...normalized));
      normalized[maxIdx] = Math.round(normalized[maxIdx] * 10 + diff) / 10;
    }
    entries.forEach((e, i) => updateVariant(e.tag, "startCustom", normalized[i]));
  }, [activeParties, total, updateVariant]);
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
            <StartingPointRow key={p.tag} party={p} sourceId={pollSource} total={total} />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-end gap-2 text-sm">
          <span className="text-gray-600">Total :</span>
          {isCustom ? (
            <>
              <span className={`font-mono font-bold ${total === 100 ? "text-green-600" : "text-amber-600"}`}>
                {total}%
              </span>
              {total !== 100 && total > 0 && (
                <button
                  type="button"
                  onClick={normalizeCustom}
                  className="rounded-lg bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
                >
                  Normaliser
                </button>
              )}
            </>
          ) : (
            <span className="font-mono font-bold text-green-600">100%</span>
          )}
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
        <p className="mb-3 text-sm text-gray-600">
          Au second tour, les &eacute;lecteurs des candidats &eacute;limin&eacute;s se reportent
          vers le finaliste le plus proche id&eacute;ologiquement, mais peuvent aussi s&rsquo;abstenir
          ou voter blanc. Ces coefficients ajoutent une <strong>p&eacute;nalit&eacute; de rejet</strong> pour
          les candidats per&ccedil;us comme extr&ecirc;mes, repr&eacute;sentant le &laquo;&nbsp;front
          r&eacute;publicain&nbsp;&raquo;.
        </p>
        <p className="mb-5 font-mono text-xs text-gray-500">
          &rho;<sub>k</sub> = &gamma;<sub>ED</sub> &times; W<sub>k,droite</sub> + &gamma;<sub>EG</sub> &times; W<sub>k,gauche</sub>
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
/*  Step 5 — Review table                                              */
/* ------------------------------------------------------------------ */
function ReviewTable({ parties }: { parties: PartyData[] }) {
  const { partyColors, pollSource } = useSimulation();
  const field = getStartField(pollSource);
  const total = parties.reduce((s, p) => s + getSelected(p)[field], 0);
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
                <td className="px-4 py-3 text-right font-mono font-semibold text-primary-dark">{total > 0 ? (c[field] / total * 100).toFixed(1) : 0}%</td>
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

  const contentRef = useCallback((node: HTMLDivElement | null) => {
    if (node) node.scrollTop = 0;
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToStep = useCallback((target: number) => {
    setStep(target);
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
    "Vérifiez la configuration avant de lancer la simulation.",
  ];

  return (
    <div className="flex flex-col lg:h-[calc(100vh-80px)]">
      {/* Mobile: titre + StepIndicator horizontal */}
      <div className="px-4 pt-4 pb-4 sm:px-6 lg:hidden">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-primary-dark">Configurer la simulation</h1>
            <p className="mt-0.5 text-xs text-gray-500">{stepSubtitles[step]}</p>
          </div>
          {step <= 3 && <GuideButton onClick={openGuide} />}
        </div>
        <StepIndicator current={step} labels={WIZARD_STEPS} onStepClick={goToStep} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Contenu principal — scroll interne */}
        <div
          ref={contentRef}
          className={`scrollbar-thin flex-1 overflow-y-auto px-4 py-4 sm:px-6 lg:px-8 ${
            step === 3 ? "flex flex-col items-center justify-center" : ""
          }`}
        >
          <div className={`w-full ${step === 3 ? "" : "mx-auto max-w-4xl"}`}>
            {step === 0 && <StepCandidats showTutorial={activeTutorial === 0 && step === 0} onCloseTutorial={closeTutorial} />}
            {step === 1 && <StepParams showTutorial={activeTutorial === 1 && step === 1} onCloseTutorial={closeTutorial} />}
            {step === 2 && <StepStartingPoint showTutorial={activeTutorial === 2 && step === 2} onCloseTutorial={closeTutorial} total={total} />}
            {step === 3 && <StepBarrage showTutorial={activeTutorial === 3 && step === 3} onCloseTutorial={closeTutorial} />}
            {step === 4 && <StepSummary />}

            {/* Spacer for bottom nav — only on steps with tall content */}
            {(step <= 2 || step === 4) && <div className="h-20" />}
          </div>
        </div>

        {/* Sidebar droite — desktop only */}
        <aside className="hidden w-72 shrink-0 flex-col px-6 py-5 lg:flex">
          <div className="flex-1">
            <h1 className="text-sm font-bold text-primary-dark">Configurer la simulation</h1>
            <p className="mt-0.5 min-h-[2rem] text-xs text-gray-500">{stepSubtitles[step]}</p>
            <div className="mt-2 min-h-[28px]">
              {step <= 3 && <GuideButton onClick={openGuide} />}
            </div>
            <div className="mt-4 pt-4">
              <StepIndicator vertical current={step} labels={WIZARD_STEPS} onStepClick={goToStep} />
            </div>
          </div>

          {/* Boutons navigation — dans la sidebar */}
          <div className="mt-4 flex flex-col gap-2 pt-4">
            {step < WIZARD_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => goToStep(Math.min(WIZARD_STEPS.length - 1, step + 1))}
                disabled={step === 2 && pollSource === "custom" && total !== 100}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Suivant
                <ChevronRight />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/resultats")}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
              >
                Lancer la simulation
              </button>
            )}
            <button
              type="button"
              onClick={() => goToStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft />
              Précédent
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom navigation — mobile only */}
      <div className="shrink-0 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between">
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
