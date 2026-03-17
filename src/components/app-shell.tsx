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
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-board px-4 pb-28 pt-5 text-ink">
      <header className="stone-panel gold-corners mb-6 rounded-panel border border-[#121b27] p-1 shadow-card">
        <div className="timber-panel ornament-frame rounded-[22px] px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex rounded-banner px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-mist banner-ribbon">
                Kinda Spanish
              </div>
              <h1 className="mt-3 text-[2rem] font-semibold leading-none text-mist">
                Learn the imperfect way.
              </h1>
              <p className="mt-3 max-w-[18rem] text-sm leading-6 text-[#eadcbe]/82">
                A little village for surviving real-life Spanish.
              </p>
            </div>
            <SoundToggle />
          </div>
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
