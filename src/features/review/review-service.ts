"use client";

import type { ReviewItem, ReviewOutcome } from "@/entities/domain";
import { createLocalReviewRepository } from "@/features/review/local-review-repository";
import { applyReviewOutcome, buildReviewQueue, createReviewItemFromSession } from "@/lib/review/review-scheduler";

export function loadReviewQueue() {
  const repository = createLocalReviewRepository();
  return buildReviewQueue(repository.listItems());
}

export function saveReviewOutcome(reviewItemId: string, outcome: ReviewOutcome) {
  const repository = createLocalReviewRepository();
  const items = repository.listItems();
  const updatedItems = items.map((item) =>
    item.id === reviewItemId ? applyReviewOutcome(item, outcome) : item
  );

  repository.saveItems(updatedItems);
  return buildReviewQueue(updatedItems);
}

export function upsertReviewItemFromSession(options: {
  scenarioId: string;
  chunk: string;
  sentence: string;
  audioRef: string;
}) {
  const repository = createLocalReviewRepository();
  const items = repository.listItems();
  const existing = items.find(
    (item) => item.scenarioId === options.scenarioId && item.chunk === options.chunk
  );

  let updatedItems: ReviewItem[];

  if (existing) {
    updatedItems = items.map((item) =>
      item.id === existing.id
        ? {
            ...item,
            sentence: options.sentence,
            audioRef: options.audioRef,
            dueAt: new Date().toISOString()
          }
        : item
    );
  } else {
    updatedItems = [
      createReviewItemFromSession({
        id: `review-${options.scenarioId}-${options.chunk.replace(/\s+/g, "-")}`,
        scenarioId: options.scenarioId,
        chunk: options.chunk,
        sentence: options.sentence,
        audioRef: options.audioRef
      }),
      ...items
    ];
  }

  repository.saveItems(updatedItems);
  return buildReviewQueue(updatedItems);
}
