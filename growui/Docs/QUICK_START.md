# Quick Start Guide 🚀

## Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## What You'll See

### 🏠 Home Page
- Beautiful hero section
- Feature overview
- Call-to-action buttons

### 🔍 Explore Funds
Click **"Explore Funds"** to:
- Browse 40,000+ mutual funds
- Search by name
- Filter by category
- View fund details

### 📊 Scheme Details
Click any fund to see:
- Current NAV
- Interactive NAV chart
- Historical returns
- Multiple calculators

### 🧮 Calculators
Use the tabs to access:
1. **SIP Calculator** - Monthly investment returns
2. **Lumpsum Calculator** - One-time investment
3. **SWP Calculator** - Withdrawal planning
4. **Comparison** - SIP vs Lumpsum

---

## Quick Examples

### Calculate SIP Returns
1. Go to any fund detail page
2. Click "SIP Calculator" tab
3. Enter:
   - Amount: ₹5,000
   - Frequency: Monthly
   - Start Date: 2020-01-01
   - End Date: Today
4. Click "Calculate Returns"
5. See results with growth chart

### Compare SIP vs Lumpsum
1. Go to any fund detail page
2. Click "SIP vs Lumpsum" tab
3. Enter monthly SIP amount
4. Select date range
5. Click "Compare Returns"
6. See side-by-side comparison

### Search Funds
1. Go to "Explore Funds" page
2. Type fund name in search box
3. Or select category from dropdown
4. Browse results

---

## Key Features at a Glance

| Feature | Description |
|---------|-------------|
| 🔍 **Search** | Real-time search across all funds |
| 📊 **Charts** | Interactive NAV history charts |
| 🧮 **SIP** | Calculate systematic investment returns |
| 💰 **Lumpsum** | One-time investment calculator |
| 📉 **SWP** | Withdrawal plan simulator |
| ⚖️ **Compare** | SIP vs Lumpsum comparison |
| 📱 **Responsive** | Works on mobile, tablet, desktop |
| ⚡ **Fast** | Cached data for quick loading |

---

## Navigation

```
Home (/)
  └─ Explore Funds (/funds)
       └─ Scheme Details (/scheme/[code])
            ├─ SIP Calculator
            ├─ Lumpsum Calculator
            ├─ SWP Calculator
            └─ Comparison Tool
```

---

## Tips & Tricks

### 💡 Tip 1: Use Recent Dates
For accurate results, use date ranges within the last 5 years where data is most complete.

### 💡 Tip 2: Try Different Frequencies
Compare weekly vs monthly SIP to see which works better.

### 💡 Tip 3: Use Comparison Tool
Always compare SIP vs Lumpsum to make informed decisions.

### 💡 Tip 4: Check Multiple Periods
Look at 1Y, 3Y, and 5Y returns to understand long-term performance.

### 💡 Tip 5: Mobile Friendly
Use on your phone while discussing with financial advisors.

---

## Common Use Cases

### 1. Planning Monthly SIP
**Goal:** Invest ₹10,000 monthly for 10 years

**Steps:**
1. Find a fund (e.g., equity fund)
2. Open SIP Calculator
3. Enter ₹10,000, Monthly, 10-year range
4. See projected returns

### 2. Comparing Strategies
**Goal:** SIP vs Lumpsum - which is better?

**Steps:**
1. Go to Comparison tab
2. Enter monthly SIP amount
3. Select same date range
4. See which performed better historically

### 3. Retirement Planning
**Goal:** Withdraw ₹50,000 monthly after retirement

**Steps:**
1. Open SWP Calculator
2. Enter initial investment
3. Set withdrawal amount
4. See how long funds will last

### 4. Quick Fund Research
**Goal:** Find best performing equity funds

**Steps:**
1. Go to Explore Funds
2. Filter by "Equity"
3. Click each fund
4. Compare 3Y and 5Y returns

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate between fields |
| `Enter` | Submit forms |
| `Esc` | Close modals/drawers |
| `/` | Focus search (on funds page) |

---

## Mobile Usage

### On Mobile Devices:
1. **Menu** - Tap hamburger icon (☰) for navigation
2. **Charts** - Swipe to zoom, pinch to scale
3. **Tables** - Scroll horizontally if needed
4. **Forms** - Use native date pickers

---

## Performance Notes

### First Load
- May take 2-3 seconds to load all schemes
- Data is cached for 24 hours

### Subsequent Loads
- Instant loading from cache
- Smooth navigation

### Calculations
- Real-time calculations
- Based on actual historical NAV data

---

## Data Source

**MFAPI.in** provides:
- 40,000+ mutual fund schemes
- Daily NAV updates
- Historical data
- Free public API

---

## Need Help?

### Documentation
- 📖 `README.md` - Overview
- 🔧 `SETUP.md` - Detailed setup
- ✨ `FEATURES.md` - All features
- 🎨 `UI_ENHANCEMENTS.md` - Design guide
- 📋 `PROJECT_SUMMARY.md` - Complete summary

### Common Issues

**Q: Port 3000 already in use?**  
A: Run `npm run dev -- -p 3001`

**Q: API errors?**  
A: Wait a moment and try again. Free API may have rate limits.

**Q: Chart not showing?**  
A: Check if fund has sufficient historical data.

**Q: Calculation seems wrong?**  
A: Verify date range has available NAV data.

---

## What's Next?

### Explore More
- Try different funds
- Test various SIP amounts
- Compare multiple strategies
- Use different time periods

### Learn More
- Read feature documentation
- Understand calculations
- Explore code structure
- Customize for your needs

---

## Enjoy! 🎉

You now have a **professional mutual fund analysis tool** at your fingertips!

**Happy Investing! 📈**

---

*Built with Next.js, TypeScript, and Material UI*
