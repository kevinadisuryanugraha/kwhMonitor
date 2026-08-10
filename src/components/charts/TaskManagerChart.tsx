import { useRef, useEffect, useCallback } from 'react';
import type { HistoryDataPoint } from '../../store/slices/historySlice';

interface MetricConfig {
  key: keyof HistoryDataPoint;
  color: string;
  label: string;
  unit: string;
  fill?: boolean;
}

interface TaskManagerChartProps {
  title: string;
  subtitle: string;
  metrics: MetricConfig[];
  data: HistoryDataPoint[];
  rollingWindowSec?: number; // default 60
  height?: number;
}

const TEXT_COLOR = '#94a3b8';
const GRID_COLOR = 'rgba(255,255,255,0.04)';
const BG_COLOR = '#0f172a';
const PADDING = { top: 10, right: 16, bottom: 28, left: 48 };

export default function TaskManagerChart({
  title,
  subtitle,
  metrics,
  data,
  rollingWindowSec = 60,
  height = 220,
}: TaskManagerChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const chartW = w - PADDING.left - PADDING.right;
    const chartH = h - PADDING.top - PADDING.bottom;

    // Clear
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, 12, 18);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(subtitle, 12, 32);

    // Grid lines
    const gridLines = 4;
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridLines; i++) {
      const y = PADDING.top + (chartH / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(PADDING.left, y);
      ctx.lineTo(w - PADDING.right, y);
      ctx.stroke();
    }

    if (data.length < 2) {
      ctx.fillStyle = '#475569';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Mengumpulkan data...', PADDING.left + chartW / 2, PADDING.top + chartH / 2);
      return;
    }

    // Calculate value ranges for ALL metrics combined
    const now = Date.now();
    const windowStart = now - rollingWindowSec * 1000;
    const windowedData = data.filter((d) => d.timestamp >= windowStart);

    if (windowedData.length < 2) {
      ctx.fillStyle = '#475569';
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('Menunggu data...', PADDING.left + chartW / 2, PADDING.top + chartH / 2);
      return;
    }

    let globalMin = Infinity;
    let globalMax = -Infinity;
    for (const d of windowedData) {
      for (const m of metrics) {
        const val = d[m.key] as number;
        if (val < globalMin) globalMin = val;
        if (val > globalMax) globalMax = val;
      }
    }
    if (globalMin === globalMax) { globalMin -= 1; globalMax += 1; }
    const range = globalMax - globalMin;

    // Y-axis labels
    ctx.fillStyle = TEXT_COLOR;
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= gridLines; i++) {
      const val = globalMin + (range / gridLines) * (gridLines - i);
      const y = PADDING.top + (chartH / gridLines) * i;
      ctx.fillText(val.toFixed(1), PADDING.left - 6, y + 3);
    }

    // Time labels at bottom
    ctx.textAlign = 'center';
    const timeLabels = 6;
    for (let i = 0; i <= timeLabels; i++) {
      const x = PADDING.left + (chartW / timeLabels) * i;
      const secsAgo = rollingWindowSec - (rollingWindowSec / timeLabels) * i;
      ctx.fillText(`${secsAgo}s`, x, h - 4);
    }

    // Draw each metric
    for (const metric of metrics) {
      const points = windowedData.map((d, i) => {
        const x = PADDING.left + (chartW / (windowedData.length - 1)) * i;
        const val = d[metric.key] as number;
        const y = PADDING.top + chartH - ((val - globalMin) / range) * chartH;
        return { x, y, val };
      });

      if (metric.fill) {
        // Area fill
        const gradient = ctx.createLinearGradient(0, PADDING.top, 0, PADDING.top + chartH);
        gradient.addColorStop(0, hexToRgba(metric.color, 0.25));
        gradient.addColorStop(1, hexToRgba(metric.color, 0.02));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(points[0].x, PADDING.top + chartH);
        for (const p of points) ctx.lineTo(p.x, p.y);
        ctx.lineTo(points[points.length - 1].x, PADDING.top + chartH);
        ctx.closePath();
        ctx.fill();
      }

      // Line
      ctx.strokeStyle = metric.color;
      ctx.lineWidth = 1.5;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.stroke();

      // Last point dot
      const last = points[points.length - 1];
      ctx.fillStyle = metric.color;
      ctx.beginPath();
      ctx.arc(last.x, last.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Value label at end of line
      ctx.fillStyle = metric.color;
      ctx.font = 'bold 10px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      const label = `${metric.label}: ${last.val} ${metric.unit}`;
      ctx.fillText(label, last.x + 8, last.y + 4);
    }

    // Legend
    let legendX = w - PADDING.right - 10;
    ctx.textAlign = 'right';
    for (let i = metrics.length - 1; i >= 0; i--) {
      const m = metrics[i];
      const y = 14 + i * 14;
      ctx.fillStyle = m.color;
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText(m.label, legendX, y);
    }
  }, [data, metrics, rollingWindowSec, title, subtitle]);

  useEffect(() => {
    draw();

    const animate = () => {
      draw();
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animFrameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw]);

  return (
    <div className="bento-card overflow-hidden p-0" style={{ height }}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
