"use client";

import { useEffect, useMemo, useState } from "react";
import { Chip } from "@/components/chip";
import { RewardBanner } from "@/components/reward-banner";
import { SoundButton } from "@/components/sound-button";
import { useSupabaseAuth } from "@/components/supabase-auth-provider";
import type { ReviewItem, ReviewOutcome, ReviewQueue } from "@/entities/domain";
import {
  loadReviewQueue,
  REVIEW_QUEUE_UPDATED_EVENT,
  saveReviewOutcome
} from "@/features/review/review-service";
import { formatReviewDueLabel } from "@/lib/review/review-scheduler";

function outcomeCopy(outcome: ReviewOutcome) {
  return {
    again: "Again today",
    good: "Good, bring it back soon",
    easy: "Easy, space it further"
  }[outcome];
}

function ReviewActionButtons({
  onSelect
}: {
  onSelect: (outcome: ReviewOutcome) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <SoundButton
        sound="retrySoft"
        volume={0.42}
        onClick={() => onSelect("again")}
        className="rounded-panel border border-coral-900/15 bg-[linear-gradient(180deg,rgba(244,224,212,0.98)_0%,rgba(230,205,194,0.96)_100%)] px-4 py-4 text-sm font-semibold text-bark shadow-sm"
      >
        Again
      </SoundButton>
      <SoundButton
        sound="successClear"
        volume={0.44}
        onClick={() => onSelect("good")}
        className="rounded-panel border border-cypress/16 bg-[linear-gradient(180deg,rgba(233,227,209,0.98)_0%,rgba(219,210,188,0.96)_100%)] px-4 py-4 text-sm font-semibold text-bark shadow-sm"
      >
        Good
      </SoundButton>
      <SoundButton
        sound="rewardClaim"
        volume={0.44}
        onClick={() => onSelect("easy")}
        className="wood-button rounded-panel px-4 py-4 text-sm font-semibold text-mist"
      >
        Easy
      </SoundButton>
    </div>
  );
}

export function ReviewPracticeClient() {
  const { userId, isRemoteReady } = useSupabaseAuth();
  const [queue, setQueue] = useState<ReviewQueue>({
    dueNow: [],
    upcoming: [],
    totalDue: 0
  });
  const [completedCount, setCompletedCount] = useState(0);
  const currentItem = queue.dueNow[0];
  const upcomingPreview = useMemo(() => queue.upcoming.slice(0, 3), [queue.upcoming]);

  useEffect(() => {
    let cancelled = false;

    const hydrateQueue = async () => {
      const nextQueue = await loadReviewQueue({
        userId,
        remoteEnabled: isRemoteReady
      });

      if (!cancelled) {
        setQueue(nextQueue);
      }
    };

    void hydrateQueue();

    const refresh = () => {
      void hydrateQueue();
    };

    window.addEventListener(REVIEW_QUEUE_UPDATED_EVENT, refresh);
    window.addEventListener("focus", refresh);

    return () => {
      cancelled = true;
      window.removeEventListener(REVIEW_QUEUE_UPDATED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [isRemoteReady, userId]);

  const handleOutcome = async (outcome: ReviewOutcome) => {
    if (!currentItem) {
      return;
    }

    const nextQueue = await saveReviewOutcome(currentItem.id, outcome, {
      userId,
      remoteEnabled: isRemoteReady
    });

    setQueue(nextQueue);
    setCompletedCount((count) => count + 1);
  };

  return (
    <div className="space-y-4">
      <RewardBanner
        title={currentItem ? "Start with the phrase that is due now" : "Nothing urgent is due"}
        body={
          currentItem
            ? "One item at a time. Recall it, rate it, and move on."
            : "Your review queue is calm right now. The next useful phrases are already scheduled."
        }
        icon={currentItem ? "◉" : "✦"}
        tone={currentItem ? "teal" : "gold"}
      >
        <Chip tone="forest">{queue.totalDue} due now</Chip>
        <Chip>{completedCount} cleared this visit</Chip>
        <Chip>{queue.upcoming.length} upcoming</Chip>
      </RewardBanner>

      {currentItem ? (
        <div className="ornament-frame rounded-panel border border-cypress/14 bg-[linear-gradient(180deg,rgba(247,238,218,0.98)_0%,rgba(230,220,193,0.96)_100%)] p-5 shadow-card">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Recall prompt</p>
              <h3 className="mt-1 text-2xl font-semibold text-bark">{currentItem.chunk}</h3>
            </div>
            <Chip tone={currentItem.easeState === "solid" ? "forest" : "sand"}>
              {currentItem.easeState}
            </Chip>
          </div>

          <p className="mt-4 text-sm leading-6 text-plum/78">
            Say this out loud, or imagine the whole sentence before you reveal it.
          </p>

          <div className="mt-4 rounded-plaque border border-bark/10 bg-[#fbf3e0] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Useful sentence</p>
            <p className="mt-2 text-base leading-7 text-bark">{currentItem.sentence}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Chip>{currentItem.audioRef}</Chip>
            <Chip>{formatReviewDueLabel(currentItem.dueAt)}</Chip>
            <Chip>{currentItem.repetitions} successful recalls</Chip>
          </div>

          <div className="mt-5">
            <ReviewActionButtons onSelect={handleOutcome} />
          </div>
        </div>
      ) : null}

      {!currentItem && completedCount > 0 ? (
        <RewardBanner
          title="Review queue cleared for now"
          body="You handled everything currently due. The next phrases are already scheduled to come back later."
          icon="✦"
          tone="gold"
        >
          <Chip tone="forest">{completedCount} cleared this visit</Chip>
          <Chip>{queue.upcoming.length} upcoming</Chip>
        </RewardBanner>
      ) : null}

      <div className="grid gap-3">
        {upcomingPreview.map((item: ReviewItem) => (
          <div
            key={item.id}
            className="rounded-plaque border border-cypress/14 bg-[linear-gradient(180deg,rgba(247,238,218,0.98)_0%,rgba(229,218,191,0.96)_100%)] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">
                  {formatReviewDueLabel(item.dueAt)}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-bark">{item.chunk}</h3>
              </div>
              <Chip>{item.easeState}</Chip>
            </div>
            <p className="mt-2 text-sm leading-6 text-plum/75">{item.sentence}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Chip>{outcomeCopy(item.intervalDays >= 4 ? "easy" : item.intervalDays >= 2 ? "good" : "again")}</Chip>
              <Chip>{item.audioRef}</Chip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
