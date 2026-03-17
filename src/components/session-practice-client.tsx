"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Chip } from "@/components/chip";
import { RewardBanner } from "@/components/reward-banner";
import { SoundButton } from "@/components/sound-button";
import { useSupabaseAuth } from "@/components/supabase-auth-provider";
import type {
  Scenario,
  SessionAttemptInputMode,
  SessionProgress,
  TurnPrompt
} from "@/entities/domain";
import { createSessionProgress, withSessionAttempt, withSessionDraft, withSessionPlayback } from "@/features/session/local-session-repository";
import { useSpeechCapture } from "@/hooks/use-speech-capture";
import { buildMockAttemptResult } from "@/lib/ai/mock-evaluator";
import {
  playLessonAudioClip,
  type LessonAudioRuntime,
  type LessonAudioStatus
} from "@/lib/audio/lesson-audio";
import { upsertReviewItemFromSession } from "@/features/review/review-service";
import { loadSessionProgress, saveSessionProgress } from "@/features/session/session-service";

type SessionPracticeClientProps = {
  scenario: Scenario;
  prompt: TurnPrompt | undefined;
};

function statusLabelForSpeech(status: ReturnType<typeof useSpeechCapture>["status"]) {
  switch (status) {
    case "requesting-permission":
      return "Allow mic";
    case "recording":
      return "Recording";
    case "transcribing":
      return "Finishing";
    case "done":
      return "Reply ready";
    case "unsupported":
      return "Type instead";
    case "error":
      return "Mic issue";
    default:
      return "Ready";
  }
}

export function SessionPracticeClient({
  scenario,
  prompt
}: SessionPracticeClientProps) {
  const { userId, isRemoteReady } = useSupabaseAuth();
  const speech = useSpeechCapture("es-ES");
  const {
    status: speechStatus,
    transcript,
    setTranscript,
    errorMessage,
    isSupported,
    start,
    stop,
    reset
  } = speech;
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>(() =>
    createSessionProgress(scenario.id)
  );
  const [primaryAudioStatus, setPrimaryAudioStatus] = useState<LessonAudioStatus>("idle");
  const [fastAudioStatus, setFastAudioStatus] = useState<LessonAudioStatus>("idle");
  const [draftInputMode, setDraftInputMode] = useState<SessionAttemptInputMode>("typed");
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const audioRuntimeRef = useRef<LessonAudioRuntime | null>(null);
  const neutralClip =
    scenario.audioClips.find((clip) => clip.variant === "neutral") ?? scenario.audioClips[0];
  const fastClip =
    scenario.audioClips.find((clip) => clip.variant === "fast") ??
    scenario.audioClips[1] ??
    neutralClip;
  const promptText = neutralClip?.transcript ?? prompt?.audioTranscript ?? scenario.transcript[0];
  const latestResult = sessionProgress.latestAttemptResult;
  const hasFeedback = Boolean(latestResult);
  const speakActive =
    speechStatus === "recording" ||
    speechStatus === "requesting-permission" ||
    speechStatus === "transcribing";
  const statusLabel = statusLabelForSpeech(speechStatus);

  useEffect(() => {
    let cancelled = false;

    const hydrateSession = async () => {
      const storedProgress = await loadSessionProgress(scenario.id, {
        userId,
        remoteEnabled: isRemoteReady
      });

      if (cancelled) {
        return;
      }

      if (storedProgress) {
        setSessionProgress(storedProgress);
        setTranscript(storedProgress.latestTranscript);
        setDraftInputMode(storedProgress.lastInputMode ?? "typed");
      } else {
        const freshProgress = createSessionProgress(scenario.id);
        setSessionProgress(freshProgress);
        setTranscript("");
        setDraftInputMode("typed");
      }

      setHasHydrated(true);
    };

    void hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [isRemoteReady, scenario.id, setTranscript, userId]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    void saveSessionProgress(sessionProgress, {
      userId,
      remoteEnabled: isRemoteReady
    });
  }, [hasHydrated, isRemoteReady, sessionProgress, userId]);

  useEffect(() => {
    return () => {
      audioRuntimeRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    if (
      speechStatus === "requesting-permission" ||
      speechStatus === "recording" ||
      speechStatus === "transcribing"
    ) {
      setSessionProgress((current) => withSessionDraft(current, transcript, "responding"));
      return;
    }

    if (speechStatus === "done") {
      setSessionProgress((current) => withSessionDraft(current, transcript, "ready-to-respond"));
      return;
    }

    if (speechStatus === "error" || speechStatus === "unsupported") {
      setSessionProgress((current) => ({
        ...current,
        updatedAt: new Date().toISOString()
      }));
    }
  }, [hasHydrated, speechStatus, transcript]);

  const playClip = (variant: "neutral" | "fast") => {
    const clip = variant === "fast" ? fastClip : neutralClip;

    if (!clip) {
      return;
    }

    audioRuntimeRef.current?.stop();

    if (variant === "fast") {
      setFastAudioStatus("loading");
      setPrimaryAudioStatus((current) => (current === "playing" ? "ended" : current));
    } else {
      setPrimaryAudioStatus("loading");
      setFastAudioStatus((current) => (current === "playing" ? "ended" : current));
    }

    audioRuntimeRef.current = playLessonAudioClip(clip, {
      onReady: () => {
        if (variant === "fast") {
          setFastAudioStatus("ready");
        } else {
          setPrimaryAudioStatus("ready");
        }
      },
      onStart: (source) => {
        if (variant === "fast") {
          setFastAudioStatus("playing");
        } else {
          setPrimaryAudioStatus("playing");
        }

        setSessionProgress((current) =>
          withSessionPlayback(current, {
            status: "listening",
            fallbackMode: source
          })
        );
      },
      onEnd: (source) => {
        if (variant === "fast") {
          setFastAudioStatus("ended");
        } else {
          setPrimaryAudioStatus("ended");
        }

        setSessionProgress((current) =>
          withSessionPlayback(current, {
            status: "ready-to-respond",
            heardVariant: clip.variant,
            fallbackMode: source
          })
        );
      },
      onError: (message) => {
        if (variant === "fast") {
          setFastAudioStatus("error");
        } else {
          setPrimaryAudioStatus("error");
        }

        setSessionProgress((current) =>
          withSessionPlayback(current, {
            status: current.status,
            playbackError: message
          })
        );
      },
      onBlocked: (message) => {
        if (variant === "fast") {
          setFastAudioStatus("blocked");
        } else {
          setPrimaryAudioStatus("blocked");
        }

        setSessionProgress((current) =>
          withSessionPlayback(current, {
            status: current.status,
            playbackError: message
          })
        );
      }
    });
  };

  const runEvaluation = () => {
    const normalizedTranscript = transcript.trim();

    if (!normalizedTranscript) {
      return;
    }

    startTransition(() => {
      const result = buildMockAttemptResult({
        scenarioId: scenario.id,
        learnerReply: normalizedTranscript,
        targetChunks: [...scenario.targetChunks],
        expectedFunctions: prompt?.expectedFunctions
      });

      setSessionProgress((current) =>
        withSessionAttempt(current, draftInputMode, normalizedTranscript, result)
      );
      void upsertReviewItemFromSession({
        scenarioId: scenario.id,
        chunk: result.carryAwayChunk,
        sentence: normalizedTranscript,
        audioRef: `${scenario.id}:neutral`
      }, {
        userId,
        remoteEnabled: isRemoteReady
      });
    });
  };

  const clearDraft = () => {
    reset();
    setSessionProgress((current) => ({
      ...current,
      status: current.heardVariants.length > 0 ? "ready-to-respond" : "not-started",
      updatedAt: new Date().toISOString(),
      latestTranscript: "",
      latestAttemptResult: undefined,
      playbackError: undefined
    }));
    setDraftInputMode("typed");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div
          className={`ornament-frame rounded-plaque border p-3 text-center shadow-sm ${
            sessionProgress.heardVariants.includes("neutral")
              ? "border-cypress/22 courtyard-tile"
              : "border-bark/10 bg-[#f7ecd6]/90"
          }`}
        >
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full medallion text-sm font-semibold text-bark">
            1
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-bark/65">Listen</p>
          <p className="mt-1 text-xs leading-5 text-plum/75">Hear the encounter once first.</p>
        </div>
        <div
          className={`ornament-frame rounded-plaque border p-3 text-center shadow-sm ${
            speakActive || transcript.trim()
              ? "border-cypress/22 courtyard-tile"
              : "border-bark/10 bg-[#f7ecd6]/90"
          }`}
        >
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full medallion text-sm font-semibold text-bark">
            2
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-bark/65">Respond</p>
          <p className="mt-1 text-xs leading-5 text-plum/75">Use the mic or type a fallback.</p>
        </div>
        <div
          className={`ornament-frame rounded-plaque border p-3 text-center shadow-sm ${
            hasFeedback ? "border-cypress/22 courtyard-tile" : "border-bark/10 bg-[#f7ecd6]/90"
          }`}
        >
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full medallion text-sm font-semibold text-bark">
            3
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-bark/65">Retry</p>
          <p className="mt-1 text-xs leading-5 text-plum/75">Check the answer and tighten it.</p>
        </div>
      </div>

      <div className="audio-prompt-panel ornament-frame rounded-panel border border-bark/20 p-5 text-mist">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-sand/75">Lesson audio</p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight text-mist">
              Hear the moment, then answer
            </h3>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-sand/85">
              Sprint 1 uses structured lesson audio with browser playback and a TTS fallback, so
              the session flow is now closer to a real phone test.
            </p>
          </div>
          <div className="medallion flex h-12 w-12 items-center justify-center rounded-full text-lg text-bark shadow-medal">
            ◉
          </div>
        </div>

        <div className="mt-5 rounded-plaque border border-sand/10 bg-black/10 p-4 shadow-sm">
          <p className="text-[11px] uppercase tracking-[0.18em] text-sand/75">Prompt</p>
          <p className="mt-2 text-xl font-medium leading-8 text-mist">{promptText}</p>
          {prompt?.hints?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {prompt.hints.map((hint) => (
                <Chip key={hint} tone="forest">
                  {hint}
                </Chip>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <SoundButton
            sound="missionReady"
            volume={0.48}
            onClick={() => playClip("neutral")}
            className={`listen-button rounded-panel border px-5 py-4 text-left shadow-sm ${
              primaryAudioStatus === "playing" || primaryAudioStatus === "loading"
                ? "border-cypress/30 ring-2 ring-cypress/20"
                : "border-sand/15"
            }`}
          >
            <span className="block text-[11px] uppercase tracking-[0.18em] text-bark/60">
              Main pass
            </span>
            <span className="mt-1 block text-base font-semibold text-bark">
              {primaryAudioStatus === "playing"
                ? "Playing prompt..."
                : primaryAudioStatus === "blocked"
                  ? "Tap again to allow audio"
                  : "Play prompt"}
            </span>
            <span className="mt-1 block text-sm text-plum/75">
              {sessionProgress.heardVariants.includes("neutral")
                ? "Heard once already"
                : "Neutral pace for first pass"}
            </span>
          </SoundButton>
          <SoundButton
            sound="dailyReminder"
            volume={0.42}
            onClick={() => playClip("fast")}
            className={`rounded-panel border px-5 py-4 text-left text-sm font-semibold shadow-sm ${
              fastAudioStatus === "playing" || fastAudioStatus === "loading"
                ? "border-olive/40 bg-[linear-gradient(180deg,rgba(63,85,71,0.96)_0%,rgba(35,53,45,0.98)_100%)] text-mist"
                : "border-sand/15 bg-black/10 text-sand"
            }`}
          >
            {fastAudioStatus === "playing" ? "Playing fast..." : "Play faster audio"}
          </SoundButton>
        </div>

        {sessionProgress.playbackError ? (
          <p className="mt-4 text-sm leading-6 text-sand/85">{sessionProgress.playbackError}</p>
        ) : null}
      </div>

      <div className="session-divider my-5" />

      <div className="rounded-panel border border-cypress/16 bg-[linear-gradient(180deg,rgba(245,236,217,0.98)_0%,rgba(231,221,196,0.96)_100%)] p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Your turn</p>
          <Chip tone={speechStatus === "done" ? "forest" : "sand"}>{statusLabel}</Chip>
        </div>
        <div className="mt-4 flex flex-col items-center text-center">
          {isSupported ? (
            <SoundButton
              sound={speakActive ? "retrySoft" : "successClear"}
              volume={0.52}
              onClick={() => {
                setDraftInputMode("speech");

                if (speakActive) {
                  stop();
                } else {
                  start();
                }
              }}
              className={`speak-button flex h-40 w-40 items-center justify-center rounded-full text-center text-bark shadow-medal ${
                speakActive ? "ring-2 ring-cypress/30" : ""
              }`}
            >
              <span>
                <span className="block text-[11px] uppercase tracking-[0.2em]">
                  {speakActive ? "Tap to" : "Tap to"}
                </span>
                <span className="mt-2 block text-2xl font-semibold">
                  {speakActive ? "Stop" : "Record"}
                </span>
              </span>
            </SoundButton>
          ) : (
            <div className="medallion flex h-32 w-32 items-center justify-center rounded-full text-center text-bark shadow-medal">
              <span className="px-4 text-sm font-semibold">Type your reply</span>
            </div>
          )}
          <p className="mt-7 text-base font-semibold text-bark">
            {speakActive ? "Recording now..." : "Say something that works."}
          </p>
          <p className="mt-2 max-w-[18rem] text-sm leading-6 text-plum/75">
            The goal is not perfect grammar. One useful chunk is enough.
          </p>
          {errorMessage ? (
            <p className="mt-3 max-w-[18rem] text-sm leading-6 text-coral-900">
              {errorMessage}
            </p>
          ) : null}
        </div>

        <div className="mt-5 space-y-3">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-bark/55">
            Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(event) => {
              setDraftInputMode("typed");
              setTranscript(event.target.value);
              setSessionProgress((current) =>
                withSessionDraft(
                  current,
                  event.target.value,
                  current.heardVariants.length > 0 ? "ready-to-respond" : "not-started"
                )
              );
            }}
            rows={4}
            placeholder="Your spoken reply will appear here. If speech capture does not work on your phone, type your answer here and keep testing the loop."
            className="w-full rounded-panel border border-cypress/14 bg-[#fbf2de] px-4 py-3 text-sm leading-6 text-bark outline-none transition focus:border-cypress"
          />
          <div className="flex flex-wrap gap-2">
            <Chip tone={speechStatus === "done" ? "forest" : "sand"}>{speechStatus}</Chip>
            <Chip tone={sessionProgress.heardVariants.includes("neutral") ? "forest" : "sand"}>
              {sessionProgress.heardVariants.includes("neutral") ? "Prompt heard" : "Need first listen"}
            </Chip>
            <Chip tone={sessionProgress.heardVariants.includes("fast") ? "forest" : "sand"}>
              {sessionProgress.heardVariants.includes("fast") ? "Fast pass done" : "Fast pass optional"}
            </Chip>
            <Chip>{sessionProgress.attemptCount} attempts saved</Chip>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SoundButton
              sound="rewardClaim"
              volume={0.48}
              onClick={runEvaluation}
              disabled={!transcript.trim() || isPending}
              className="wood-button rounded-panel px-5 py-4 text-sm font-semibold text-mist disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Checking..." : "Check my answer"}
            </SoundButton>
            <SoundButton
              sound="retrySoft"
              volume={0.42}
              onClick={clearDraft}
              className="rounded-panel border border-cypress/16 bg-[linear-gradient(180deg,rgba(237,232,218,0.98)_0%,rgba(221,215,198,0.96)_100%)] px-5 py-4 text-sm font-semibold text-bark shadow-sm"
            >
              Clear and try again
            </SoundButton>
          </div>
        </div>
      </div>

      {latestResult ? (
        <RewardBanner
          title={latestResult.functionHit ? "That works in real life" : "One more small adjustment"}
          body={latestResult.primaryFeedback}
          icon={latestResult.functionHit ? "✦" : "❖"}
          tone={latestResult.functionHit ? "gold" : "teal"}
        >
          <Chip tone="forest">{latestResult.retryPrompt}</Chip>
          <Chip>{latestResult.carryAwayChunk}</Chip>
          {sessionProgress.lastInputMode ? <Chip>{sessionProgress.lastInputMode}</Chip> : null}
        </RewardBanner>
      ) : null}
    </div>
  );
}
