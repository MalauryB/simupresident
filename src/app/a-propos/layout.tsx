import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Qui sommes-nous ? Découvrez l'équipe et la mission derrière le simulateur présidentielle 2027.",
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return children;
}
