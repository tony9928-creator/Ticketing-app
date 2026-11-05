import { APP_NAME } from "@/lib/config";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 font-display font-semibold text-ink">
          <Logo className="h-5 w-5" /> {APP_NAME}
        </span>
        <span>Proyecto final · Bootcamp DevLights</span>
      </div>
    </footer>
  );
}
