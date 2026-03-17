"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SpeechCaptureStatus } from "@/entities/domain";

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
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

export function useSpeechCapture(language = "es-ES") {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef("");
  const [status, setStatus] = useState<SpeechCaptureStatus>("ready");
  const [transcript, setTranscript] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const ctor = readRecognitionCtor();
    const isSupported = Boolean(ctor);
    setSupported(isSupported);
    setStatus(isSupported ? "ready" : "unsupported");
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const start = useCallback(() => {
    const ctor = readRecognitionCtor();

    if (!ctor) {
      setSupported(false);
      setStatus("unsupported");
      setErrorMessage("Speech recognition is not available on this phone.");
      return;
    }

    setErrorMessage("");
    setStatus("requesting-permission");

    const recognition = new ctor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setStatus("recording");
    };

    recognition.onresult = (event) => {
      const nextTranscript = Array.from({ length: event.results.length })
        .map((_, index) => event.results[index]?.[0]?.transcript ?? "")
        .join(" ")
        .trim();

      transcriptRef.current = nextTranscript;
      setTranscript(nextTranscript);
    };

    recognition.onerror = (event) => {
      const nextError =
        event.error === "not-allowed"
          ? "Microphone permission is blocked for this browser."
          : event.error === "no-speech"
            ? "No speech was captured. Try again in a quieter moment."
            : "Speech capture failed on this device.";

      setErrorMessage(nextError);
      setStatus(event.error === "not-allowed" ? "error" : "ready");
    };

    recognition.onend = () => {
      setStatus((current) => {
        if (current === "error" || current === "unsupported") {
          return current;
        }

        return transcriptRef.current.trim().length > 0 ? "done" : "ready";
      });
    };

    recognition.start();
  }, [language]);

  const stop = useCallback(() => {
    if (!recognitionRef.current) {
      return;
    }

    setStatus("transcribing");
    recognitionRef.current.stop();
  }, []);

  const reset = useCallback(() => {
    transcriptRef.current = "";
    setTranscript("");
    setErrorMessage("");
    setStatus(supported ? "ready" : "unsupported");
  }, [supported]);

  const updateTranscript = useCallback((value: string) => {
    transcriptRef.current = value;
    setTranscript(value);
  }, []);

  return {
    status,
    transcript,
    setTranscript: updateTranscript,
    errorMessage,
    isSupported: supported,
    start,
    stop,
    reset
  };
}
