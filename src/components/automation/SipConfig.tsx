import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';

type Frequency = 'daily' | 'weekly' | 'monthly';

const SipConfig: React.FC = () => {
  const [amount, setAmount] = useState(20); // Default to $20
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [goldAccumulation, setGoldAccumulation] = useState(0);

  // Placeholder for current gold price (e.g., $2000/ounce, 1 ounce = 31.1 grams)
  const GOLD_PRICE_PER_GRAM = 64.3; // Example: 2000 / 31.1

  useEffect(() => {
    // Calculate estimated gold accumulation
    let annualInvestment = 0;
    if (frequency === 'daily') {
      annualInvestment = amount * 365;
    } else if (frequency === 'weekly') {
      annualInvestment = amount * 52;
    } else { // monthly
      annualInvestment = amount * 12;
    }
    setGoldAccumulation(annualInvestment / GOLD_PRICE_PER_GRAM);
  }, [amount, frequency]);

  return (
    <Card className="bg-deepBlack/40 backdrop-blur-md p-6">
      <h3 className="text-xl font-light tracking-tight text-white mb-4">Auto-Pilot: Recurring Buy</h3>

      <div className="mb-6">
        <label htmlFor="sip-amount" className="block text-sm text-gray-400 mb-2">
          Amount: <span className="text-primary font-semibold">${amount}</span>
        </label>
        <input
          id="sip-amount"
          type="range"
          min="5"
          max="100"
          step="5"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>$5</span>
          <span>$100</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="block text-sm text-gray-400 mb-2">Frequency:</p>
        <div className="flex bg-deepBlack/60 rounded-lg p-1">
          {['daily', 'weekly', 'monthly'].map((freq) => (
            <motion.button
              key={freq}
              className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                frequency === freq ? 'bg-primary text-deepBlack' : 'text-gray-300'
              }`}
              onClick={() => setFrequency(freq as Frequency)}
              whileTap={{ scale: 0.95 }}
            >
              {freq}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        className="text-center text-sm p-4 rounded-lg bg-deepBlack/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-gray-300">
          You will accumulate <span className="text-primary font-semibold">~{goldAccumulation.toFixed(2)}g</span> of gold by next year.
        </p>
      </motion.div>
    </Card>
  );
};

export default SipConfig;
