import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-[#FF7B73] shadow-lg shadow-accent/40">
          <span className="text-xl">🗳️</span>
        </div>
        <span className="text-lg font-extrabold tracking-tight text-primary-dark">
          quiprésident<span className="text-accent">.fr</span>
        </span>
      </Link>
      <Navigation />
    </nav>
  );
}
