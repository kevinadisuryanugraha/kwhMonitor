# ⚡ KWh Meter Monitoring

Professional real-time KWh meter monitoring dashboard with live API updates, Task Manager-style scrolling charts, and professional dark-themed UI.

## Features

- 🔴 **Real-time Monitoring** — 4-second polling with live metric cards (Voltage, Current, Power, Token)
- 📊 **Task Manager Style Charts** — Smooth 60-second scrolling Canvas charts like Windows Task Manager
- 🌐 **CORS Proxy** — Automatic API fallback via serverless proxy
- 🎛️ **Configurable** — Custom device ID, API URL, poll interval
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🎮 **Demo Mode** — Simulated data for offline testing
- 💾 **Data Persistence** — Auto-saves history to localStorage

## Tech Stack

- React 19 + TypeScript
- Redux Toolkit + RTK Query
- Vite + Tailwind CSS v4
- Canvas API (zero charting library)
- Express + Vercel serverless

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
```

## Deploy

```bash
npm run build      # outputs to dist/
vercel --prod      # or deploy dist/ to any static host
```

## Project Structure

```
src/
├── components/
│   ├── charts/       # Task Manager-style Canvas charts
│   ├── layout/       # Header, Footer, Dashboard
│   ├── metrics/      # Voltage, Current, Power, Token cards
│   ├── alerts/       # Error & low token banners
│   ├── system/       # Status badge, countdown, system info
│   ├── settings/     # Config modal
│   └── ui/           # BentoCard, Spinner, IconButton
├── store/            # Redux + RTK Query
├── lib/              # Calculations, formatters, stats
└── types/            # TypeScript interfaces
```
