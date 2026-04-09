import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import type { ReactNode } from 'react';

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  external?: boolean;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external = false
}: ButtonLinkProps) {
  const shared =
    "inline-flex items-center justify-center gap-2 rounded-[1rem] border px-5 py-3.5 text-sm font-bold tracking-[0.01em] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0";
  const variants = {
    primary:
      "border-[#4d8840] bg-[linear-gradient(180deg,#6fbd5d,#5ea24d)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_0_#4b853f,0_18px_34px_rgba(94,162,77,0.22)] hover:bg-[linear-gradient(180deg,#79c967,#5ea24d)]",
    secondary:
      "border-[rgba(215,212,200,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,244,232,0.94))] text-[var(--ink)] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_4px_0_rgba(201,151,99,0.28),0_16px_30px_rgba(70,95,68,0.08)] hover:bg-white",
    ghost:
      "border-[var(--border)] bg-white/80 text-[var(--ink)] shadow-[0_12px_26px_rgba(70,95,68,0.06)] hover:border-[var(--grass-deep)] hover:bg-white"
  };

  if (external) {
    return (
      <a className={cn(shared, variants[variant], className)} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={cn(shared, variants[variant], className)} to={href}>
      {children}
    </Link>
  );
}

export function Button({
  onClick,
  children,
  variant = "primary",
  className,
  type = "button",
  disabled = false
}: Omit<ButtonLinkProps, "href" | "external"> & { onClick?: () => void; type?: "button" | "submit" | "reset"; disabled?: boolean }) {
  const shared =
    "inline-flex items-center justify-center gap-2 rounded-[1rem] border px-5 py-3.5 text-sm font-bold tracking-[0.01em] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0";
  const variants = {
    primary:
      "border-[#4d8840] bg-[linear-gradient(180deg,#6fbd5d,#5ea24d)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_4px_0_#4b853f,0_18px_34px_rgba(94,162,77,0.22)] hover:bg-[linear-gradient(180deg,#79c967,#5ea24d)]",
    secondary:
      "border-[rgba(215,212,200,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,244,232,0.94))] text-[var(--ink)] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_4px_0_rgba(201,151,99,0.28),0_16px_30px_rgba(70,95,68,0.08)] hover:bg-white",
    ghost:
      "border-[var(--border)] bg-white/80 text-[var(--ink)] shadow-[0_12px_26px_rgba(70,95,68,0.06)] hover:border-[var(--grass-deep)] hover:bg-white"
  };

  return (
    <button
      type={type}
      className={cn(shared, variants[variant], className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
