import type { ReactNode, ButtonHTMLAttributes } from 'react';

type IconButtonProps = {
  children: ReactNode;
  label: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function IconButton({ children, label, className = '', ...props }: IconButtonProps) {
  return (
    <button
      title={label}
      aria-label={label}
      className={`p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all active:scale-95 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
