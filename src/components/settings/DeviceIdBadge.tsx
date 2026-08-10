import { useAppSelector } from '../../store/hooks';

export default function DeviceIdBadge() {
  const deviceId = useAppSelector((s) => s.config.deviceId);

  return (
    <span className="px-3 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
      ID: {deviceId}
    </span>
  );
}
