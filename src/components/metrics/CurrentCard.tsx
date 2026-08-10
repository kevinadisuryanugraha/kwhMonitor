import { useRef, useEffect, useState } from 'react';
import { useGetMeterDataQuery } from '../../store/api/kwhApi';
import { useAppSelector } from '../../store/hooks';
import { calcCurrentLoadPct, getCurrentLoadStatus } from '../../lib/calculations';
import { formatNumber } from '../../lib/formatters';
import MetricCard from './MetricCard';

export default function CurrentCard() {
  const { deviceId, apiUrl, isDemoMode } = useAppSelector((s) => s.config);
  const { data } = useGetMeterDataQuery({ deviceId, apiUrl, isDemoMode });
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(data?.a);

  useEffect(() => {
    if (data && prevRef.current !== data.a) {
      prevRef.current = data.a;
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const value = data?.a;
  const loadPct = value !== undefined ? calcCurrentLoadPct(value) : 0;
  const status = value !== undefined ? getCurrentLoadStatus(value) : { label: '--', className: 'text-slate-400' };

  return (
    <MetricCard
      label="Arus Listrik"
      icon={
        <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      }
      footer={
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="text-[10px] uppercase font-bold text-slate-500">Maks 10A</span>
          <span className="text-slate-300 font-bold">{loadPct}%</span>
        </div>
      }
    >
      <div className={`metric-value ${flash ? 'value-updated' : ''}`}>
        <div className="flex items-baseline gap-2">
          <span className="stat-value text-4xl sm:text-5xl font-light text-white">
            {value !== undefined ? formatNumber(value, 2) : '--'}
          </span>
          <span className="text-amber-400 font-bold text-lg">A</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Beban: <span className={status.className}>{status.label}</span>
        </p>
      </div>
    </MetricCard>
  );
}
