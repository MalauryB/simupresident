import type { PartyData } from "@/types/simulation";
import { PARTY_COLORS } from "@/lib/constants";
import { getSelected, getTrendColor } from "@/lib/simulation";
import { TrendSparkline } from "../ui/TrendSparkline";

interface ReviewTableProps {
  activeParties: PartyData[];
  source: string;
}

export function ReviewTable({ activeParties, source }: ReviewTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50/80">
            <th className="px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
              Candidat
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              D&eacute;part
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Attractivit&eacute;
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Barrage
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Tendance
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              Trend
            </th>
            <th className="px-3 py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
              G / C / D
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {activeParties.map((party) => {
            const colors = PARTY_COLORS[party.tag] ?? {
              bg: "#556C96",
              fg: "#FFFFFF",
              accent: "#556C96",
              chart: "#556C96",
            };
            const selected = getSelected(party);

            const startValue =
              source === "agrege"
                ? selected.startAgrege
                : source === "debiaise"
                  ? selected.startDebiaise
                  : selected.startCustom;

            const trendColor = getTrendColor(selected.tendance);
            const pctG = (selected.left * 100).toFixed(0);
            const pctC = (selected.center * 100).toFixed(0);
            const pctD = (selected.right * 100).toFixed(0);

            return (
              <tr
                key={party.tag}
                className="transition-colors hover:bg-gray-50/50"
              >
                {/* Avatar + name */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
                      style={{
                        background: `linear-gradient(135deg, ${colors.bg}, ${colors.accent})`,
                        color: colors.fg,
                      }}
                    >
                      {selected.initials}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {selected.name}
                      </span>
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: colors.accent }}
                      >
                        {party.tag}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Starting % */}
                <td className="px-3 py-2.5 text-center">
                  <span
                    className="font-mono text-sm font-bold"
                    style={{ color: colors.accent }}
                  >
                    {startValue}%
                  </span>
                </td>

                {/* Attractivite */}
                <td className="px-3 py-2.5 text-center">
                  <span className="font-mono text-sm text-gray-700">
                    {selected.attractivite.toFixed(2)}
                  </span>
                </td>

                {/* Barrage */}
                <td className="px-3 py-2.5 text-center">
                  <span className="font-mono text-sm text-gray-700">
                    {selected.barrage.toFixed(2)}
                  </span>
                </td>

                {/* Tendance value */}
                <td className="px-3 py-2.5 text-center">
                  <span
                    className="font-mono text-sm font-semibold"
                    style={{ color: trendColor }}
                  >
                    {selected.tendance.toFixed(2)}
                  </span>
                </td>

                {/* Trend sparkline */}
                <td className="px-3 py-2.5">
                  <div className="flex justify-center">
                    <TrendSparkline
                      value={selected.tendance}
                      width={48}
                      height={16}
                    />
                  </div>
                </td>

                {/* Ideology breakdown */}
                <td className="px-3 py-2.5">
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className="rounded px-1 py-0.5 text-[10px] font-bold"
                      style={{
                        color: "#E63946",
                        backgroundColor: "#E6394612",
                      }}
                    >
                      {pctG}
                    </span>
                    <span className="text-[10px] text-gray-300">/</span>
                    <span
                      className="rounded px-1 py-0.5 text-[10px] font-bold"
                      style={{
                        color: "#FFB800",
                        backgroundColor: "#FFB80012",
                      }}
                    >
                      {pctC}
                    </span>
                    <span className="text-[10px] text-gray-300">/</span>
                    <span
                      className="rounded px-1 py-0.5 text-[10px] font-bold"
                      style={{
                        color: "#0066CC",
                        backgroundColor: "#0066CC12",
                      }}
                    >
                      {pctD}
                    </span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
