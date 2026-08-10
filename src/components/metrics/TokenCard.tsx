import { useRef, useEffect, useState } from 'react';
import { useGetMeterDataQuery } from '../../store/api/kwhApi';
import { useAppSelector } from '../../store/hooks';
import { calcDaysLeft, getTokenStatus } from '../../lib/calculations';
import { formatNumber } from '../../lib/formatters';
import MetricCard from './MetricCard';

export default function TokenCard() {
  const { deviceId, apiUrl, isDemoMode } = useAppSelector((s) => s.config);
  const { data } = useGetMeterDataQuery({ deviceId, apiUrl, isDemoMode });
  const [flash, setFlash] = useState(false);
  const prevRef = useRef(data?.sld);

  useEffect(() => {
    if (data && prevRef.current !== data.sld) {
      prevRef.current = data.sld;
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 600);
      return () => clearTimeout(timer);
    }
  }, [data]);

  const value = data?.sld;
  const daysLeft = value !== undefined && data ? calcDaysLeft(value, data.w) : Infinity;
  const status = value !== undefined ? getTokenStatus(value) : { label: '--', className: 'text-slate-400', isLow: false };

  return (
    <MetricCard
      label="Sisa Token"
      icon={
        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      }
      footer={
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="text-[10px] uppercase font-bold text-slate-500">PLN Prabayar</span>
          <span className={status.className}>{status.label}</span>
        </div>
      }
    >
      <div className={`metric-value ${flash ? 'value-updated' : ''}`}>
        <div className="flex items-baseline gap-2">
          <span className="stat-value text-4xl sm:text-5xl font-light text-white">
            {value !== undefined ? formatNumber(value, 2) : '--'}
          </span>
          <span className="text-purple-400 font-bold text-lg">kWh</span>
        </div>
        <p className="text-xs text-slate-400 mt-2">
          Ketahanan:{' '}
          <span className="text-purple-300 font-semibold">
            {isFinite(daysLeft) ? `~${daysLeft} hari` : 'Standby'}
          </span>
        </p>
      </div>
    </MetricCard>
  );
}
