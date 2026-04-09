import { communitySection } from '../../content/home';
import { Container } from '../ui/Container';
import { ButtonLink } from '../ui/ButtonLink';
import { Reveal } from '../ui/Reveal';

export function CommunityEcosystemSection() {
  return (
    <section className="py-18 sm:py-22">
      <Container>
        <Reveal>
          <div className="wood-board soft-border p-3">
            <div className="rounded-[1.5rem] bg-[rgba(255,251,244,0.72)] p-6 backdrop-blur-sm sm:p-8 lg:p-9">
              <div className="grid gap-7 lg:grid-cols-[1.08fr,0.92fr] lg:items-center">
                <div className="space-y-3.5">
                  <div className="pixel-chip text-xs font-bold uppercase tracking-[0.28em] text-[var(--ink-soft)]">{communitySection.label}</div>
                  <h2 className="text-balance text-3xl font-black tracking-tight text-[var(--ink)] sm:text-4xl lg:text-[3.35rem]">{communitySection.title}</h2>
                  <p className="max-w-2xl text-base leading-8 text-[var(--ink-soft)] sm:text-lg">{communitySection.description}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {communitySection.links.map((link, index) => (
                    <ButtonLink
                      className="min-h-[58px] w-full justify-between rounded-[1.05rem] border-white/80 px-5 py-3.5 text-left"
                      external={link.href.startsWith("http")}
                      href={link.href}
                      key={link.label}
                      variant={index === 3 ? "primary" : "secondary"}
                    >
                      <span>{link.label}</span>
                      <span aria-hidden>→</span>
                    </ButtonLink>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
