import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="flex items-center gap-2.5">
        <img src="/logo_rouge.png" alt="" className="h-9 w-9 object-contain" aria-hidden="true" />
        <span className="text-lg font-extrabold tracking-tight text-primary-dark">
          Qui pour <span className="text-accent">l&rsquo;&Eacute;lys&eacute;e</span>&nbsp;?
        </span>
      </Link>
      <Navigation />
    </header>
  );
}
