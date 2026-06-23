import React, { useState, useEffect, useMemo } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion } from 'framer-motion';
import { History, ArrowRight, TrendingUp, Info, Package } from 'lucide-react';
import { ResponsiveContainer, AreaChart, XAxis, YAxis, Tooltip, Area } from 'recharts';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { fetchLiveGoldPrice, fetchHistoricalGoldPrices } from '../lib/goldApi';
import { toast } from 'sonner';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { fadeIn, staggerContainer, staggerItem } from '../lib/animations';

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length > 0 && payload[0] != null) {
    return (
      <div className="bg-deepBlack border border-white/[0.08] p-3 rounded-xl shadow-xl">
        <p className="label-timestamp mb-1">{label}</p>
        <p className="text-gold font-semibold">${payload[0].value.toFixed(2)}</p>
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
  const [isLoadingPrice, setIsLoadingPrice] = useState(true);

  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [isLoadingChart, setIsLoadingChart] = useState(true);

  useEffect(() => {
    const getLivePrice = async () => {
      setIsLoadingPrice(true);
      try {
        const newPrice = await fetchLiveGoldPrice();
        const oldPrice = livePrice || 2400;
        const change = ((newPrice - oldPrice) / oldPrice) * 100;
        setLivePrice(newPrice);
        setPriceChange(parseFloat(change.toFixed(2)));
        setPriceAnimationKey(prev => prev + 1);
      } catch (err) {
        // error handled
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
        // error handled
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
    <div className="page-container">
      <motion.div initial="initial" animate="animate" variants={staggerContainer} className="flex flex-col gap-4">
        {/* Header */}
        <motion.div variants={staggerItem} className="page-header px-1 mb-0">
          <h1 className="page-title">Market</h1>
          <button 
            className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-colors hover:bg-white/[0.08]" 
            onClick={() => setActiveTab && setActiveTab('Activity')}
          >
            <History size={20} />
          </button>
        </motion.div>

        {/* Price Display */}
        <motion.div variants={staggerItem} className="text-center mt-2">
          {isLoadingPrice ? (
            <div className="h-16 flex items-center justify-center"><LoadingSpinner /></div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="label-overline mb-1">XAU/USD (Per Gram)</p>
              <motion.h2 key={priceAnimationKey} className="value-hero text-gold-gradient">
                ${pricePerGram.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.h2>
              <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold mt-3 ${priceChange >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                <TrendingUp size={12} />
                <span>{priceChange >= 0 ? '+' : ''}{priceChange}%</span>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Fluid Chart */}
        <motion.div variants={staggerItem} className="h-48 w-full mt-4">
          <div className="h-full w-full relative">
            {isLoadingChart ? (
               <div className="absolute inset-0 flex items-center justify-center"><LoadingSpinner /></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historicalData}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip content={<CustomChartTooltip />} cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={2} fill="url(#chartGradient)" activeDot={{ r: 4, fill: '#D4AF37', stroke: '#0A0A0A', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Trade Terminal */}
        <motion.div variants={staggerItem} className="mt-4">
          <div className="p-1 bg-white/[0.03] border border-white/[0.05] rounded-xl flex mb-6">
            <button 
              onClick={() => setTradeMode('Buy')}
              className={`flex-1 py-3 rounded-lg text-xs font-semibold transition-all ${tradeMode === 'Buy' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Buy Gold
            </button>
            <button 
              onClick={() => setTradeMode('Sell')}
              className={`flex-1 py-3 rounded-lg text-xs font-semibold transition-all ${tradeMode === 'Sell' ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Sell Gold
            </button>
          </div>

          <div className="text-center mb-8">
             <div className="flex items-center justify-center gap-2 mb-2">
               <span className="text-3xl font-medium text-gray-500">$</span>
               <input 
                 type="text" 
                 value={amount} 
                 onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setAmount(e.target.value)}
                 placeholder="0.00"
                 className="bg-transparent text-5xl font-semibold focus:outline-none w-48 text-center placeholder-white/[0.08]"
               />
             </div>
             <p className="label-meta text-gold flex items-center justify-center gap-1.5">
               <Package size={14} />
               ≈ {goldWeight}g Gold
             </p>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-8">
            {quickAmounts.map(v => (
              <button 
                key={v} 
                onClick={() => handleQuickSelect(v)}
                className="py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-xs font-medium text-gray-400 hover:text-white hover:bg-white/[0.05] transition-all"
              >
                {v === 'Max' ? 'MAX' : `$${v}`}
              </button>
            ))}
          </div>

          <Button 
            variant="gold" 
            fullWidth
            onClick={handleConfirmOrder}
            disabled={!amount || isSubmitting || pricePerGram <= 0}
            className="disabled:opacity-50"
          >
            {isSubmitting ? 'Finalizing Order...' : `Confirm ${tradeMode} Order`}
            <ArrowRight size={18} className="ml-2" />
          </Button>
          
          <div className="mt-4 flex items-center justify-center gap-2 label-meta">
             <Info size={12} />
             <span>Orders filled at best available market price</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Trade;
