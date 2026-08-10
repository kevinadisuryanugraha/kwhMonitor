import { useRef, useEffect, useState } from 'react';
import { useGetMeterDataQuery } from '../../store/api/kwhApi';
import { useAppSelector } from '../../store/hooks';
import { calcCostPerHour, calcApparentPower, calcPowerFactor } from '../../lib/calculations';
import { formatNumber, formatCurrency } from '../../lib/formatters';
import MetricCard from './MetricCard';

export default function PowerCard() {
  const { deviceId, apiUrl, isDemoMode } = useAppSelector((s) => s.config);
  const { data } = useGetMeterDataQuery({ deviceId, apiUrl, isDemoMode });
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(data?.w);

  useEffect(() => {
    if (data && prevRef.current !== data.w) {
      prevRef.current = data.w;
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const value = data?.w;
  const cost = value !== undefined ? calcCostPerHour(value) : 0;
  const apparent = value !== undefined && data ? calcApparentPower(data.v, data.a) : 0;
  const pf = value !== undefined && data ? calcPowerFactor(data.w, apparent) : 'PF 1.00';

  return (
    <MetricCard
      label="Daya Listrik"
      icon={
        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      }
      footer={
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="text-[10px] uppercase font-bold text-slate-500">Semu: {apparent}VA</span>
          <span className="text-slate-300 font-bold">{pf}</span>
        </div>
      }
    >
      <div className={`metric-value ${flash ? 'value-updated' : ''}`}>
        <div className="flex items-baseline gap-2">
          <span className="stat-value text-4xl sm:text-5xl font-light text-white">
            {value !== undefined ? formatNumber(value, 1) : '--'}
          </span>
          <span className="text-emerald-400 font-bold text-lg">W</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Biaya: <span className="text-emerald-300 font-semibold">{formatCurrency(cost)} / jam</span>
        </p>
      </div>
    </MetricCard>
  );
}
