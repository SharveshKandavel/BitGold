import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { PieChart, Package, Wallet, ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';
import { useGold } from '../context/GoldContext';
import { useAuth } from '@clerk/clerk-react';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { fadeIn, staggerContainer, staggerItem } from '../lib/animations';

const GOLD_PRICE_PER_GRAM = 89.24;

interface PortfolioProps {
  setActiveTab?: (tab: string) => void;
}

const Portfolio: React.FC<PortfolioProps> = ({ setActiveTab }) => {
  const user = useCurrentUser();
  const { isDemoMode } = useGold();
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const clerkAuth = PUBLISHABLE_KEY ? useAuth() : { isSignedIn: true, isLoaded: true };
  const isAuth = isDemoMode || (clerkAuth.isLoaded && clerkAuth.isSignedIn);

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

  const isLoaded = !PUBLISHABLE_KEY || clerkAuth.isLoaded;

  if (!isLoaded || user === undefined || (user !== null && transactions === undefined)) {
    return (
      <div className="page-container justify-center items-center">
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  if (user === null && !isAuth) {
    return (
      <div className="page-container justify-center px-6">
        <div className="text-center p-8 card-primary w-full max-w-sm mx-auto">
          <p className="text-gray-400 text-sm mb-4">Please sign in to view your wealth portfolio.</p>
          <Button variant="primary" fullWidth onClick={() => setActiveTab && setActiveTab('Profile')}>
            Go to Profile
          </Button>
        </div>
      </div>
    );
  }

  const transactionsList = transactions ?? [];

  return (
    <div className="page-container">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="page-header px-1">
          <h1 className="page-title">Wealth Portfolio</h1>
          <button 
            className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-colors hover:bg-white/[0.08]"
            onClick={() => setActiveTab && setActiveTab('Activity')}
          >
            <PieChart size={20} />
          </button>
        </motion.div>

        {/* Total Wealth Header */}
        <motion.div variants={staggerItem} className="text-center py-6">
          <p className="label-overline mb-2">Net Worth</p>
          <h2 className="value-hero text-gold-gradient mb-2">
            ${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium">
            <TrendingUp size={16} />
            <span>+${(netWorth * 0.024).toFixed(2)} (24h)</span>
          </div>
        </motion.div>

        {/* Circular Asset Breakdown */}
        <motion.div variants={staggerItem} className="relative w-64 h-64 mx-auto my-8 flex items-center justify-center">
          <motion.div
            className="w-full h-full rounded-full relative"
            style={{
              background: `conic-gradient(from 0deg, #D4AF37 ${goldAllocation * 360}deg, #1e293b ${goldAllocation * 360}deg)`,
            }}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'circOut' }}
          >
            <div className="absolute inset-[12%] bg-deepBlack rounded-full border border-white/[0.08] flex flex-col items-center justify-center shadow-xl">
                <p className="label-overline">Allocation</p>
                <p className="text-lg font-bold">{(goldAllocation * 100).toFixed(0)}% Gold</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Asset Cards */}
        <motion.div variants={staggerItem} className="space-y-3 mb-10">
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
        </motion.div>

        {/* Recent Activity Section */}
        <motion.div variants={staggerItem} className="pb-8">
          <div className="flex justify-between items-end mb-4 ml-1">
            <h2 className="label-section">Recent Activity</h2>
            <button 
              className="label-meta text-gold hover:text-white transition-colors"
              onClick={() => setActiveTab && setActiveTab('Activity')}
            >
              View All
            </button>
          </div>

          <div className="card-primary px-0 py-2">
            {transactionsList.length === 0 ? (
              <div className="p-6 text-center border-dashed border-white/[0.08]">
                <p className="label-card">No transactions found.</p>
                <Button 
                  variant="ghost" 
                  className="mt-2 text-primary text-xs"
                  onClick={() => setActiveTab && setActiveTab('Trade')}
                >
                  Start Investing
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                {transactionsList.slice(0, 4).map((tx, idx, arr) => (
                  <TransactionItem key={tx._id} tx={tx} isLast={idx === arr.length - 1} />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const AssetCard = ({ icon: Icon, label, value, subValue, percent, color }: any) => (
  <div className="card-secondary flex items-center justify-between group transition-colors hover:bg-white/[0.05]">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl ${color}/10 flex items-center justify-center text-white`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="label-meta">{subValue}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-sm font-semibold text-white">{value}</p>
      <div className="flex items-center justify-end gap-2 mt-1">
        <div className="h-1 w-12 bg-white/[0.05] rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full`} style={{ width: `${percent * 100}%` }} />
        </div>
        <span className="label-meta">{(percent * 100).toFixed(0)}%</span>
      </div>
    </div>
  </div>
);

const TransactionItem = ({ tx, isLast }: { tx: any, isLast: boolean }) => {
  const isBuy = tx.type === 'buy';
  const isSell = tx.type === 'sell';
  const isDeposit = tx.type === 'deposit';
  const isWithdraw = tx.type === 'withdraw';
  const isRedeem = tx.type === 'redeem';

  let Icon = ArrowUp;
  let iconBg = 'bg-emerald-500/10';
  let iconColor = 'text-emerald-400';
  let title = "Transaction";
  let cadDisplay = `$${tx.cadAmount.toFixed(2)}`;
  let goldDisplay = `${tx.goldAmount.toFixed(4)}g`;

  if (isBuy) {
    Icon = ArrowUp;
    iconBg = 'bg-emerald-500/10';
    iconColor = 'text-emerald-400';
    title = "Bought Gold";
    cadDisplay = `$${tx.cadAmount.toFixed(2)}`;
    goldDisplay = `+${tx.goldAmount.toFixed(4)}g`;
  } else if (isSell) {
    Icon = ArrowDown;
    iconBg = 'bg-red-500/10';
    iconColor = 'text-red-400';
    title = "Sold Gold";
    cadDisplay = `$${tx.cadAmount.toFixed(2)}`;
    goldDisplay = `-${tx.goldAmount.toFixed(4)}g`;
  } else if (isDeposit) {
    Icon = ArrowUp;
    iconBg = 'bg-emerald-500/10';
    iconColor = 'text-emerald-400';
    title = "Deposited Funds";
    cadDisplay = `+$${tx.cadAmount.toFixed(2)}`;
    goldDisplay = "";
  } else if (isWithdraw) {
    Icon = ArrowDown;
    iconBg = 'bg-amber-500/10';
    iconColor = 'text-amber-400';
    title = "Withdrew Funds";
    cadDisplay = `-$${tx.cadAmount.toFixed(2)}`;
    goldDisplay = "";
  } else if (isRedeem) {
    Icon = ArrowDown;
    iconBg = 'bg-red-500/10';
    iconColor = 'text-red-400';
    title = "Redeemed Gold";
    cadDisplay = "Redemption";
    goldDisplay = `-${tx.goldAmount.toFixed(4)}g`;
  }

  return (
    <div className={`card-flat flex items-center justify-between group transition-colors hover:bg-white/[0.02] px-4 ${isLast ? 'border-b-0' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center ${iconColor}`}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{title}</p>
          <p className="label-timestamp">
            {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </div>
      </div>
      <div className="text-right">
        {goldDisplay && <p className="text-sm font-medium text-white">{goldDisplay}</p>}
        <p className="label-meta">{cadDisplay}</p>
      </div>
    </div>
  );
};

export default Portfolio;
