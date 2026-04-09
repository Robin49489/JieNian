import { cn } from '../../lib/cn';

type SectionHeadingProps = {
  label: string;
  title: string;
  description: string;
  align?: "left" | "center";
};

export function SectionHeading({
  label,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("mb-10 space-y-3", centered && "mx-auto max-w-3xl text-center")}>
      <div className={cn("flex", centered && "justify-center")}>
        <div className="pixel-chip text-xs font-bold uppercase tracking-[0.28em] text-[var(--ink-soft)]">{label}</div>
      </div>
      <div className="space-y-2">
        <h2 className="text-balance text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="text-balance max-w-3xl text-base leading-7 text-[var(--ink-soft)] sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  );
}
