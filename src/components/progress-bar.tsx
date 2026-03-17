export function ProgressBar({
  value,
  label
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm text-plum/70">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-3 rounded-pill bg-plum/10">
        <div
          className="h-3 rounded-pill bg-gradient-to-r from-coral to-gold"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

