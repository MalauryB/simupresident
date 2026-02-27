import { getTrendColor } from "@/lib/simulation";

interface TrendSparklineProps {
  value: number;
  width?: number;
  height?: number;
}

export function TrendSparkline({
  value,
  width = 64,
  height = 28,
}: TrendSparklineProps) {
  const color = getTrendColor(value);
  const gradientId = `spark-${Math.round(value * 1000)}`;

  // Build a curve that reflects the trend value.
  // value > 0.5 curves upward, value < 0.5 curves downward.
  const startY = height - value * height * 0.2 - height * 0.3;
  const endY = height - value * height * 0.8 - height * 0.05;
  const midX = width / 2;
  const cp1Y = startY + (1 - value) * height * 0.5;
  const cp2Y = endY - value * height * 0.5;

  const curvePath = `M 0 ${startY} C ${midX * 0.5} ${cp1Y}, ${midX * 1.5} ${cp2Y}, ${width} ${endY}`;
  const areaPath = `${curvePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>

      {/* Filled area under the curve */}
      <path d={areaPath} fill={`url(#${gradientId})`} />

      {/* The trend curve */}
      <path
        d={curvePath}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
