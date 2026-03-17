export function ProgressBar({
  value,
  label
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-walnut/75">
        <span className="uppercase tracking-[0.12em]">{label}</span>
        <span className="font-semibold text-brass">{value}%</span>
      </div>
      <div className="inset-panel h-5 rounded-pill border border-walnut/12 p-[2px]">
        <div
          className="h-full rounded-pill bg-[linear-gradient(90deg,#4a6857_0%,#788454_44%,#cf9e41_100%)] shadow-[inset_0_1px_0_rgba(255,244,212,0.4)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
