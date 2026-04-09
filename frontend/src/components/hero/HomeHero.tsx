import { lazy, Suspense } from 'react';
import { heroContent } from '../../content/home';
import { ButtonLink } from '../ui/ButtonLink';
import { Container } from '../ui/Container';

const MinecraftHeroScene = lazy(() => import('./MinecraftHeroScene'));

export function HomeHero() {
  return (
    <section className="relative isolate min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Suspense
          fallback={
            <div className="h-full w-full bg-[linear-gradient(180deg,#dcefff_0%,#d7f0ff_42%,#92d06f_100%)]">
              <div className="h-full w-full grid-noise opacity-35" />
            </div>
          }
        >
          <MinecraftHeroScene />
        </Suspense>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(255,255,255,0.16),rgba(255,255,255,0.03)_28%,rgba(255,255,255,0)_58%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0)_34%,rgba(82,122,70,0.025)_76%,rgba(255,255,255,0.28)_100%)]" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[15vw] bg-[linear-gradient(90deg,rgba(220,239,255,0.18),rgba(220,239,255,0))]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[16vw] bg-[linear-gradient(270deg,rgba(220,239,255,0.18),rgba(220,239,255,0))]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(244,248,239,0)_0%,rgba(244,248,239,0.8)_100%)]" />
      </div>

      <Container className="relative flex min-h-screen items-center justify-center pb-18 pt-36">
        <div className="max-w-[45rem] text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/74 bg-white/72 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--ink-soft)] shadow-[0_16px_40px_rgba(70,95,68,0.1)] backdrop-blur-md sm:px-5">
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--grass-deep)] shadow-[0_0_0_5px_rgba(94,162,77,0.16)]" />
            {heroContent.badge}
          </div>

          <h1 className="text-balance text-5xl font-black tracking-[-0.05em] text-white drop-shadow-[0_10px_34px_rgba(36,61,34,0.28)] sm:text-6xl lg:text-[5.5rem]">
            {heroContent.title}
          </h1>
          <p className="mx-auto mt-5 max-w-[40rem] text-balance text-base leading-8 text-white/92 drop-shadow-[0_4px_14px_rgba(36,61,34,0.18)] sm:text-lg">
            {heroContent.description}
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={heroContent.primaryCta.href} className="min-w-[220px] border-white/60 shadow-[0_18px_34px_rgba(36,61,34,0.14)]">
              {heroContent.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={heroContent.secondaryCta.href}
              variant="secondary"
              className="min-w-[220px] border-white/70 bg-white/82 backdrop-blur-md"
            >
              {heroContent.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
