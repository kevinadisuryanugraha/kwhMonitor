import type { DataPoint } from '../types/meterData';
import type { ChartMetric } from '../types/config';

export interface ChartDimensions {
  width: number;
  height: number;
}

export function drawChart(
  ctx: CanvasRenderingContext2D,
  data: DataPoint[],
  metric: ChartMetric,
  dims: ChartDimensions
): void {
  const { width, height } = dims;
  const padding = 30;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  ctx.clearRect(0, 0, width, height);

  if (data.length < 2) {
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.font = "12px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = 'center';
    ctx.fillText('Menunggu pengumpulan data realtime...', width / 2, height / 2);
    return;
  }

  const values = data.map((d) => d[metric as keyof DataPoint] as number);
  let minVal = Math.min(...values);
  let maxVal = Math.max(...values);

  if (minVal === maxVal) {
    minVal -= 1;
    maxVal += 1;
  }

  const colors = getMetricColors(metric);

  // Draw grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Calculate points
  const points = data.map((d, index) => {
    const x = padding + (chartWidth / (data.length - 1)) * index;
    const val = d[metric as keyof DataPoint] as number;
    const normY = (val - minVal) / (maxVal - minVal);
    const y = height - padding - normY * chartHeight;
    return { x, y, val };
  });

  // Draw area fill
  ctx.beginPath();
  ctx.moveTo(points[0].x, height - padding);
  for (const p of points) ctx.lineTo(p.x, p.y);
  ctx.lineTo(points[points.length - 1].x, height - padding);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
  gradient.addColorStop(0, colors.fill);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw line
  ctx.beginPath();
  ctx.strokeStyle = colors.stroke;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  for (let i = 0; i < points.length; i++) {
    if (i === 0) ctx.moveTo(points[i].x, points[i].y);
    else ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.stroke();

  // Draw dots
  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    const isLast = i === points.length - 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, isLast ? 5 : 3, 0, Math.PI * 2);
    ctx.fillStyle = isLast ? '#ffffff' : colors.stroke;
    ctx.fill();
    ctx.strokeStyle = colors.stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Label last value
  const lastPoint = points[points.length - 1];
  const unit = metric === 'w' ? 'W' : metric === 'v' ? 'V' : metric === 'a' ? 'A' : 'kWh';
  ctx.fillStyle = '#ffffff';
  ctx.font = "bold 11px 'JetBrains Mono', monospace";
  ctx.textAlign = 'left';
  ctx.fillText(
    `${lastPoint.val} ${unit}`,
    Math.min(lastPoint.x - 30, width - 65),
    Math.max(lastPoint.y - 10, 15)
  );
}

function getMetricColors(metric: ChartMetric): { stroke: string; fill: string } {
  switch (metric) {
    case 'v':
      return { stroke: '#06b6d4', fill: 'rgba(6, 182, 212, 0.15)' };
    case 'a':
      return { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.15)' };
    case 'sld':
      return { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.15)' };
    case 'w':
    default:
      return { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.15)' };
  }
}
