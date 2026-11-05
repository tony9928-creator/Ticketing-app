import Link from "next/link";
import { Suspense } from "react";
import { APP_NAME } from "@/lib/config";
import { Logo } from "./Logo";
import { UserNav } from "./UserNav";

/**
 * Barra superior. La parte fija (logo, "Eventos") se prerenderiza; la parte que depende
 * de la sesión (UserNav lee cookies) va en <Suspense> para no frenar el resto de la página.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-tight">
          <Logo className="h-7 w-7" />
          {APP_NAME}
        </Link>
        <nav className="ml-2 hidden text-sm font-medium text-muted sm:block">
          <Link href="/" className="rounded-full px-3 py-2 hover:bg-line/60 hover:text-ink">
            Eventos
          </Link>
        </nav>
        <div className="ml-auto">
          <Suspense fallback={<div className="h-9 w-40 animate-pulse rounded-full bg-line/70" />}>
            <UserNav />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
