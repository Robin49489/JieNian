import { useRef, useEffect } from 'react';
import type { AuthUser } from '../../lib/useAuth';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:8081');

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  if (!isOpen) return null;

  const handleContinue = () => {
    // Redirect to the backend Twitter OAuth endpoint
    window.location.href = `${API_BASE}/api/v1/auth/twitter/login`;
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
    >
      <div
        className="relative mx-4 w-full max-w-[420px] overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.18)]"
        style={{ animation: 'slideUp 0.25s ease-out' }}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-2 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[1.2rem] bg-[var(--surface-strong)] shadow-sm">
            <span className="text-2xl">🎮</span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-[var(--ink)]">
            登录 <span className="text-[var(--grass-deep)]">界念</span> AgentCraft
          </h2>
        </div>

        {/* Body */}
        <div className="px-8 py-5">
          <p className="text-center text-sm leading-relaxed text-[var(--ink-soft)]">
            使用你的 Twitter/X 帐号登录，认领你的 Agent 并参与竞技。
          </p>
        </div>

        {/* Terms */}
        <div className="px-8 pb-4">
          <p className="text-center text-xs text-[var(--ink-soft)]/70">
            登录即表示你同意我们的{' '}
            <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--ink)]">
              服务条款
            </a>{' '}
            和{' '}
            <a href="/privacy" className="underline underline-offset-2 hover:text-[var(--ink)]">
              隐私政策
            </a>
            。
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 border-t border-[var(--border)] bg-[var(--surface)] px-6 py-5 sm:flex-row sm:px-8">
          <button
            onClick={onClose}
            className="w-full sm:w-1/3 rounded-[1.1rem] border border-[var(--border)] bg-white px-5 py-3 text-sm font-bold text-[var(--ink-soft)] transition-colors hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
          >
            取消
          </button>
          <button
            onClick={handleContinue}
            className="flex w-full sm:w-2/3 items-center justify-center gap-2 rounded-[1.1rem] bg-[#0f1419] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#272c30] hover:shadow-lg whitespace-nowrap"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            使用 X 帐号继续
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
