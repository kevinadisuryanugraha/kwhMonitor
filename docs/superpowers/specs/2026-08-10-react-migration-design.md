# Sub-Proyek #1: Migrasi React + Arsitektur Ulang

**Tanggal:** 2026-08-10  
**Status:** Approved — Menunggu Implementation Plan  
**Cakupan:** KWh Meter Monitoring — Full Rewrite ke React + Redux Toolkit

---

## 1. Tujuan

Migrasi seluruh logika aplikasi dari vanilla JavaScript di `index.html` ke arsitektur React + TypeScript + Redux Toolkit yang modern dan scalable. Ini adalah fondasi untuk semua sub-proyek fitur berikutnya (Billing Engine, AI Insights, Histori, Multi-Device, Notifikasi, Export).

---

## 2. Pendekatan: Full Rewrite (Opsi A)

**Keputusan:** Bangun ulang dari nol menggunakan React 19 + TypeScript. Hapus semua vanilla JS dari `index.html`. Aplikasi menjadi fully React-based SPA.

**Alasan:**
- Kode existing seluruhnya dalam 1 file `index.html` (46KB) — tidak scalable untuk fitur berikutnya
- DOM manipulation manual akan konflik dengan fitur kompleks yang butuh state isolation
- TypeScript memberikan type safety untuk kalkulasi billing yang rawan bug
- Gemini SDK, React, dan Vite sudah tersedia di project

---

## 3. Tech Stack

| Teknologi | Versi | Peran |
|-----------|-------|-------|
| React | 19.0.1 | UI Component Library |
| TypeScript | ~5.8.2 | Type safety |
| Redux Toolkit + RTK Query | (baru) | State management + API fetching/caching |
| Vite | 6.2.3 | Build tool & dev server |
| Tailwind CSS | 4.1.14 | Utility-first CSS |
| Lucide React | 0.546.0 | Icon library |
| Motion | 12.23.24 | Animasi (opsional, pengganti CSS animation) |
| Express | 4.21.2 | CORS proxy server |

---

## 4. Folder Structure

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root component + router
├── index.css                         # Tailwind + custom base styles
│
├── components/
│   ├── layout/
│   │   ├── DashboardLayout.tsx       # Grid layout utama
│   │   ├── Header.tsx               # Logo, status, controls
│   │   └── Footer.tsx               # Demo toggle, copyright
│   │
│   ├── metrics/
│   │   ├── MetricCard.tsx           # Card reusable
│   │   ├── VoltageCard.tsx
│   │   ├── CurrentCard.tsx
│   │   ├── PowerCard.tsx
│   │   └── TokenCard.tsx
│   │
│   ├── chart/
│   │   ├── RealtimeChart.tsx        # Canvas chart wrapper
│   │   ├── ChartControls.tsx        # Filter button V/A/W/Token
│   │   └── useChartRenderer.ts      # Canvas drawing hook
│   │
│   ├── system/
│   │   ├── SystemInfo.tsx           # Latency, success count, updated time
│   │   ├── JsonInspector.tsx        # Raw JSON drawer
│   │   ├── StatusBadge.tsx          # Online/offline badge
│   │   └── CountdownTimer.tsx       # Polling countdown display
│   │
│   ├── alerts/
│   │   ├── ErrorBanner.tsx          # Error notification banner
│   │   └── LowTokenBanner.tsx       # Token < 10 kWh warning
│   │
│   ├── settings/
│   │   ├── ConfigModal.tsx          # Device ID & polling settings modal
│   │   └── DeviceIdBadge.tsx        # Device ID display di header
│   │
│   └── ui/
│       ├── BentoCard.tsx            # Bento glass card wrapper
│       ├── Spinner.tsx
│       └── IconButton.tsx
│
├── store/
│   ├── index.ts                     # ConfigureStore
│   ├── hooks.ts                     # Typed useDispatch/useSelector
│   │
│   ├── api/
│   │   └── kwhApi.ts               # RTK Query: endpoint, polling, transform
│   │
│   └── slices/
│       ├── configSlice.ts           # Device ID, API URL, polling interval
│       ├── systemSlice.ts           # Online status, success count, demo mode
│       └── chartSlice.ts            # Active metric, history data (max 20)
│
├── lib/
│   ├── calculations.ts              # Billing, delta %, load %, token estimation
│   ├── formatters.ts                # Number formatting, currency, date
│   └── chartRenderer.ts             # Canvas drawing logic (pure functions)
│
└── types/
    ├── meterData.ts                  # MeterData interface
    ├── apiResponse.ts               # API response types
    └── config.ts                    # Config types
```

---

## 5. Component Tree

```
<App>
  <ConfigModal />
  <DashboardLayout>
    <Header>
      <DeviceIdBadge />
      <StatusBadge />
      <CountdownTimer />
      <IconButton />       ← Refresh
      <IconButton />       ← Settings
    </Header>

    <ErrorBanner />
    <LowTokenBanner />

    <main>                  ← 4-column bento grid
      <VoltageCard />
      <CurrentCard />
      <PowerCard />
      <TokenCard />
    </main>

    <section>               ← 3-column (2+1) grid
      <div>                 ← spans 2 cols
        <ChartControls />
        <RealtimeChart />
        <ChartLegend />
      </div>
      <div>                 ← spans 1 col
        <SystemInfo />
        <JsonInspector />
      </div>
    </section>

    <Footer />
  </DashboardLayout>
</App>
```

---

## 6. State Management — Redux Store

### 6.1 RTK Query: `kwhApi.ts`

```typescript
// Endpoint auto-generated hooks:
useGetMeterDataQuery(deviceId, { pollingInterval: 4000 })
// Returns: { data, error, isLoading, isFetching }
```

- **Polling** otomatis sesuai `configSlice.intervalSec` detik
- **Cache** data terakhir — jika network error, UI tetap render data sebelumnya
- **Fallback logic:** direct API gagal → retry via `baseUrl: '/api/kwh-proxy'`
- **Tag invalidation:** setiap polling baru → auto re-render subscriber components

### 6.2 Redux Slices

| Slice | State | Actions |
|-------|-------|---------|
| `configSlice` | `deviceId: string`, `apiUrl: string`, `intervalSec: number`, `isDemoMode: boolean` | `setDeviceId()`, `setInterval()`, `setApiUrl()`, `toggleDemo()` |
| `systemSlice` | `isOnline: boolean`, `successCount: number`, `latency: number`, `lastUpdated: string` | `updateSystemMetrics()`, `setOnlineStatus()`, `incrementSuccess()` |
| `chartSlice` | `activeMetric: 'v'\|'a'\|'w'\|'sld'`, `history: DataPoint[]` (max 20) | `pushDataPoint()`, `setActiveMetric()` |

### 6.3 Data Flow per Component

```
Header                  ← useSelector(systemSlice)
  StatusBadge            ← isOnline → green/red
  DeviceIdBadge          ← useSelector(configSlice).deviceId

MetricCard ×4           ← useSelector(kwhApi.data)
  VoltageCard            ← data.v → format + delta calculation
  CurrentCard            ← data.a → load % calculation
  PowerCard              ← data.w → cost calculation
  TokenCard              ← data.sld → days estimation

RealtimeChart           ← useSelector(chartSlice)
                          ← dispatch(pushDataPoint) via useEffect on kwhApi.data change

SystemInfo              ← useSelector(systemSlice).{latency, successCount, lastUpdated}

ErrorBanner             ← useSelector(kwhApi.error) → conditional render
LowTokenBanner          ← useSelector(kwhApi.data).sld < 10 → conditional render
```

### 6.4 Re-render Strategy

Setiap komponen menggunakan `useSelector` dengan selector spesifik — hanya komponen yang field datanya berubah yang re-render:

- `VoltageCard`: hanya saat `data.v` berubah
- `CurrentCard`: hanya saat `data.a` berubah
- `PowerCard`: hanya saat `data.w` berubah
- `TokenCard`: hanya saat `data.sld` berubah
- `RealtimeChart`: hanya saat `chartSlice.history` berubah
- `Header/StatusBadge`: hanya saat `systemSlice.isOnline` berubah

---

## 7. Error Handling

### 7.1 API Error Layers

| Layer | Mekanisme |
|-------|-----------|
| **RTK Query** | Auto-detect network error, HTTP error (4xx/5xx), parse error. Disediakan via `{ error }` dari hook. |
| **Retry & Fallback** | Direct API fail → retry via CORS proxy. Proxy fail → exponential backoff (1s, 2s, 4s). All fail → render data cache terakhir. |
| **UI Response** | ErrorBanner tampil dengan pesan spesifik. StatusBadge ONLINE→OFFLINE (merah). MetricCards tetap render data cache dengan opacity 50%. Auto-dismiss banner setelah 5 detik. |

### 7.2 Error States per Komponen

| Komponen | Loading | Empty | Error | Edge Case |
|---|---|---|---|---|
| `MetricCard` | Skeleton pulse | `--` abu-abu | Data cache + 50% opacity | NaN/undefined → `--` |
| `RealtimeChart` | "Mengumpulkan data..." | Garis kosong + label | Render data cache | `history < 2` → placeholder |
| `StatusBadge` | Pulsing amber | Grey "Unknown" | Red "Offline" | Transisi smooth |
| `SystemInfo` | Spinner kecil | "Belum ada data" | "Gagal: {msg}" | Latency >10s → ">10s" |
| `JsonInspector` | "Menunggu data..." | `{}` kosong | `{"error":"..."}` | JSON besar → scrollable |

### 7.3 Data Validation (TypeScript Guard)

```typescript
interface MeterData {
  v: number;   // range: 180-260
  a: number;   // range: 0-15
  w: number;   // range: 0-5000
  sld: number; // range: 0-999999
}

// RTK Query transformResponse akan validasi semua field.
// Nilai NaN/null/undefined difallback ke 0.
// Nilai di luar range wajar tetap ditampilkan + warning badge.
```

---

## 8. Testing Strategy

| Layer | Tool | Cakupan |
|-------|------|---------|
| **Unit Test** | Vitest | `calculations.ts`, `formatters.ts`, `chartRenderer.ts`, Redux slices & reducers |
| **Component Test** | Vitest + React Testing Library | Render tiap component dengan mock Redux store, test semua states: loading/empty/error/edge |
| **Integration Test** | Vitest + RTK mock | Full flow: fetch → transform → render card. Test fallback proxy. Test demo mode. |

---

## 9. Acceptance Criteria

- [ ] Aplikasi berjalan 100% via React, **nol** vanilla DOM manipulation
- [ ] Semua fitur existing berfungsi identik: polling, 4 metric cards, chart, config modal, demo mode, JSON inspector
- [ ] Error handling: banner muncul saat offline, data cache tetap tampil
- [ ] Status online/offline berubah realtime
- [ ] TypeScript strict mode — **nol** `any` type
- [ ] Responsive: mobile/desktop layout tidak pecah
- [ ] `npm run dev` dan `npm run build` sukses tanpa error
- [ ] Lighthouse performance score tidak turun dari existing

---

## 10. Dependencies Baru

Tambahkan ke `package.json`:

```json
{
  "@reduxjs/toolkit": "^2.x",
  "react-redux": "^9.x"
}
```

Dev dependencies:

```json
{
  "vitest": "^2.x",
  "@testing-library/react": "^16.x",
  "@testing-library/jest-dom": "^6.x",
  "jsdom": "^25.x"
}
```

---

## 11. Yang Tidak Berubah

- `server.ts` — Express CORS proxy tetap sama
- `vite.config.ts` — Konfigurasi Vite tetap
- `tsconfig.json` — TypeScript config tetap
- Tailwind custom theme & CSS variables (dipindah ke `index.css` dengan sintaks Tailwind v4 `@theme`)
- Font: Plus Jakarta Sans + JetBrains Mono via Google Fonts
- Skema warna brand: cyan (voltage), amber (current), emerald (power), purple (token)

---

## 12. Transisi ke Sub-Proyek Berikutnya

Setelah Sub-Proyek #1 selesai dan diverifikasi:

```
✅ #1 React Migration
        │
        ├── ▶ #2 Billing Engine
        │
        └── ▶ #3 Histori & Data Storage
                        │
                        ▼
                 #4 AI Insights → #5 Notifikasi → #6 Multi-Device → #7 Export
```
