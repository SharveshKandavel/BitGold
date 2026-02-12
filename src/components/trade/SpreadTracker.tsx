import React from 'react';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface SpreadTrackerProps {
  buyPrice?: number;
  sellPrice?: number;
}

const SpreadTracker: React.FC<SpreadTrackerProps> = ({ buyPrice = 85.50, sellPrice = 84.90 }) => {
  const spread = useMemo(() => {
    if (!buyPrice || !sellPrice) return 0;
    return ((buyPrice - sellPrice) / buyPrice) * 100;
  }, [buyPrice, sellPrice]);

  const isLowSpread = spread <= 0.8; // Example threshold for a "good deal"

  return (
    <motion.div
      className="absolute top-4 right-4 bg-deepBlack/60 backdrop-blur-md px-3 py-1 rounded-full text-xs text-gray-400 border border-white/10 flex items-center space-x-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <span>Buy: <span className="text-white">${buyPrice.toFixed(2)}</span></span>
      <span>|</span>
      <span>Sell: <span className="text-white">${sellPrice.toFixed(2)}</span></span>
      <span>|</span>
      <span>
        Spread:
        <motion.span
          className={`ml-1 font-semibold ${isLowSpread ? 'text-primary drop-shadow-gold' : 'text-white'}`}
          animate={isLowSpread ? { opacity: [1, 0.7, 1] } : {}}
          transition={isLowSpread ? { repeat: Infinity, duration: 2 } : {}}
        >
          {spread.toFixed(1)}%
        </motion.span>
      </span>
    </motion.div>
  );
};

export default SpreadTracker;
