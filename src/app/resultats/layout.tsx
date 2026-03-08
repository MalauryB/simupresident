import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Résultats",
  description:
    "Visualisez les résultats de votre simulation : trajectoires de sondages, scores au premier tour et probabilités de qualification.",
};

export default function ResultatsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
