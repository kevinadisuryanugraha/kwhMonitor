import type { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

export default function MetricCard({ label, icon, children, footer }: MetricCardProps) {
  return (
    <div className="bento-card p-4 sm:p-5 flex flex-col justify-between group relative overflow-hidden min-h-[140px]">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
        <div className="p-2 rounded-lg border border-slate-700/50 bg-slate-800/30 transition-transform group-hover:scale-110 shrink-0">
          {icon}
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center">{children}</div>
      <div className="pt-3 mt-2 border-t border-slate-800/50">{footer}</div>
    </div>
  );
}
