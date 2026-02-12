import React from 'react';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { PieChart, Zap, Calendar, ShieldCheck, Package, Wallet, ArrowUp, ArrowDown, Gift } from 'lucide-react';
import { cn } from '../lib/utils';

// --- Mock Data ---
const mockTransactions = [
  { id: 1, type: 'Bought Gold', value: '+5.0g', date: '2 days ago', icon: ArrowUp, iconColor: 'text-green-400' },
  { id: 2, type: 'Received Gift', value: '+0.5g', date: '3 days ago', icon: Gift, iconColor: 'text-primary' },
  { id: 3, type: 'Sold Gold', value: '-2.5g', date: '1 week ago', icon: ArrowDown, iconColor: 'text-red-400' },
  { id: 4, type: 'Bought Gold', value: '+1.0g', date: '1 week ago', icon: ArrowUp, iconColor: 'text-green-400' },
];

interface PortfolioProps {
  // setActiveTab: (tab: string) => void; // Removed as per new spec, will re-add if needed
}

const Portfolio: React.FC<PortfolioProps> = () => {
  // Dummy data for now
  const netWorth = 24500;
  const goldAllocation = 0.98;
  const cashAllocation = 0.02;
  const totalReturn = 12.5;

  // --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};
  return (
    <Container className="pt-4 pb-[104px] bg-deepBlack min-h-screen text-white font-sans tracking-tight">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <h1 className="text-xl font-light text-white">My Wealth</h1>
          <Button variant="ghost" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full w-10 h-10 p-0 flex items-center justify-center">
            <PieChart size={20} className="text-white" />
          </Button>
        </div>

        {/* The 'Wealth Ring' */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 mx-auto mt-8 mb-12 flex items-center justify-center shadow-[0_0_50px_-10px_rgba(212,175,55,0.3)]">
          {/* CSS Conic Gradient Ring */}
          <motion.div
            className="w-full h-full rounded-full"
            style={{
              background: `conic-gradient(from 0deg, #D4AF37 ${goldAllocation * 360}deg, #333 ${goldAllocation * 360}deg)`
            }}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* Mask for the center to create a ring */}
            <div className="absolute inset-[15%] bg-deepBlack rounded-full"></div>
          </motion.div>

          {/* Center Text */}
          <div className="absolute text-center">
            <p className="text-xs text-gray-400 uppercase tracking-widest">Net Worth</p>
            <p className="text-3xl font-light text-white">${netWorth.toLocaleString()}</p>
            <p className="text-green-400 text-sm font-bold">+{totalReturn}%</p>
          </div>
        </div>

        {/* Asset Breakdown List */}
        <div className="px-6 mb-8">
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 mb-3">
            <div className="flex items-center">
              <Package size={20} className="text-gold-400 mr-3" /> {/* Gold Bar */}
              <span className="text-white">Physical Gold</span>
            </div>
            <div className="text-right">
              <p className="text-white">${(netWorth * goldAllocation).toLocaleString()}</p>
              <p className="text-gray-400 text-sm">{(goldAllocation * 100).toFixed(0)}%</p>
            </div>
          </div>
          <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 mb-3">
            <div className="flex items-center">
              <Wallet size={20} className="text-blue-400 mr-3" /> {/* Wallet for Cash */}
              <span className="text-white">Cash Balance</span>
            </div>
            <div className="text-right">
              <p className="text-white">${(netWorth * cashAllocation).toLocaleString()}</p>
              <p className="text-gray-400 text-sm">{(cashAllocation * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        {/* The 'Linked Account' Widget */}
        <div className="mx-6 mb-8 p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
          {/* Left Side */}
          <div>
            <p className="text-xs text-gray-400 mb-1">Primary Funding Source</p>
            <p className="text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Chase Bank •••• 8888
            </p>
          </div>
          {/* Right Side */}
          <Button variant="ghost" className="px-3 py-1 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20 transition">
            Change
          </Button>
        </div>

        {/* Transaction History Section */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="px-6 pb-32">
          <motion.h2 {...fadeInUp} className="text-lg font-light text-white mb-4">Recent Transactions</motion.h2>
          {mockTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              {...fadeInUp}
              transition={{ ...fadeInUp.transition, delay: 0.1 * index + 0.3 }}
              className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 mb-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-deepBlack p-2 rounded-full flex items-center justify-center">
                  <tx.icon size={20} className={tx.iconColor} />
                </div>
                <div>
                  <p className="text-white font-medium">{tx.type}</p>
                  <p className="text-gray-500 text-xs">{tx.date}</p>
                </div>
              </div>
              <p className="text-white font-bold">{tx.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Portfolio;
