import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simulation",
  description:
    "Paramétrez les candidats, ajustez les dynamiques et lancez votre simulation de l'élection présidentielle 2027.",
};

export default function SimulationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
