import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { fetchLiveGoldPrice, fetchHistoricalGoldPrices } from '../lib/goldApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ArrowUp, ArrowDown, ShoppingCart, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useUser } from '@clerk/clerk-react';
import { fadeIn, staggerContainer, staggerItem } from '../lib/animations';

export interface HomeProps {
  setActiveTab?: (tab: string) => void;
  navigateToTrade?: (mode: 'Buy' | 'Sell') => void;
  navigateToVault?: (segment: 'storage' | 'automation') => void;
}

const mockRoundUps = [
  { id: 1, merchant: 'Starbucks', amount: 4.50, roundUp: 0.50 },
  { id: 2, merchant: 'Uber', amount: 12.20, roundUp: 0.80 },
  { id: 3, merchant: 'Whole Foods', amount: 84.10, roundUp: 0.90 },
  { id: 4, merchant: 'Coffee Shop', amount: 3.75, roundUp: 0.25 },
];

const TROY_OZ_TO_GRAMS = 31.1034768;

export const Home: React.FC<HomeProps> = ({ setActiveTab, navigateToTrade, navigateToVault }) => {
  const user = useCurrentUser();
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const { user: clerkUser } = PUBLISHABLE_KEY ? useUser() : { user: null };
  const dbName = user?.name && user.name !== "New User" ? user.name : user?.email;
  const clerkName = clerkUser?.fullName || clerkUser?.primaryEmailAddress?.emailAddress;
  const displayName = dbName || clerkName || 'Valued Member';

  const recurringBuys = useQuery(api.automation.getRecurringBuys, user ? { userId: user._id } : "skip");
  const roundUpSettings = useQuery(api.automation.getRoundUpSettings, user ? { userId: user._id } : "skip");

  const [currentRoundUpIndex, setCurrentRoundUpIndex] = useState(0);
  const [livePrice, setLivePrice] = useState(2664.24);
  
  const activeSip = recurringBuys && recurringBuys.length > 0 ? recurringBuys[0] : null;
  const isRoundUpEnabled = roundUpSettings?.enabled ?? false;
  
  const [chartData, setChartData] = useState<any[]>([]);
  const [timeframe, setTimeframe] = useState<'30M' | '1D' | '1W' | '1M' | '1Y'>('1M');
  const [chartLoading, setChartLoading] = useState(true);

  useEffect(() => {
    const loadChartData = async () => {
      setChartLoading(true);
      try {
        const data = await fetchHistoricalGoldPrices(timeframe);
        setChartData(data);
      } catch (err) {
        console.error("Failed to load chart data", err);
      } finally {
        setChartLoading(false);
      }
    };
    loadChartData();
  }, [timeframe]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0A0A] border border-white/[0.08] p-3 rounded-xl shadow-xl">
          <p className="label-timestamp mb-1">{payload[0].payload.date}</p>
          <p className="text-gold font-semibold">${payload[0].value.toFixed(2)}/oz</p>
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const getLivePrice = async () => {
      try {
        const newPrice = await fetchLiveGoldPrice();
        setLivePrice(newPrice);
      } catch (err) {
        console.error("Failed to fetch live price", err);
      }
    };
    getLivePrice();
    const interval = setInterval(getLivePrice, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoundUpIndex((prevIndex) => (prevIndex + 1) % mockRoundUps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const pricePerGram = livePrice / TROY_OZ_TO_GRAMS;
  const goldBalance = user?.goldBalance ?? 10;
  const cadBalance = user?.cadBalance ?? 5000;
  const goldValue = goldBalance * pricePerGram;
  const portfolioValue = cadBalance + goldValue;

  const currentRoundUp = mockRoundUps[currentRoundUpIndex];


  return (
    <div className="page-container">
      <motion.div 
        className="flex-1 flex flex-col gap-6"
        initial="initial" 
        animate="animate" 
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="page-header mb-0">
          <div className="flex items-center gap-3">
            <div 
              className="relative w-10 h-10 rounded-full border border-white/[0.08] p-0.5 flex items-center justify-center cursor-pointer"
              onClick={() => setActiveTab && setActiveTab('Profile')}
            >
              <img src={user?.picture || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user?.name || 'JD')}`} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-deepBlack flex items-center justify-center">
                <ShieldCheck size={8} className="text-black" />
              </div>
            </div>
            <div>
              <p className="label-overline">Welcome back</p>
              <p className="page-title leading-tight">{displayName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center relative transition-colors hover:bg-white/[0.08]" onClick={() => setActiveTab && setActiveTab('Activity')}>
              <Bell size={18} className="text-white" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
            </button>
          </div>
        </motion.div>

        {/* Hero Portfolio Card */}
        <motion.div variants={staggerItem}>
          <div className="card-hero relative flex flex-col items-center text-center">
            {/* Single subtle glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#D4AF37]/10 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 w-full">
              <p className="label-overline mb-3 text-gray-400">Total Wealth</p>
              <motion.h2 
                className="value-hero mb-2 text-white"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.h2>
              <div className="flex items-center justify-center gap-3">
                <span className="text-gray-300 font-medium text-sm">≈ {goldBalance.toFixed(3)}g</span>
                <div className="h-4 w-[1px] bg-white/[0.15]" />
                <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                  <TrendingUp size={14} />
                  <span>+2.4%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>



        {/* Quick Actions */}
        <motion.div variants={staggerItem} className="grid grid-cols-4 gap-4">
          {[
            { label: 'Auto-Invest', icon: RefreshCw, color: 'text-gold', type: 'autoinvest' },
            { label: 'Buy', icon: ArrowUp, color: 'text-white', type: 'trade', mode: 'Buy' as const },
            { label: 'Sell', icon: ArrowDown, color: 'text-white', type: 'trade', mode: 'Sell' as const },
            { label: 'Redeem', icon: ShoppingCart, color: 'text-white', type: 'tab', tab: 'Redeem' },
          ].map((action) => (
            <button 
              key={action.label}
              className="flex flex-col items-center gap-2 group transition-transform active:scale-95" 
              onClick={() => {
                if (action.type === 'autoinvest' && navigateToVault) {
                  navigateToVault('automation');
                } else if (action.type === 'trade' && action.mode && navigateToTrade) {
                  navigateToTrade(action.mode);
                } else if (action.type === 'tab' && action.tab && setActiveTab) {
                  setActiveTab(action.tab);
                }
              }}
            >
              <div className="w-14 h-14 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                <action.icon size={22} className={action.color} />
              </div>
              <span className="label-meta">{action.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Live Market Section */}
        <motion.div variants={staggerItem}>
          <div className="card-primary flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="label-section flex items-center gap-1.5 text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
                  XAU/USD Market
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="value-lg text-white">${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className="text-sm text-gray-500 font-normal ml-1">/oz</span></h3>
                  <span className="text-xs text-emerald-400 font-medium flex items-center gap-0.5">
                    <TrendingUp size={12} />
                    +1.8%
                  </span>
                </div>
                <p className="label-meta mt-1">≈ ${pricePerGram.toFixed(2)}/g</p>
              </div>

              {/* Timeframe pill selector */}
              <div className="flex bg-white/[0.03] border border-white/[0.05] p-1 rounded-xl gap-1">
                {(['30M', '1D', '1W', '1M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`pill transition-all ${
                      timeframe === tf
                        ? 'pill-active'
                        : 'pill-inactive hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Area Chart */}
            <div className="h-40 w-full relative flex items-center justify-center">
              {chartLoading ? (
                <div className="flex flex-col items-center gap-2 label-meta">
                  <div className="w-6 h-6 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
                  <span>Loading Chart...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 5, bottom: 5 }}>
                    <defs>
                      <linearGradient id="goldChartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" hide={true} />
                    <YAxis domain={['auto', 'auto']} hide={true} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(212,175,55,0.2)', strokeWidth: 1 }} />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#D4AF37" 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#goldChartGradient)"
                      activeDot={{ r: 4, fill: '#D4AF37', stroke: '#0A0A0A', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </motion.div>

        {/* Auto-Invest Activity */}
        <motion.div variants={staggerItem} className="mb-4">
          <div className="card-primary flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse-dot" />
                  <p className="label-section text-gold">Auto-Invest Pulse</p>
                </div>
                <button 
                  className="label-meta hover:text-white transition-colors"
                  onClick={() => navigateToVault && navigateToVault('automation')}
                >
                  Configure
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* 1. Round-Ups Activity */}
               <div className="card-secondary min-h-[72px] flex flex-col justify-center">
                 <p className="label-overline mb-3">Spare Change Round-Ups</p>
                 {isRoundUpEnabled ? (
                   <div className="h-8 relative overflow-hidden">
                     <AnimatePresence mode="wait">
                       <motion.div
                         key={currentRoundUp.id}
                         initial={{ y: 8, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         exit={{ y: -8, opacity: 0 }}
                         transition={{ duration: 0.3 }}
                         className="flex items-center justify-between"
                       >
                         <div className="flex items-center gap-2">
                           <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center text-xs font-semibold text-gray-300">
                             {currentRoundUp.merchant[0]}
                           </div>
                           <div>
                             <p className="text-xs font-medium text-white">{currentRoundUp.merchant}</p>
                             <p className="label-meta">${currentRoundUp.amount.toFixed(2)}</p>
                           </div>
                         </div>
                         <p className="text-sm font-semibold text-gold">+${currentRoundUp.roundUp.toFixed(2)}</p>
                       </motion.div>
                     </AnimatePresence>
                   </div>
                 ) : (
                   <div className="flex items-center gap-2 text-xs text-gray-500 py-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                     <span>Inactive (Toggled Off)</span>
                   </div>
                 )}
               </div>

               {/* 2. Auto-Pilot Recurring Buy status */}
               <div className="card-secondary min-h-[72px] flex flex-col justify-center">
                 <p className="label-overline mb-3">Auto-Pilot Recurring Buy</p>
                 {activeSip ? (
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-sm font-semibold text-white">${activeSip.amount} <span className="label-meta capitalize">/ {activeSip.frequency}</span></p>
                       <p className="label-meta mt-0.5">
                         Next: {new Date(activeSip.next_execution).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                       </p>
                     </div>
                     <span className="pill pill-success">
                       Active
                     </span>
                   </div>
                 ) : (
                   <div className="flex items-center gap-2 text-xs text-gray-500 py-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                     <span>No recurring plan active</span>
                   </div>
                 )}
               </div>
             </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Home;
