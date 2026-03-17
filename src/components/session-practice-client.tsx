"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Chip } from "@/components/chip";
import { RewardBanner } from "@/components/reward-banner";
import { SoundButton } from "@/components/sound-button";
import type { Scenario, TurnPrompt } from "@/entities/domain";
import { buildMockAttemptResult } from "@/lib/ai/mock-evaluator";

type SessionPracticeClientProps = {
  scenario: Scenario;
  prompt: TurnPrompt | undefined;
};

type PlaybackState = "idle" | "playing" | "ended";
type RecognitionState = "idle" | "listening" | "processing" | "done" | "unsupported";

type PersistedSession = {
  transcript: string;
  feedback: string;
  retryPrompt: string;
  listenedOnce: boolean;
  listenedFast: boolean;
  lastUpdatedAt: string;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
};

const storageKeyForScenario = (scenarioId: string) => `kinda-spanish-session-progress:${scenarioId}`;

function readRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") {
    return null;
  }

  const possibleWindow = window as Window & {
    webkitSpeechRecognition?: SpeechRecognitionCtor;
    SpeechRecognition?: SpeechRecognitionCtor;
  };

  return possibleWindow.SpeechRecognition ?? possibleWindow.webkitSpeechRecognition ?? null;
}

export function SessionPracticeClient({
  scenario,
  prompt
}: SessionPracticeClientProps) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>("idle");
  const [fastPlaybackState, setFastPlaybackState] = useState<PlaybackState>("idle");
  const [recognitionState, setRecognitionState] = useState<RecognitionState>("idle");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [retryPrompt, setRetryPrompt] = useState("");
  const [listenedOnce, setListenedOnce] = useState(false);
  const [listenedFast, setListenedFast] = useState(false);
  const [isPending, startTransition] = useTransition();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechSynthesisUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKeyForScenario(scenario.id));

    if (!stored) {
      const ctor = readRecognitionCtor();
      if (!ctor) {
        setRecognitionState("unsupported");
      }
      return;
    }

    const parsed = JSON.parse(stored) as PersistedSession;
    setTranscript(parsed.transcript);
    transcriptRef.current = parsed.transcript;
    setFeedback(parsed.feedback);
    setRetryPrompt(parsed.retryPrompt);
    setListenedOnce(parsed.listenedOnce);
    setListenedFast(parsed.listenedFast);

    const ctor = readRecognitionCtor();
    if (!ctor) {
      setRecognitionState("unsupported");
    }
  }, [scenario.id]);

  useEffect(() => {
    const payload: PersistedSession = {
      transcript,
      feedback,
      retryPrompt,
      listenedOnce,
      listenedFast,
      lastUpdatedAt: new Date().toISOString()
    };

    window.localStorage.setItem(storageKeyForScenario(scenario.id), JSON.stringify(payload));
  }, [feedback, listenedFast, listenedOnce, retryPrompt, scenario.id, transcript]);

  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  const playPrompt = (rate: number) => {
    if (typeof window === "undefined" || !window.speechSynthesis || !prompt?.audioTranscript) {
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(prompt.audioTranscript);
    utterance.lang = "es-ES";
    utterance.rate = rate;
    utterance.pitch = 1;

    if (rate > 1) {
      setFastPlaybackState("playing");
    } else {
      setPlaybackState("playing");
    }

    utterance.onend = () => {
      if (rate > 1) {
        setFastPlaybackState("ended");
        setListenedFast(true);
      } else {
        setPlaybackState("ended");
        setListenedOnce(true);
      }
    };

    speechSynthesisUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const ctor = readRecognitionCtor();

    if (!ctor) {
      setRecognitionState("unsupported");
      return;
    }

    const recognition = new ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "es-ES";
    recognitionRef.current = recognition;
    setRecognitionState("listening");

    recognition.onresult = (event) => {
      const nextTranscript = Array.from({ length: event.results.length })
        .map((_, index) => event.results[index]?.[0]?.transcript ?? "")
        .join(" ")
        .trim();

      transcriptRef.current = nextTranscript;
      setTranscript(nextTranscript);
    };

    recognition.onerror = () => {
      setRecognitionState("unsupported");
    };

    recognition.onend = () => {
      setRecognitionState("processing");

      startTransition(() => {
        const result = buildMockAttemptResult({
          scenarioId: scenario.id,
          learnerReply: transcriptRef.current || "",
          targetChunk: scenario.targetChunks[0]
        });

        setFeedback(result.primaryFeedback);
        setRetryPrompt(result.retryPrompt);
        setRecognitionState("done");
      });
    };

    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const canEvaluate = transcript.trim().length > 0;

  const runTypedFallback = () => {
    if (!canEvaluate) {
      return;
    }

    setRecognitionState("processing");
    startTransition(() => {
      const result = buildMockAttemptResult({
        scenarioId: scenario.id,
        learnerReply: transcriptRef.current,
        targetChunk: scenario.targetChunks[0]
      });

      setFeedback(result.primaryFeedback);
      setRetryPrompt(result.retryPrompt);
      setRecognitionState("done");
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        <div className="ornament-frame rounded-plaque border border-bark/10 bg-[#f7ecd6]/90 p-3 text-center">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full medallion text-sm font-semibold text-bark">
            1
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-bark/65">Listen</p>
          <p className="mt-1 text-xs leading-5 text-plum/75">Hear the prompt in real Spanish.</p>
        </div>
        <div className="ornament-frame rounded-plaque border border-bark/10 bg-[#f7ecd6]/90 p-3 text-center">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full medallion text-sm font-semibold text-bark">
            2
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-bark/65">Speak</p>
          <p className="mt-1 text-xs leading-5 text-plum/75">Use your mic or type a fallback.</p>
        </div>
        <div className="ornament-frame rounded-plaque border border-bark/10 bg-[#f7ecd6]/90 p-3 text-center">
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full medallion text-sm font-semibold text-bark">
            3
          </div>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-bark/65">Retry</p>
          <p className="mt-1 text-xs leading-5 text-plum/75">Get fast feedback and go again.</p>
        </div>
      </div>

      <div className="mt-4 audio-prompt-panel ornament-frame rounded-panel border border-bark/20 p-5 text-mist">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-sand/75">Now listening</p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight text-mist">
              Hear the moment before you answer
            </h3>
          </div>
          <div className="medallion flex h-12 w-12 items-center justify-center rounded-full text-lg text-bark shadow-medal">
            ◉
          </div>
        </div>

        <div className="mt-5 rounded-plaque border border-sand/10 bg-black/10 p-4">
          <p className="text-[11px] uppercase tracking-[0.18em] text-sand/75">Prompt</p>
          <p className="mt-2 text-xl font-medium leading-8 text-mist">
            {prompt?.audioTranscript ?? scenario.transcript[0]}
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <SoundButton
            sound="missionReady"
            volume={0.48}
            onClick={() => playPrompt(0.92)}
            className="listen-button rounded-panel border border-sand/15 px-5 py-4 text-left shadow-sm"
          >
            <span className="block text-[11px] uppercase tracking-[0.18em] text-bark/60">
              Audio cue
            </span>
            <span className="mt-1 block text-base font-semibold text-bark">
              {playbackState === "playing" ? "Playing prompt..." : "Play prompt"}
            </span>
            <span className="mt-1 block text-sm text-plum/75">
              {listenedOnce ? "Heard once already" : "Neutral pace for first pass"}
            </span>
          </SoundButton>
          <SoundButton
            sound="dailyReminder"
            volume={0.42}
            onClick={() => playPrompt(1.14)}
            className="rounded-panel border border-sand/15 bg-black/10 px-5 py-4 text-left text-sm font-semibold text-sand"
          >
            {fastPlaybackState === "playing" ? "Playing fast..." : "Play faster audio"}
          </SoundButton>
        </div>
      </div>

      <div className="session-divider my-5" />

      <div className="rounded-panel border border-bark/12 bg-[#f4e7cb]/94 p-5 shadow-sm">
        <p className="text-[11px] uppercase tracking-[0.18em] text-bark/55">Your turn</p>
        <div className="mt-4 flex flex-col items-center text-center">
          {recognitionState !== "unsupported" ? (
            <SoundButton
              sound={recognitionState === "listening" ? "retrySoft" : "successClear"}
              volume={0.52}
              onClick={() =>
                recognitionState === "listening" ? stopListening() : startListening()
              }
              className="speak-button flex h-40 w-40 items-center justify-center rounded-full text-center text-bark shadow-medal"
            >
              <span>
                <span className="block text-[11px] uppercase tracking-[0.2em]">
                  {recognitionState === "listening" ? "Tap to" : "Tap to"}
                </span>
                <span className="mt-2 block text-2xl font-semibold">
                  {recognitionState === "listening" ? "Stop" : "Speak"}
                </span>
              </span>
            </SoundButton>
          ) : (
            <div className="medallion flex h-32 w-32 items-center justify-center rounded-full text-center text-bark shadow-medal">
              <span className="px-4 text-sm font-semibold">Mic not supported</span>
            </div>
          )}
          <p className="mt-7 text-base font-semibold text-bark">
            {recognitionState === "listening"
              ? "Listening now..."
              : "Say something that works."}
          </p>
          <p className="mt-2 max-w-[18rem] text-sm leading-6 text-plum/75">
            One useful chunk is enough. You are aiming for clear, not flawless.
          </p>
        </div>

        <div className="mt-5 space-y-3">
          <label className="block text-[11px] uppercase tracking-[0.18em] text-bark/55">
            Transcript
          </label>
          <textarea
            value={transcript}
            onChange={(event) => {
              transcriptRef.current = event.target.value;
              setTranscript(event.target.value);
            }}
            rows={4}
            placeholder="Your spoken reply will appear here. If STT does not work on your phone, type your answer here to keep testing the session flow."
            className="w-full rounded-panel border border-bark/12 bg-[#fbf2de] px-4 py-3 text-sm leading-6 text-bark outline-none transition focus:border-brass"
          />
          <div className="flex flex-wrap gap-2">
            <Chip>{recognitionState === "unsupported" ? "Typed fallback" : recognitionState}</Chip>
            <Chip>{listenedOnce ? "Prompt heard" : "Need first listen"}</Chip>
            <Chip>{listenedFast ? "Fast pass done" : "Fast pass optional"}</Chip>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <SoundButton
              sound="rewardClaim"
              volume={0.48}
              onClick={runTypedFallback}
              disabled={!canEvaluate || isPending}
              className="wood-button rounded-panel px-5 py-4 text-sm font-semibold text-mist disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? "Checking..." : "Check my answer"}
            </SoundButton>
            <SoundButton
              sound="retrySoft"
              volume={0.42}
              onClick={() => {
                transcriptRef.current = "";
                setTranscript("");
                setFeedback("");
                setRetryPrompt("");
                setRecognitionState(readRecognitionCtor() ? "idle" : "unsupported");
              }}
              className="rounded-panel border border-bark/15 bg-[#efe1c1]/90 px-5 py-4 text-sm font-semibold text-bark shadow-sm"
            >
              Clear and try again
            </SoundButton>
          </div>
        </div>
      </div>

      {(feedback || retryPrompt) && (
        <RewardBanner
          title={feedback ? "Scout feedback is ready" : "Try again"}
          body={feedback || "Keep it shorter and clearer."}
          icon="❖"
          tone="teal"
        >
          {retryPrompt ? <Chip>{retryPrompt}</Chip> : null}
          <Chip>{scenario.targetChunks[0]}</Chip>
        </RewardBanner>
      )}
    </div>
  );
}
