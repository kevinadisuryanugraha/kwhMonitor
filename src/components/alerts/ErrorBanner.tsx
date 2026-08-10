import { useState, useEffect } from 'react';
import { useAppSelector } from '../../store/hooks';

export default function ErrorBanner() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const isOnline = useAppSelector((s) => s.system.isOnline);

  useEffect(() => {
    if (!isOnline) {
      setMessage('Gagal mengambil data dari server. Menampilkan nilai terakhir.');
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isOnline]);

  if (!visible) return null;

  return (
    <div className="bento-card rounded-xl p-3.5 bg-red-500/10 border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{message}</span>
      </div>
      <button onClick={() => setVisible(false)} className="text-red-400 hover:text-red-200 font-bold p-1">
        ✕
      </button>
    </div>
  );
}
