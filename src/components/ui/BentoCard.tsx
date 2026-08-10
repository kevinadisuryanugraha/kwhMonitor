import type { ReactNode, HTMLAttributes } from 'react';

interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function BentoCard({ children, className = '', ...props }: BentoCardProps) {
  return (
    <div className={`bento-card ${className}`} {...props}>
      {children}
    </div>
  );
}
