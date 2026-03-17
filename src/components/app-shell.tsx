import Link from "next/link";
import { ReactNode } from "react";

const tabs = [
  { href: "/", label: "Home" },
  { href: "/arcade", label: "Arcade" },
  { href: "/review", label: "Review" }
];

export function AppShell({
  children,
  activePath
}: {
  children: ReactNode;
  activePath: string;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-hero px-4 pb-28 pt-5 text-ink">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-plum/60">Kinda Spanish</p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight">
            Learn the imperfect way.
          </h1>
        </div>
        <div className="rounded-panel bg-white/80 px-3 py-2 text-right shadow-card backdrop-blur">
          <p className="text-xs uppercase tracking-[0.2em] text-plum/50">Mode</p>
          <p className="text-sm font-semibold text-plum">Phone-first</p>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <nav className="fixed bottom-4 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-panel border border-white/80 bg-white/90 px-3 py-3 shadow-card backdrop-blur">
        {tabs.map((tab) => {
          const active = activePath === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`rounded-pill px-4 py-2 text-sm font-medium transition ${
                active ? "bg-ink text-white" : "text-plum/70"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

