import { CompassIcon, HouseIcon, TowerIcon } from "@/components/settlers-icons";

const markerIconMap = {
  house: HouseIcon,
  tower: TowerIcon,
  compass: CompassIcon
};

export function BuildingMarker({
  label,
  icon,
  className
}: {
  label: string;
  icon: keyof typeof markerIconMap;
  className?: string;
}) {
  const Icon = markerIconMap[icon];

  return (
    <div className={`absolute hidden items-center gap-2 md:flex ${className ?? ""}`}>
      <div className="building-lot flex h-9 w-11 items-center justify-center rounded-[8px]">
        <Icon className="h-5 w-5" />
      </div>
      <span className="text-[10px] uppercase tracking-[0.16em] text-[#d9c392]/72">{label}</span>
    </div>
  );
}
