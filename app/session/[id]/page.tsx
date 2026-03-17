import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { Chip } from "@/components/chip";
import { SectionCard } from "@/components/section-card";
import { getAIConversationService } from "@/lib/ai/provider";
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
  const ai = getAIConversationService();
  const attemptResult = await ai.evaluateAttempt({
    scenarioId: id,
    learnerReply: `Si, ${scenario.targetChunks[0]}.`,
    targetChunk: scenario.targetChunks[0]
  });

  return (
    <AppShell activePath="/">
      <div className="space-y-4">
        <SectionCard title={scenario.intent} eyebrow={`${scenario.domain} • ${scenario.estimatedMinutes} min`} accent="coral">
          <p className="text-sm leading-6 text-plum/80">{scenario.quickStartPrompt}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {scenario.targetChunks.map((chunk) => (
              <Chip key={chunk}>{chunk}</Chip>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Listen, answer, retry" eyebrow="Daily mission flow" accent="gold">
          <div className="rounded-[22px] bg-white/85 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-plum/55">Audio prompt</p>
            <p className="mt-2 text-base font-medium">{prompt?.audioTranscript}</p>
          </div>
          <div className="mt-3 rounded-[22px] bg-white/85 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-plum/55">Mock AI feedback</p>
            <p className="mt-2 text-sm leading-6 text-plum/80">{attemptResult.primaryFeedback}</p>
            <p className="mt-2 text-sm font-medium text-ink">{attemptResult.retryPrompt}</p>
          </div>
          <div className="mt-4 grid gap-3">
            <button className="rounded-pill bg-ink px-5 py-4 text-sm font-semibold text-white">
              Hold to answer
            </button>
            <button className="rounded-pill border border-ink/10 bg-white px-5 py-4 text-sm font-semibold text-ink">
              Play faster audio
            </button>
          </div>
        </SectionCard>

        <SectionCard title="Carry it into real life" eyebrow="Mission + arcade bridge" accent="teal">
          <p className="text-sm leading-6 text-plum/80">{scenario.mission}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {mission?.relatedArcadeGameIds?.map((gameId) => (
              <Chip key={gameId}>{gameId}</Chip>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/arcade"
              className="inline-flex rounded-pill bg-white px-5 py-3 text-sm font-semibold text-ink shadow-sm"
            >
              Practice this in Arcade
            </Link>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
