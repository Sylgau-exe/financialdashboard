// Vercel Serverless Function to fetch live quotes
// This runs server-side, avoiding CORS issues

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');

  // Yahoo Finance symbols mapping
  const symbols = {
    // Fear & Volatility
    'VIX': '^VIX',
    'US10Y': '^TNX',
    'JP10Y': '^TNX',  // Note: Yahoo doesn't have JP10Y, we'll handle separately
    'US30Y': '^TYX',
    
    // Currencies
    'DXY': 'DX-Y.NYB',
    'USDJPY': 'JPY=X',
    'EURUSD': 'EURUSD=X',
    'USDCAD': 'CAD=X',
    
    // Safe Havens
    'GOLD': 'GC=F',
    'SILVER': 'SI=F',
    'BTC': 'BTC-USD',
    'WTI': 'CL=F',
    
    // Equities
    'SPX': '^GSPC',
    'DJI': '^DJI',
    'NDX': '^NDX',
    'NI225': '^N225',
    
    // Banks
    'JPM': 'JPM',
    'BAC': 'BAC',
    'MUFG': 'MUFG',
    'KRE': 'KRE'
  };

  try {
    const symbolList = Object.values(symbols).join(',');
    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolList)}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API error: ${response.status}`);
    }

    const data = await response.json();
    const quotes = data.quoteResponse?.result || [];

    // Transform to our format
    const result = {};
    
    for (const [key, yahooSymbol] of Object.entries(symbols)) {
      const quote = quotes.find(q => q.symbol === yahooSymbol);
      
      if (quote) {
        // Special handling for currency pairs (Yahoo quotes them inversely for some)
        let price = quote.regularMarketPrice;
        let change = quote.regularMarketChange;
        let percent = quote.regularMarketChangePercent;

        // USDJPY: Yahoo gives us JPYUSD, need to invert
        if (key === 'USDJPY' && price) {
          price = 1 / price;
          // Approximate change (this is simplified)
          const prevPrice = 1 / (quote.regularMarketPrice - quote.regularMarketChange);
          change = price - prevPrice;
          percent = (change / prevPrice) * 100;
        }
        
        // USDCAD: Yahoo gives us CADUSD, need to invert
        if (key === 'USDCAD' && price) {
          price = 1 / price;
          const prevPrice = 1 / (quote.regularMarketPrice - quote.regularMarketChange);
          change = price - prevPrice;
          percent = (change / prevPrice) * 100;
        }

        // Yields are reported as whole numbers, divide by appropriate factor
        if (['US10Y', 'US30Y'].includes(key) && price) {
          // TNX and TYX are already in percentage points (e.g., 4.25 = 4.25%)
          // No transformation needed
        }

        result[key] = {
          price: price || 0,
          change: change || 0,
          percent: percent || 0,
          marketState: quote.marketState,
          lastUpdate: quote.regularMarketTime
        };
      }
    }

    // Add Japan 10Y from alternative source or use placeholder
    // Yahoo doesn't have good JP10Y data, so we'll note this
    if (!result['JP10Y'] || result['JP10Y'].price === 0) {
      result['JP10Y'] = {
        price: 0,
        change: 0,
        percent: 0,
        note: 'JP10Y requires alternative data source'
      };
    }

    res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      quotes: result
    });

  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
