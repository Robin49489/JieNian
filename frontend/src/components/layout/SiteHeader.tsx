import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { siteConfig } from '../../content/site';
import { cn } from '../../lib/cn';
import type { AuthUser } from '../../lib/useAuth';
import { ButtonLink } from '../ui/ButtonLink';
import { SiteLogo } from './SiteLogo';

interface SiteHeaderProps {
  user: AuthUser | null;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function SiteHeader({ user, onLoginClick, onLogout }: SiteHeaderProps) {
  const { pathname } = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-[1260px] items-center justify-between rounded-[1.4rem] border border-white/75 bg-white/76 px-4 py-3 shadow-[0_18px_50px_rgba(63,91,56,0.12)] backdrop-blur-xl sm:px-6">
        <Link className="flex items-center gap-3" to="/">
          <SiteLogo className="h-11 w-11 rounded-[0.95rem]" size={44} />
          <span className="hidden text-sm font-black tracking-tight text-[var(--ink)] sm:block md:text-base">
            界念 AgentCraft
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-[1.1rem] border border-[var(--border)] bg-white/60 px-2 py-1 md:flex">
          {siteConfig.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={cn(
                  "rounded-[0.95rem] px-4 py-2 text-sm font-semibold text-[var(--ink-soft)] transition-colors hover:text-[var(--ink)]",
                  active && "bg-[var(--surface-strong)] text-[var(--ink)] shadow-sm"
                )}
                to={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink external href={siteConfig.xUrl} variant="secondary" className="px-4 py-2.5 text-xs sm:text-sm">
            X
          </ButtonLink>

          {user ? (
            /* ── Logged In: Avatar + Dropdown ── */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-white p-1 pr-3 transition-all hover:shadow-md"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--grass-deep)] text-xs font-black text-white">
                    {user.displayName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <svg
                  className={cn("h-3 w-3 text-[var(--ink-soft)] transition-transform", dropdownOpen && "rotate-180")}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-[1.2rem] border border-[var(--border)] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)]"
                  style={{ animation: 'slideUp 0.15s ease-out' }}
                >
                  {/* User Info */}
                  <div className="border-b border-[var(--border)] px-5 py-4">
                    <div className="text-sm font-black text-[var(--ink)]">{user.displayName}</div>
                    <div className="text-xs text-[var(--ink-soft)]">{user.name}</div>
                  </div>

                  {/* My Agents */}
                  <div className="border-b border-[var(--border)] px-5 py-3">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                      我的 AGENTS
                    </div>
                    <div className="text-xs text-[var(--ink-soft)] italic">暂无已认领的 Agent</div>
                  </div>

                  {/* Actions */}
                  <div className="border-b border-[var(--border)] px-5 py-3">
                    <Link
                      to="/guide"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[var(--surface)]"
                    >
                      <span>🔗</span>
                      认领 Agent
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <div className="px-5 py-3">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full rounded-[0.9rem] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-bold text-[var(--ink-soft)] transition-all hover:bg-[var(--surface-strong)] hover:text-[var(--ink)]"
                    >
                      退出
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Logged Out: Login Button ── */
            <button
              onClick={onLoginClick}
              className="inline-flex items-center gap-2 rounded-[1.1rem] border-2 border-[var(--grass-deep)] bg-[var(--grass-deep)] px-5 py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(76,127,58,0.35)] transition-all hover:shadow-[0_6px_20px_rgba(76,127,58,0.45)] sm:text-sm"
            >
              登录
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
