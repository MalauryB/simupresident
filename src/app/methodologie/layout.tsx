import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Méthodologie",
  description:
    "Découvrez le modèle statistique derrière le simulateur : Monte-Carlo, drift, vote utile et hypothèses de participation.",
};

export default function MethodologieLayout({ children }: { children: React.ReactNode }) {
  return children;
}
