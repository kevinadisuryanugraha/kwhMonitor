import { useRef, useEffect, useState } from 'react';
import { useGetMeterDataQuery } from '../../store/api/kwhApi';
import { useAppSelector } from '../../store/hooks';
import { calcVoltageDelta, getVoltageStatus } from '../../lib/calculations';
import { formatNumber } from '../../lib/formatters';
import MetricCard from './MetricCard';

export default function VoltageCard() {
  const { deviceId, apiUrl, isDemoMode } = useAppSelector((s) => s.config);
  const { data } = useGetMeterDataQuery({ deviceId, apiUrl, isDemoMode });
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(data?.v);

  useEffect(() => {
    if (data && prevRef.current !== data.v) {
      prevRef.current = data.v;
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const value = data?.v;
  const delta = value !== undefined ? calcVoltageDelta(value) : 0;
  const status = value !== undefined ? getVoltageStatus(value) : { label: '--', className: 'text-slate-400' };

  return (
    <MetricCard
      label="Tegangan"
      icon={
        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      }
      footer={
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="text-[10px] uppercase font-bold text-slate-500">Acuan 220V</span>
          <span className="text-slate-300 font-bold">{delta >= 0 ? '+' : ''}{delta}%</span>
        </div>
      }
    >
      <div className={`metric-value ${flash ? 'value-updated' : ''}`}>
        <div className="flex items-baseline gap-2">
          <span className="stat-value text-4xl sm:text-5xl font-light text-white">
            {value !== undefined ? formatNumber(value, 1) : '--'}
          </span>
          <span className="text-cyan-400 font-bold text-lg">V</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Status: <span className={status.className}>{status.label}</span>
        </p>
      </div>
    </MetricCard>
  );
}
