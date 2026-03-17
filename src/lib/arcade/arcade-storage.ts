"use client";

import type { ArcadeRunResult } from "@/entities/domain";

const ARCADE_RUNS_STORAGE_KEY = "kinda-spanish-arcade-runs";

export function readStoredArcadeRuns(): ArcadeRunResult[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(ARCADE_RUNS_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as ArcadeRunResult[];
  } catch {
    return [];
  }
}

export function writeStoredArcadeRuns(runs: ArcadeRunResult[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ARCADE_RUNS_STORAGE_KEY, JSON.stringify(runs));
}
