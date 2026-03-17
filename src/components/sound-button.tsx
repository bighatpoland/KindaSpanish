"use client";

import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { UISoundName } from "@/lib/audio/ui-sounds";
import { useSound } from "@/hooks/use-sound";

type SoundButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    sound?: UISoundName;
    volume?: number;
  }
>;

export function SoundButton({
  children,
  sound = "successClear",
  volume = 0.52,
  onClick,
  ...props
}: SoundButtonProps) {
  const playSound = useSound(sound, { volume });

  return (
    <button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        playSound();
      }}
    >
      {children}
    </button>
  );
}

