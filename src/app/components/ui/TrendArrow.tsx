import { getTrendColor } from "@/lib/simulation";

interface TrendArrowProps {
  value: number;
  size?: number;
}

export function TrendArrow({ value, size = 18 }: TrendArrowProps) {
  const color = getTrendColor(value);
  const rotation = (1 - value) * 180 - 90;
  const circleSize = size + 8;

  return (
    <div
      className="inline-flex items-center justify-center rounded-full"
      style={{
        width: circleSize,
        height: circleSize,
        backgroundColor: `${color}18`,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        <path
          d="M12 4l7 7h-4.5v9h-5v-9H5l7-7z"
          fill={color}
        />
      </svg>
    </div>
  );
}
