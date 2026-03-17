"use client";

import type { AttemptResult, SessionProgress } from "@/entities/domain";
import type { SessionRepository } from "@/features/session/session-repository";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AttemptResultJson = {
  comprehensibilityScore: number;
  functionHit: boolean;
  primaryFeedback: string;
  retryPrompt: string;
  carryAwayChunk: string;
  avoidLongText: boolean;
};

type SessionProgressRow = {
  user_id: string;
  scenario_id: string;
  session_id: string;
  status: SessionProgress["status"];
  started_at: string;
  updated_at: string;
  completed_at: string | null;
  heard_variants: string[];
  latest_transcript: string;
  latest_attempt_result: AttemptResultJson | null;
  attempt_count: number;
  last_input_mode: "speech" | "typed" | null;
  playback_error: string | null;
  fallback_mode: "file" | "tts" | null;
};

function toAttemptResultJson(result?: AttemptResult): AttemptResultJson | null {
  if (!result) {
    return null;
  }

  return {
    comprehensibilityScore: result.comprehensibilityScore,
    functionHit: result.functionHit,
    primaryFeedback: result.primaryFeedback,
    retryPrompt: result.retryPrompt,
    carryAwayChunk: result.carryAwayChunk,
    avoidLongText: result.avoidLongText
  };
}

function mapRowToSessionProgress(row: SessionProgressRow): SessionProgress {
  return {
    sessionId: row.session_id,
    scenarioId: row.scenario_id,
    status: row.status,
    startedAt: row.started_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at ?? undefined,
    heardVariants: row.heard_variants ?? [],
    latestTranscript: row.latest_transcript ?? "",
    latestAttemptResult: row.latest_attempt_result ?? undefined,
    attemptCount: row.attempt_count ?? 0,
    lastInputMode: row.last_input_mode ?? undefined,
    attempts: [],
    playbackError: row.playback_error ?? undefined,
    fallbackMode: row.fallback_mode ?? undefined
  };
}

function mapProgressToRow(userId: string, progress: SessionProgress): SessionProgressRow {
  return {
    user_id: userId,
    scenario_id: progress.scenarioId,
    session_id: progress.sessionId,
    status: progress.status,
    started_at: progress.startedAt,
    updated_at: progress.updatedAt,
    completed_at: progress.completedAt ?? null,
    heard_variants: progress.heardVariants,
    latest_transcript: progress.latestTranscript,
    latest_attempt_result: toAttemptResultJson(progress.latestAttemptResult),
    attempt_count: progress.attemptCount,
    last_input_mode: progress.lastInputMode ?? null,
    playback_error: progress.playbackError ?? null,
    fallback_mode: progress.fallbackMode ?? null
  };
}

export function createSupabaseSessionRepository(): SessionRepository {
  return {
    loadProgress: async (scenarioId, userId) => {
      const client = createBrowserSupabaseClient();

      if (!client || !userId) {
        return null;
      }

      const { data, error } = await client
        .from("scenario_sessions")
        .select(
          "user_id, scenario_id, session_id, status, started_at, updated_at, completed_at, heard_variants, latest_transcript, latest_attempt_result, attempt_count, last_input_mode, playback_error, fallback_mode"
        )
        .eq("user_id", userId)
        .eq("scenario_id", scenarioId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }

      return mapRowToSessionProgress(data as SessionProgressRow);
    },
    saveProgress: async (progress, userId) => {
      const client = createBrowserSupabaseClient();

      if (!client || !userId) {
        return;
      }

      const { error } = await client
        .from("scenario_sessions")
        .upsert(mapProgressToRow(userId, progress), { onConflict: "user_id,scenario_id" });

      if (error) {
        throw error;
      }
    },
    clearProgress: async (scenarioId, userId) => {
      const client = createBrowserSupabaseClient();

      if (!client || !userId) {
        return;
      }

      const { error } = await client
        .from("scenario_sessions")
        .delete()
        .eq("user_id", userId)
        .eq("scenario_id", scenarioId);

      if (error) {
        throw error;
      }
    }
  };
}
