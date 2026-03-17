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
  const flowSteps = [
    { label: "Listen", value: "1", body: "Catch the real-life meaning first." },
    { label: "Speak", value: "2", body: "Answer with one phrase that works." },
    { label: "Retry", value: "3", body: "Sharpen it after feedback." }
  ];

  return (
    <AppShell activePath="/">
      <div className="space-y-4">
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
          <div className="grid grid-cols-3 gap-2">
            {flowSteps.map((step) => (
              <div
                key={step.label}
                className="ornament-frame rounded-plaque border border-bark/10 bg-[#f7ecd6]/90 p-3 text-center"
              >
                <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full medallion text-sm font-semibold text-bark">
                  {step.value}
                </div>
                <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-bark/65">
                  {step.label}
                </p>
                <p className="mt-1 text-xs leading-5 text-plum/75">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 audio-prompt-panel ornament-frame rounded-panel border border-bark/20 p-5 text-mist">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-sand/75">Now listening</p>
                <h3 className="mt-2 text-2xl font-semibold leading-tight text-mist">
                  Hear the moment before you answer
                </h3>
              </div>
              <div className="medallion flex h-12 w-12 items-center justify-center rounded-full text-lg text-bark shadow-medal">
                ◉
              </div>
            </div>

            <div className="mt-5 rounded-plaque border border-sand/10 bg-black/10 p-4">
              <p className="text-[11px] uppercase tracking-[0.18em] text-sand/75">Prompt</p>
              <p className="mt-2 text-xl font-medium leading-8 text-mist">{prompt?.audioTranscript}</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
              <button className="listen-button rounded-panel border border-sand/15 px-5 py-4 text-left shadow-sm">
                <span className="block text-[11px] uppercase tracking-[0.18em] text-bark/60">
                  Audio cue
                </span>
                <span className="mt-1 block text-base font-semibold text-bark">Play prompt</span>
                <span className="mt-1 block text-sm text-plum/75">Neutral pace, then faster-native</span>
              </button>
              <button className="rounded-panel border border-sand/15 bg-black/10 px-5 py-4 text-left text-sm font-semibold text-sand">
                Play faster audio
              </button>
            </div>
          </div>

          <div className="session-divider my-5" />

          <div className="rounded-panel border border-bark/12 bg-[#f4e7cb]/94 p-5 shadow-sm">
            <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Your turn</p>
            <div className="mt-4 flex flex-col items-center text-center">
              <button className="speak-button flex h-40 w-40 items-center justify-center rounded-full text-center text-bark shadow-medal">
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.2em]">Hold to</span>
                  <span className="mt-2 block text-2xl font-semibold">Speak</span>
                </span>
              </button>
              <p className="mt-7 text-base font-semibold text-bark">Say something that works.</p>
              <p className="mt-2 max-w-[18rem] text-sm leading-6 text-plum/75">
                One useful chunk is enough. You are aiming for clear, not flawless.
              </p>
            </div>
          </div>

          <div className="mt-4 ornament-frame rounded-plaque border border-bark/12 bg-[#f7ecd6]/95 p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Scout feedback</p>
            <p className="mt-2 text-sm leading-6 text-plum/80">{attemptResult.primaryFeedback}</p>
            <div className="mt-3 rounded-plaque border border-bark/10 bg-[#efe1c1]/90 p-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Retry cue</p>
              <p className="mt-1 text-sm font-medium leading-6 text-bark">{attemptResult.retryPrompt}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip>{attemptResult.carryAwayChunk}</Chip>
              <Chip>{attemptResult.functionHit ? "Clear enough" : "Needs one stronger chunk"}</Chip>
            </div>
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
              className="inline-flex rounded-panel border border-bark/15 bg-[#efe1c1]/90 px-5 py-3 text-sm font-semibold text-bark shadow-sm"
            >
              Practice this in Arcade
            </Link>
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}
