"use client";

import type { ArcadeRunResult, Scenario } from "@/entities/domain";
import { scenarios } from "@/features/scenarios/data";
import { readStoredArcadeRuns, writeStoredArcadeRuns } from "@/lib/arcade/arcade-storage";

export const ARCADE_RUNS_UPDATED_EVENT = "kinda-spanish:arcade-runs-updated";

export type CatchTheChunkRound = {
  id: string;
  scenarioId: string;
  prompt: string;
  correctChunk: string;
  options: string[];
};

function notifyArcadeRunsUpdated() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(ARCADE_RUNS_UPDATED_EVENT));
}

function buildDistractorPool(allScenarios: Scenario[], excludedChunk: string) {
  return allScenarios
    .flatMap((scenario) => scenario.targetChunks)
    .filter((chunk) => chunk !== excludedChunk);
}

export function buildCatchTheChunkRounds(limit = 5): CatchTheChunkRound[] {
  return scenarios.slice(0, limit).map((scenario, index) => {
    const correctChunk = scenario.targetChunks[0];
    const distractors = buildDistractorPool(scenarios, correctChunk).slice(index, index + 2);
    const options = Array.from(new Set([correctChunk, ...distractors])).sort(() =>
      Math.random() - 0.5
    );

    return {
      id: `${scenario.id}-round-${index + 1}`,
      scenarioId: scenario.id,
      prompt: scenario.audioClips.find((clip) => clip.variant === "fast")?.transcript ?? scenario.transcript[0],
      correctChunk,
      options
    };
  });
}

export function loadArcadeRuns() {
  return readStoredArcadeRuns();
}

export function saveArcadeRun(run: ArcadeRunResult) {
  const currentRuns = readStoredArcadeRuns();
  const nextRuns = [run, ...currentRuns].slice(0, 25);
  writeStoredArcadeRuns(nextRuns);
  notifyArcadeRunsUpdated();
  return nextRuns;
}

export function getBestArcadeRunScore(gameId: string) {
  return readStoredArcadeRuns()
    .filter((run) => run.gameId === gameId)
    .sort((left, right) => right.score - left.score)[0]?.score;
}
