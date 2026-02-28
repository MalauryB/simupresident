import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-dark font-mono text-base font-extrabold leading-none text-white" aria-hidden="true">
          Q<span className="text-accent">?</span>
        </span>
        <span className="text-lg font-extrabold tracking-tight text-primary-dark">
          Qui sera <span className="text-accent">président</span>
        </span>
      </Link>
      <Navigation />
    </header>
  );
}
