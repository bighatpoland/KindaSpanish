"use client";

import type { SessionProgress } from "@/entities/domain";
import { createLocalSessionRepository } from "@/features/session/local-session-repository";
import { createSupabaseSessionRepository } from "@/features/session/supabase-session-repository";
import { getSessionProgressStorageKey, readStoredSessionProgress } from "@/lib/session/session-storage";

const SESSION_MIGRATION_PREFIX = "kinda-spanish-session-migrated-v1:";

type SessionServiceContext = {
  userId?: string;
  remoteEnabled?: boolean;
};

function getSessionMigrationKey(scenarioId: string) {
  return `${SESSION_MIGRATION_PREFIX}${scenarioId}`;
}

async function ensureRemoteSessionMigration(
  scenarioId: string,
  userId: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const marker = window.localStorage.getItem(getSessionMigrationKey(scenarioId));

  if (marker === "done") {
    return;
  }

  const localProgress = readStoredSessionProgress(scenarioId);

  if (localProgress) {
    const remoteRepository = createSupabaseSessionRepository();
    try {
      await remoteRepository.saveProgress(localProgress, userId);
    } catch {
      return;
    }
  }

  window.localStorage.setItem(getSessionMigrationKey(scenarioId), "done");
}

export async function loadSessionProgress(
  scenarioId: string,
  context?: SessionServiceContext
) {
  const localRepository = createLocalSessionRepository();

  if (!context?.remoteEnabled || !context.userId) {
    return localRepository.loadProgress(scenarioId);
  }

  await ensureRemoteSessionMigration(scenarioId, context.userId);

  try {
    const remoteRepository = createSupabaseSessionRepository();
    const remoteProgress = await remoteRepository.loadProgress(scenarioId, context.userId);

    if (remoteProgress) {
      return remoteProgress;
    }
  } catch {
    return localRepository.loadProgress(scenarioId);
  }

  return localRepository.loadProgress(scenarioId);
}

export async function saveSessionProgress(
  progress: SessionProgress,
  context?: SessionServiceContext
) {
  const localRepository = createLocalSessionRepository();
  await localRepository.saveProgress(progress);

  if (!context?.remoteEnabled || !context.userId) {
    return;
  }

  try {
    const remoteRepository = createSupabaseSessionRepository();
    await remoteRepository.saveProgress(progress, context.userId);
  } catch {
    return;
  }
}

export async function clearSessionProgress(
  scenarioId: string,
  context?: SessionServiceContext
) {
  const localRepository = createLocalSessionRepository();
  await localRepository.clearProgress(scenarioId);

  if (!context?.remoteEnabled || !context.userId) {
    return;
  }

  try {
    const remoteRepository = createSupabaseSessionRepository();
    await remoteRepository.clearProgress(scenarioId, context.userId);
  } catch {
    return;
  }

  if (typeof window !== "undefined") {
    window.localStorage.removeItem(getSessionProgressStorageKey(scenarioId));
  }
}
