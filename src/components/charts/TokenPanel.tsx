import { useAppSelector } from '../../store/hooks';
import TaskManagerChart from './TaskManagerChart';

export default function TokenPanel() {
  const points = useAppSelector((s) => s.history.points);

  return (
    <TaskManagerChart
      title="🪙 Token"
      subtitle="Sisa Token kWh (60 detik terakhir)"
      metrics={[
        { key: 'sld' as const, color: '#a855f7', label: 'Token', unit: 'kWh', fill: true },
      ]}
      data={points}
      rollingWindowSec={60}
    />
  );
}
