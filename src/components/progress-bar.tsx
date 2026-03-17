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
      <div className="h-4 rounded-pill border border-bark/10 bg-[#d8c6a4]/70 p-[2px]">
        <div
          className="h-full rounded-pill bg-brass"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
