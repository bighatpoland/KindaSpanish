"use client";

import type { ScenarioAudioClip } from "@/entities/domain";

export type LessonAudioStatus =
  | "idle"
  | "loading"
  | "ready"
  | "playing"
  | "ended"
  | "error"
  | "blocked";

export type LessonAudioPlaybackSource = "file" | "tts";

type LessonAudioCallbacks = {
  onReady?: () => void;
  onStart?: (source: LessonAudioPlaybackSource) => void;
  onEnd?: (source: LessonAudioPlaybackSource) => void;
  onError?: (message: string) => void;
  onBlocked?: (message: string) => void;
};

export type LessonAudioRuntime = {
  stop: () => void;
};

export function playLessonAudioClip(
  clip: ScenarioAudioClip,
  callbacks: LessonAudioCallbacks
): LessonAudioRuntime | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (clip.src) {
    const audio = new Audio(clip.src);
    audio.preload = "auto";
    audio.playbackRate = clip.playbackRate ?? 1;
    callbacks.onReady?.();

    audio.onplay = () => callbacks.onStart?.("file");
    audio.onended = () => callbacks.onEnd?.("file");
    audio.onerror = () => callbacks.onError?.("Audio file could not be played.");

    void audio.play().catch(() => {
      callbacks.onBlocked?.("Tap again to allow lesson audio on this device.");
    });

    return {
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }

  if (!clip.ttsFallback || !window.speechSynthesis) {
    callbacks.onError?.("No lesson audio is available for this prompt yet.");
    return null;
  }

  window.speechSynthesis.cancel();
  callbacks.onReady?.();

  const utterance = new SpeechSynthesisUtterance(clip.transcript);
  utterance.lang = "es-ES";
  utterance.rate = clip.playbackRate ?? 1;
  utterance.pitch = 1;
  utterance.onstart = () => callbacks.onStart?.("tts");
  utterance.onend = () => callbacks.onEnd?.("tts");
  utterance.onerror = () => callbacks.onError?.("Speech playback failed on this device.");

  window.speechSynthesis.speak(utterance);

  return {
    stop: () => {
      window.speechSynthesis.cancel();
    }
  };
}
