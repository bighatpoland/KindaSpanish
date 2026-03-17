"use client";

import type { SessionProgress } from "@/entities/domain";

const SESSION_PROGRESS_KEY_PREFIX = "kinda-spanish-session-progress:";

export function getSessionProgressStorageKey(scenarioId: string) {
  return `${SESSION_PROGRESS_KEY_PREFIX}${scenarioId}`;
}

export function readStoredSessionProgress(scenarioId: string): SessionProgress | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getSessionProgressStorageKey(scenarioId));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as SessionProgress;
  } catch {
    return null;
  }
}

export function writeStoredSessionProgress(progress: SessionProgress) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    getSessionProgressStorageKey(progress.scenarioId),
    JSON.stringify(progress)
  );
}

export function clearStoredSessionProgress(scenarioId: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(getSessionProgressStorageKey(scenarioId));
}
