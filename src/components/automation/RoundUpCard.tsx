import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Card from '../ui/Card';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  roundedUp: number;
}

const RoundUpCard: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [roundUpCount, setRoundUpCount] = useState(0);

  useEffect(() => {
    if (!isEnabled) {
      setTransactions([]);
      return;
    }

    const interval = setInterval(() => {
      const newTransaction: Transaction = {
        id: Date.now(),
        description: ['Starbucks', 'Grocery Store', 'Coffee Shop', 'Pharmacy'][Math.floor(Math.random() * 4)],
        amount: parseFloat((Math.random() * 10 + 1).toFixed(2)), // $1.00 - $11.00
        roundedUp: 0,
      };

      const remainder = newTransaction.amount % 1;
      if (remainder !== 0) {
        newTransaction.roundedUp = parseFloat((1 - remainder).toFixed(2));
      }

      if (newTransaction.roundedUp > 0) {
        setTransactions((prev) => [newTransaction, ...prev].slice(0, 3)); // Keep only last 3
        setRoundUpCount((prev) => prev + 1);
      }
    }, 3000); // Simulate a transaction every 3 seconds

    return () => clearInterval(interval);
  }, [isEnabled]);

  return (
    <Card className="bg-deepBlack/40 backdrop-blur-md p-6 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-light tracking-tight text-white">Round-Ups</h3>
        <motion.button
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
            isEnabled ? 'bg-primary' : 'bg-gray-700'
          }`}
          onClick={() => setIsEnabled(!isEnabled)}
          whileTap={{ scale: 0.95 }}
        >
          <motion.span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              isEnabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
          {isEnabled && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ boxShadow: '0 0 0px rgba(212,175,55,0)' }}
              animate={{ boxShadow: '0 0 8px rgba(212,175,55,0.7)' }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            />
          )}
        </motion.button>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        Automatically invest your spare change from everyday purchases.
      </p>

      <AnimatePresence mode="popLayout">
        {isEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2 mt-4"
          >
            {transactions.length === 0 && (
              <p className="text-center text-gray-500 text-sm py-4">Waiting for transactions...</p>
            )}
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                className="flex justify-between items-center bg-deepBlack/60 p-3 rounded-lg text-sm"
              >
                <span>{tx.description} ${tx.amount.toFixed(2)}</span>
                <motion.span
                  className="flex items-center text-primary font-semibold"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <motion.div
                    className="mr-1"
                    initial={{ y: -10, opacity: 0, rotate: -30 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <Sparkles size={16} className="text-primary" />
                  </motion.div>
                  +${tx.roundedUp.toFixed(2)} invested
                </motion.span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute bottom-4 right-4 text-xs text-gray-500"
        key={roundUpCount} // Key change to re-trigger animation
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Total round-ups: <span className="text-primary">{roundUpCount}</span>
      </motion.div>
    </Card>
  );
};

export default RoundUpCard;
