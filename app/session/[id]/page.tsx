import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { SectionCard } from "@/components/section-card";
import { SessionReadyCue } from "@/components/session-ready-cue";
import { SessionLifecycleGuard } from "@/components/session-lifecycle-guard";
import { SoundLink } from "@/components/sound-link";
import { SessionPracticeClient } from "@/components/session-practice-client";
import { getScenarioById, missionLinks, turnPrompts } from "@/features/scenarios/data";

export default async function SessionPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const scenario = getScenarioById(id);

  if (!scenario) {
    notFound();
  }

  const prompt = turnPrompts[id]?.[0];
  const mission = missionLinks.find((item) => item.sourceScenarioId === id);

  return (
    <AppShell activePath="/">
      <div className="space-y-4">
        <SessionReadyCue scenarioId={scenario.id} intent={scenario.intent} />
        <SessionLifecycleGuard scenarioId={scenario.id} intent={scenario.intent} />

        <SectionCard title="Daily encounter" eyebrow={`${scenario.domain} • ${scenario.estimatedMinutes} min`} accent="coral">
          <div className="courtyard-tile rounded-panel border border-cypress/18 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Target</p>
                <h3 className="mt-1 text-2xl font-semibold text-bark">{scenario.intent}</h3>
                <p className="mt-3 max-w-[26rem] text-sm leading-6 text-plum/80">
                  {scenario.quickStartPrompt}
                </p>
              </div>
              <div className="rounded-panel border border-cypress/18 bg-[linear-gradient(180deg,rgba(95,124,104,0.96)_0%,rgba(61,86,72,0.98)_100%)] px-3 py-2 text-right text-mist shadow-panel">
                <p className="text-[10px] uppercase tracking-[0.18em] text-mist/75">Time</p>
                <p className="text-sm font-semibold">{scenario.estimatedMinutes} min</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {scenario.targetChunks.map((chunk) => (
                <Chip key={chunk}>{chunk}</Chip>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Encounter board" eyebrow="Audio-first mission" accent="gold">
          <SessionPracticeClient scenario={scenario} prompt={prompt} />
        </SectionCard>

        <SectionCard title="Carry it into real life" eyebrow="Mission + arcade bridge" accent="teal">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm leading-6 text-plum/80">{scenario.mission}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mission?.relatedArcadeGameIds?.map((gameId) => (
                  <Chip key={gameId}>{gameId}</Chip>
                ))}
              </div>
            </div>
            <div className="rounded-panel border border-cypress/18 bg-[linear-gradient(180deg,rgba(69,105,90,0.14)_0%,rgba(122,132,96,0.1)_100%)] p-4 text-center">
              <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Next place</p>
              <p className="mt-2 text-lg font-semibold text-bark">Arcade practice</p>
              <div className="mt-4">
                <SoundLink
                  href="/arcade"
                  sound="arcadeUnlock"
                  className="inline-flex rounded-panel border border-bark/15 bg-[#efe1c1]/90 px-5 py-3 text-sm font-semibold text-bark shadow-sm"
                >
                  Practice this in Arcade
                </SoundLink>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
