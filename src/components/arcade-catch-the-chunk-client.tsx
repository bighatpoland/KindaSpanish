"use client";

import { useMemo, useState } from "react";
import { Chip } from "@/components/chip";
import { RewardBanner } from "@/components/reward-banner";
import { SoundButton } from "@/components/sound-button";
import { SoundLink } from "@/components/sound-link";
import type { ArcadeRunResult } from "@/entities/domain";
import { buildCatchTheChunkRounds, saveArcadeRun } from "@/features/arcade/arcade-service";
import { playLessonAudioClip, type LessonAudioRuntime } from "@/lib/audio/lesson-audio";

export function ArcadeCatchTheChunkClient() {
  const rounds = useMemo(() => buildCatchTheChunkRounds(3), []);
  const [roundIndex, setRoundIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [completedRun, setCompletedRun] = useState<ArcadeRunResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentRound = rounds[roundIndex];

  const playPrompt = () => {
    if (!currentRound) {
      return;
    }

    let runtime: LessonAudioRuntime | null = null;
    runtime = playLessonAudioClip(
      {
        id: currentRound.id,
        variant: "fast",
        transcript: currentRound.prompt,
        playbackRate: 1.08,
        ttsFallback: true
      },
      {
        onStart: () => setIsPlaying(true),
        onEnd: () => {
          setIsPlaying(false);
          runtime?.stop();
        },
        onError: () => setIsPlaying(false),
        onBlocked: () => setIsPlaying(false)
      }
    );
  };

  const selectOption = (option: string) => {
    if (selectedOption || !currentRound) {
      return;
    }

    setSelectedOption(option);

    const nextCorrectCount = option === currentRound.correctChunk ? correctCount + 1 : correctCount;
    const nextRoundIndex = roundIndex + 1;

    if (nextRoundIndex >= rounds.length) {
      const accuracy = nextCorrectCount / rounds.length;
      const run: ArcadeRunResult = {
        gameId: "catch-the-chunk",
        score: nextCorrectCount * 100,
        accuracy,
        speedBonus: 0,
        xpEarned: nextCorrectCount * 12,
        coinsEarned: nextCorrectCount * 4,
        masterySignals: accuracy >= 0.66 ? ["chunk recognition", "listening confidence"] : ["needs more chunk listening"]
      };

      saveArcadeRun(run);
      setCorrectCount(nextCorrectCount);
      setCompletedRun(run);
      return;
    }

    window.setTimeout(() => {
      setCorrectCount(nextCorrectCount);
      setRoundIndex(nextRoundIndex);
      setSelectedOption(null);
    }, 800);
  };

  if (completedRun) {
    return (
      <div className="space-y-4">
        <RewardBanner
          title="Run complete"
          body={`You caught ${correctCount} of ${rounds.length} useful chunks.`}
          icon="✦"
          tone="gold"
        >
          <Chip tone="forest">{completedRun.xpEarned} XP</Chip>
          <Chip>{completedRun.coinsEarned} coins</Chip>
          <Chip>{Math.round(completedRun.accuracy * 100)}% accuracy</Chip>
        </RewardBanner>

        <div className="grid gap-3 sm:grid-cols-2">
          <SoundButton
            sound="rewardClaim"
            className="wood-button rounded-panel px-5 py-4 text-sm font-semibold text-mist"
            onClick={() => {
              setRoundIndex(0);
              setSelectedOption(null);
              setCorrectCount(0);
              setCompletedRun(null);
            }}
          >
            Play again
          </SoundButton>
          <SoundLink
            href="/arcade"
            sound="arcadeUnlock"
            className="inline-flex items-center justify-center rounded-panel border border-cypress/16 bg-[linear-gradient(180deg,rgba(237,232,218,0.98)_0%,rgba(221,215,198,0.96)_100%)] px-5 py-4 text-sm font-semibold text-bark shadow-sm"
          >
            Back to Arcade
          </SoundLink>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <RewardBanner
        title="Hear it and catch the useful chunk"
        body="Listen once, then tap the phrase that matters most."
        icon="◉"
        tone="teal"
      >
        <Chip tone="forest">Round {roundIndex + 1} / {rounds.length}</Chip>
        <Chip>{correctCount} correct</Chip>
      </RewardBanner>

      <div className="audio-prompt-panel ornament-frame rounded-panel border border-bark/20 p-5 text-mist">
        <p className="text-[11px] uppercase tracking-[0.18em] text-sand/75">Fast audio</p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight text-mist">{currentRound.prompt}</h3>
        <div className="mt-4">
          <SoundButton
            sound="missionReady"
            onClick={playPrompt}
            className="listen-button rounded-panel border border-sand/15 px-5 py-4 text-left shadow-sm"
          >
            <span className="block text-[11px] uppercase tracking-[0.18em] text-bark/60">Audio cue</span>
            <span className="mt-1 block text-base font-semibold text-bark">
              {isPlaying ? "Playing..." : "Play line"}
            </span>
          </SoundButton>
        </div>
      </div>

      <div className="grid gap-3">
        {currentRound.options.map((option) => {
          const isSelected = selectedOption === option;
          const isCorrect = selectedOption && option === currentRound.correctChunk;

          return (
            <SoundButton
              key={option}
              sound={isSelected ? (option === currentRound.correctChunk ? "successClear" : "retrySoft") : "successClear"}
              onClick={() => selectOption(option)}
              disabled={Boolean(selectedOption)}
              className={`rounded-panel border px-5 py-4 text-left text-sm font-semibold shadow-sm ${
                isCorrect
                  ? "border-grove/22 bg-[linear-gradient(180deg,rgba(226,236,217,0.98)_0%,rgba(204,223,193,0.96)_100%)] text-bark"
                  : isSelected
                    ? "border-coral-900/16 bg-[linear-gradient(180deg,rgba(245,226,218,0.98)_0%,rgba(230,208,198,0.96)_100%)] text-bark"
                    : "border-cypress/16 bg-[linear-gradient(180deg,rgba(247,238,218,0.98)_0%,rgba(229,218,191,0.96)_100%)] text-bark"
              }`}
            >
              {option}
            </SoundButton>
          );
        })}
      </div>

      {selectedOption ? (
        <RewardBanner
          title={selectedOption === currentRound.correctChunk ? "You caught it" : "Not this one"}
          body={
            selectedOption === currentRound.correctChunk
              ? `"${currentRound.correctChunk}" is the chunk to keep.`
              : `The useful chunk here was "${currentRound.correctChunk}".`
          }
          icon={selectedOption === currentRound.correctChunk ? "✦" : "❖"}
          tone={selectedOption === currentRound.correctChunk ? "gold" : "ember"}
        >
          <Chip tone="forest">{currentRound.correctChunk}</Chip>
        </RewardBanner>
      ) : null}
    </div>
  );
}
