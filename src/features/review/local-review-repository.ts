"use client";

import type { ReviewItem } from "@/entities/domain";
import { reviewItems as reviewSeedItems } from "@/features/scenarios/data";
import type { ReviewRepository } from "@/features/review/review-repository";

const REVIEW_STORAGE_KEY = "kinda-spanish-review-items";

export function createLocalReviewRepository(): ReviewRepository {
  return {
    listItems: async () => {
      if (typeof window === "undefined") {
        return [...reviewSeedItems];
      }

      const stored = window.localStorage.getItem(REVIEW_STORAGE_KEY);

      if (!stored) {
        window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(reviewSeedItems));
        return [...reviewSeedItems];
      }

      try {
        return JSON.parse(stored) as ReviewItem[];
      } catch {
        return [...reviewSeedItems];
      }
    },
    saveItems: async (items) => {
      if (typeof window === "undefined") {
        return;
      }

      window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(items));
    }
  };
}
