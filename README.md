# CoinScope

A responsive cryptocurrency tracking platform built with React and the CoinGecko API. CoinScope lets users search, track, and analyze live crypto market data through an interactive dashboard, detailed coin pages, and a multi-tab analysis modal.

**Live demo:** [coinscopee.netlify.app](https://coinscopee.netlify.app)

---

## Features

- **Live Market Dashboard** — global market cap, 24h trading volume, and BTC/ETH dominance, updated in real time
- **Smart Search** — debounced search with live dropdown suggestions across top cryptocurrencies
- **Coin Detail Pages** — interactive price charts (1D/7D/30D/90D/1Y), market stats, supply data, and project links
- **Analysis Modal** — a 3-tab view (Overview, Analysis, Sentiment) combining price charts, support/resistance levels, and basic market-sentiment indicators
- **Graceful API Fallbacks** — falls back to cached/demo data when the CoinGecko free-tier rate limit is hit, so the UI never breaks
- **Fully Responsive** — tested across mobile, tablet, and desktop breakpoints

---

## Tech Stack

| Category | Tools |
|---|---|
| Frontend | React 19, React Router DOM |
| Styling | Tailwind CSS v4 |
| Charts | Chart.js, react-chartjs-2 |
| Icons | Lucide React |
| HTTP Client | Axios |
| Data Source | [CoinGecko API](https://www.coingecko.com/en/api) (free tier) |
| Build Tool | Vite |
| Linting | ESLint (with React Hooks + React Refresh plugins) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/ayushhmsr/CoinScope.git
cd CoinScope
npm install
```

### Run locally

```bash
npm run dev
```

App runs at `http://localhost:5173` by default.

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
CoinScope/
├── public/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level pages
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Notes on API Usage

This project uses the free tier of the CoinGecko API, which has rate limits. When a request fails or is rate-limited, the app falls back to realistic mock data so the interface remains functional during development and demos.

---

## Author

**Ayush Kumar Mishra**
[Portfolio](https://ayushkumarmishra.netlify.app/) · [LinkedIn](https://www.linkedin.com/in/ayushkumarmishra2004) · [GitHub](https://github.com/ayushhmsr)

