import { useAppSelector } from '../../store/hooks';
import TaskManagerChart from './TaskManagerChart';

export default function PowerPanel() {
  const points = useAppSelector((s) => s.history.points);

  return (
    <TaskManagerChart
      title="🔌 Power"
      subtitle="Daya & Arus Listrik (60 detik terakhir)"
      metrics={[
        { key: 'w' as const, color: '#10b981', label: 'Daya', unit: 'W', fill: true },
        { key: 'a' as const, color: '#f59e0b', label: 'Arus', unit: 'A', fill: false },
      ]}
      data={points}
      rollingWindowSec={60}
    />
  );
}
