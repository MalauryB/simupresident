"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSimulation } from "@/lib/simulation-context";
import { PARTY_COLORS } from "@/lib/constants";
import { generateSimData, getSelected } from "@/lib/simulation";
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
} from "recharts";

/* ------------------------------------------------------------------ */
/*  Results page                                                       */
/* ------------------------------------------------------------------ */
export default function ResultatsPage() {
  const { activeParties, pollSource } = useSimulation();

  const simData = useMemo(
    () => generateSimData(activeParties, pollSource),
    [activeParties, pollSource],
  );

  const { trajectory, probabilities } = simData;

  /* Sorted for charts */
  const sortedByQualif = [...probabilities].sort(
    (a, b) => b.pQualif - a.pQualif,
  );
  const sortedByVictoire = [...probabilities].sort(
    (a, b) => b.pVictoire - a.pVictoire,
  );

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

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ---- Header ---- */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/simulation"
          className="no-print inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary-dark"
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
          Nouvelle simulation
        </Link>

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
        <p className="text-gray-500">
          10 000 simulations Monte Carlo &middot; IC 75%
        </p>
      </div>

      {/* ---- Section 1: Trajectory chart ---- */}
      <section className="mb-16">
        <h2 className="mb-6 text-xl font-bold text-primary-dark">
          Trajectoires de sondages
        </h2>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Chart */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={trajectory}>
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
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                {activeParties.map((p) => {
                  const color = PARTY_COLORS[p.tag]?.chart ?? "#999";
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
                    />
                  );
                })}
                {activeParties.map((p) => {
                  const color = PARTY_COLORS[p.tag]?.chart ?? "#999";
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
                    />
                  );
                })}
                {activeParties.map((p) => {
                  const color = PARTY_COLORS[p.tag]?.chart ?? "#999";
                  return (
                    <Line
                      key={p.tag}
                      type="monotone"
                      dataKey={p.tag}
                      stroke={color}
                      strokeWidth={2.5}
                      dot={false}
                      name={getSelected(p).name}
                    />
                  );
                })}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-bold text-primary-dark">
                Lecture du graphique
              </h3>
              <p className="text-xs leading-relaxed text-gray-500">
                Chaque ligne repr&eacute;sente la trajectoire moyenne du
                candidat. Les zones color&eacute;es semi-transparentes
                montrent l&rsquo;intervalle de confiance &agrave; 75%, c&rsquo;est-&agrave;-dire
                la zone dans laquelle le candidat &eacute;volue dans
                75% des simulations.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-sm font-bold text-primary-dark">
                Mod&egrave;le utilis&eacute;
              </h3>
              <p className="text-xs leading-relaxed text-gray-500">
                Les trajectoires sont g&eacute;n&eacute;r&eacute;es par un
                mod&egrave;le de marche al&eacute;atoire avec d&eacute;rive
                (tendance) et volatilit&eacute; d&eacute;croissante. Le bruit
                est calibr&eacute; sur les variations historiques des
                sondages pr&eacute;sidentiels fran&ccedil;ais.
              </p>
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
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-sm font-bold text-primary-dark">
              P(qualification au 2nd tour)
            </h3>
            <p className="mb-4 text-xs text-gray-400">
              Probabilit&eacute; d&rsquo;acc&eacute;der au second tour
            </p>
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
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="pQualif" radius={[0, 6, 6, 0]} barSize={24}>
                  {sortedByQualif.map((entry) => (
                    <Cell
                      key={entry.tag}
                      fill={PARTY_COLORS[entry.tag]?.chart ?? "#999"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* P(victoire) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-sm font-bold text-primary-dark">
              P(victoire finale)
            </h3>
            <p className="mb-4 text-xs text-gray-400">
              Probabilit&eacute; de remporter l&rsquo;&eacute;lection
            </p>
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
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="pVictoire" radius={[0, 6, 6, 0]} barSize={24}>
                  {sortedByVictoire.map((entry) => (
                    <Cell
                      key={entry.tag}
                      fill={PARTY_COLORS[entry.tag]?.chart ?? "#999"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-4 rounded-xl bg-gray-50 px-4 py-3 text-xs leading-relaxed text-gray-500">
          <strong className="text-gray-600">Note :</strong>{" "}
          P(qualification) est la probabilit&eacute; qu&rsquo;un candidat
          termine dans les deux premiers au premier tour. P(victoire) combine
          la qualification avec un mod&egrave;le de second tour int&eacute;grant
          le coefficient &laquo; barrage &raquo; de chaque candidat.
        </div>
      </section>

      {/* ---- Section 3: Methodology note ---- */}
      <section className="mb-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="mb-3 text-sm font-bold text-primary-dark">
            Note m&eacute;thodologique
          </h3>
          <p className="mb-2 text-xs leading-relaxed text-gray-500">
            Les r&eacute;sultats sont produits par 10 000 it&eacute;rations
            d&rsquo;une simulation de Monte Carlo. Chaque it&eacute;ration
            g&eacute;n&egrave;re une trajectoire quotidienne en appliquant un
            bruit gaussien calibr&eacute; et une d&eacute;rive fond&eacute;e sur
            le param&egrave;tre de tendance. L&rsquo;intervalle de confiance
            affich&eacute; est de 75%.
          </p>
          <p className="text-xs leading-relaxed text-gray-500">
            Cette simulation est un exercice p&eacute;dagogique et ne constitue
            pas une pr&eacute;vision &eacute;lectorale.
          </p>
          <Link
            href="/methodologie"
            className="no-print mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent transition-colors hover:text-accent/80"
          >
            Voir la m&eacute;thodologie compl&egrave;te &rarr;
          </Link>
        </div>
      </section>

      {/* ---- Legend ---- */}
      <section className="mb-8">
        <h3 className="mb-3 text-sm font-bold text-primary-dark">
          L&eacute;gende
        </h3>
        <div className="flex flex-wrap gap-4">
          {activeParties.map((p) => {
            const c = getSelected(p);
            const color = PARTY_COLORS[p.tag]?.chart ?? "#999";
            return (
              <div key={p.tag} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="text-xs font-medium text-gray-600">
                  {c.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
