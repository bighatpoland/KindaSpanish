"use client";

import Link, { LinkProps } from "next/link";
import { PropsWithChildren } from "react";
import { UISoundName } from "@/lib/audio/ui-sounds";
import { useSound } from "@/hooks/use-sound";

type SoundLinkProps = PropsWithChildren<
  LinkProps & {
    className?: string;
    sound?: UISoundName;
  }
>;

export function SoundLink({
  children,
  className,
  sound = "successClear",
  ...props
}: SoundLinkProps) {
  const playSound = useSound(sound, { volume: 0.48 });

  return (
    <Link
      {...props}
      className={className}
      onClick={(event) => {
        props.onClick?.(event);
        playSound();
      }}
    >
      {children}
    </Link>
  );
}

