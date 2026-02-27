"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/lib/simulation-context";
import { PARTY_COLORS, POLL_SOURCES, WIZARD_STEPS } from "@/lib/constants";
import { getSelected, getTrendColor } from "@/lib/simulation";
import { StepIndicator } from "@/app/components/ui/StepIndicator";
import { Slider } from "@/app/components/ui/Slider";
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
  const candidate = getSelected(party);
  const colors = PARTY_COLORS[party.tag];

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`group relative w-full overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        party.active
          ? "border-accent bg-white shadow-md"
          : "border-gray-200 bg-white/60 opacity-60 hover:opacity-80"
      }`}
    >
      {/* Top gradient bar */}
      <div
        className="h-1.5"
        style={{
          background: `linear-gradient(90deg, ${colors.accent}, ${colors.chart})`,
        }}
      />

      <div className="flex flex-col items-center px-3 py-4">
        {/* Avatar */}
        <div
          className="mb-2 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold shadow-sm"
          style={{ backgroundColor: colors.bg, color: colors.fg }}
        >
          {candidate.initials}
        </div>

        <h3 className="mb-0.5 text-center text-sm font-semibold text-primary-dark">
          {candidate.name}
        </h3>
        <span
          className="mb-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={{
            backgroundColor: `${colors.accent}18`,
            color: colors.accent,
          }}
        >
          {party.tag}
        </span>
        <p className="text-center text-[11px] text-gray-400">{party.party}</p>
      </div>

      {/* Checkmark overlay */}
      {party.active && (
        <div className="absolute right-2 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white">
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Config card (step 1)                                               */
/* ------------------------------------------------------------------ */
function ConfigCard({ party }: { party: PartyData }) {
  const { switchVariant, updateVariant } = useSimulation();
  const candidate = getSelected(party);
  const colors = PARTY_COLORS[party.tag];
  const trendColor = getTrendColor(candidate.tendance);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: `3px solid ${colors.accent}` }}
      >
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
          style={{ backgroundColor: colors.bg, color: colors.fg }}
        >
          {candidate.initials}
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
        {/* Variant selector (if more than one) */}
        {party.variants.length > 1 && (
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-500">
              Candidat
            </label>
            <div className="flex gap-2">
              {party.variants.map((v, idx) => (
                <button
                  key={v.name}
                  type="button"
                  onClick={() => switchVariant(party.tag, idx)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    idx === party.selectedIdx
                      ? "bg-accent text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {v.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Attractivite slider */}
        <Slider
          label="Attractivit&eacute;"
          value={candidate.attractivite}
          onChange={(v) => updateVariant(party.tag, "attractivite", v)}
          color={colors.accent}
        />

        {/* Tendance slider */}
        <Slider
          label="Tendance"
          value={candidate.tendance}
          onChange={(v) => updateVariant(party.tag, "tendance", v)}
          color={trendColor}
        />

        {/* Barrage slider */}
        <Slider
          label="Coefficient barrage"
          value={candidate.barrage}
          onChange={(v) => updateVariant(party.tag, "barrage", v)}
          color="#ea580c"
        />

        {/* Ideology tri-bar */}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-gray-500">
            Positionnement id&eacute;ologique
          </label>
          <div className="flex h-3 overflow-hidden rounded-full">
            <div
              className="transition-all"
              style={{
                width: `${candidate.left * 100}%`,
                backgroundColor: "#E63946",
              }}
            />
            <div
              className="transition-all"
              style={{
                width: `${candidate.center * 100}%`,
                backgroundColor: "#FFB800",
              }}
            />
            <div
              className="transition-all"
              style={{
                width: `${candidate.right * 100}%`,
                backgroundColor: "#002395",
              }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[10px] text-gray-400">
            <span>Gauche {Math.round(candidate.left * 100)}%</span>
            <span>Centre {Math.round(candidate.center * 100)}%</span>
            <span>Droite {Math.round(candidate.right * 100)}%</span>
          </div>
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
  const { updateVariant } = useSimulation();
  const candidate = getSelected(party);
  const colors = PARTY_COLORS[party.tag];

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
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
        style={{ backgroundColor: colors.bg, color: colors.fg }}
      >
        {candidate.initials}
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
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
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
            <th className="px-4 py-3 text-right font-semibold text-gray-600">
              Barrage
            </th>
          </tr>
        </thead>
        <tbody>
          {parties.map((p) => {
            const c = getSelected(p);
            const colors = PARTY_COLORS[p.tag];
            return (
              <tr
                key={p.tag}
                className="border-b border-gray-100 last:border-0"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{ backgroundColor: colors.bg, color: colors.fg }}
                    >
                      {c.initials}
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
                <td className="px-4 py-3 text-right font-mono font-semibold text-gray-500">
                  {c.barrage.toFixed(2)}
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
    toggleParty,
    selectAll,
    setPollSource,
    unpolledActive,
  } = useSimulation();

  const [step, setStep] = useState(0);

  const stepSubtitles = [
    "S\u00e9lectionnez les candidats \u00e0 inclure dans la simulation.",
    "Ajustez les param\u00e8tres de chaque candidat.",
    "Choisissez la source de sondages et v\u00e9rifiez les points de d\u00e9part.",
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

  const selectedSource = POLL_SOURCES.find((s) => s.id === pollSource);

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
        <p className="text-gray-500">{stepSubtitles[step]}</p>
      </div>

      {/* Step indicator */}
      <div className="mb-10">
        <StepIndicator current={step} labels={WIZARD_STEPS} />
      </div>

      {/* ---- STEP 0: Party selection ---- */}
      {step === 0 && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
            >
              Tout s&eacute;lectionner
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {parties.map((party) => (
              <PartySelectCard
                key={party.tag}
                party={party}
                onToggle={() => toggleParty(party.tag)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ---- STEP 1: Parameter config ---- */}
      {step === 1 && (
        <div className="space-y-6">
          {activeParties.map((party) => (
            <ConfigCard key={party.tag} party={party} />
          ))}
          {activeParties.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 py-12 text-center">
              <p className="text-gray-400">
                Aucun candidat s&eacute;lectionn&eacute;. Retournez &agrave;
                l&rsquo;&eacute;tape pr&eacute;c&eacute;dente.
              </p>
            </div>
          )}
        </div>
      )}

      {/* ---- STEP 2: Poll source & starting points ---- */}
      {step === 2 && (
        <div className="space-y-8">
          {/* Source selection */}
          <div className="grid gap-4 sm:grid-cols-3">
            {POLL_SOURCES.map((src) => (
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
            <h3 className="mb-3 text-sm font-bold text-primary-dark">
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
                  Math.abs(total - 100) < 2
                    ? "text-green-600"
                    : "text-amber-600"
                }`}
              >
                {total}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ---- STEP 3: Summary ---- */}
      {step === 3 && (
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
          onClick={() => setStep((s) => Math.max(0, s - 1))}
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

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
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
