import { useGetMeterDataQuery } from '../../store/api/kwhApi';
import { useAppSelector } from '../../store/hooks';

export default function LowTokenBanner() {
  const { deviceId, apiUrl, isDemoMode } = useAppSelector((s) => s.config);
  const { data } = useGetMeterDataQuery({ deviceId, apiUrl, isDemoMode });

  if (!data || data.sld >= 10) return null;

  return (
    <div className="bento-card rounded-xl p-3.5 bg-amber-500/10 border-amber-500/30 text-amber-300 text-xs sm:text-sm flex items-center gap-3">
      <svg className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <strong className="font-semibold text-white">Sisa Token Sangat Rendah!</strong>
        <span> Sisa kuota token Anda berada di bawah 10 kWh. Segera lakukan pengisian token listrik.</span>
      </div>
    </div>
  );
}
