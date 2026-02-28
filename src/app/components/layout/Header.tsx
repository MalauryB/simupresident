import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="flex items-center gap-3">
        <img
          src="/icons/icon-192x192.svg"
          alt="Logo"
          className="h-10 w-10 rounded-xl shadow-lg shadow-primary/30"
        />
        <span className="text-lg font-extrabold tracking-tight text-primary-dark">
          Qui sera <span className="text-accent">président</span>
        </span>
      </Link>
      <Navigation />
    </nav>
  );
}
