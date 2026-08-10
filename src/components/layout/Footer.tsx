import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleDemo } from '../../store/slices/configSlice';

export default function Footer() {
  const dispatch = useAppDispatch();
  const isDemoMode = useAppSelector((s) => s.config.isDemoMode);

  return (
    <footer className="mt-auto pt-4 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
      <span>KWh Meter Realtime Dashboard &copy; 2026</span>
      <button
        onClick={() => dispatch(toggleDemo())}
        className={`font-medium hover:underline transition-colors ${isDemoMode ? 'text-amber-400' : 'text-indigo-400 hover:text-indigo-300'}`}
      >
        {isDemoMode ? 'Matikan Demo' : 'Demo Simulasi Data'}
      </button>
    </footer>
  );
}
