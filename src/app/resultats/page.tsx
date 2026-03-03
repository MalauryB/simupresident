"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSimulation } from "@/lib/simulation-context";
import { generateSimData, getSelected } from "@/lib/simulation";
import { TutorialOverlay, RESULTS_TUTORIAL_STEPS } from "@/app/components/ui/TutorialOverlay";
import { BackLink } from "@/app/components/ui/BackLink";
import { GuideButton } from "@/app/components/ui/GuideButton";
import { ScrollableContainer } from "@/app/components/ui/ScrollableContainer";
import { SIM_COUNT } from "@/lib/constants";
import type { SimulationData } from "@/types/simulation";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Results page                                                       */
/* ------------------------------------------------------------------ */
export default function ResultatsPage() {
  const { activeParties, pollSource, partyColors, gammaRejetED, gammaRejetEG, days } = useSimulation();

  const [simData, setSimData] = useState<SimulationData | null>(null);
  const [computing, setComputing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTutoResults, setShowTutoResults] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("tutoResultsSeen")) {
      setShowTutoResults(true);
    }
  }, []);

  useEffect(() => {
    setComputing(true);
    // setTimeout pour permettre le rendu du loading state avant le calcul lourd
    const timer = setTimeout(() => {
      try {
        const result = generateSimData(activeParties, pollSource, days, gammaRejetED, gammaRejetEG);
        setSimData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur inattendue");
      } finally {
        setComputing(false);
      }
    }, 50);
    return () => clearTimeout(timer);
  }, [activeParties, pollSource, days, gammaRejetED, gammaRejetEG]);

  /* PDF download via print */
  const handleDownloadPDF = () => {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        nav, footer, button, a[href] { display: none !important; }
        body { background: white !important; }
        .no-print { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 500);
  };

  if (activeParties.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm font-medium text-gray-600">
          Aucun candidat s&eacute;lectionn&eacute;.
        </p>
        <BackLink href="/simulation" label="Retour &agrave; la simulation" />
      </div>
    );
  }

  if (error) {
    return (
      <div role="alert" className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-sm font-medium text-red-600">
          Erreur lors de la simulation : {error}
        </p>
        <BackLink href="/simulation" label="Retour &agrave; la simulation" />
      </div>
    );
  }

  if (computing || !simData) {
    return (
      <div role="status" aria-label="Simulation en cours" className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-dark" aria-hidden="true" />
        <p className="text-sm font-medium text-gray-600">
          Simulation Monte Carlo en cours&hellip;
        </p>
        <p className="text-xs text-gray-500">{SIM_COUNT} simulations &times; {days} jours</p>
      </div>
    );
  }

  const { trajectory, probabilities, duels, secondRound } = simData;

  /* Sorted for charts */
  const sortedByQualif = [...probabilities].sort(
    (a, b) => b.pQualif - a.pQualif,
  );
  const sortedByVictoire = [...probabilities].sort(
    (a, b) => b.pVictoire - a.pVictoire,
  );

  const topDuels = duels.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ---- Header ---- */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <BackLink href="/simulation" label="Nouvelle simulation" className="no-print" />

        <button
          type="button"
          onClick={handleDownloadPDF}
          className="no-print inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          T&eacute;l&eacute;charger PDF
        </button>
      </div>

      {/* Badge */}
      <div className="mb-4 text-center">
        <span className="inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-semibold text-green-700">
          &#10003; SIMULATION TERMIN&Eacute;E
        </span>
      </div>

      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-primary-dark sm:text-4xl">
          R&eacute;sultats de la simulation
        </h1>
        <p className="text-gray-600">
          {simData.probabilities.length} candidats &middot; {SIM_COUNT} simulations Monte
          Carlo &middot; {days} jours &middot; IC 80%
        </p>
        <GuideButton onClick={() => setShowTutoResults(true)} label="Guide des résultats" className="no-print mx-auto mt-3" />
      </div>

      {/* ---- Section 1: Trajectory chart ---- */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-bold text-primary-dark" data-tuto="res-trajectoires">
          Trajectoires de sondages
        </h2>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Chart */}
          <ScrollableContainer className="rounded-xl border border-gray-200 bg-white p-4" role="img" aria-label="Graphique des trajectoires de sondages pour chaque candidat avec intervalles de confiance à 80%">
            <div className="min-w-[600px]">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={trajectory} margin={{ right: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="jour"
                  tickFormatter={(v: number) => `J${v}`}
                  tick={{ fontSize: 11, fill: "#999" }}
                />
                <YAxis
                  tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                  tick={{ fontSize: 11, fill: "#999" }}
                  domain={[0, "auto"]}
                />
                <Tooltip
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                  labelFormatter={(label) => `Jour ${label}`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                {activeParties.map((p) => {
                  const color = partyColors[p.tag]?.chart ?? "#999";
                  return (
                    <Area
                      key={`${p.tag}_band`}
                      type="monotone"
                      dataKey={`${p.tag}_hi`}
                      stroke="none"
                      fill={color}
                      fillOpacity={0.1}
                      name={`${p.tag} IC+`}
                      dot={false}
                      activeDot={false}
                      legendType="none"
                      tooltipType="none"
                    />
                  );
                })}
                {activeParties.map((p) => {
                  const color = partyColors[p.tag]?.chart ?? "#999";
                  return (
                    <Area
                      key={`${p.tag}_lo`}
                      type="monotone"
                      dataKey={`${p.tag}_lo`}
                      stroke="none"
                      fill={color}
                      fillOpacity={0.05}
                      name={`${p.tag} IC-`}
                      dot={false}
                      activeDot={false}
                      legendType="none"
                      tooltipType="none"
                    />
                  );
                })}
                {activeParties.map((p) => {
                  const color = partyColors[p.tag]?.chart ?? "#999";
                  const lastIdx = trajectory.length - 1;
                  return (
                    <Line
                      key={p.tag}
                      type="monotone"
                      dataKey={p.tag}
                      stroke={color}
                      strokeWidth={2.5}
                      dot={false}
                      name={getSelected(p).name}
                    >
                      <LabelList
                        dataKey={p.tag}
                        content={({ x, y, value, index }) => {
                          if (index !== lastIdx) return null;
                          return (
                            <text
                              x={Number(x) + 8}
                              y={Number(y)}
                              fill={color}
                              fontSize={11}
                              fontWeight={700}
                              dominantBaseline="central"
                            >
                              {(Number(value) * 100).toFixed(1)}%
                            </text>
                          );
                        }}
                      />
                    </Line>
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
            </div>
          </ScrollableContainer>

          {/* Side panel */}
          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-bold text-primary-dark">
                Lecture du graphique
              </h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Chaque ligne repr&eacute;sente la trajectoire m&eacute;diane du
                candidat sur {SIM_COUNT} simulations. Les zones color&eacute;es
                montrent l&rsquo;intervalle de confiance &agrave; 80%
                (quantiles 10%-90%).
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <h3 className="mb-2 text-sm font-bold text-primary-dark">
                Mod&egrave;le utilis&eacute;
              </h3>
              <p className="text-xs leading-relaxed text-gray-600">
                Processus latent sur logits relatifs avec chocs factoriels
                (embedding id&eacute;ologique W), drift cibl&eacute; par
                candidat et transformation de vote utile activ&eacute;e en fin
                de campagne.
              </p>
              <Link
                href="/methodologie"
                className="no-print mt-2 inline-flex items-center gap-1 text-xs font-semibold text-accent transition-colors hover:text-accent/80"
              >
                Voir la m&eacute;thodologie compl&egrave;te &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Section 2: Probability charts ---- */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-bold text-primary-dark">
          Probabilit&eacute;s
        </h2>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* P(qualification) */}
          <ScrollableContainer className="rounded-xl border border-gray-200 bg-white p-5" data-tuto="res-qualif" role="img" aria-label="Probabilité de qualification au second tour par candidat">
            <h3 className="mb-1 text-sm font-bold text-primary-dark">
              Probabilit&eacute; d&rsquo;acc&eacute;der au second tour
            </h3>
            <p className="mb-4 text-xs text-gray-500">
              P(qualification au 2nd tour)
            </p>
            <div className="min-w-[400px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={sortedByQualif}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: "#999" }}
                />
                <YAxis
                  type="category"
                  dataKey="initials"
                  width={40}
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#475465" }}
                />
                <Tooltip
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="pQualif" radius={[0, 6, 6, 0]} barSize={24}>
                  {sortedByQualif.map((entry) => (
                    <Cell
                      key={entry.tag}
                      fill={partyColors[entry.tag]?.chart ?? "#999"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </div>
          </ScrollableContainer>

          {/* P(victoire) */}
          <ScrollableContainer className="rounded-xl border border-gray-200 bg-white p-5" data-tuto="res-victoire" role="img" aria-label="Probabilité de victoire finale par candidat">
            <h3 className="mb-1 text-sm font-bold text-primary-dark">
              Probabilit&eacute; de remporter l&rsquo;&eacute;lection
            </h3>
            <p className="mb-4 text-xs text-gray-500">
              P(victoire finale)
            </p>
            <div className="min-w-[400px]">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={sortedByVictoire}
                layout="vertical"
                margin={{ left: 10, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f0f0f0"
                />
                <XAxis
                  type="number"
                  tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                  domain={[0, 1]}
                  tick={{ fontSize: 11, fill: "#999" }}
                />
                <YAxis
                  type="category"
                  dataKey="initials"
                  width={40}
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#475465" }}
                />
                <Tooltip
                  formatter={(value) => `${(Number(value) * 100).toFixed(1)}%`}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="pVictoire" radius={[0, 6, 6, 0]} barSize={24}>
                  {sortedByVictoire.map((entry) => (
                    <Cell
                      key={entry.tag}
                      fill={partyColors[entry.tag]?.chart ?? "#999"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </div>
          </ScrollableContainer>
        </div>

        <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-600">
          <strong className="text-gray-600">Note :</strong>{" "}
          P(qualification) est la fr&eacute;quence empirique d&rsquo;acc&egrave;s
          au top 2 sur {simData.probabilities.length > 0 ? SIM_COUNT : "0"}{" "}
          simulations. P(victoire) est la fr&eacute;quence empirique du vainqueur
          au second tour, int&eacute;grant reports de voix, abstention
          diff&eacute;rentielle et vote barrage.
        </div>
      </section>

      {/* ---- Section 3: Duels les plus probables ---- */}
      {topDuels.length > 0 && (
        <section className="mb-16">
          <h2 className="mb-6 text-xl font-bold text-primary-dark" data-tuto="res-duels">
            Duels les plus probables au second tour
          </h2>

          <ScrollableContainer className="rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[600px] text-sm">
              <caption className="sr-only">Les 5 duels les plus probables au second tour</caption>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">
                    Duel
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">
                    Probabilit&eacute;
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">
                    P(victoire)
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-600">
                    Score moyen (exprim&eacute;s)
                  </th>
                </tr>
              </thead>
              <tbody>
                {topDuels.map((d, i) => (
                  <tr
                    key={`${d.tagA}-${d.tagB}`}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              partyColors[d.tagA]?.chart ?? "#999",
                          }}
                        />
                        <span className="font-medium text-gray-700">
                          {d.nameA}
                        </span>
                        <span className="text-xs text-gray-500">vs</span>
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              partyColors[d.tagB]?.chart ?? "#999",
                          }}
                        />
                        <span className="font-medium text-gray-700">
                          {d.nameB}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-block rounded-full bg-primary-dark/10 px-2.5 py-0.5 text-xs font-bold text-primary-dark">
                        {(d.probability * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-600">
                      {(d.pWinA * 100).toFixed(1)}% &ndash;{" "}
                      {(d.pWinB * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-600">
                      {(d.avgShareA * 100).toFixed(1)}% &ndash;{" "}
                      {(d.avgShareB * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableContainer>
        </section>
      )}


      {/* ---- Avertissement ---- */}
      <section className="mb-16">
        <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <span className="mt-0.5 text-lg leading-none" aria-hidden="true">&#9888;</span>
          <div>
            <h3 className="mb-1 text-sm font-bold text-amber-800">Attention</h3>
            <p className="text-xs leading-relaxed text-amber-700">
              Ce mod&egrave;le ne peut pas pr&eacute;dire tous les
              &eacute;v&eacute;nements (scandales, crises, ralliements
              impr&eacute;vus&hellip;). Il repose sur des hypoth&egrave;ses
              simplificatrices et ne constitue pas une pr&eacute;vision
              &eacute;lectorale. C&rsquo;est avant tout un outil
              d&rsquo;analyse et de strat&eacute;gie politique.
            </p>
          </div>
        </div>
      </section>

      {showTutoResults && (
        <TutorialOverlay
          steps={RESULTS_TUTORIAL_STEPS}
          storageKey="tutoResultsSeen"
          onClose={() => setShowTutoResults(false)}
        />
      )}

    </div>
  );
}
