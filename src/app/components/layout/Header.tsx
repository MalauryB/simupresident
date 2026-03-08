import Image from "next/image";
import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="flex items-center gap-2.5">
        <Image src="/logo_rouge.png" alt="" width={36} height={36} className="object-contain" aria-hidden="true" />
        <span className="text-lg font-extrabold tracking-tight text-primary-dark">
          Qui pour <span className="text-accent">l&rsquo;&Eacute;lys&eacute;e</span>&nbsp;?
        </span>
      </Link>
      <Navigation />
    </header>
  );
}
