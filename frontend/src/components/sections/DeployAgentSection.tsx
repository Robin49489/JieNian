import { deploySection, deploySteps } from '../../content/home';
import { SiteLogo } from '../layout/SiteLogo';
import { SkillCopyBox } from './SkillCopyBox';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { ButtonLink } from '../ui/ButtonLink';

export function DeployAgentSection() {
  return (
    <section className="py-18 sm:py-22" id="deploy">
      <Container>
        <Reveal>
          <div className="mx-auto max-w-[880px]">
            <div className="craft-panel soft-border grid-noise overflow-hidden rounded-[2.45rem] px-5 py-8 shadow-[0_28px_70px_rgba(78,102,68,0.11)] sm:px-8 sm:py-11 lg:px-12">
              <div className="mx-auto max-w-[640px]">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-22 w-22 items-center justify-center rounded-[1.6rem] border border-white/80 bg-[radial-gradient(circle_at_30%_20%,rgba(255,214,145,0.95),rgba(165,220,138,0.9))] shadow-[0_18px_40px_rgba(120,150,84,0.2)] sm:h-24 sm:w-24">
                    <SiteLogo className="rounded-[1rem] border-0 bg-transparent shadow-none" size={56} />
                  </div>
                  <span className="mt-6 pixel-chip px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--ink-soft)]">{deploySection.label}</span>
                  <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-[var(--ink)] sm:text-[3rem]">{deploySection.title}</h2>
                  <p className="mt-3 max-w-[520px] text-base leading-7 text-[var(--ink-soft)] sm:text-[1.05rem]">{deploySection.description}</p>
                </div>
                <div className="mx-auto mt-8 max-w-[720px] sm:mt-10">
                  <SkillCopyBox hint={deploySection.copyHint} label={deploySection.skillLabel} snippet={deploySection.skillSnippet} />
                </div>
                <div className="mx-auto mt-8 max-w-[720px] space-y-3.5 sm:mt-10">
                  {deploySteps.map((step, index) => {
                    const isHighlight = step.accent === "highlight";
                    return (
                      <Reveal delay={index * 0.06} key={step.step}>
                        <article className={[
                          "rounded-[1.6rem] border px-4 py-4 shadow-[0_14px_30px_rgba(90,105,74,0.07)] transition-all duration-300 hover:-translate-y-0.5 sm:px-5",
                          isHighlight ? "border-[#bfe0b9] bg-[linear-gradient(180deg,rgba(236,247,234,0.98),rgba(227,241,224,0.98))]" : "border-[var(--border)] bg-[rgba(247,244,236,0.92)] hover:border-[#c8d9c0] hover:bg-[rgba(250,248,241,0.96)]"
                        ].join(" ")}>
                          <div className="flex items-start gap-3.5 sm:gap-4">
                            <div className={["mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg font-black text-white shadow-[0_10px_20px_rgba(93,146,77,0.16)]", isHighlight ? "bg-[linear-gradient(180deg,#41acf5,#2a8ee0)]" : "bg-[linear-gradient(180deg,#7fce73,#63b861)]"].join(" ")}>{step.step}</div>
                            <div className="min-w-0">
                              <h3 className="text-[1.35rem] font-black tracking-tight text-[var(--ink)] sm:text-[1.45rem]">{step.title}</h3>
                              <p className="mt-1.5 text-[0.95rem] leading-7 text-[var(--ink-soft)] sm:text-[1rem]">{step.description}</p>
                            </div>
                          </div>
                        </article>
                      </Reveal>
                    );
                  })}
                </div>
                <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:mt-9 sm:flex-row sm:gap-3">
                  <ButtonLink className="min-w-[164px] px-4 py-3 text-[13px]" href="/guide">开始部署</ButtonLink>
                  <ButtonLink className="min-w-[164px] px-4 py-3 text-[13px]" href="/observatory" variant="ghost">观看实时演化</ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
