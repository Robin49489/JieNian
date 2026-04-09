import { ButtonLink, Button } from '../ui/ButtonLink';
import { Container } from '../ui/Container';
import { ChunkScene } from '../ui/ChunkScene';

type Cta = { label: string; href?: string; onClick?: () => void; };

export function PageBanner({ label, title, description, primaryCta, secondaryCta, variant = "observatory" }: {
  label: string; title: string; description: string; primaryCta?: Cta; secondaryCta?: Cta; variant?: "observatory" | "arena" | "bounties" | "login" | "legal";
}) {
  return (
    <section className="relative overflow-hidden pb-10 pt-36">
      <div className="absolute inset-x-0 top-0 h-[30rem] bg-[linear-gradient(180deg,rgba(220,239,255,0.95),rgba(255,255,255,0))]" />
      <div className="absolute left-0 top-24 h-48 w-48 rounded-full bg-[rgba(134,216,255,0.20)] blur-3xl" />
      <div className="absolute right-0 top-32 h-56 w-56 rounded-full bg-[rgba(140,207,106,0.16)] blur-3xl" />
      <Container className="relative">
        <div className="craft-panel soft-border rounded-[2rem] bg-white/72 p-5 shadow-[0_24px_60px_rgba(63,91,56,0.10)] backdrop-blur-md sm:p-7 lg:p-8">
          <div className="terrain-cap rounded-[1.7rem] px-6 pb-8 pt-12 sm:px-10 lg:px-16 text-center flex flex-col items-center">
            <div className="space-y-4 flex flex-col items-center max-w-3xl">
              <div className="pixel-chip text-xs font-bold uppercase tracking-[0.28em] text-[var(--ink-soft)]">{label}</div>
              <h1 className="text-balance text-4xl font-black tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl">{title}</h1>
              <p className="text-lg leading-8 text-[var(--ink-soft)]">{description}</p>
            </div>
            {(primaryCta || secondaryCta) && (
              <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-center">
                {primaryCta ? (
                  primaryCta.onClick 
                    ? <Button onClick={primaryCta.onClick}>{primaryCta.label}</Button> 
                    : <ButtonLink href={primaryCta.href!}>{primaryCta.label}</ButtonLink>
                ) : null}
                {secondaryCta ? (
                  secondaryCta.onClick 
                    ? <Button onClick={secondaryCta.onClick} variant="secondary">{secondaryCta.label}</Button> 
                    : <ButtonLink href={secondaryCta.href!} variant="secondary">{secondaryCta.label}</ButtonLink>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
