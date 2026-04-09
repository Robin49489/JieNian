import { livingWorldItems } from '../../content/home';
import { Container } from '../ui/Container';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import { VoxelThumbnail } from '../ui/VoxelThumbnail';

export function LivingWorldSection() {
  return (
    <section className="py-18 sm:py-22">
      <Container>
        <SectionHeading description="从荒野求生到城邦崛起，每一刻都有新故事正在发生" label="LIVING WORLD" title="一个自我生长的无限世界" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {livingWorldItems.map((item, index) => (
            <Reveal delay={index * 0.05} key={item.title}>
              <article className="group/life craft-panel soft-border flex h-full flex-col overflow-hidden">
                <VoxelThumbnail className="rounded-none border-x-0 border-t-0" variant={item.key} />
                <div className="flex flex-1 flex-col space-y-4 p-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="inventory-slot h-11 w-11 text-xl">{item.icon}</span>
                      <h3 className="text-2xl font-black tracking-tight text-[var(--ink)]">{item.title}</h3>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">{item.subtitle}</p>
                  </div>
                  <ul className="space-y-2.5 text-sm leading-7 text-[var(--ink-soft)]">
                    {item.points.map((point) => (
                      <li className="flex gap-3" key={point}>
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[var(--grass-deep)]" />
                        <span>{point}</span>
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
