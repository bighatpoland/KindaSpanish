import { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-pill bg-white/85 px-3 py-1 text-xs font-medium text-plum shadow-sm">
      {children}
    </span>
  );
}

