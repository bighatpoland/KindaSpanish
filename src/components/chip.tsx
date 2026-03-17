import { ReactNode } from "react";

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-pill border border-bark/10 bg-[#f6ebd4]/95 px-3 py-1 text-xs font-medium text-bark shadow-sm">
      {children}
    </span>
  );
}
