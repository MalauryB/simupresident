import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question ou une suggestion ? Contactez l'équipe derrière le simulateur présidentielle 2027.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
