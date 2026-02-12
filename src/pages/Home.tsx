import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Container from "../components/ui/Container";
import { Bell, ArrowUp, ArrowDown, ShoppingCart, Lock, CheckCircle2, BarChart } from 'lucide-react';

// Assuming these are available or will be created
import Button from "../components/ui/Button"; // Reusable Button component

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

// --- Mock Data ---
const mockPortfolioValue = 24500.00;
const mockGoldWeight = 285.4;
const mockLivePrice = 85.65; // per unit (e.g., per gram)

const mockRoundUps = [
  { id: 1, merchant: 'Starbucks', amount: 4.50, roundUp: 0.50 },
  { id: 2, merchant: 'Uber', amount: 12.20, roundUp: 0.80 },
  { id: 3, merchant: 'Whole Foods', amount: 84.10, roundUp: 0.90 },
  { id: 4, merchant: 'Coffee Shop', amount: 3.75, roundUp: 0.25 },
];

// --- Animation Variants ---
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

const actionButtonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  whileTap: { scale: 0.95 },
  transition: { type: "spring", stiffness: 400, damping: 20 },
};

const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const [currentRoundUpIndex, setCurrentRoundUpIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoundUpIndex((prevIndex) => (prevIndex + 1) % mockRoundUps.length);
    }, 3000); // Change transaction every 3 seconds
    return () => clearInterval(interval);
  }, [mockRoundUps.length]);

  const currentRoundUp = mockRoundUps[currentRoundUpIndex];

  return (
    <Container className="pt-4 pb-[104px] bg-deepBlack min-h-screen text-white font-sans tracking-tight">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section (Adjusted for mobile, reduced padding) */}
        <motion.div {...fadeInUp} className="flex justify-between items-center px-4 py-3">
          {/* Left: User Avatar */}
          <div className="relative w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center border-2 border-primary overflow-hidden">
            <img src="https://api.dicebear.com/8.x/initials/svg?seed=JD" alt="User Avatar" className="w-full h-full object-cover" />
          </div>

          {/* Right: Bell Icon with Notification Dot */}
          <div className="relative">
            <Bell size={20} className="text-white" />
            <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
          </div>
        </motion.div>

        {/* Hero Balance */}
        <motion.div {...fadeInUp} className="text-center mt-4 mb-6">
          <p className="text-gray-400 text-sm uppercase tracking-widest">Total Portfolio Value</p>
          <motion.p
            className="text-5xl font-thin text-white tracking-tighter mt-1"
            animate={{ scale: [1, 1.01, 1] }} // Subtle breathing effect
            transition={{ duration: 3, repeat: Infinity, ease: "easeOut", repeatType: "mirror" }}
          >
            ${mockPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </motion.p>
          <motion.p
            className="text-primary text-md font-medium mt-1"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            ≈ {mockGoldWeight.toFixed(1)}g
          </motion.p>
        </motion.div>

        {/* The 'Golden Ledger' Widget */}
        <motion.div {...fadeInUp} className="mx-4 mb-6 p-4 rounded-xl relative overflow-hidden
                     bg-gradient-to-r from-white/5 to-transparent border-l-4 border-gold">
          {/* Headline & Pulsing Dot */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <p className="text-sm font-bold text-white">Auto-Invest Active</p>
          </div>
          <p className="text-xs text-gray-400 mb-4">Turning your spare change into real gold.</p>

          {/* Animated Round-Up Transactions */}
          <div className="h-10 relative overflow-hidden"> {/* Fixed height for animation */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={currentRoundUp.id}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-sm text-gray-300">{currentRoundUp.merchant} <span className="text-gray-500 text-xs">${currentRoundUp.amount.toFixed(2)}</span></p>
                </div>
                <p className="text-sm font-bold text-gold drop-shadow-lg shadow-gold ml-4">
                  +${currentRoundUp.roundUp.toFixed(2)} Gold
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Manage Button */}
          <Button
            className="mt-4 w-full bg-white/10 backdrop-blur-md text-white px-3 py-2 rounded-lg text-sm font-semibold"
            onClick={() => setActiveTab('Vault')} // Link to Vault
          >
            Manage Round-Ups
          </Button>
        </motion.div>

        {/* Action Grid (Adjusted for mobile, reduced padding) */}
        <motion.div {...fadeInUp} className="grid grid-cols-4 gap-3 px-4 mb-6">
          {/* Buy Button */}
          <motion.button {...actionButtonVariants} className="flex flex-col items-center" onClick={() => setActiveTab('Trade')}>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary text-xl">
              <ArrowUp />
            </div>
            <span className="text-xs text-gray-300 mt-1">Buy</span>
          </motion.button>

          {/* Sell Button */}
          <motion.button {...actionButtonVariants} className="flex flex-col items-center" onClick={() => setActiveTab('Trade')}>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary text-xl">
              <ArrowDown />
            </div>
            <span className="text-xs text-gray-300 mt-1">Sell</span>
          </motion.button>

          {/* Redeem Physical Button */}
          <motion.button {...actionButtonVariants} className="flex flex-col items-center" onClick={() => setActiveTab('Redeem')}>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary text-xl">
              <ShoppingCart /> {/* Using ShoppingCart for Redeem Physical */}
            </div>
            <span className="text-xs text-gray-300 mt-1">Redeem</span>
          </motion.button>

          {/* Vault Button */}
          <motion.button {...actionButtonVariants} className="flex flex-col items-center" onClick={() => setActiveTab('Vault')}>
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-primary text-xl">
              <Lock />
            </div>
            <span className="text-xs text-gray-300 mt-1">Vault</span>
          </motion.button>
        </motion.div>

        {/* Market Context - Live Gold Price Ticker (Adjusted for mobile) */}
        <motion.div {...fadeInUp} className="mx-4 py-3 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-sm font-medium text-white">
          <div className="flex items-center gap-2">
            <BarChart size={16} className="text-gold" />
            <span>Live Gold Price:</span>
          </div>
          <span className="text-primary">${mockLivePrice.toFixed(2)}/g</span>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Home;
