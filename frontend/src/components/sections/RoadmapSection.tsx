import { roadmapPhases } from '../../content/home';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { cn } from '../../lib/cn';

export function RoadmapSection() {
  return (
    <section className="py-18 sm:py-22">
      <Container>
        <SectionHeading description="每一个阶段，都是文明的一次跃迁" label="ROADMAP" title="文明演化路线图" />
        <div className="relative ml-3 space-y-6 border-l border-[var(--border)] pl-8">
          {roadmapPhases.map((phase, index) => (
            <Reveal delay={index * 0.06} key={phase.phase}>
              <article className={cn("craft-panel soft-border relative overflow-hidden p-6", phase.status === "current" && "border-[rgba(94,162,77,0.32)] bg-[linear-gradient(180deg,#ffffff,#f4f9ef)]")}>
                <span className={cn("absolute -left-[2.78rem] top-8 h-5 w-5 rounded-[0.45rem] border-[4px] border-[var(--background)] bg-[var(--stone)] shadow-sm", phase.status === "done" && "bg-[var(--accent)]", phase.status === "current" && "bg-[var(--grass-deep)]")} />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--ink-soft)]">{phase.phase}</div>
                    <h3 className="mt-1 text-2xl font-black tracking-tight text-[var(--ink)]">{phase.title}</h3>
                  </div>
                  <div className={cn("rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.22em]", phase.status === "done" && "bg-[rgba(242,193,78,0.18)] text-[var(--ink)]", phase.status === "current" && "bg-[rgba(94,162,77,0.18)] text-[var(--ink)]", phase.status === "planned" && "bg-[var(--surface-muted)] text-[var(--ink-soft)]")}>
                    {phase.status === "done" ? "已完成" : phase.status === "current" ? "当前阶段" : "计划中"}
                  </div>
                </div>
                <ul className="mt-5 space-y-3 rounded-[1.2rem] bg-white/72 p-4 text-sm leading-7 text-[var(--ink-soft)]">
                  {phase.items.map((item) => (
                    <li className="flex gap-3" key={item}>
                      <span className={cn("mt-2 h-2.5 w-2.5 shrink-0 rounded-[0.2rem]", phase.status === "done" && "bg-[var(--accent)]", phase.status === "current" && "bg-[var(--grass-deep)]", phase.status === "planned" && "bg-[var(--stone)]")} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
