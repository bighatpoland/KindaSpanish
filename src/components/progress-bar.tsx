export function ProgressBar({
  value,
  label
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-bark/70">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-4 rounded-pill border border-cypress/12 bg-[linear-gradient(180deg,rgba(216,198,164,0.68)_0%,rgba(200,209,184,0.62)_100%)] p-[2px]">
        <div
          className="h-full rounded-pill bg-[linear-gradient(90deg,#4d6f5f_0%,#7c8e5b_46%,#c89a43_100%)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
