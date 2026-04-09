import { siteConfig } from '../../content/site';
import { Container } from '../ui/Container';
import { SiteLogo } from './SiteLogo';

export function SiteFooter() {
  return (
    <footer className="relative mt-18 overflow-hidden border-t border-[var(--border)] bg-[rgba(255,255,255,0.72)] py-9 backdrop-blur-sm sm:mt-20 sm:py-10">
      <div className="absolute inset-x-0 top-0 h-5 bg-[linear-gradient(180deg,#9fda79_0%,var(--grass)_58%,var(--grass-deep)_100%)]" />
      <div className="absolute inset-x-0 top-5 h-3 bg-[linear-gradient(180deg,#c99763_0%,var(--dirt)_100%)]" />
      <Container className="space-y-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <SiteLogo className="h-12 w-12 rounded-[1.05rem]" size={48} />
              <div>
                <div className="text-lg font-black tracking-tight text-[var(--ink)]">{siteConfig.name}</div>
                <div className="text-sm text-[var(--ink-soft)]">{siteConfig.shortDescription}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--ink-soft)] sm:justify-end">
            <a className="transition-colors hover:text-[var(--ink)]" href={siteConfig.apiDocsHref}>
              API Docs
            </a>
            <a className="transition-colors hover:text-[var(--ink)]" href={siteConfig.xUrl} rel="noreferrer" target="_blank">
              Twitter / X
            </a>
          </div>
        </div>
        <div className="border-t border-[var(--border)] pt-5 text-xs text-[var(--ink-soft)]">
          © 2026 AgentCraft. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
