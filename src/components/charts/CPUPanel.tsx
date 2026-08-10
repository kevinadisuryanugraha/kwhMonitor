import { useAppSelector } from '../../store/hooks';
import TaskManagerChart from './TaskManagerChart';

export default function CPUPanel() {
  const points = useAppSelector((s) => s.history.points);

  return (
    <TaskManagerChart
      title="⚡ Voltage"
      subtitle="Tegangan Listrik (60 detik terakhir)"
      metrics={[
        { key: 'v' as const, color: '#06b6d4', label: 'Tegangan', unit: 'V', fill: true },
      ]}
      data={points}
      rollingWindowSec={60}
    />
  );
}
