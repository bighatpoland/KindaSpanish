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

        <SectionCard
          title={scenario.intent}
          eyebrow={`${scenario.domain} • ${scenario.estimatedMinutes} min`}
          accent="coral"
        >
          <p className="text-sm leading-6 text-plum/80">{scenario.quickStartPrompt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {scenario.targetChunks.map((chunk) => (
              <Chip key={chunk}>{chunk}</Chip>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Encounter board" eyebrow="Audio-first mission" accent="gold">
          <SessionPracticeClient scenario={scenario} prompt={prompt} />
        </SectionCard>

        <SectionCard title="Carry it into real life" eyebrow="Mission + arcade bridge" accent="teal">
          <p className="text-sm leading-6 text-plum/80">{scenario.mission}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {mission?.relatedArcadeGameIds?.map((gameId) => (
              <Chip key={gameId}>{gameId}</Chip>
            ))}
          </div>
          <div className="mt-4">
            <SoundLink
              href="/arcade"
              sound="arcadeUnlock"
              className="inline-flex rounded-panel border border-bark/15 bg-[#efe1c1]/90 px-5 py-3 text-sm font-semibold text-bark shadow-sm"
            >
              Practice this in Arcade
            </SoundLink>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
