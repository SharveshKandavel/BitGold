// src/lib/goldApi.ts

// Simulate fetching real-time gold price
export const fetchLiveGoldPrice = async (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate slight fluctuations
      const price = 2000 + Math.random() * 100 - 50; // Base around 2000, +/- 50
      resolve(parseFloat(price.toFixed(2)));
    }, 500); // Simulate network delay
  });
};

interface HistoricalPriceDataPoint {
  date: string; // e.g., "2024-01-01" or "01:00"
  price: number;
}

// Simulate fetching historical gold price data
export const fetchHistoricalGoldPrices = async (timeframe: '1H' | '1D' | '1W' | '1M' | '1Y'): Promise<HistoricalPriceDataPoint[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data: HistoricalPriceDataPoint[] = [];
      let currentPrice = 2000; // Starting price for simulation

      const generateData = (count: number, interval: number, format: (i: number) => string) => {
        for (let i = 0; i < count; i++) {
          currentPrice += (Math.random() - 0.5) * 10; // Random fluctuation
          data.push({
            date: format(i),
            price: parseFloat(currentPrice.toFixed(2)),
          });
        }
      };

      switch (timeframe) {
        case '1H': // 60 data points for 60 minutes
          generateData(60, 1, (i) => `${String(Math.floor(i / 60)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`);
          break;
        case '1D': // 24 data points for 24 hours
          generateData(24, 1, (i) => `${String(i).padStart(2, '0')}:00`);
          break;
        case '1W': // 7 data points for 7 days
          generateData(7, 1, (i) => `Day ${i + 1}`);
          break;
        case '1M': // ~30 data points for 30 days
          generateData(30, 1, (i) => `Day ${i + 1}`);
          break;
        case '1Y': // 12 data points for 12 months
          generateData(12, 1, (i) => `Month ${i + 1}`);
          break;
        default:
          generateData(10, 1, (i) => `Point ${i + 1}`);
      }
      resolve(data);
    }, 1000); // Simulate network delay for historical data
  });
};
