// src/lib/goldApi.ts

interface HistoricalPriceDataPoint {
  date: string; // e.g., "2024-01-01" or "01:00"
  price: number;
}

// Fetch real-time spot gold price (PAXG) from CoinGecko
export const fetchLiveGoldPrice = async (): Promise<number> => {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd");
    if (!res.ok) throw new Error("API response not ok");
    const data = await res.json();
    const price = data["pax-gold"]?.usd;
    if (price && typeof price === "number") {
      return price;
    }
    throw new Error("Invalid price data");
  } catch (err) {
    console.warn("CoinGecko Live API failed, falling back to simulated price:", err);
    // Spot gold price in 2026 is around $2300-$2700 USD. Let's use 2664.24 as a realistic base.
    const basePrice = 2664.24;
    return parseFloat((basePrice + Math.random() * 10 - 5).toFixed(2));
  }
};

// Fetch historical gold price data (PAXG) from CoinGecko
export const fetchHistoricalGoldPrices = async (timeframe: '30M' | '1H' | '1D' | '1W' | '1M' | '1Y'): Promise<HistoricalPriceDataPoint[]> => {
  let days = "30";
  let count = 30;

  switch (timeframe) {
    case '30M':
      days = "1";
      count = 6; // last 6 points (6 * 5 min = 30 mins)
      break;
    case '1H':
      days = "1";
      count = 12; // last 12 points (12 * 5 min = 60 mins)
      break;
    case '1D':
      days = "1";
      count = 24;
      break;
    case '1W':
      days = "7";
      count = 7;
      break;
    case '1M':
      days = "30";
      count = 30;
      break;
    case '1Y':
      days = "365";
      count = 12;
      break;
  }

  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/pax-gold/market_chart?vs_currency=usd&days=${days}`);
    if (!res.ok) throw new Error("API response not ok");
    const data = await res.json();
    const pricesArray = data.prices as [number, number][];

    if (pricesArray && Array.isArray(pricesArray)) {
      let sourceArray = pricesArray;

      // Slice the source array for sub-day granular timeframes (since they use days=1)
      if (timeframe === '30M') {
        sourceArray = pricesArray.slice(-6); // last 30 mins (6 points of 5 mins)
      } else if (timeframe === '1H') {
        sourceArray = pricesArray.slice(-12); // last 1 hour (12 points of 5 mins)
      }

      const N = sourceArray.length;
      let points: [number, number][] = [];

      if (N <= count) {
        points = sourceArray;
      } else {
        // Linearly downsample to get exactly 'count' points spread across the entire duration
        for (let i = 0; i < count; i++) {
          const index = Math.floor((i * (N - 1)) / (count - 1));
          points.push(sourceArray[index]);
        }
      }

      return points.map(([timestamp, price]) => {
        const dateObj = new Date(timestamp);
        let dateStr = "";

        if (timeframe === '30M') {
          dateStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
        } else if (timeframe === '1H') {
          dateStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
        } else if (timeframe === '1D') {
          dateStr = `${dateObj.getHours()}:00`;
        } else if (timeframe === '1W') {
          dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
        } else if (timeframe === '1M') {
          dateStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        } else {
          dateStr = dateObj.toLocaleDateString(undefined, { month: 'short' });
        }

        return {
          date: dateStr,
          price: parseFloat(price.toFixed(2)),
        };
      });
    }
    throw new Error("Invalid historical price data");
  } catch (err) {
    console.warn(`CoinGecko Historical API (${timeframe}) failed, falling back to simulated data:`, err);
    // Simulated fallback
    const fallbackData: HistoricalPriceDataPoint[] = [];
    let currentPrice = 2664.24;
    const now = new Date();
    for (let i = 0; i < count; i++) {
      currentPrice += (Math.random() - 0.5) * 15;
      let dateStr = "";
      
      if (timeframe === '30M') {
        const minsAgo = (count - 1 - i) * 5;
        const d = new Date(now.getTime() - minsAgo * 60 * 1000);
        dateStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      } else if (timeframe === '1H') {
        const minsAgo = (count - 1 - i) * 5;
        const d = new Date(now.getTime() - minsAgo * 60 * 1000);
        dateStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
      } else if (timeframe === '1D') {
        const hoursAgo = count - 1 - i;
        const d = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
        dateStr = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
      } else if (timeframe === '1W') {
        const daysAgo = count - 1 - i;
        const d = new Date();
        d.setDate(now.getDate() - daysAgo);
        dateStr = d.toLocaleDateString(undefined, { weekday: 'short' });
      } else if (timeframe === '1M') {
        const daysAgo = count - 1 - i;
        const d = new Date();
        d.setDate(now.getDate() - daysAgo);
        dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      } else { // 1Y
        const monthsAgo = count - 1 - i;
        const d = new Date();
        d.setMonth(now.getMonth() - monthsAgo);
        dateStr = d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' });
      }
      
      fallbackData.push({
        date: dateStr,
        price: parseFloat(currentPrice.toFixed(2)),
      });
    }
    return fallbackData;
  }
};
