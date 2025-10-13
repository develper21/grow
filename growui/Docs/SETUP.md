# Setup Guide - Mutual Fund Explorer

## Quick Start

Follow these steps to get your application running:

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- Material UI (MUI) v5
- MUI X Charts
- TypeScript
- Axios
- Date-fns

### 2. Run Development Server

```bash
npm run dev
```

The application will start at [http://localhost:3000](http://localhost:3000)

### 3. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── NAVChart.tsx    # NAV history chart
│   ├── ReturnsTable.tsx # Returns display table
│   ├── SIPCalculator.tsx
│   ├── LumpsumCalculator.tsx
│   ├── SWPCalculator.tsx
│   └── ComparisonCalculator.tsx
├── pages/
│   ├── _app.tsx        # App wrapper with theme
│   ├── _document.tsx   # HTML document
│   ├── index.tsx       # Home page
│   ├── 404.tsx         # 404 error page
│   ├── funds/
│   │   └── index.tsx   # Fund listing page
│   ├── scheme/
│   │   └── [code].tsx  # Scheme detail page
│   └── api/            # API routes
│       ├── mf.ts       # List all schemes
│       └── scheme/
│           ├── [code].ts        # Scheme details
│           └── [code]/
│               ├── returns.ts   # Returns calculator
│               ├── sip.ts       # SIP calculator
│               ├── lumpsum.ts   # Lumpsum calculator
│               └── swp.ts       # SWP calculator
├── theme/
│   └── theme.ts        # MUI theme configuration
├── types/
│   └── index.ts        # TypeScript type definitions
└── utils/
    ├── cache.ts        # In-memory caching
    └── calculations.ts # Financial calculations

```

## Features

### 1. Fund Explorer
- Browse thousands of mutual funds
- Search by fund name
- Filter by category (Equity, Debt, Hybrid, ELSS, etc.)
- Paginated results for better performance

### 2. Scheme Details
- Complete fund information
- Current NAV with historical data
- Interactive NAV charts with multiple time periods
- Historical returns (1M, 3M, 6M, 1Y, 3Y, 5Y)

### 3. SIP Calculator
- Calculate returns for Systematic Investment Plans
- Support for weekly, monthly, and quarterly frequencies
- Visual growth chart showing investment vs current value
- Detailed breakdown of each investment

### 4. Lumpsum Calculator
- Calculate returns for one-time investments
- Compare with SIP returns
- Annualized return calculations

### 5. SWP Calculator
- Systematic Withdrawal Plan simulator
- Monthly and quarterly withdrawal options
- Track remaining value over time
- Visual timeline of withdrawals

### 6. SIP vs Lumpsum Comparison
- Side-by-side comparison
- Visual bar charts
- Detailed metrics comparison
- Automatic recommendation

## API Endpoints

### GET /api/mf
Returns list of all mutual fund schemes.

**Response:**
```json
[
  {
    "schemeCode": 119551,
    "schemeName": "Aditya Birla Sun Life Liquid Fund - Direct Plan - Growth"
  }
]
```

### GET /api/scheme/:code
Returns scheme details with NAV history.

**Response:**
```json
{
  "meta": {
    "scheme_type": "Open Ended Schemes",
    "scheme_category": "Debt Scheme - Liquid Fund",
    "scheme_code": 119551,
    "scheme_name": "...",
    "fund_house": "Aditya Birla Sun Life Mutual Fund"
  },
  "data": [
    {
      "date": "31-12-2023",
      "nav": "345.6789"
    }
  ]
}
```

### GET /api/scheme/:code/returns
Calculate returns for a period.

**Query Parameters:**
- `period`: 1m, 3m, 6m, 1y, 3y, 5y
- OR `from` and `to`: YYYY-MM-DD format

**Response:**
```json
{
  "startDate": "2023-01-01",
  "endDate": "2023-12-31",
  "startNAV": 300.00,
  "endNAV": 345.67,
  "simpleReturn": 15.22,
  "annualizedReturn": 15.22,
  "duration": 365
}
```

### POST /api/scheme/:code/sip
Calculate SIP returns.

**Request Body:**
```json
{
  "amount": 5000,
  "frequency": "monthly",
  "from": "2020-01-01",
  "to": "2023-12-31"
}
```

**Response:**
```json
{
  "totalInvested": 240000,
  "currentValue": 298500,
  "totalUnits": 863.45,
  "absoluteReturn": 24.38,
  "annualizedReturn": 7.12,
  "investments": [...]
}
```

### POST /api/scheme/:code/lumpsum
Calculate lumpsum returns.

**Request Body:**
```json
{
  "amount": 100000,
  "from": "2020-01-01",
  "to": "2023-12-31"
}
```

### POST /api/scheme/:code/swp
Calculate SWP projections.

**Request Body:**
```json
{
  "initialInvestment": 500000,
  "withdrawalAmount": 5000,
  "frequency": "monthly",
  "from": "2020-01-01",
  "to": "2023-12-31"
}
```

## Caching

The application uses in-memory caching to improve performance:
- All schemes list: 24 hours TTL
- Scheme details: 12 hours TTL

## Customization

### Theme
Edit `src/theme/theme.ts` to customize colors, typography, and component styles.

### Calculations
Modify `src/utils/calculations.ts` to adjust financial calculation logic.

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
npm run dev -- -p 3001
```

### API Errors
The application uses MFAPI.in which is a free public API. If you encounter rate limiting or errors, the cache will help reduce API calls.

### Build Errors
Clear Next.js cache:
```bash
rm -rf .next
npm run build
```

## Performance Tips

1. The initial load of all schemes may take a few seconds
2. Scheme details are cached for 12 hours
3. Use the search and filter to narrow down results
4. Charts are optimized for large datasets

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT
