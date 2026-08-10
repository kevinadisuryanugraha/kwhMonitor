import type { HistoryDataPoint } from '../store/slices/historySlice';

export interface HourlyAverage {
  hour: string;  // e.g., "14:00"
  v: number;
  a: number;
  w: number;
  sld: number;
  count: number;
}

export interface DailyTotal {
  date: string;  // e.g., "2026-08-10"
  totalKwh: number;
  avgW: number;
  peakW: number;
  minW: number;
  samples: number;
}

/** Average hourly aggregation for last 24 hours (bar chart) */
export function aggregateHourly(points: HistoryDataPoint[]): HourlyAverage[] {
  const now = Date.now();
  const cutoff = now - 24 * 60 * 60 * 1000;

  const recent = points.filter((p) => p.timestamp >= cutoff);
  const buckets: Record<string, { v: number; a: number; w: number; sld: number; count: number }> = {};

  for (const p of recent) {
    const date = new Date(p.timestamp);
    const hour = `${String(date.getHours()).padStart(2, '0')}:00`;
    if (!buckets[hour]) {
      buckets[hour] = { v: 0, a: 0, w: 0, sld: 0, count: 0 };
    }
    buckets[hour].v += p.v;
    buckets[hour].a += p.a;
    buckets[hour].w += p.w;
    buckets[hour].sld += p.sld;
    buckets[hour].count++;
  }

  return Object.entries(buckets)
    .map(([hour, data]) => ({
      hour,
      v: round(data.v / data.count, 1),
      a: round(data.a / data.count, 2),
      w: round(data.w / data.count, 1),
      sld: round(data.sld / data.count, 2),
      count: data.count,
    }))
    .sort((a, b) => a.hour.localeCompare(b.hour));
}

/** Daily power totals for last 7 days (for heatmap and daily bar) */
export function aggregateDaily(points: HistoryDataPoint[]): DailyTotal[] {
  const now = Date.now();
  const cutoff = now - 7 * 24 * 60 * 60 * 1000;

  const recent = points.filter((p) => p.timestamp >= cutoff);
  const buckets: Record<string, { totalW: number; peakW: number; minW: number; count: number }> = {};

  for (const p of recent) {
    const date = new Date(p.timestamp);
    const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (!buckets[day]) {
      buckets[day] = { totalW: 0, peakW: 0, minW: Infinity, count: 0 };
    }
    buckets[day].totalW += p.w;
    buckets[day].peakW = Math.max(buckets[day].peakW, p.w);
    buckets[day].minW = Math.min(buckets[day].minW, p.w);
    buckets[day].count++;
  }

  return Object.entries(buckets)
    .map(([date, data]) => ({
      date,
      totalKwh: round((data.totalW / data.count) * 24 / 1000, 2), // estimated daily kWh
      avgW: round(data.totalW / data.count, 1),
      peakW: data.peakW,
      minW: data.minW === Infinity ? 0 : data.minW,
      samples: data.count,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function round(val: number, decimals: number): number {
  return parseFloat(val.toFixed(decimals));
}

/** Heatmap data: day x hour grid */
export function aggregateHeatmap(points: HistoryDataPoint[]): { day: number; hour: number; value: number }[] {
  const now = Date.now();
  const cutoff = now - 7 * 24 * 60 * 60 * 1000;

  const recent = points.filter((p) => p.timestamp >= cutoff);
  const grid: Record<string, { total: number; count: number }> = {};

  for (const p of recent) {
    const date = new Date(p.timestamp);
    const day = date.getDay(); // 0=Sunday
    const hour = date.getHours();
    const key = `${day}-${hour}`;
    if (!grid[key]) {
      grid[key] = { total: 0, count: 0 };
    }
    grid[key].total += p.w;
    grid[key].count++;
  }

  return Object.entries(grid).map(([key, data]) => {
    const [day, hour] = key.split('-').map(Number);
    return { day, hour, value: Math.round(data.total / data.count) };
  });
}
