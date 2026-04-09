import { pillars } from '../../content/home';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { cn } from '../../lib/cn';

const pillarThemes = [
  { border: "border-[rgba(110,176,90,0.28)]", hover: "hover:border-[rgba(94,162,77,0.72)] hover:bg-[linear-gradient(180deg,#fcfff8,#f1f8ea)]", icon: "bg-[linear-gradient(180deg,#f2ffe7,#dbf3ca)]" },
  { border: "border-[rgba(156,183,128,0.28)]", hover: "hover:border-[rgba(110,156,83,0.62)] hover:bg-[linear-gradient(180deg,#ffffff,#f3f8ee)]", icon: "bg-[linear-gradient(180deg,#fff6e7,#f2ecd6)]" },
  { border: "border-[rgba(123,166,111,0.28)]", hover: "hover:border-[rgba(95,147,85,0.66)] hover:bg-[linear-gradient(180deg,#fbfffd,#eef7ef)]", icon: "bg-[linear-gradient(180deg,#eef8ff,#ddeef4)]" },
  { border: "border-[rgba(129,178,149,0.28)]", hover: "hover:border-[rgba(83,139,111,0.66)] hover:bg-[linear-gradient(180deg,#fbffff,#eef8f5)]", icon: "bg-[linear-gradient(180deg,#eefcff,#dff4f0)]" }
] as const;

export function FourPillarsSection() {
  return (
    <section className="py-18 sm:py-22">
      <Container>
        <SectionHeading description="从个体智能到集体文明，每一层都在自主演化" label="CORE PILLARS" title="驱动文明的四大支柱" />
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
          {pillars.map((pillar, index) => (
            <Reveal delay={index * 0.06} key={pillar.title}>
              <article className={cn("group relative flex h-full flex-col gap-5 rounded-[1.7rem] border bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,249,238,0.94))] px-6 py-6 shadow-[0_18px_36px_rgba(65,91,62,0.08)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_54px_rgba(65,91,62,0.14)]", pillarThemes[index].border, pillarThemes[index].hover)}>
                <div className="absolute inset-x-0 top-0 h-[6px] rounded-t-[1.7rem] bg-[linear-gradient(90deg,#a6de7e,#6aad58)] opacity-80" />
                <div className="flex items-center gap-3 pt-2">
                  <div className={cn("inventory-slot h-[3.25rem] w-[3.25rem] shrink-0 border border-white/80 text-2xl shadow-[0_14px_24px_rgba(64,93,58,0.08)] transition-transform duration-300 group-hover:scale-[1.04]", pillarThemes[index].icon)}>
                    {pillar.icon}
                  </div>
                  <h3 className="text-[1.55rem] font-black tracking-tight text-[var(--ink)]">{pillar.title}</h3>
                </div>
                <div className="rounded-[1.2rem] border border-white/80 bg-white/74 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <ul className="space-y-3 text-[0.95rem] leading-7 text-[var(--ink-soft)]">
                    {pillar.description.map((line) => (
                      <li className="flex items-start gap-3" key={line}>
                        <span className="mt-2 h-2.5 w-2.5 rounded-[0.2rem] bg-[var(--grass-deep)] transition-colors duration-300 group-hover:bg-[var(--accent)]" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
