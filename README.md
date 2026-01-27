# Market Risk Dashboard

Real-time financial market monitoring dashboard for tracking carry trade dynamics, safe havens, and systemic risk indicators.

![Dashboard Preview](https://img.shields.io/badge/status-live-brightgreen)

## Features

- **Live Market Data** - Auto-refreshes every 30 seconds
- **20 Key Indicators** across 5 categories:
  - Fear & Volatility (VIX, Treasury Yields)
  - Currencies (DXY, USD/JPY, EUR/USD, USD/CAD)
  - Safe Havens (Gold, Silver, Bitcoin, Oil)
  - Equities (S&P 500, Dow, NASDAQ, Nikkei)
  - Banks (JPM, BAC, MUFG, KRE)
- **Click-to-Chart** - Each ticker opens full TradingView chart
- **Reference Guide** - Built-in danger levels and pattern recognition
- **Dark Theme** - Optimized for monitoring

## Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/market-dashboard)

### Option 2: Manual Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/market-dashboard.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"
   - Done! Your dashboard is live.

## Project Structure

```
market-dashboard/
├── api/
│   └── quotes.js      # Serverless function to fetch Yahoo Finance data
├── public/
│   └── index.html     # Dashboard UI
├── package.json
├── vercel.json        # Vercel configuration
└── README.md
```

## Key Indicators Reference

### VIX (Fear Index)
| Level | Status |
|-------|--------|
| 12-15 | Calm |
| 15-20 | Normal |
| 20-30 | Elevated |
| 30+ | Fear |
| 40+ | Panic |

### USD/JPY (Carry Trade)
| Level | Status |
|-------|--------|
| 158+ | Yen Weak (Safe) |
| 150-158 | Watch Zone |
| <150 | Unwind Pressure |
| <145 | Crisis Territory |

### DXY (Dollar Index)
| Level | Status |
|-------|--------|
| 105+ | Strong Dollar |
| 100-105 | Normal |
| <100 | Weak |
| <96 | Very Weak |

### Warning Patterns
- **"Sell America"**: DXY↓ + Yields↑ + Gold↑
- **Risk Off**: VIX↑ + Stocks↓ + Gold↑
- **Carry Unwind**: JPY↑ + Banks↓ + VIX↑
- **Flight to Safety**: Gold↑ + Yields↓

## Data Source

Market data fetched from Yahoo Finance via serverless API. Data refreshes every 30 seconds.

**Note**: Japan 10Y yield may require alternative data source as Yahoo Finance coverage is limited.

## Local Development

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

## License

MIT - Use freely for personal monitoring.

---

Built for monitoring yen carry trade dynamics and global market risk.
