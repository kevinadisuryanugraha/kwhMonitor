import { useState, useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { useGetMeterDataQuery } from './store/api/kwhApi';
import { updateSystemMetrics, setOnlineStatus, incrementSuccess } from './store/slices/systemSlice';
import { pushDataPoint } from './store/slices/chartSlice';
import { addHistoryPoint } from './store/slices/historySlice';
import { formatTimestamp } from './lib/formatters';
import type { DataPoint } from './types/meterData';

import DashboardLayout from './components/layout/DashboardLayout';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ErrorBanner from './components/alerts/ErrorBanner';
import LowTokenBanner from './components/alerts/LowTokenBanner';
import VoltageCard from './components/metrics/VoltageCard';
import CurrentCard from './components/metrics/CurrentCard';
import PowerCard from './components/metrics/PowerCard';
import TokenCard from './components/metrics/TokenCard';
import SystemInfo from './components/system/SystemInfo';
import ConfigModal from './components/settings/ConfigModal';
import CPUPanel from './components/charts/CPUPanel';
import PowerPanel from './components/charts/PowerPanel';
import TokenPanel from './components/charts/TokenPanel';

export default function App() {
  const dispatch = useAppDispatch();
  const { deviceId, apiUrl, intervalSec, isDemoMode } = useAppSelector((s) => s.config);
  const [isConfigOpen, setConfigOpen] = useState(false);

  const { data, error, isSuccess } = useGetMeterDataQuery(
    { deviceId, apiUrl, isDemoMode },
    { pollingInterval: intervalSec * 1000 }
  );

  useEffect(() => {
    if (data && isSuccess) {
      const now = new Date();
      const timestamp = now.getTime();
      dispatch(incrementSuccess());
      dispatch(setOnlineStatus(true));
      const dataPoint: DataPoint = {
        ...data,
        time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      };
      dispatch(pushDataPoint(dataPoint));
      dispatch(addHistoryPoint({ ...data, timestamp, time: dataPoint.time }));
      dispatch(updateSystemMetrics({ latency: 0, lastUpdated: formatTimestamp(now) }));
    }
  }, [data, isSuccess, dispatch]);

  useEffect(() => {
    if (error) dispatch(setOnlineStatus(false));
  }, [error, dispatch]);

  const handleRefresh = useCallback(() => window.location.reload(), []);

  return (
    <>
      <ConfigModal isOpen={isConfigOpen} onClose={() => setConfigOpen(false)} />
      <DashboardLayout>
        <Header onRefresh={handleRefresh} onOpenSettings={() => setConfigOpen(true)} />
        <ErrorBanner />
        <LowTokenBanner />

        {/* Metric Cards — 4 column on desktop, 2 on mobile */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <VoltageCard />
          <CurrentCard />
          <PowerCard />
          <TokenCard />
        </section>

        {/* Charts — 2/3 left + 1/3 right, stack on mobile */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
          {/* Left: 2 panels stacked */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <CPUPanel />
            <PowerPanel />
          </div>

          {/* Right: Token + System Info stacked */}
          <div className="flex flex-col gap-4">
            <TokenPanel />
            <SystemInfo />
          </div>
        </section>

        <Footer />
      </DashboardLayout>
    </>
  );
}
