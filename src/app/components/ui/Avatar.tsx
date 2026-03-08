import Image from "next/image";
import type { PartyColors, CandidatVariant } from "@/types/simulation";

interface AvatarProps {
  candidate: CandidatVariant;
  colors: PartyColors;
  size?: number;
  grayscale?: boolean;
}

export function Avatar({ candidate, colors, size = 14, grayscale = false }: AvatarProps) {
  const px = size * 4;

  return (
    <div className="relative flex-shrink-0" style={{ width: px, height: px }}>
      <div
        className="rounded-full"
        style={{
          width: px,
          height: px,
          backgroundColor: colors.bg,
          filter: grayscale ? "grayscale(0.8)" : "none",
        }}
      />
      {candidate.photoUrl && (
        <Image
          src={candidate.photoUrl}
          alt={candidate.name}
          fill
          sizes={`${px * 2}px`}
          className="rounded-full object-cover"
          style={{
            filter: grayscale ? "grayscale(0.8)" : "none",
          }}
          aria-hidden="true"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
    </div>
  );
}
