# Professional Charts + Data Persistence

**Tanggal:** 2026-08-10  
**Status:** Approved  
**Cakupan:** 6 tipe grafik profesional + localStorage persistence + Recharts library

---

## Goal

Tambahkan 6 jenis grafik profesional untuk monitoring listrik realtime, dengan data persistence via localStorage agar grafik historis punya data asli untuk ditampilkan.

## Approach

**Canvas + Recharts hybrid**: Canvas untuk realtime (tetap ringan), Recharts untuk grafik interaktif (Line, Bar, Area, Pie/Donut). Data disimpan ke localStorage via Redux middleware.

## Tech

| Layer | Teknologi |
|-------|-----------|
| Chart library | Recharts 2.x |
| Data buffer | Redux `historySlice` + localStorage |
| Middleware | Custom persist middleware |
| Aggregation | `statsCalculator.ts` (pure functions) |
| Donut gauge | Recharts PieChart (custom label) |
| Heatmap | CSS grid + inline style (tanpa library) |

## Charts

| # | Chart | Library | Size |
|---|-------|---------|------|
| 1 | Realtime Line (upgrade) | Canvas | Full width |
| 2 | Multi-Series Line (V+A+W) | Recharts | 2-col left |
| 3 | Bar Pemakaian (24 jam) | Recharts | 2-col right |
| 4 | Gauge Donut ×4 | Recharts | 4 cards |
| 5 | Area Stacked | Recharts | Full width |
| 6 | Heatmap (7h×24h) | CSS Grid | Full width |

## Data Persistence

- `historySlice`: simpan semua DataPoint + timestamp epoch
- LocalStorage middleware: auto-save tiap 10 point, auto-load di init
- `statsCalculator`: aggregate hourly average, daily total dari data mentah

## File Changes

| Action | File |
|--------|------|
| NEW | `src/store/slices/historySlice.ts` |
| NEW | `src/store/middleware/persistMiddleware.ts` |
| NEW | `src/lib/statsCalculator.ts` |
| NEW | `src/components/charts/MultiSeriesChart.tsx` |
| NEW | `src/components/charts/BarUsageChart.tsx` |
| NEW | `src/components/charts/GaugeDonut.tsx` |
| NEW | `src/components/charts/GaugeRow.tsx` |
| NEW | `src/components/charts/AreaStackedChart.tsx` |
| NEW | `src/components/charts/HeatmapChart.tsx` |
| MODIFY | `src/store/index.ts` (tambah historySlice + middleware) |
| MODIFY | `src/App.tsx` (tambah section chart baru) |
| MODIFY | `src/components/chart/RealtimeChart.tsx` (upgrade) |
