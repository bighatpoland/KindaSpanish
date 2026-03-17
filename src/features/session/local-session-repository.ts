"use client";

import type { AttemptResult, SessionProgress } from "@/entities/domain";
import { readStoredSessionProgress, writeStoredSessionProgress, clearStoredSessionProgress } from "@/lib/session/session-storage";
import type { SessionRepository } from "@/features/session/session-repository";

export function createLocalSessionRepository(): SessionRepository {
  return {
    loadProgress: async (scenarioId) => readStoredSessionProgress(scenarioId),
    saveProgress: async (progress) => writeStoredSessionProgress(progress),
    clearProgress: async (scenarioId) => clearStoredSessionProgress(scenarioId)
  };
}

export function createSessionProgress(scenarioId: string): SessionProgress {
  const timestamp = new Date().toISOString();

  return {
    sessionId: `${scenarioId}-${timestamp}`,
    scenarioId,
    status: "not-started",
    startedAt: timestamp,
    updatedAt: timestamp,
    heardVariants: [],
    latestTranscript: "",
    attemptCount: 0,
    attempts: []
  };
}

export function withSessionPlayback(
  progress: SessionProgress,
  options: {
    status: SessionProgress["status"];
    heardVariant?: string;
    playbackError?: string;
    fallbackMode?: SessionProgress["fallbackMode"];
  }
): SessionProgress {
  const heardVariants = options.heardVariant
    ? Array.from(new Set([...progress.heardVariants, options.heardVariant]))
    : progress.heardVariants;

  return {
    ...progress,
    status: options.status,
    heardVariants,
    playbackError: options.playbackError,
    fallbackMode: options.fallbackMode ?? progress.fallbackMode,
    updatedAt: new Date().toISOString()
  };
}

export function withSessionDraft(
  progress: SessionProgress,
  transcript: string,
  status: SessionProgress["status"]
): SessionProgress {
  return {
    ...progress,
    latestTranscript: transcript,
    status,
    updatedAt: new Date().toISOString()
  };
}

export function withSessionAttempt(
  progress: SessionProgress,
  inputMode: "speech" | "typed",
  transcript: string,
  result: AttemptResult
): SessionProgress {
  return {
    ...progress,
    status: "feedback-ready",
    updatedAt: new Date().toISOString(),
    latestTranscript: transcript,
    latestAttemptResult: result,
    attemptCount: progress.attemptCount + 1,
    lastInputMode: inputMode,
    attempts: [
      ...progress.attempts,
      {
        id: `${progress.scenarioId}-attempt-${progress.attemptCount + 1}`,
        scenarioId: progress.scenarioId,
        inputMode,
        transcript,
        createdAt: new Date().toISOString(),
        result
      }
    ]
  };
}
