import Link from "next/link";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-primary">
          SimuPresident
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
