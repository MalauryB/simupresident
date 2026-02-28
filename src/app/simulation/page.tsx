"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/lib/simulation-context";
import { WIZARD_STEPS, ALLIANCE_PRESETS } from "@/lib/constants";
import { getSelected, getTrendColor } from "@/lib/simulation";
import { StepIndicator } from "@/app/components/ui/StepIndicator";
import { Slider } from "@/app/components/ui/Slider";
import { TrendSlider } from "@/app/components/ui/TrendSlider";
import { TriSlider } from "@/app/components/ui/TriSlider";
import { TutorialOverlay, CANDIDATE_TUTORIAL_STEPS, PARAMS_TUTORIAL_STEPS, STARTING_POINT_TUTORIAL_STEPS, BARRAGE_TUTORIAL_STEPS } from "@/app/components/ui/TutorialOverlay";
import type { PartyData } from "@/types/simulation";

/* ------------------------------------------------------------------ */
/*  Party select card (step 0)                                         */
/* ------------------------------------------------------------------ */
function PartySelectCard({
  party,
  onToggle,
}: {
  party: PartyData;
  onToggle: () => void;
}) {
  const { partyColors, switchVariant } = useSimulation();
  const candidate = getSelected(party);
  const colors = partyColors[party.tag];
  const hasVariants = party.variants.length > 1;

  return (
    <div
      className="relative overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        background: party.active ? "#fff" : "rgba(243,244,246,0.13)",
        border: party.active
          ? `2.5px solid ${colors.accent}`
          : "2.5px solid transparent",
        opacity: party.active ? 1 : 0.5,
        transform: party.active ? "scale(1)" : "scale(0.97)",
        boxShadow: party.active
          ? `0 4px 20px ${colors.accent}20`
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {/* Clickable top area */}
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onToggle(); }}
        className="cursor-pointer px-4 pt-[18px] text-center"
      >
        {/* Checkmark */}
        <div
          className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full text-[13px] font-bold text-white"
          style={{
            background: party.active ? colors.accent : "rgba(209,213,219,0.5)",
          }}
        >
          {party.active ? "\u2713" : ""}
        </div>

        {/* Gradient avatar */}
        <div
          className="relative mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent})`,
            filter: party.active ? "none" : "grayscale(0.8)",
          }}
        >
          <span
            className="font-extrabold"
            style={{
              color: colors.fg,
              fontSize: candidate.initials.length > 2 ? "14px" : "18px",
            }}
          >
            {candidate.initials}
          </span>
          {candidate.photoUrl && (
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="absolute inset-0 h-14 w-14 rounded-full object-cover"
              style={{ filter: party.active ? "none" : "grayscale(0.8)" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>

        {/* Name */}
        <div className="flex min-h-[34px] items-center justify-center text-sm font-bold leading-tight text-primary-dark">
          {candidate.name}
        </div>

        {/* Tag badge */}
        <span
          className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
          style={{
            background: party.active ? `${colors.bg}15` : "rgba(209,213,219,0.25)",
            color: party.active ? colors.bg : "#9ca3af",
          }}
        >
          {party.tag}
        </span>
      </div>

      {/* Variant tabs (only when active and multiple variants) */}
      {hasVariants && party.active ? (
        <div className="mt-2 px-2.5 pb-3">
          <div
            className="flex overflow-hidden rounded-[10px]"
            style={{
              background: `${colors.bg}10`,
              border: `1px solid ${colors.accent}20`,
            }}
          >
            {party.variants.map((v, idx) => {
              const isSelected = party.selectedIdx === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => { e.stopPropagation(); switchVariant(party.tag, idx); }}
                  className="flex-1 truncate py-[7px] px-1 text-[11px] font-bold transition-colors"
                  style={{
                    background: isSelected ? colors.accent : "transparent",
                    color: isSelected ? colors.fg : colors.bg,
                  }}
                >
                  {v.name.split(" ").pop()}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="h-3.5" />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Config card (step 1)                                               */
/* ------------------------------------------------------------------ */
function ConfigCard({ party, isTutorial }: { party: PartyData; isTutorial?: boolean }) {
  const { updateVariant, partyColors } = useSimulation();
  const candidate = getSelected(party);
  const colors = partyColors[party.tag];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: `3px solid ${colors.accent}` }}
      >
        <div className="relative h-10 w-10 flex-shrink-0">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
            style={{ backgroundColor: colors.bg, color: colors.fg }}
          >
            {candidate.initials}
          </div>
          {candidate.photoUrl && (
            <img
              src={candidate.photoUrl}
              alt={candidate.name}
              className="absolute inset-0 h-10 w-10 rounded-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-primary-dark">
            {candidate.name}
          </h3>
          <p className="text-xs text-gray-400">{party.party}</p>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-bold"
          style={{
            backgroundColor: `${colors.accent}18`,
            color: colors.accent,
          }}
        >
          {party.tag}
        </span>
      </div>

      <div className="space-y-4 px-5 py-4">
        {/* Attractivite slider */}
        <div {...(isTutorial ? { "data-tuto": "attractivite" } : {})}>
          <Slider
            label="Attractivit&eacute;"
            value={candidate.attractivite}
            onChange={(v) => updateVariant(party.tag, "attractivite", v)}
            color={colors.accent}
          />
        </div>

        {/* Tendance slider (rich version from mockup) */}
        <div {...(isTutorial ? { "data-tuto": "tendance" } : {})}>
          <TrendSlider
            value={candidate.tendance}
            onChange={(v) => updateVariant(party.tag, "tendance", v)}
          />
        </div>

        {/* Ideology tri-slider */}
        <div {...(isTutorial ? { "data-tuto": "ideologie" } : {})}>
          <TriSlider
            left={candidate.left}
            center={candidate.center}
            right={candidate.right}
            onChange={(v) => updateVariant(party.tag, "ideology", v)}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Starting point row (step 2)                                        */
/* ------------------------------------------------------------------ */
function StartingPointRow({
  party,
  sourceId,
}: {
  party: PartyData;
  sourceId: string;
}) {
  const { updateVariant, partyColors } = useSimulation();
  const candidate = getSelected(party);
  const colors = partyColors[party.tag];

  const fieldKey =
    sourceId === "agrege"
      ? "startAgrege"
      : sourceId === "debiaise"
        ? "startDebiaise"
        : "startCustom";

  const value = candidate[fieldKey];
  const isCustom = sourceId === "custom";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
      <div className="relative h-8 w-8 flex-shrink-0">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
          style={{ backgroundColor: colors.bg, color: colors.fg }}
        >
          {candidate.initials}
        </div>
        {candidate.photoUrl && (
          <img
            src={candidate.photoUrl}
            alt={candidate.name}
            className="absolute inset-0 h-8 w-8 rounded-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      <div className="flex-1">
        <span className="text-sm font-medium text-primary-dark">
          {candidate.name}
        </span>
      </div>
      {isCustom ? (
        <input
          type="number"
          min={0}
          max={100}
          value={value}
          onChange={(e) =>
            updateVariant(party.tag, fieldKey, Number(e.target.value))
          }
          className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-right font-mono text-sm font-semibold text-primary-dark focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        />
      ) : (
        <span className="font-mono text-sm font-semibold text-primary-dark">
          {value}%
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Review table (step 3)                                              */
/* ------------------------------------------------------------------ */
function ReviewTable({ parties }: { parties: PartyData[] }) {
  const { partyColors } = useSimulation();
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full min-w-[500px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-4 py-3 font-semibold text-gray-600">Candidat</th>
            <th className="px-4 py-3 font-semibold text-gray-600">Parti</th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">
              D&eacute;part
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">
              Tendance
            </th>
          </tr>
        </thead>
        <tbody>
          {parties.map((p) => {
            const c = getSelected(p);
            const colors = partyColors[p.tag];
            return (
              <tr
                key={p.tag}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="relative h-7 w-7 flex-shrink-0">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: colors.bg, color: colors.fg }}
                      >
                        {c.initials}
                      </div>
                      {c.photoUrl && (
                        <img
                          src={c.photoUrl}
                          alt={c.name}
                          className="absolute inset-0 h-7 w-7 rounded-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                    </div>
                    <span className="font-medium text-primary-dark">
                      {c.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-bold"
                    style={{
                      backgroundColor: `${colors.accent}18`,
                      color: colors.accent,
                    }}
                  >
                    {p.tag}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-primary-dark">
                  {c.startAgrege}%
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className="font-mono font-semibold"
                    style={{ color: getTrendColor(c.tendance) }}
                  >
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

/* ------------------------------------------------------------------ */
/*  Simulation wizard page                                             */
/* ------------------------------------------------------------------ */
export default function SimulationPage() {
  const router = useRouter();
  const {
    parties,
    activeParties,
    pollSource,
    pollSources,
    toggleParty,
    selectAll,
    setPartiesActive,
    setPollSource,
    unpolledActive,
    gammaRejetED,
    gammaRejetEG,
    setGammaRejetED,
    setGammaRejetEG,
    days,
    setDays,
  } = useSimulation();

  const [step, setStep] = useState(0);
  const [showTutoCandidats, setShowTutoCandidats] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showTutoStarting, setShowTutoStarting] = useState(false);
  const [showTutoBarrage, setShowTutoBarrage] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("tutoCandidatsSeen")) {
      setShowTutoCandidats(true);
    }
    if (!localStorage.getItem("tutoParamsSeen")) {
      setShowTutorial(true);
    }
    if (!localStorage.getItem("tutoStartingSeen")) {
      setShowTutoStarting(true);
    }
    if (!localStorage.getItem("tutoBarrageSeen")) {
      setShowTutoBarrage(true);
    }
  }, []);

  const stepSubtitles = [
    "S\u00e9lectionnez les candidats \u00e0 inclure dans la simulation.",
    "Ajustez les param\u00e8tres de chaque candidat.",
    "Choisissez la source de sondages et v\u00e9rifiez les points de d\u00e9part.",
    "Configurez l\u2019intensit\u00e9 du vote barrage au second tour.",
    "Choisissez l\u2019horizon temporel de la simulation.",
    "V\u00e9rifiez la configuration avant de lancer la simulation.",
  ];

  const total = activeParties.reduce((s, p) => {
    const c = getSelected(p);
    const field =
      pollSource === "agrege"
        ? "startAgrege"
        : pollSource === "debiaise"
          ? "startDebiaise"
          : "startCustom";
    return s + c[field];
  }, 0);

  const selectedSource = pollSources.find((s) => s.id === pollSource);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-dark"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Retour
      </Link>

      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary-dark sm:text-4xl">
          Configurer la simulation
        </h1>
        <div className="flex items-center justify-center gap-2">
          <p className="text-gray-500">{stepSubtitles[step]}</p>
        </div>
        {step <= 3 && (
          <button
            type="button"
            onClick={() => {
              if (step === 0) setShowTutoCandidats(true);
              if (step === 1) setShowTutorial(true);
              if (step === 2) setShowTutoStarting(true);
              if (step === 3) setShowTutoBarrage(true);
            }}
            className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01" />
            </svg>
            Guide de cette étape
          </button>
        )}

      </div>

      {/* Step indicator */}
      <div className="mb-10">
        <StepIndicator current={step} labels={WIZARD_STEPS} onStepClick={(i) => { setStep(i); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
      </div>

      {/* ---- STEP 0: Party selection ---- */}
      {step === 0 && (() => {
        const firstVariantIdx = showTutoCandidats
          ? parties.findIndex((p, i) => i !== 0 && p.variants.length > 1 && p.active)
          : -1;
        // Detect which preset matches current active/inactive state
        const currentPresetId = ALLIANCE_PRESETS.find((preset) => {
          return parties.every((p) =>
            preset.inactive.includes(p.tag) ? !p.active : p.active
          );
        })?.id ?? null;
        return (
          <div>
            {/* Alliance presets */}
            <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4">
              <h3 className="mb-3 text-sm font-bold text-primary-dark">
                Sc&eacute;narios d&rsquo;alliance
              </h3>
              <div className="flex flex-wrap gap-2">
                {ALLIANCE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setPartiesActive(preset.inactive)}
                    title={preset.desc}
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
                const tutoAttr = showTutoCandidats && i === 0
                  ? "candidat-carte"
                  : showTutoCandidats && i === firstVariantIdx
                    ? "candidat-variante"
                    : undefined;
                return (
                  <div key={party.tag} {...(tutoAttr ? { "data-tuto": tutoAttr } : {})}>
                    <PartySelectCard
                      party={party}
                      onToggle={() => toggleParty(party.tag)}
                    />
                  </div>
                );
              })}
            </div>

            {showTutoCandidats && (
              <TutorialOverlay
                steps={CANDIDATE_TUTORIAL_STEPS}
                storageKey="tutoCandidatsSeen"
                onClose={() => setShowTutoCandidats(false)}
              />
            )}
          </div>
        );
      })()}

      {/* ---- STEP 1: Parameter config ---- */}
      {step === 1 && (
        <div className="space-y-6">
          {activeParties.map((party, i) => (
            <ConfigCard
              key={party.tag}
              party={party}
              isTutorial={showTutorial && i === 0}
            />
          ))}
          {activeParties.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center">
              <p className="text-gray-400">
                Aucun candidat s&eacute;lectionn&eacute;. Retournez &agrave;
                l&rsquo;&eacute;tape pr&eacute;c&eacute;dente.
              </p>
            </div>
          )}
          {showTutorial && step === 1 && (
            <TutorialOverlay
              steps={PARAMS_TUTORIAL_STEPS}
              storageKey="tutoParamsSeen"
              onClose={() => setShowTutorial(false)}
            />
          )}
        </div>
      )}

      {/* ---- STEP 2: Poll source & starting points ---- */}
      {step === 2 && (
        <div className="space-y-8">
          {/* Source selection */}
          <div className="grid gap-4 sm:grid-cols-3" {...(showTutoStarting ? { "data-tuto": "source-sondage" } : {})}>
            {pollSources.map((src) => (
              <button
                key={src.id}
                type="button"
                onClick={() => setPollSource(src.id)}
                className={`rounded-2xl border-2 p-5 text-left transition-all duration-200 hover:shadow-md ${
                  pollSource === src.id
                    ? "border-accent bg-white shadow-md"
                    : "border-gray-200 bg-white/60 hover:border-gray-300"
                }`}
              >
                <div className="mb-2 text-2xl">{src.icon}</div>
                <h3 className="mb-1 text-sm font-bold text-primary-dark">
                  {src.label}
                </h3>
                <p className="text-xs text-gray-500">{src.desc}</p>
              </button>
            ))}
          </div>

          {/* Warning for unpolled candidates */}
          {unpolledActive.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
              <div className="flex items-start gap-2">
                <span className="text-lg">&#9888;&#65039;</span>
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Candidats non sond&eacute;s directement
                  </p>
                  <p className="mt-0.5 text-xs text-amber-600">
                    {unpolledActive
                      .map((p) => getSelected(p).name)
                      .join(", ")}{" "}
                    &mdash; leurs points de d&eacute;part sont
                    estim&eacute;s.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Starting points list */}
          <div>
            <h3
              className="mb-3 text-sm font-bold text-primary-dark"
              {...(showTutoStarting ? { "data-tuto": "points-depart" } : {})}
            >
              Points de d&eacute;part
            </h3>
            <div className="space-y-2">
              {activeParties.map((p) => (
                <StartingPointRow
                  key={p.tag}
                  party={p}
                  sourceId={pollSource}
                />
              ))}
            </div>
            {/* Total */}
            <div className="mt-3 flex items-center justify-end gap-2 text-sm">
              <span className="text-gray-500">Total :</span>
              <span
                className={`font-mono font-bold ${
                  total === 100
                    ? "text-green-600"
                    : "text-amber-600"
                }`}
              >
                {total}%
              </span>
            </div>
          </div>

          {showTutoStarting && (
            <TutorialOverlay
              steps={STARTING_POINT_TUTORIAL_STEPS}
              storageKey="tutoStartingSeen"
              onClose={() => setShowTutoStarting(false)}
            />
          )}
        </div>
      )}

      {/* ---- STEP 3: Barrage ---- */}
      {step === 3 && (
        <div className="mx-auto max-w-lg space-y-6">
          <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6">
            <h3 className="mb-1 text-base font-bold text-primary-dark">
              Vote barrage (second tour)
            </h3>
            <p className="mb-5 text-sm text-gray-500">
              Ces coefficients p&eacute;nalisent les candidats extr&ecirc;mes
              lorsqu&rsquo;ils acc&egrave;dent au second tour. La p&eacute;nalit&eacute;
              de chaque candidat est calcul&eacute;e &agrave; partir de son vecteur
              id&eacute;ologique : &rho;<sub>k</sub> = &gamma;<sub>ED</sub> &times;
              W<sub>droite</sub> + &gamma;<sub>EG</sub> &times; W<sub>gauche</sub>.
            </p>
            <div className="space-y-4">
              <div {...(showTutoBarrage ? { "data-tuto": "barrage-ed" } : {})}>
                <Slider
                  label="Barrage extr&ecirc;me droite (&gamma;_ED)"
                  value={gammaRejetED}
                  onChange={setGammaRejetED}
                  min={0}
                  max={10}
                  step={0.1}
                  color="#2563eb"
                />
              </div>
              <div {...(showTutoBarrage ? { "data-tuto": "barrage-eg" } : {})}>
                <Slider
                  label="Barrage extr&ecirc;me gauche (&gamma;_EG)"
                  value={gammaRejetEG}
                  onChange={setGammaRejetEG}
                  min={0}
                  max={10}
                  step={0.1}
                  color="#dc2626"
                />
              </div>
            </div>
          </div>

          {showTutoBarrage && (
            <TutorialOverlay
              steps={BARRAGE_TUTORIAL_STEPS}
              storageKey="tutoBarrageSeen"
              onClose={() => setShowTutoBarrage(false)}
            />
          )}
        </div>
      )}

      {/* ---- STEP 4: Horizon ---- */}
      {step === 4 && (() => {
        const ELECTION_DATE = new Date(2027, 3, 10); // 10 avril 2027
        const daysUntilElection = Math.max(7, Math.min(365, Math.round((ELECTION_DATE.getTime() - Date.now()) / 86_400_000)));
        return (
          <div className="mx-auto max-w-lg space-y-6">
            <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-6">
              <h3 className="mb-1 text-base font-bold text-primary-dark">
                Horizon de simulation
              </h3>
              <p className="mb-5 text-sm text-gray-500">
                Nombre de jours avant l&rsquo;&eacute;lection sur lesquels la
                simulation est projet&eacute;e. Un horizon court (30&ndash;90&nbsp;j)
                donne des r&eacute;sultats plus stables&nbsp;; un horizon long
                (365&nbsp;j) capture davantage d&rsquo;incertitude.
              </p>
              <Slider
                label="Jours avant l&rsquo;&eacute;lection"
                value={days}
                onChange={(v) => setDays(Math.round(v))}
                min={7}
                max={365}
                step={1}
                color="#ea580c"
              />
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
                  Aujourd&rsquo;hui ({daysUntilElection}j)
                </button>
                {[30, 90, 180, 365].map((d) => (
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
      })()}

      {/* ---- STEP 5: Summary ---- */}
      {step === 5 && (
        <div className="space-y-6">
          {/* Source info badge */}
          {selectedSource && (
            <div className="flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-3">
              <span className="text-xl">{selectedSource.icon}</span>
              <div>
                <p className="text-sm font-bold text-primary-dark">
                  {selectedSource.label}
                </p>
                <p className="text-xs text-gray-500">{selectedSource.desc}</p>
              </div>
            </div>
          )}

          {/* Review table */}
          <ReviewTable parties={activeParties} />
        </div>
      )}

      {/* ---- Bottom navigation ---- */}
      <div className="mt-10 flex items-center justify-between">
        <button
          type="button"
          onClick={() => { setStep((s) => Math.max(0, s - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Pr&eacute;c&eacute;dent
        </button>

        {step < 5 ? (
          <button
            type="button"
            onClick={() => { setStep((s) => Math.min(5, s + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={step === 2 && pollSource === "custom" && total !== 100}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/resultats")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-accent to-[#FF7B73] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            <span>🗳️</span>
            Lancer la simulation
          </button>
        )}
      </div>
    </div>
  );
}
