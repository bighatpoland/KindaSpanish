"use client";

import type { ReviewItem } from "@/entities/domain";
import type { ReviewRepository } from "@/features/review/review-repository";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type ReviewRow = {
  user_id: string;
  client_id: string;
  scenario_id: string;
  chunk: string;
  sentence: string;
  audio_ref: string;
  due_at: string;
  ease_state: ReviewItem["easeState"];
  interval_days: number;
  repetitions: number;
  last_reviewed_at: string | null;
};

function mapRowToReviewItem(row: ReviewRow): ReviewItem {
  return {
    id: row.client_id,
    scenarioId: row.scenario_id,
    chunk: row.chunk,
    sentence: row.sentence,
    audioRef: row.audio_ref,
    dueAt: row.due_at,
    easeState: row.ease_state,
    intervalDays: row.interval_days,
    repetitions: row.repetitions,
    lastReviewedAt: row.last_reviewed_at ?? undefined
  };
}

function mapReviewItemToRow(userId: string, item: ReviewItem): ReviewRow {
  return {
    user_id: userId,
    client_id: item.id,
    scenario_id: item.scenarioId,
    chunk: item.chunk,
    sentence: item.sentence,
    audio_ref: item.audioRef,
    due_at: item.dueAt,
    ease_state: item.easeState,
    interval_days: item.intervalDays,
    repetitions: item.repetitions,
    last_reviewed_at: item.lastReviewedAt ?? null
  };
}

export function createSupabaseReviewRepository(): ReviewRepository {
  return {
    listItems: async (userId) => {
      const client = createBrowserSupabaseClient();

      if (!client || !userId) {
        return [];
      }

      const { data, error } = await client
        .from("review_items")
        .select(
          "user_id, client_id, scenario_id, chunk, sentence, audio_ref, due_at, ease_state, interval_days, repetitions, last_reviewed_at"
        )
        .eq("user_id", userId)
        .order("due_at", { ascending: true });

      if (error || !data) {
        return [];
      }

      return (data as ReviewRow[]).map(mapRowToReviewItem);
    },
    saveItems: async (items, userId) => {
      const client = createBrowserSupabaseClient();

      if (!client || !userId) {
        return;
      }

      const rows = items.map((item) => mapReviewItemToRow(userId, item));

      const { error } = await client
        .from("review_items")
        .upsert(rows, { onConflict: "user_id,client_id" });

      if (error) {
        throw error;
      }
    }
  };
}
