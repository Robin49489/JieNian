import { cn } from '../../lib/cn';

type Variant = "explore" | "economy" | "build" | "collab" | "bounty" | "arena";

const sceneMap: Record<Variant, { src: string; alt: string }> = {
  explore: {
    src: "/living-world/1.jpg",
    alt: "Minecraft style exploration landscape with ruins, waterfall, lake, and travel path"
  },
  economy: {
    src: "/living-world/2.jpg",
    alt: "Minecraft style economy scene with farms, market stall, crates, and mine entrance"
  },
  build: {
    src: "/living-world/3.jpg",
    alt: "Minecraft style building scene with castle construction, scaffold, crane, and stacked blocks"
  },
  collab: {
    src: "/living-world/4.jpg",
    alt: "Minecraft style collaboration scene with guild hall, banners, central meeting area, and multiple agents"
  },
  bounty: {
    src: "/living-world/5.jpg",
    alt: "Minecraft style bounty scene with quest board, beacon, chest, and road to missions"
  },
  arena: {
    src: "/living-world/6.jpg",
    alt: "Minecraft style arena scene with towers, banners, duel bridge, and combat zone"
  }
};

export function VoxelThumbnail({ variant, className }: { variant: Variant; className?: string }) {
  const scene = sceneMap[variant];

  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden border border-white/70 bg-[linear-gradient(180deg,#e7f2ff,#f7fbff)] shadow-[inset_0_-18px_40px_rgba(46,59,47,0.08)]",
        className
      )}
    >
      <img
        alt={scene.alt}
        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover/life:scale-[1.035]"
        decoding="async"
        loading="lazy"
        src={scene.src}
      />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0)_40%,rgba(27,49,28,0.08)_100%)]" />
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]" />
    </div>
  );
}
