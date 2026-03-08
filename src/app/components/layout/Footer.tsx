import Link from "next/link";

const NAV_LINKS = [
  { href: "/simulation", label: "Simulation" },
  { href: "/resultats", label: "Résultats" },
  { href: "/methodologie", label: "Méthodologie" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer role="contentinfo" className="mt-12">
      <div className="h-px bg-gray-200" />
      <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-gray-600">
        <nav aria-label="Pied de page" className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-gray-700 transition-colors">
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-center">
          &copy; quiserapresident.fr 2026
        </p>
      </div>
    </footer>
  );
}
