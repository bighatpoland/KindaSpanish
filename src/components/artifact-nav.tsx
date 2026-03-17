import Link from "next/link";

const tabs = [
  { href: "/", label: "Home", glyph: "⌂" },
  { href: "/arcade", label: "Arcade", glyph: "✦" },
  { href: "/review", label: "Review", glyph: "❖" }
];

export function ArtifactNav({ activePath }: { activePath: string }) {
  return (
    <nav className="fixed bottom-4 left-1/2 z-20 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-panel border border-bark/20 bg-wood px-3 py-3 text-mist shadow-panel ornament-frame">
      {tabs.map((tab) => {
        const active = activePath === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`artifact-tab flex min-w-[88px] items-center justify-center gap-2 rounded-panel px-3 py-2 text-sm font-medium ${
              active ? "artifact-tab--active medallion text-bark" : "text-sand/85"
            }`}
          >
            <span className="text-base leading-none">{tab.glyph}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
