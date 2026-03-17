"use client";

import type { ReviewItem, ReviewOutcome } from "@/entities/domain";
import { createLocalReviewRepository } from "@/features/review/local-review-repository";
import { createSupabaseReviewRepository } from "@/features/review/supabase-review-repository";
import { applyReviewOutcome, buildReviewQueue, createReviewItemFromSession } from "@/lib/review/review-scheduler";

const REVIEW_MIGRATION_KEY = "kinda-spanish-review-migrated-v1";

type ReviewServiceContext = {
  userId?: string;
  remoteEnabled?: boolean;
};

async function getReviewRepositoryState(context?: ReviewServiceContext) {
  const localRepository = createLocalReviewRepository();
  const remoteRepository = createSupabaseReviewRepository();
  const shouldUseRemote = Boolean(context?.remoteEnabled && context?.userId);

  if (!shouldUseRemote || !context?.userId || typeof window === "undefined") {
    return {
      repository: localRepository,
      items: await localRepository.listItems()
    };
  }

  try {
    const alreadyMigrated = window.localStorage.getItem(REVIEW_MIGRATION_KEY) === "done";

    if (!alreadyMigrated) {
      const localItems = await localRepository.listItems();

      if (localItems.length > 0) {
        await remoteRepository.saveItems(localItems, context.userId);
      }

      window.localStorage.setItem(REVIEW_MIGRATION_KEY, "done");
    }

    return {
      repository: remoteRepository,
      items: await remoteRepository.listItems(context.userId)
    };
  } catch {
    return {
      repository: localRepository,
      items: await localRepository.listItems()
    };
  }
}

export async function loadReviewQueue(context?: ReviewServiceContext) {
  const { items } = await getReviewRepositoryState(context);
  return buildReviewQueue(items);
}

export async function saveReviewOutcome(
  reviewItemId: string,
  outcome: ReviewOutcome,
  context?: ReviewServiceContext
) {
  const { repository, items } = await getReviewRepositoryState(context);
  const updatedItems = items.map((item) =>
    item.id === reviewItemId ? applyReviewOutcome(item, outcome) : item
  );

  await repository.saveItems(updatedItems, context?.userId);
  return buildReviewQueue(updatedItems);
}

export async function upsertReviewItemFromSession(
  options: {
  scenarioId: string;
  chunk: string;
  sentence: string;
  audioRef: string;
  },
  context?: ReviewServiceContext
) {
  const { repository, items } = await getReviewRepositoryState(context);
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

  await repository.saveItems(updatedItems, context?.userId);
  return buildReviewQueue(updatedItems);
}
