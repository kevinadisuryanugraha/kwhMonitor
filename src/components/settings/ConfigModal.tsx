import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setDeviceId, setInterval, setApiUrl } from '../../store/slices/configSlice';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  const dispatch = useAppDispatch();
  const config = useAppSelector((s) => s.config);

  const [deviceId, setDeviceIdLocal] = useState(config.deviceId);
  const [apiUrl, setApiUrlLocal] = useState(config.apiUrl);
  const [intervalSec, setIntervalLocal] = useState(String(config.intervalSec));

  if (!isOpen) return null;

  function handleSave() {
    dispatch(setDeviceId(deviceId));
    dispatch(setApiUrl(apiUrl));
    dispatch(setInterval(Number(intervalSec)));
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bento-card max-w-md w-full p-6 sm:p-7 relative border border-slate-700 bg-slate-900/95 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            ⚙️ Pengaturan ID Device KWh Meter
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 font-bold">✕</button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">URL Endpoint API</label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrlLocal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">ID Device</label>
            <input
              type="text"
              value={deviceId}
              onChange={(e) => setDeviceIdLocal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-slate-300 font-medium mb-1.5">Interval Polling (Detik)</label>
            <input
              type="number"
              min={2}
              max={60}
              value={intervalSec}
              onChange={(e) => setIntervalLocal(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400">
            <strong>Catatan CORS:</strong> Jika browser memblokir request langsung ke server API karena aturan CORS, aplikasi akan secara otomatis mencoba jalur proxy aman.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-semibold">
            Batal
          </button>
          <button onClick={handleSave} className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30">
            Simpan & Terapkan
          </button>
        </div>
      </div>
    </div>
  );
}
