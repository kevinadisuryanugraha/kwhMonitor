import { useState, useEffect, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import Spinner from '../ui/Spinner';
import { useGetMeterDataQuery } from '../../store/api/kwhApi';

export default function CountdownTimer() {
  const intervalSec = useAppSelector((s) => s.config.intervalSec);
  const { deviceId, apiUrl, isDemoMode } = useAppSelector((s) => s.config);
  const { isFetching } = useGetMeterDataQuery(
    { deviceId, apiUrl, isDemoMode },
    { pollingInterval: intervalSec * 1000 }
  );
  const [countdown, setCountdown] = useState(intervalSec);
  const lastFetchRef = useRef(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = (Date.now() - lastFetchRef.current) / 1000;
      const remaining = Math.max(0, Math.ceil(intervalSec - elapsed));
      setCountdown(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalSec]);

  useEffect(() => {
    if (!isFetching) {
      lastFetchRef.current = Date.now();
      setCountdown(intervalSec);
    }
  }, [isFetching, intervalSec]);

  return (
    <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-xs text-slate-300">
      {isFetching ? (
        <Spinner className="w-4 h-4 text-indigo-400" />
      ) : (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      <span className="font-mono">
        Update: <strong className="text-white font-bold">{countdown}</strong>s
      </span>
    </div>
  );
}
