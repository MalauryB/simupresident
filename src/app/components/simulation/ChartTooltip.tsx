interface PayloadEntry {
  color?: string;
  name?: string;
  value?: number;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string | number;
  suffix?: string;
}

export function ChartTooltip({
  active,
  payload,
  label,
  suffix = "%",
}: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 shadow-lg">
      {/* Header */}
      <p className="mb-1.5 text-xs font-semibold text-gray-500">
        Jour {label}
      </p>

      {/* Data points */}
      <div className="flex flex-col gap-1">
        {payload.map((entry, idx) => {
          if (entry.value == null) return null;
          const formatted =
            suffix === "%"
              ? `${(entry.value * 100).toFixed(1)}%`
              : `${entry.value}${suffix}`;

          return (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs"
            >
              {/* Colored dot */}
              <span
                className="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: entry.color ?? "#556C96" }}
              />

              {/* Name */}
              <span className="font-medium text-gray-700">
                {entry.name}
              </span>

              {/* Value */}
              <span className="ml-auto font-mono font-semibold text-gray-900">
                {formatted}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
