# Mutual Fund Explorer

A professional Next.js application for exploring mutual funds with SIP calculator, lumpsum calculator, and advanced analytics.

## Features

- 🔍 **Fund Search & Filtering** - Search and filter from thousands of mutual funds
- 📊 **Interactive Charts** - Visualize NAV history and performance
- 💰 **SIP Calculator** - Calculate returns for Systematic Investment Plans
- 💵 **Lumpsum Calculator** - Compare one-time investment returns
- 📉 **SWP Calculator** - Simulate Systematic Withdrawal Plans
- 📈 **Performance Analytics** - View returns across multiple time periods
- 🎨 **Professional UI** - Built with Material UI for a modern experience

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework with API routes
- **TypeScript** - Type-safe development
- **Material UI (MUI)** - Professional component library
- **MUI X Charts** - Data visualization
- **MFAPI.in** - Mutual fund data source

## API Routes

- `GET /api/mf` - List all mutual fund schemes
- `GET /api/scheme/[code]` - Get scheme details and NAV history
- `GET /api/scheme/[code]/returns` - Calculate returns for a period
- `POST /api/scheme/[code]/sip` - Calculate SIP returns
- `POST /api/scheme/[code]/lumpsum` - Calculate lumpsum returns
- `POST /api/scheme/[code]/swp` - Calculate SWP projections

## License

MIT
