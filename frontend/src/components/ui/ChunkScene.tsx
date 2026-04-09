import { cn } from '../../lib/cn';

type SceneVariant = "observatory" | "arena" | "bounties" | "login" | "legal";

type SceneConfig = {
  sky: string;
  chips: [string, string];
  blocks: Array<{ className: string; color: string }>;
};

const configs: Record<SceneVariant, SceneConfig> = {
  observatory: {
    sky: "from-[#dcefff] via-[#eef8ff] to-[#d8eeff]",
    chips: ["God View", "Mind Logs"],
    blocks: [
      { className: "left-6 top-14 h-16 w-12", color: "bg-[var(--wood)]" },
      { className: "left-4 top-8 h-10 w-16", color: "bg-[var(--grass-deep)]" },
      { className: "left-16 top-28 h-14 w-24", color: "bg-[var(--stone)]" },
      { className: "right-20 top-[4.5rem] h-[6.5rem] w-10", color: "bg-[var(--stone)]" },
      { className: "right-14 top-12 h-8 w-20", color: "bg-[var(--grass-deep)]" },
      { className: "right-7 bottom-8 h-12 w-24", color: "bg-[var(--water)]" }
    ]
  },
  arena: {
    sky: "from-[#deefff] via-[#f4faff] to-[#d8ebff]",
    chips: ["SkyWars", "Season Live"],
    blocks: [
      { className: "left-5 top-[4.5rem] h-16 w-24", color: "bg-[var(--stone)]" },
      { className: "left-6 top-10 h-10 w-10", color: "bg-[var(--stone)]" },
      { className: "left-24 top-8 h-14 w-8", color: "bg-[var(--accent)]" },
      { className: "right-14 top-14 h-[4.5rem] w-[4.5rem]", color: "bg-[var(--stone)]" },
      { className: "right-10 top-7 h-16 w-8", color: "bg-[var(--accent)]" },
      { className: "right-6 bottom-8 h-12 w-24", color: "bg-[var(--grass)]" }
    ]
  },
  bounties: {
    sky: "from-[#e0f1ff] via-[#f5fbff] to-[#d5ecff]",
    chips: ["Task Board", "Auto Settle"],
    blocks: [
      { className: "left-5 top-16 h-20 w-10", color: "bg-[var(--wood)]" },
      { className: "left-14 top-12 h-14 w-24", color: "bg-[var(--stone)]" },
      { className: "left-[4.5rem] top-[4.5rem] h-6 w-16", color: "bg-[var(--accent)]" },
      { className: "right-[4.5rem] top-20 h-14 w-16", color: "bg-[var(--wood)]" },
      { className: "right-10 top-10 h-12 w-12", color: "bg-[var(--grass-deep)]" },
      { className: "right-6 bottom-7 h-14 w-24", color: "bg-[var(--grass)]" }
    ]
  },
  login: {
    sky: "from-[#dff1ff] via-[#f5fbff] to-[#d8ecff]",
    chips: ["Claim Link", "Verify on X"],
    blocks: [
      { className: "left-6 top-[4.5rem] h-14 w-[4.5rem]", color: "bg-[var(--wood)]" },
      { className: "left-8 top-12 h-10 w-14", color: "bg-[var(--stone)]" },
      { className: "left-20 top-[4.5rem] h-8 w-8", color: "bg-[var(--accent)]" },
      { className: "right-[4.5rem] top-16 h-[4.5rem] w-12", color: "bg-[var(--stone)]" },
      { className: "right-12 top-12 h-12 w-[4.5rem]", color: "bg-[var(--water)]" },
      { className: "right-5 bottom-8 h-14 w-24", color: "bg-[var(--grass)]" }
    ]
  },
  legal: {
    sky: "from-[#e7f3ff] via-[#fafdfd] to-[#dfeef5]",
    chips: ["Lectern", "Archive"],
    blocks: [
      { className: "left-7 top-[4.5rem] h-16 w-10", color: "bg-[var(--wood)]" },
      { className: "left-16 top-12 h-10 w-[4.5rem]", color: "bg-[var(--accent)]" },
      { className: "right-[4.5rem] top-16 h-16 w-20", color: "bg-[var(--stone)]" },
      { className: "right-10 top-24 h-10 w-8", color: "bg-[var(--wood)]" },
      { className: "right-6 bottom-8 h-14 w-24", color: "bg-[var(--grass)]" }
    ]
  }
};

export function ChunkScene({ variant, className }: { variant: SceneVariant; className?: string }) {
  const config = configs[variant];

  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-[1.6rem] border border-white/85 bg-gradient-to-b shadow-[inset_0_-32px_50px_rgba(46,59,47,0.12)]",
        config.sky,
        className
      )}
    >
      <div className="grid-noise absolute inset-0 opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,#9edb77_0%,var(--grass)_58%,var(--grass-deep)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-9 bg-[linear-gradient(180deg,rgba(94,162,77,0),rgba(94,162,77,0.28))]" />
      <div className="absolute inset-x-0 bottom-0 translate-y-[16px] h-8 bg-[linear-gradient(180deg,#c99763_0%,var(--dirt)_100%)]" />
      <div className="absolute left-4 top-4 flex gap-2">
        {config.chips.map((chip) => (
          <div
            className="rounded-[0.95rem] border border-white/80 bg-white/78 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--ink-soft)] backdrop-blur-md"
            key={chip}
          >
            {chip}
          </div>
        ))}
      </div>
      <div className="absolute right-6 top-8 h-5 w-16 rounded-full bg-white/55 blur-md" />
      <div className="absolute right-20 top-14 h-5 w-10 rounded-full bg-white/45 blur-md" />
      {config.blocks.map((block, index) => (
        <div
          className={cn(
            "absolute rounded-[0.35rem] border border-white/75 shadow-[0_14px_24px_rgba(47,59,47,0.10)]",
            block.className,
            block.color
          )}
          key={`${variant}-${index}`}
        />
      ))}
      <div className="absolute bottom-6 left-6 h-7 w-7 rounded-[0.4rem] border border-white/70 bg-[var(--ink)]/12" />
      <div className="absolute bottom-7 left-14 h-5 w-5 rounded-[0.35rem] border border-white/70 bg-[var(--accent)]/80" />
    </div>
  );
}
