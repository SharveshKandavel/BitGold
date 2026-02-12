import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence
import { History, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
// import Card from '../components/ui/Card'; // Card not directly used here anymore
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import TradeInputModal from '../components/trade/TradeInputModal'; // Import TradeInputModal
import { fetchLiveGoldPrice, fetchHistoricalGoldPrices } from '../lib/goldApi';
import { toast } from 'sonner'; // Import toast for messages

// --- Helper for chart tooltip ---
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-deepBlack/90 p-2 rounded-lg border border-white/10 text-white text-xs shadow-lg">
        <p className="font-semibold">{label}</p>
        <p className="text-primary">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const Trade: React.FC = () => {
  const [tradeMode, setTradeMode] = useState<'Buy' | 'Sell'>('Buy');
  const [activeTimeframe, setActiveTimeframe] = useState<'1H' | '1D' | '1W' | '1M' | '1Y'>('1D');
  const [priceAnimationKey, setPriceAnimationKey] = useState(0);

  // Modal visibility state
  const [showTradeInputModal, setShowTradeInputModal] = useState(false);

  // Real-time price states
  const [livePrice, setLivePrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangeAmount, setPriceChangeAmount] = useState(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);

  // Historical data states
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  // --- Fetch Live Price ---
  useEffect(() => {
    const getLivePrice = async () => {
      setIsLoadingPrice(true);
      setPriceError(null);
      try {
        const newPrice = await fetchLiveGoldPrice();
        const oldPrice = livePrice || 2400; // Use previous state or a base
        const change = ((newPrice - oldPrice) / oldPrice) * 100;
        const changeAmount = newPrice - oldPrice;

        setLivePrice(newPrice);
        setPriceChange(parseFloat(change.toFixed(2)));
        setPriceChangeAmount(parseFloat(changeAmount.toFixed(2)));
        setPriceAnimationKey(prev => prev + 1);
      } catch (err) {
        setPriceError("Failed to fetch live price.");
        console.error("Error fetching live price:", err);
      } finally {
        setIsLoadingPrice(false);
      }
    };

    getLivePrice();
    const interval = setInterval(getLivePrice, 15000); // Poll every 15 seconds
    return () => clearInterval(interval);
  }, []); // Only run on mount

  // --- Fetch Historical Data for Chart ---
  useEffect(() => {
    const getHistoricalData = async () => {
      setIsLoadingChart(true);
      setChartError(null);
      try {
        const data = await fetchHistoricalGoldPrices(activeTimeframe);
        setHistoricalData(data);
      } catch (err) {
        setChartError(`Failed to fetch ${activeTimeframe} historical data.`);
        console.error("Error fetching historical data:", err);
      } finally {
        setIsLoadingChart(false);
      }
    };

    getHistoricalData();
  }, [activeTimeframe]); // Re-run when activeTimeframe changes

  // Handle Review Order from modal
  const handleReviewOrder = (mode: 'Buy' | 'Sell', orderAmount: number) => {
    console.log(`Reviewing ${mode} order for $${orderAmount}`);
    toast.info(`Reviewing ${mode} order for $${orderAmount}`, {
      description: `Approx. ${(orderAmount / livePrice).toFixed(2)}g Gold`,
    });
    // Here you would navigate to a review screen or open another modal
    setShowTradeInputModal(false); // Close modal after action
  };

  const handleToggleTradeMode = (mode: 'Buy' | 'Sell') => {
    setTradeMode(mode);
    setShowTradeInputModal(true); // Show modal when Buy/Sell button is clicked
  };

  return (
    <Container className="pt-4 pb-[104px] bg-deepBlack min-h-screen relative">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center p-4 -mx-4">
        <h1 className="text-white font-light text-xl tracking-tight">Market</h1>
        <Button variant="ghost" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full w-10 h-10 p-0 flex items-center justify-center">
          <History size={20} className="text-white" />
        </Button>
      </motion.div>

      {/* Live Price Display */}
      <div className="text-center mt-4">
        {isLoadingPrice ? (
          <div className="h-12 flex items-center justify-center">
            <LoadingSpinner size={32} className="text-primary" />
          </div>
        ) : priceError ? (
          <ErrorMessage message={priceError} />
        ) : (
          <>
            <motion.p
              key={priceAnimationKey}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-4xl font-thin text-white tracking-tighter"
            >
              ${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.p>
            <p className={`text-sm font-medium mt-2 bg-opacity-10 px-3 py-1 rounded-full inline-block ${
                priceChange >= 0 ? 'text-green-400 bg-green-500/10' : 'text-red-400 bg-red-500/10'
              }`}
            >
              {priceChange > 0 ? '+' : ''}{priceChange}% (${priceChangeAmount.toFixed(2)})
            </p>
          </>
        )}
      </div>

      {/* Buy/Sell Segmented Control - Now placed below chart and timeframes with animation */}
      <motion.div className="relative flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 mx-4 mb-8 mt-8"> {/* Added mt-8 and mb-8 for spacing */}
        <motion.span
          layoutId="tradeModeIndicator"
          className={`absolute top-0 bottom-0 rounded-full ${tradeMode === 'Buy' ? 'left-0' : 'right-0'} bg-primary`}
          style={{ width: 'calc(50% - 4px)', margin: '2px' }} // Adjust width and margin to fit within padding of parent div
          transition={{ type: "tween", duration: 0.2 }}
        />
        <button
          onClick={() => handleToggleTradeMode('Buy')}
          className={`flex-1 py-3 text-base font-semibold transition-colors relative z-10 ${
            tradeMode === 'Buy' ? 'text-deepBlack' : 'text-gray-400'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => handleToggleTradeMode('Sell')}
          className={`flex-1 py-3 text-base font-semibold transition-colors relative z-10 ${
            tradeMode === 'Sell' ? 'text-deepBlack' : 'text-gray-400'
          }`}
        >
          Sell
        </button>
      </motion.div>

      {/* The 'Liquid' Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-56 w-full my-8">
        {isLoadingChart ? (
          <div className="h-full flex items-center justify-center">
            <LoadingSpinner size={48} className="text-primary" />
          </div>
        ) : chartError ? (
          <ErrorMessage message={chartError} />
        ) : (
          <div style={{ position: 'relative', height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip content={<CustomChartTooltip />} />
              <Area type="monotone" dataKey="price" stroke="#D4AF37" fillOpacity={1} fill="url(#chartColor)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          </div>
        )}
      </motion.div>

      {/* Timeframes */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex justify-center gap-2 mb-8">
        {['1H', '1D', '1W', '1M', '1Y'].map(timeframe => (
          <motion.button
            key={timeframe}
            className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
              activeTimeframe === timeframe ? 'bg-primary text-deepBlack' : 'bg-white/5 text-gray-300 backdrop-blur-md border border-white/10'
            }`}
            onClick={() => setActiveTimeframe(timeframe)}
            whileTap={{ scale: 0.95 }}
          >
            {timeframe}
          </motion.button>
        ))}
      </motion.div>

      {/* Trade Input Modal */}
      <AnimatePresence>
        {showTradeInputModal && (
          <TradeInputModal
            tradeMode={tradeMode}
            livePrice={livePrice}
            onClose={() => setShowTradeInputModal(false)}
            onReviewOrder={handleReviewOrder}
          />
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Trade;
