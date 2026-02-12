import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import Button from '../ui/Button'; // Assuming a Button component exists

interface TradeInputModalProps {
  tradeMode: 'Buy' | 'Sell';
  livePrice: number;
  onClose: () => void;
  onReviewOrder: (mode: 'Buy' | 'Sell', amount: number) => void;
}

const quickAmounts = [10, 50, 100, 'Max'];

const TradeInputModal: React.FC<TradeInputModalProps> = ({ tradeMode, livePrice, onClose, onReviewOrder }) => {
  const [amount, setAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleQuickSelect = (value: number | 'Max') => {
    if (value === 'Max') {
      setAmount('1000'); // Dummy max for now
    } else {
      setAmount(String(value));
    }
  };

  const goldWeight = useMemo(() => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0 || livePrice <= 0) return '0.00';
    return (numAmount / livePrice).toFixed(2);
  }, [amount, livePrice]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="fixed bottom-[88px] left-0 right-0 bg-deepBlack/80 rounded-t-3xl border-t border-white/10 p-6 z-20"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-light tracking-tight text-white">{tradeMode} Gold</h2>
          <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </Button>
        </div>

        {/* Input */}
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          placeholder="0.00"
          className="text-3xl text-white bg-transparent text-center focus:outline-none w-full placeholder-white/20 font-light tracking-tighter mb-4"
        />
        <p className="text-center text-sm text-gray-400 mt-1">
          {`≈ ${goldWeight}g Gold`}
        </p>

        {/* Quick Pills */}
        <div className="flex justify-center gap-2 mb-6">
          {quickAmounts.map((qAmount) => (
            <motion.button
              key={qAmount}
              onClick={() => handleQuickSelect(qAmount)}
              className="px-4 py-2 rounded-full text-sm font-medium bg-white/5 text-gray-300 backdrop-blur-md border border-white/10"
              whileTap={{ scale: 0.95 }}
            >
              {qAmount === 'Max' ? 'Max' : `$${qAmount}`}
            </motion.button>
          ))}
        </div>

        {/* Review Order Button */}
        <motion.button
          className="w-full py-4 bg-primary text-deepBlack font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center"
          onClick={() => onReviewOrder(tradeMode, Number(amount))}
          disabled={!amount || Number(amount) <= 0}
          whileTap={{ scale: 0.95 }}
        >
          Review Order
          <ArrowRight size={20} className="ml-2" />
        </motion.button>
      </motion.div>
    </AnimatePresence>
  );
};

export default TradeInputModal;
