import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion, Variants } from 'framer-motion';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { PieChart, Package, Wallet, ArrowUp, ArrowDown, ChevronRight, TrendingUp } from 'lucide-react';

const GOLD_PRICE_PER_GRAM = 89.24;

interface PortfolioProps {
  setActiveTab?: (tab: string) => void;
}

import { useCurrentUser } from '../hooks/useCurrentUser';

const Portfolio: React.FC<PortfolioProps> = ({ setActiveTab }) => {
  const user = useCurrentUser();
  const transactions = useQuery(
    api.transactions.getUserTransactions,
    user ? { userId: user._id } : 'skip',
  );

  const cadBalance = user?.cadBalance ?? 0;
  const goldBalance = user?.goldBalance ?? 0;
  const goldValue = goldBalance * GOLD_PRICE_PER_GRAM;
  const netWorth = cadBalance + goldValue;
  const goldAllocation = netWorth > 0 ? goldValue / netWorth : 0;
  const cashAllocation = netWorth > 0 ? cadBalance / netWorth : 0;
  const totalReturn = 2.4; // Mock return

  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  const staggerContainer: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  if (user === undefined) {
    return (
      <Container className="pt-4 pb-24 bg-deepBlack h-full flex items-center justify-center">
        <LoadingSpinner size={32} className="text-primary" />
      </Container>
    );
  }

  if (user === null) {
    return (
      <Container className="pt-4 pb-24 bg-deepBlack h-full flex items-center justify-center px-6">
        <div className="text-center p-8 glass rounded-3xl border border-white/10 w-full max-w-sm">
          <p className="text-gray-400 text-sm mb-4">Please sign in to view your wealth portfolio.</p>
          <Button variant="primary" className="w-full" onClick={() => setActiveTab && setActiveTab('Profile')}>
            Go to Profile
          </Button>
        </div>
      </Container>
    );
  }

  if (transactions === undefined) {
    return (
      <Container className="pt-4 pb-24 bg-deepBlack h-full flex items-center justify-center">
        <LoadingSpinner size={32} className="text-primary" />
      </Container>
    );
  }

  return (
    <Container className="pt-4 pb-24 bg-deepBlack h-full overflow-y-auto hide-scrollbar text-white font-sans">
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">Wealth Portfolio</h1>
          <button 
            className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white"
            onClick={() => setActiveTab && setActiveTab('Activity')}
          >
            <PieChart size={20} />
          </button>
        </motion.div>

        {/* Total Wealth Header */}
        <motion.div variants={fadeInUp} className="text-center py-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-2">Net Worth</p>
          <h2 className="text-5xl font-light tracking-tighter mb-2 text-gold-premium">
            ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center justify-center gap-2 text-green-400 text-xs font-bold">
            <TrendingUp size={14} />
            <span>+${(netWorth * 0.024).toFixed(2)} (24h)</span>
          </div>
        </motion.div>

        {/* Circular Asset Breakdown */}
        <motion.div variants={fadeInUp} className="relative w-64 h-64 mx-auto my-8 flex items-center justify-center">
          {/* Outer Ring Glow */}
          <div className="absolute inset-0 rounded-full border border-white/5 bg-primary/5 blur-2xl" />
          
          <motion.div
            className="w-full h-full rounded-full relative"
            style={{
              background: `conic-gradient(from 0deg, #D4AF37 ${goldAllocation * 360}deg, #1e293b ${goldAllocation * 360}deg)`,
            }}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          >
            <div className="absolute inset-[12%] bg-deepBlack rounded-full border border-white/5 flex flex-col items-center justify-center shadow-2xl">
                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Allocation</p>
                <p className="text-lg font-bold">{(goldAllocation * 100).toFixed(0)}% Gold</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Asset Cards */}
        <div className="px-6 space-y-3 mb-10">
          <AssetCard 
            icon={Package} 
            label="Physical Gold" 
            value={`$${goldValue.toLocaleString()}`} 
            subValue={`${goldBalance.toFixed(3)}g`} 
            percent={goldAllocation}
            color="bg-primary"
          />
          <AssetCard 
            icon={Wallet} 
            label="Cash Reserve" 
            value={`$${cadBalance.toLocaleString()}`} 
            subValue="CAD" 
            percent={cashAllocation}
            color="bg-blue-500"
          />
        </div>

        {/* Recent Activity Section */}
        <motion.div variants={fadeInUp} className="px-6 pb-32">
          <div className="flex justify-between items-end mb-6 ml-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500">Recent Activity</h2>
            <button 
              className="text-[10px] font-bold text-primary uppercase"
              onClick={() => setActiveTab && setActiveTab('Activity')}
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {transactions.length === 0 ? (
              <div className="p-8 glass rounded-3xl text-center border-dashed border-white/10">
                <p className="text-gray-500 text-xs font-medium">No transactions found.</p>
                <Button 
                  variant="ghost" 
                  className="mt-2 text-primary text-[10px]"
                  onClick={() => setActiveTab && setActiveTab('Trade')}
                >
                  Start Investing
                </Button>
              </div>
            ) : (
              transactions.slice(0, 4).map((tx) => (
                <TransactionItem key={tx._id} tx={tx} />
              ))
            )}
          </div>
        </motion.div>
      </motion.div>
    </Container>
  );
};

const AssetCard = ({ icon: Icon, label, value, subValue, percent, color }: any) => (
  <div className="p-5 rounded-3xl glass border border-white/5 flex items-center justify-between group hover:bg-white/10 transition-all">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl ${color}/10 flex items-center justify-center text-white`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{subValue}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-bold">{value}</p>
      <div className="flex items-center justify-end gap-2 mt-1">
        <div className="h-1 w-12 bg-white/5 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${percent * 100}%` }} />
        </div>
        <span className="text-[10px] text-gray-500 font-bold">{(percent * 100).toFixed(0)}%</span>
      </div>
    </div>
  </div>
);

const TransactionItem = ({ tx }: any) => {
  const isBuy = tx.type === 'buy';
  const Icon = isBuy ? ArrowUp : ArrowDown;
  const iconBg = isBuy ? 'bg-green-500/10' : 'bg-red-500/10';
  const iconColor = isBuy ? 'text-green-400' : 'text-red-400';

  return (
    <div className="p-4 glass-dark rounded-2xl flex items-center justify-between group hover:border-white/20 transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-xs font-bold">{isBuy ? 'Bought Gold' : 'Sold Gold'}</p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-bold">{isBuy ? '+' : '-'}{tx.goldAmount.toFixed(4)}g</p>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">${tx.cadAmount.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Portfolio;
