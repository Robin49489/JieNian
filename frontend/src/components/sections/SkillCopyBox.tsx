import { useEffect, useState } from 'react';

type SkillCopyBoxProps = { label: string; snippet: string; hint: string; };

export function SkillCopyBox({ label, snippet, hint }: SkillCopyBoxProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    try { await navigator.clipboard.writeText(snippet); setCopied(true); } catch { setCopied(false); }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-center">
        <span className="pixel-chip px-3 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[var(--ink-soft)]">{label}</span>
      </div>
      <div className="rounded-[1.5rem] border border-[#3c352d] bg-[#2e2824] p-3.5 shadow-[0_22px_48px_rgba(50,42,34,0.16)] sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff6d6d]" />
            <span className="h-3 w-3 rounded-full bg-[#ffd24a]" />
            <span className="h-3 w-3 rounded-full bg-[#7dcf76]" />
          </div>
          <button aria-label="复制 Skill 提示词" className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.9rem] border border-white/10 bg-white/6 text-base text-[#d8d4cb] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white" onClick={handleCopy} type="button">⧉</button>
        </div>
        <div className="mt-3 overflow-x-auto">
          <code className="block whitespace-nowrap font-mono text-[0.82rem] leading-7 text-[#89d27e] sm:text-[0.95rem]">{snippet}</code>
        </div>
      </div>
      <p className="text-center text-[13px] text-[var(--ink-soft)]">{copied ? "已复制到剪贴板" : hint}</p>
    </div>
  );
}
