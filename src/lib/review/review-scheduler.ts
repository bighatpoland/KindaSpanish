import type { ReviewItem, ReviewOutcome, ReviewQueue, ReviewState } from "@/entities/domain";

const DAY_IN_MS = 1000 * 60 * 60 * 24;

export function getReviewStateForInterval(intervalDays: number): ReviewState {
  if (intervalDays >= 4) {
    return "solid";
  }

  if (intervalDays >= 2) {
    return "warming";
  }

  return "fresh";
}

export function isReviewDue(item: ReviewItem, referenceTime = new Date()) {
  return new Date(item.dueAt).getTime() <= referenceTime.getTime();
}

export function buildReviewQueue(items: ReviewItem[], referenceTime = new Date()): ReviewQueue {
  const dueNow = items
    .filter((item) => isReviewDue(item, referenceTime))
    .sort((left, right) => new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime());
  const upcoming = items
    .filter((item) => !isReviewDue(item, referenceTime))
    .sort((left, right) => new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime());

  return {
    dueNow,
    upcoming,
    totalDue: dueNow.length
  };
}

export function applyReviewOutcome(
  item: ReviewItem,
  outcome: ReviewOutcome,
  referenceTime = new Date()
): ReviewItem {
  const nextIntervalDays =
    outcome === "again" ? 1 : outcome === "good" ? Math.max(2, item.intervalDays + 1) : Math.max(4, item.intervalDays + 3);

  return {
    ...item,
    intervalDays: nextIntervalDays,
    repetitions: outcome === "again" ? item.repetitions : item.repetitions + 1,
    easeState: getReviewStateForInterval(nextIntervalDays),
    dueAt: new Date(referenceTime.getTime() + nextIntervalDays * DAY_IN_MS).toISOString(),
    lastReviewedAt: referenceTime.toISOString()
  };
}

export function createReviewItemFromSession(options: {
  id: string;
  scenarioId: string;
  chunk: string;
  sentence: string;
  audioRef: string;
  dueAt?: string;
}): ReviewItem {
  return {
    id: options.id,
    scenarioId: options.scenarioId,
    chunk: options.chunk,
    sentence: options.sentence,
    audioRef: options.audioRef,
    dueAt: options.dueAt ?? new Date().toISOString(),
    easeState: "fresh",
    intervalDays: 1,
    repetitions: 0
  };
}

export function formatReviewDueLabel(dueAt: string, referenceTime = new Date()) {
  const dueDate = new Date(dueAt);
  const diff = dueDate.getTime() - referenceTime.getTime();

  if (diff <= 0) {
    return "Due now";
  }

  const hours = Math.round(diff / (1000 * 60 * 60));

  if (hours < 24) {
    return `In ${hours}h`;
  }

  const days = Math.round(hours / 24);
  return `In ${days}d`;
}
