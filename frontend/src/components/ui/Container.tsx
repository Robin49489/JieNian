import { cn } from '../../lib/cn';
import type { ReactNode } from 'react';

type ContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section";
  children: ReactNode;
};

export function Container({
  as: Tag = "div",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-[var(--max-width)] px-5 sm:px-8", className)} {...props}>
      {children}
    </Tag>
  );
}
