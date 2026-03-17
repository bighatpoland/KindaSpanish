import { ReactNode } from "react";
import { ArtifactNav } from "@/components/artifact-nav";
import { MobileRuntimeBanner } from "@/components/mobile-runtime-banner";
import { SoundToggle } from "@/components/sound-toggle";

export function AppShell({
  children,
  activePath
}: {
  children: ReactNode;
  activePath: string;
}) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-map px-4 pb-28 pt-5 text-ink">
      <header className="mb-6 rounded-panel border border-bark/15 bg-parchment p-4 shadow-panel ornament-frame">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-bark/60">Kinda Spanish</p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-bark">
              Learn the imperfect way.
            </h1>
            <p className="mt-2 text-sm leading-6 text-plum/80">
              A little village for surviving real-life Spanish.
            </p>
          </div>
          <SoundToggle />
        </div>
      </header>

      <main className="flex-1">
        <MobileRuntimeBanner />
        {children}
      </main>

      <ArtifactNav activePath={activePath} />
    </div>
  );
}
