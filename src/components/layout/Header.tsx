import BentoCard from '../ui/BentoCard';
import DeviceIdBadge from '../settings/DeviceIdBadge';
import StatusBadge from '../system/StatusBadge';
import CountdownTimer from '../system/CountdownTimer';
import IconButton from '../ui/IconButton';

interface HeaderProps {
  onRefresh: () => void;
  onOpenSettings: () => void;
}

export default function Header({ onRefresh, onOpenSettings }: HeaderProps) {
  return (
    <BentoCard className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">KWh Meter Monitoring</h1>
            <DeviceIdBadge />
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Sistem Pengawasan Penggunaan Daya Listrik Realtime</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
        <StatusBadge />
        <CountdownTimer />

        <div className="flex items-center gap-2">
          <IconButton label="Refresh Data Sekarang" onClick={onRefresh}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </IconButton>

          <IconButton label="Pengaturan ID Device" onClick={onOpenSettings}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </IconButton>
        </div>
      </div>
    </BentoCard>
  );
}
