interface FloatingShapeProps {
  top: string;
  left: string;
  size: string;
  color: string;
  delay: number;
  shape: "circle" | "square" | "blob";
}

const borderRadiusMap: Record<FloatingShapeProps["shape"], string> = {
  circle: "50%",
  square: "12%",
  blob: "30% 70% 70% 30% / 30% 30% 70% 70%",
};

export function FloatingShape({
  top,
  left,
  size,
  color,
  delay,
  shape,
}: FloatingShapeProps) {
  return (
    <div
      className="pointer-events-none absolute animate-[float_6s_ease-in-out_infinite]"
      style={{
        top,
        left,
        width: size,
        height: size,
        backgroundColor: color,
        opacity: 0.07,
        borderRadius: borderRadiusMap[shape],
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    />
  );
}
