import { useAppSelector } from '../../store/hooks';
import { formatLatency } from '../../lib/formatters';

export default function SystemInfo() {
  const { latency, successCount, lastUpdated } = useAppSelector((s) => s.system);
  const isDemoMode = useAppSelector((s) => s.config.isDemoMode);
  const fetchMode = isDemoMode ? 'Simulasi Demo' : 'API Langsung';

  const rows = [
    { label: 'Terakhir Update', value: lastUpdated, valueClass: 'text-slate-200' },
    { label: 'Latency', value: formatLatency(latency), valueClass: 'text-cyan-400' },
    { label: 'Request Sukses', value: String(successCount), valueClass: 'text-emerald-400' },
    { label: 'Mode', value: fetchMode, valueClass: 'text-slate-300' },
  ];

  return (
    <div className="bento-card p-4 sm:p-5 flex flex-col">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">System</span>
      <h3 className="text-sm font-bold text-white mt-1 mb-3">Informasi Monitoring</h3>
      <div className="space-y-2 text-xs flex-1">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-900/50 border border-slate-800/50">
            <span className="text-slate-400">{row.label}</span>
            <span className={`font-mono font-bold ${row.valueClass}`}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
