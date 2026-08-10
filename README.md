<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TS">
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux&logoColor=white" alt="Redux">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/tests-37/37_passing-10B981?logo=vitest&logoColor=white" alt="Tests">
  <img src="https://img.shields.io/badge/license-Apache_2.0-blue" alt="License">
</div>

<br>

<h1 align="center">⚡ KWh Meter Monitoring</h1>

<p align="center">
  <b>Professional Real-Time Electricity Monitoring Dashboard</b><br>
  Task Manager–style scrolling charts • Live 4‑second polling • CORS proxy • Fully responsive
</p>

<br>

---

## 📸 Preview

> Dashboard with dark bento-grid UI, 4 metric cards, 3 Task Manager–style Canvas charts, and real‑time system status.

```
┌──────────────────────────────────────────────────┐
│  HEADER  ⚡ Online · Update: 3s · ⚙️ Settings    │
├──────────┬──────────┬──────────┬─────────────────┤
│ ⚡ 227.5V│ 🔌 0.06A │ 💡 0.0W  │ 🪙 0.00 kWh    │
│ Normal   │ Ringan   │ Rp 0/jam │ KRITIS          │
├──────────┴──────────┴──────────┴─────────────────┤
│ ⚡ Voltage (60‑sec scrolling)                    │
│ ┌──────────────────────────────────────────┐     │
│ │  ▂▂▃▄▅▆▇█▇▆▅▄▃▂  Tegangan: 227.5 V    │     │
│ └──────────────────────────────────────────┘     │
│ 🔌 Power (Daya + Arus overlay)                   │
│ ┌──────────────────────────────────────────┐     │
│ │  ═══ Daya ··· Arus   Daya: 0.0 W        │     │
│ └──────────────────────────────────────────┘     │
│                           🪙 Token · System Info │
└──────────────────────────────────────────────────┘
```

---

## ✨ Features

<table>
<tr><td width="50%">

### 📊 Real‑Time Monitoring
- **4 live metric cards** — Voltage, Current, Power, Token
- **Auto‑polling** every 4 seconds (configurable 2‑60s)
- **Delta indicators** — voltage deviation, load %, cost per hour
- **Token estimation** — remaining days based on current draw

### 🎛️ Task Manager–Style Charts
- **Smooth 60 fps Canvas rendering** — zero library overhead
- **Scrolling 60‑second window** — like Windows Task Manager
- **3 panels**: Voltage (CPU style), Power overlay, Token decline
- **Grid lines + time axis + value labels** — professional telemetry

</td><td width="50%">

### 🌐 Connectivity
- **Direct API** → auto‑fallback to **CORS proxy**
- **Express proxy** (local) + **Vercel serverless** (production)
- **Online/Offline badge** with ping animation
- **Error banner** with auto‑dismiss

### 💾 Data & Settings
- **localStorage persistence** — survives page refresh
- **Config modal** — device ID, API URL, interval
- **Demo mode** — simulated data for offline testing
- **Raw JSON inspector** — debug API responses

### 📱 UI/UX
- **Dark bento‑grid** design — glassmorphism, gradient backgrounds
- **Fully responsive** — mobile, tablet, desktop
- **Flash animations** on value change
- **Custom scrollbars** — indigo accent

</td></tr>
</table>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────┐
│              Redux Store                  │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐   │
│  │ config  │ │ system  │ │  chart   │   │
│  │ Slice   │ │ Slice   │ │  Slice   │   │
│  ├─────────┤ ├─────────┤ ├──────────┤   │
│  │deviceId │ │isOnline │ │history[] │   │
│  │interval │ │latency  │ │metric    │   │
│  │demoMode │ │success  │ │(max 20)  │   │
│  └─────────┘ └─────────┘ └──────────┘   │
│  ┌──────────────────────────────────┐    │
│  │         historySlice             │    │
│  │  5000 data points → localStorage │    │
│  └──────────────────────────────────┘    │
│  ┌──────────────────────────────────┐    │
│  │    RTK Query — kwhApi            │    │
│  │  auto‑polling · cache · retry    │    │
│  │  direct API → proxy fallback     │    │
│  └──────────────────────────────────┘    │
└──────────────────────────────────────────┘
         │                    │
    ┌────▼────┐         ┌────▼────┐
    │ Direct  │  CORS   │  Proxy  │
    │  API    │──fail──▶│ /api/   │
    │ pojiweb │         │ kwh-    │
    │ .online │         │ proxy   │
    └─────────┘         └─────────┘
```

### Component Tree

```
<App>
  <ConfigModal />
  <DashboardLayout>
    <Header>
      <DeviceIdBadge />  <StatusBadge />
      <CountdownTimer />  <IconButton />×2
    </Header>
    <ErrorBanner />  <LowTokenBanner />
    <section>  ← 4 Metric Cards
      <VoltageCard /> <CurrentCard />
      <PowerCard />   <TokenCard />
    </section>
    <section>  ← Charts
      <CPUPanel />     <PowerPanel />
      <TokenPanel />   <SystemInfo />
    </section>
    <Footer />
  </DashboardLayout>
</App>
```

---

## 📁 Project Structure

```
kwh-meter-monitoring/
├── api/
│   └── kwh-proxy.js              # Vercel serverless proxy
├── src/
│   ├── main.tsx                  # Entry point
│   ├── App.tsx                   # Root component
│   ├── index.css                 # Tailwind + custom styles
│   │
│   ├── components/
│   │   ├── alerts/               # ErrorBanner, LowTokenBanner
│   │   ├── charts/               # TaskManagerChart, CPUPanel, PowerPanel, TokenPanel
│   │   ├── layout/               # DashboardLayout, Header, Footer
│   │   ├── metrics/              # MetricCard, Voltage/Current/Power/TokenCard
│   │   ├── settings/             # ConfigModal, DeviceIdBadge
│   │   ├── system/               # StatusBadge, CountdownTimer, SystemInfo
│   │   └── ui/                   # BentoCard, Spinner, IconButton
│   │
│   ├── lib/                      # Pure functions
│   │   ├── calculations.ts       # Voltage delta, cost, load, token estimation
│   │   ├── formatters.ts         # Number, currency, timestamp formatting
│   │   ├── chartRenderer.ts      # Canvas drawing engine
│   │   ├── statsCalculator.ts    # Hourly/daily/heatmap aggregation
│   │   └── __tests__/            # 25 unit tests
│   │
│   ├── store/
│   │   ├── index.ts              # configureStore
│   │   ├── hooks.ts              # Typed useSelector / useDispatch
│   │   ├── api/
│   │   │   └── kwhApi.ts         # RTK Query endpoint + proxy fallback
│   │   ├── middleware/
│   │   │   └── persistMiddleware.ts  # localStorage auto‑save
│   │   ├── slices/
│   │   │   ├── configSlice.ts    # Device ID, interval, demo mode
│   │   │   ├── systemSlice.ts    # Online status, latency, counts
│   │   │   ├── chartSlice.ts     # 20‑point realtime buffer
│   │   │   └── historySlice.ts   # 5000‑point persistent storage
│   │   └── __tests__/            # 12 slice tests
│   │
│   └── types/
│       ├── meterData.ts          # MeterData, DataPoint
│       ├── apiResponse.ts        # API response shapes
│       └── config.ts             # ChartMetric, AppConfig
│
├── server.ts                     # Express dev/prod server
├── vite.config.ts                # Vite + Tailwind + Vitest config
├── vercel.json                   # Vercel deployment config
├── tsconfig.json                 # TypeScript strict config
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Install & Run

```bash
# Clone
git clone https://github.com/kevinadisuryanugraha/kwhMonitor.git
cd kwhMonitor

# Install dependencies
npm install

# Start development server
npm run dev
# → http://localhost:3000
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```env
GEMINI_API_KEY="your_api_key"   # Optional — for AI features
APP_URL="http://localhost:3000"  # App base URL
```

---

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build (`dist/`) |
| `npm start` | Serve production build |
| `npm run lint` | TypeScript type check |
| `npx vitest run` | Run all 37 tests |

---

## 🧪 Testing

```
✅ 5 test files
✅ 37 tests passing
✅ TypeScript strict mode — 0 errors
```

```bash
npx vitest run

# Test Files  5 passed (5)
# Tests      37 passed (37)
```

### Test Coverage

| Layer | Framework | Tests |
|-------|-----------|:-----:|
| Pure functions | Vitest | 25 |
| Redux slices | Vitest | 12 |
| Components | In‑progress | – |

---

## 🌍 Deployment

### Vercel (Recommended)

```bash
# CLI
vercel login
vercel --prod

# Dashboard
# 1. vercel.com/import
# 2. Select repo → Deploy
```

### Any Static Host (Netlify, Firebase, etc.)

```bash
npm run build
# Upload dist/ folder
```

### Self‑Hosted

```bash
npm run build
npm start
# → http://0.0.0.0:3000
```

---

## 🔌 API Reference

### Data Source

```
GET https://kwhmeter2.pojiweb.online/api/web/data?id={deviceId}

Response:
{
  "success": true,
  "data": {
    "v": 227.5,    // Voltage (V)
    "a": 0.06,     // Current (A)
    "w": 0.0,      // Power (W)
    "sld": 0.00    // Token balance (kWh)
  }
}
```

### Proxy Fallback

When CORS blocks the direct API call, the app automatically routes through:

```
GET /api/kwh-proxy?id={deviceId}
```

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Font | Plus Jakarta Sans + JetBrains Mono |
| Background | Slate‑950 with indigo/cyan/purple radial gradients |
| Cards | Glassmorphism — rgba(30,41,59,0.5) + 24px radius |
| Accent | Indigo‑500 (hover border glow) |
| Charts | Dark canvas (#0f172a) + subtle grid |

### Color Palette

| Metric | Color | Hex |
|--------|-------|-----|
| Voltage | Cyan | `#06b6d4` |
| Current | Amber | `#f59e0b` |
| Power | Emerald | `#10b981` |
| Token | Purple | `#a855f7` |

---

## 📄 License

Apache 2.0 — see [LICENSE](LICENSE)

---

<div align="center">
  <b>Built with ⚡ by Kevin Adisurya Nugraha</b><br>
  <sub>React 19 · Redux Toolkit · Canvas API · Tailwind CSS</sub>
</div>
