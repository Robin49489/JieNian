import { cn } from '../../lib/cn';

export function SiteLogo({
  className,
  size = 48
}: {
  className?: string;
  size?: number;
}) {
  return (
    <img
      alt="界念 Logo"
      className={cn(
        "logo-toned rounded-[1rem] border border-white/75 bg-white/90 object-cover shadow-[0_14px_32px_rgba(64,93,58,0.12)]",
        className
      )}
      height={size}
      width={size}
      src="/logo1.jpg"
    />
  );
}
