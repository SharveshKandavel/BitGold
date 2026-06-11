import React, { useState, useEffect, useMemo } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { History, ArrowRight, TrendingUp, Info, Package } from 'lucide-react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { fetchLiveGoldPrice, fetchHistoricalGoldPrices } from '../lib/goldApi';
import { toast } from 'sonner';

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length > 0 && payload[0] != null) {
    return (
      <div className="glass p-3 rounded-2xl text-white shadow-2xl border-white/10">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-gold-premium">${payload[0].value.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const TROY_OZ_TO_GRAMS = 31.1034768;

interface TradeProps {
  setActiveTab?: (tab: string) => void;
  initialMode?: 'Buy' | 'Sell';
}

import { useCurrentUser } from '../hooks/useCurrentUser';

const Trade: React.FC<TradeProps> = ({ setActiveTab, initialMode = 'Buy' }) => {
  const user = useCurrentUser();
  const executeBuy = useMutation(api.transactions.executeBuy);
  const executeSell = useMutation(api.transactions.executeSell);
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tradeMode, setTradeMode] = useState<'Buy' | 'Sell'>(initialMode);
  
  useEffect(() => {
    setTradeMode(initialMode);
  }, [initialMode]);

  const [activeTimeframe, setActiveTimeframe] = useState<'1H' | '1D' | '1W' | '1M' | '1Y'>('1D');
  const [priceAnimationKey, setPriceAnimationKey] = useState(0);

  const [amount, setAmount] = useState('');
  const quickAmounts: (number | 'Max')[] = [100, 500, 1000, 'Max'];

  const [livePrice, setLivePrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangeAmount, setPriceChangeAmount] = useState(0);
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);

  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);
  const [chartError, setChartError] = useState<string | null>(null);

  useEffect(() => {
    const getLivePrice = async () => {
      setIsLoadingPrice(true);
      try {
        const newPrice = await fetchLiveGoldPrice();
        const oldPrice = livePrice || 2400;
        const change = ((newPrice - oldPrice) / oldPrice) * 100;
        setLivePrice(newPrice);
        setPriceChange(parseFloat(change.toFixed(2)));
        setPriceChangeAmount(newPrice - oldPrice);
        setPriceAnimationKey(prev => prev + 1);
      } catch (err) {
        setPriceError("Failed to fetch price.");
      } finally {
        setIsLoadingPrice(false);
      }
    };
    getLivePrice();
    const interval = setInterval(getLivePrice, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const getHistoricalData = async () => {
      setIsLoadingChart(true);
      try {
        const data = await fetchHistoricalGoldPrices(activeTimeframe);
        setHistoricalData(data);
      } catch (err) {
        setChartError("Chart unavailable.");
      } finally {
        setIsLoadingChart(false);
      }
    };
    getHistoricalData();
  }, [activeTimeframe]);

  const pricePerGram = livePrice > 0 ? livePrice / TROY_OZ_TO_GRAMS : 0;
  const goldWeight = useMemo(() => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0 || pricePerGram <= 0) return '0.0000';
    return (numAmount / pricePerGram).toFixed(4);
  }, [amount, pricePerGram]);

  const handleQuickSelect = (v: number | 'Max') => {
    if (v === 'Max') {
      if (tradeMode === 'Buy') {
        setAmount((user?.cadBalance || 0).toString());
      } else {
        const maxSellCad = (user?.goldBalance || 0) * pricePerGram;
        setAmount(maxSellCad.toFixed(2));
      }
    } else {
      setAmount(v.toString());
    }
  };

  const handleConfirmOrder = async () => {
    const cadAmount = Number(amount);
    if (isNaN(cadAmount) || cadAmount <= 0) return toast.error('Enter amount');
    if (pricePerGram <= 0) return toast.error('Price unavailable');

    setIsSubmitting(true);
    try {
      let userId = user?._id;
      if (!userId) {
        const createdId = await ensureCurrentUser({});
        if (!createdId) throw new Error('Sign in required');
        userId = createdId;
      }

      const goldAmount = cadAmount / pricePerGram;
      
      if (tradeMode === 'Buy') {
        await executeBuy({ userId, cadAmount, goldAmount, pricePerGram });
        toast.success(`Success! Purchased ${goldAmount.toFixed(4)}g gold.`);
      } else {
        await executeSell({ userId, cadAmount, goldAmount, pricePerGram });
        toast.success(`Success! Sold ${goldAmount.toFixed(4)}g gold.`);
      }
      
      setAmount('');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="pt-4 pb-24 bg-deepBlack h-full overflow-y-auto hide-scrollbar text-white font-sans flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-xl font-bold tracking-tight">Market</h1>
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white" onClick={() => setActiveTab && setActiveTab('Activity')}>
          <History size={20} />
        </button>
      </div>

      {/* Price Display */}
      <div className="text-center mt-2 px-6">
        {isLoadingPrice ? (
          <div className="h-16 flex items-center justify-center"><LoadingSpinner /></div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black mb-1">XAU/USD (Per Gram)</p>
            <motion.h2 key={priceAnimationKey} className="text-5xl font-light tracking-tighter text-gold-premium">
              ${pricePerGram.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.h2>
            <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black mt-3 ${priceChange >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              <TrendingUp size={12} />
              <span>{priceChange >= 0 ? '+' : ''}{priceChange}%</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Fluid Chart */}
      <div className="h-48 w-full mt-6 px-4">
        <div className="h-full w-full relative">
          {isLoadingChart ? (
             <div className="absolute inset-0 flex items-center justify-center"><LoadingSpinner /></div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" hide />
                <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                <Tooltip content={<CustomChartTooltip />} />
                <Area type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={3} fill="url(#chartGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Timeframes */}
      <div className="flex justify-center gap-2 mt-4">
        {(['1H', '1D', '1W', '1M', '1Y'] as const).map(tf => (
          <button
            key={tf}
            onClick={() => setActiveTimeframe(tf)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
              activeTimeframe === tf ? 'bg-primary text-deepBlack' : 'glass text-gray-500'
            }`}
          >
            {tf}
          </button>
        ))}
      </div>

      {/* Trade Terminal */}
      <div className="mt-8 px-6 pb-32">
        <div className="p-1 glass rounded-2xl flex mb-6">
          <button 
            onClick={() => setTradeMode('Buy')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tradeMode === 'Buy' ? 'bg-primary text-deepBlack shadow-lg shadow-gold/20' : 'text-gray-500'}`}
          >
            Buy Gold
          </button>
          <button 
            onClick={() => setTradeMode('Sell')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${tradeMode === 'Sell' ? 'bg-primary text-deepBlack shadow-lg shadow-gold/20' : 'text-gray-500'}`}
          >
            Sell Gold
          </button>
        </div>

        <div className="text-center mb-8">
           <div className="flex items-center justify-center gap-2 mb-2">
             <span className="text-3xl font-light text-gray-600">$</span>
             <input 
               type="text" 
               value={amount} 
               onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setAmount(e.target.value)}
               placeholder="0.00"
               className="bg-transparent text-5xl font-light tracking-tighter focus:outline-none w-48 text-center placeholder-white/5"
             />
           </div>
           <p className="text-gold-premium text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
             <Package size={14} />
             ≈ {goldWeight}g Gold
           </p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-8">
          {quickAmounts.map(v => (
            <button 
              key={v} 
              onClick={() => handleQuickSelect(v)}
              className="py-3 rounded-xl glass border border-white/5 text-[10px] font-bold text-gray-400 hover:text-white transition-all"
            >
              {v === 'Max' ? 'MAX' : `$${v}`}
            </button>
          ))}
        </div>

        <Button 
          variant="premium" 
          className="w-full py-5 rounded-[1.5rem]" 
          onClick={handleConfirmOrder}
          disabled={!amount || isSubmitting || pricePerGram <= 0}
        >
          {isSubmitting ? 'Finalizing Order...' : `Confirm ${tradeMode} Order`}
          <ArrowRight size={18} className="ml-2" />
        </Button>
        
        <div className="mt-4 flex items-center justify-center gap-2 text-gray-600 text-[10px] font-bold uppercase tracking-widest">
           <Info size={12} />
           <span>Orders filled at best available market price</span>
        </div>
      </div>
    </Container>
  );
};

export default Trade;
