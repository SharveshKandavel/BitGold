import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { fetchLiveGoldPrice, fetchHistoricalGoldPrices } from '../lib/goldApi';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Container from "../components/ui/Container";
import { Bell, ArrowUp, ArrowDown, ShoppingCart, Lock, BarChart, TrendingUp, ShieldCheck, RefreshCw } from 'lucide-react';
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useUser } from '@clerk/clerk-react';

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

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const Home: React.FC<HomeProps> = ({ setActiveTab, navigateToTrade, navigateToVault }) => {
  const user = useCurrentUser();
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const { user: clerkUser } = PUBLISHABLE_KEY ? useUser() : { user: null };
  const dbName = user?.name && user.name !== "New User" ? user.name : user?.email;
  const clerkName = clerkUser?.fullName || clerkUser?.primaryEmailAddress?.emailAddress;
  const displayName = dbName || clerkName || 'Valued Member';
  const goals = useQuery(api.automation.getSavingsGoals, user ? { userId: user._id } : "skip");
  const recurringBuys = useQuery(api.automation.getRecurringBuys, user ? { userId: user._id } : "skip");
  const roundUpSettings = useQuery(api.automation.getRoundUpSettings, user ? { userId: user._id } : "skip");

  const [currentRoundUpIndex, setCurrentRoundUpIndex] = useState(0);
  const [livePrice, setLivePrice] = useState(2664.24); // Base price per Troy Oz
  
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
        <div className="bg-deepBlack/95 border border-white/10 p-3 rounded-2xl text-xs shadow-2xl backdrop-blur-xl">
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[8px] mb-1">{payload[0].payload.date}</p>
          <p className="text-[#D4AF37] font-black">${payload[0].value.toFixed(2)}/oz</p>
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
  const goldBalance = user?.goldBalance ?? 10; // Fallback for demo
  const cadBalance = user?.cadBalance ?? 5000; // Fallback for demo
  const goldValue = goldBalance * pricePerGram;
  const portfolioValue = cadBalance + goldValue;

  const currentRoundUp = mockRoundUps[currentRoundUpIndex];

  // Goals handling
  const activeGoal = goals && goals.length > 0 ? goals[0] : null;
  const goalName = activeGoal ? activeGoal.name : "Savings Goal";
  const goalTarget = activeGoal ? activeGoal.target_amount : 500; // 500g default
  const goalCurrent = activeGoal ? activeGoal.current_amount : goldBalance;
  const goalProgress = Math.min((goalCurrent / goalTarget) * 100, 100);

  return (
    <Container className="pt-4 pb-24 bg-deepBlack h-full overflow-y-auto hide-scrollbar text-white font-sans flex flex-col">
      <motion.div 
        className="flex-1 flex flex-col gap-6 py-2"
        initial="initial" 
        animate="animate" 
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex justify-between items-center px-4">
          <div className="flex items-center gap-3">
            <div 
              className="relative w-10 h-10 rounded-full border border-white/10 p-0.5 flex items-center justify-center cursor-pointer"
              onClick={() => setActiveTab && setActiveTab('Profile')}
            >
              <img src={user?.picture || `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(user?.name || 'JD')}`} alt="User Avatar" className="w-full h-full rounded-full object-cover" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary border-2 border-deepBlack flex items-center justify-center">
                <ShieldCheck size={8} className="text-black" />
              </div>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">Welcome back</p>
              <p className="text-sm font-medium">{displayName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full glass flex items-center justify-center relative" onClick={() => setActiveTab && setActiveTab('Activity')}>
              <Bell size={18} className="text-white" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </button>
          </div>
        </motion.div>

        {/* Hero Portfolio Card */}
        <motion.div variants={fadeInUp} className="px-4">
          <div className="relative p-8 rounded-[2rem] bg-gold-card-premium overflow-hidden shadow-[0_20px_50px_rgba(212,175,55,0.25)] border border-[#FCF6BA]/30">
            {/* Subtle inner shine overlays */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/20 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center text-slate-950">
              <p className="text-[10px] text-slate-900/60 uppercase tracking-[0.3em] font-black mb-3">Total Wealth</p>
              <motion.h2 
                className="text-5xl font-bold tracking-tighter mb-1 font-sans text-slate-950"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "circOut" }}
              >
                ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </motion.h2>
              <div className="flex items-center gap-2">
                <span className="text-slate-900 font-extrabold text-lg">≈ {goldBalance.toFixed(3)}g</span>
                <div className="h-4 w-[1px] bg-slate-900/20" />
                <div className="flex items-center gap-1 text-emerald-900 text-xs font-black">
                  <TrendingUp size={12} className="text-emerald-950" />
                  <span>+2.4%</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Goal Tracker */}
        <motion.div variants={fadeInUp} className="px-4">
          <Card className="glass p-5 rounded-3xl flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between items-end mb-2">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">{goalName}</p>
                <p className="text-xs font-bold text-white">{goalCurrent.toFixed(1)}g / {goalTarget}g</p>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${goalProgress}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center">
              <TrendingUp size={20} className="text-primary" />
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-4 px-4">
          {[
            { label: 'Auto-Invest', icon: RefreshCw, color: 'text-[#D4AF37]', type: 'autoinvest' },
            { label: 'Buy', icon: ArrowUp, color: 'text-white', type: 'trade', mode: 'Buy' as const },
            { label: 'Sell', icon: ArrowDown, color: 'text-white', type: 'trade', mode: 'Sell' as const },
            { label: 'Redeem Gold', icon: ShoppingCart, color: 'text-white', type: 'tab', tab: 'Redeem' },
          ].map((action) => (
            <motion.button 
              key={action.label}
              whileTap={{ scale: 0.9 }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-2" 
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
              <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center">
                <action.icon size={22} className={action.color} />
              </div>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold text-center leading-tight">{action.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Live Market Section (Premium Glowing Gold Chart) */}
        <motion.div variants={fadeInUp} className="px-4">
          <div className="p-6 rounded-[2rem] glass-dark border border-white/5 flex flex-col gap-4 relative overflow-hidden">
            {/* Subtle glowing mesh behind */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[50px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  XAU/USD Live Market
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold tracking-tight">${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className="text-xs text-gray-500 font-normal">/oz</span></h3>
                  <span className="text-[10px] text-green-400 font-bold flex items-center gap-0.5">
                    <TrendingUp size={10} />
                    +1.8%
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5 font-bold">≈ ${pricePerGram.toFixed(2)}/g</p>
              </div>

              {/* Timeframe pill selector */}
              <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl gap-1">
                {(['30M', '1D', '1W', '1M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                      timeframe === tf
                        ? 'bg-primary text-deepBlack font-bold shadow-lg shadow-gold/15'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Glowing Area Chart */}
            <div className="h-40 w-full relative flex items-center justify-center">
              {chartLoading ? (
                <div className="flex flex-col items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest">
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
                      activeDot={{ r: 5, fill: '#D4AF37', stroke: '#050505', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </motion.div>

        {/* Auto-Invest Activity */}
        <motion.div variants={fadeInUp} className="px-4 mb-4">
          <div className="p-5 rounded-3xl glass overflow-hidden relative flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Auto-Invest Pulse</p>
                </div>
                <button 
                  className="text-[10px] font-bold text-gray-500 uppercase hover:text-white transition-colors"
                  onClick={() => navigateToVault && navigateToVault('automation')}
                >
                  Configure
                </button>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* 1. Round-Ups Activity */}
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center min-h-[72px]">
                 <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-2">Spare Change Round-Ups</p>
                 {isRoundUpEnabled ? (
                   <div className="h-8 relative overflow-hidden">
                     <AnimatePresence mode="wait">
                       <motion.div
                         key={currentRoundUp.id}
                         initial={{ y: 15, opacity: 0 }}
                         animate={{ y: 0, opacity: 1 }}
                         exit={{ y: -15, opacity: 0 }}
                         className="flex items-center justify-between"
                       >
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[8px] font-bold">
                             {currentRoundUp.merchant[0]}
                           </div>
                           <div>
                             <p className="text-[11px] font-medium text-white">{currentRoundUp.merchant}</p>
                             <p className="text-[9px] text-gray-500">${currentRoundUp.amount.toFixed(2)}</p>
                           </div>
                         </div>
                         <p className="text-xs font-bold text-gold-premium">+${currentRoundUp.roundUp.toFixed(2)}</p>
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
               <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center min-h-[72px]">
                 <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-2">Auto-Pilot Recurring Buy</p>
                 {activeSip ? (
                   <div className="flex items-center justify-between">
                     <div>
                       <p className="text-[11px] font-bold text-white">${activeSip.amount} <span className="text-[9px] text-gray-400 capitalize">/ {activeSip.frequency}</span></p>
                       <p className="text-[8px] text-gray-500 font-bold mt-0.5">
                         Next: {new Date(activeSip.next_execution).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                       </p>
                     </div>
                     <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
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
    </Container>
  );
};

export default Home;
