import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../ui/Card';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';
import { Calendar, Trash2, Play } from 'lucide-react';
import { useGold } from '../../context/GoldContext';
import { useAuth } from '@clerk/clerk-react';

type Frequency = 'daily' | 'weekly' | 'monthly';

import { useCurrentUser } from '../../hooks/useCurrentUser';

const SipConfig: React.FC = () => {
  const user = useCurrentUser();
  const { isDemoMode } = useGold();
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const clerkAuth = PUBLISHABLE_KEY ? useAuth() : { isSignedIn: true, isLoaded: true };
  const isAuth = isDemoMode || (clerkAuth.isLoaded && clerkAuth.isSignedIn);

  const recurringBuys = useQuery(api.automation.getRecurringBuys, user ? { userId: user._id } : "skip");
  const createRecurringBuy = useMutation(api.automation.createRecurringBuy);
  const deleteRecurringBuy = useMutation(api.automation.deleteRecurringBuy);

  const [amount, setAmount] = useState(20); // Default to $20
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [goldAccumulation, setGoldAccumulation] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const activePlan = recurringBuys && recurringBuys.length > 0 ? recurringBuys[0] : null;

  const handleActivatePlan = async () => {
    if (!isAuth) {
      toast.error("Please sign in to schedule recurring buys.");
      return;
    }
    if (!user) {
      toast.error("Synchronizing account profile... Please try again in a moment.");
      return;
    }
    setIsSubmitting(true);
    try {
      await createRecurringBuy({
        userId: user._id,
        amount,
        frequency,
      });
      toast.success(`Auto-Pilot activated: $${amount} ${frequency}!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to activate Auto-Pilot plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPlan = async () => {
    if (!activePlan) return;
    setIsSubmitting(true);
    try {
      await deleteRecurringBuy({ buyId: activePlan._id });
      toast.success("Recurring buy plan cancelled.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (activePlan) {
    return (
      <Card className="bg-deepBlack/40 border border-white/10 backdrop-blur-md p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-primary/10">
          <Calendar size={60} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <h3 className="text-xs font-black uppercase tracking-widest text-primary">Active Auto-Pilot Plan</h3>
          </div>

          <h3 className="text-3xl font-light tracking-tight text-white mb-2">
            ${activePlan.amount} <span className="text-sm font-bold uppercase tracking-widest text-gray-500">/ {activePlan.frequency}</span>
          </h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Your systematic plan is active. Next execution: {new Date(activePlan.next_execution).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}.
          </p>

          <div className="h-[1px] w-full bg-white/5 my-6" />

          <button
            onClick={handleCancelPlan}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            <span>Cancel Auto-Pilot</span>
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-deepBlack/40 border border-white/10 backdrop-blur-md p-6">
      <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Auto-Pilot: Recurring Buy</h3>
      <p className="text-xs text-gray-400 mb-6 leading-relaxed">
        Schedule regular automatic purchases of gold to build your wealth steadily over time.
      </p>

      <div className="mb-6">
        <label htmlFor="sip-amount" className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">
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
        <p className="block text-xs text-gray-400 font-bold uppercase tracking-widest mb-2">Frequency:</p>
        <div className="flex bg-deepBlack/60 border border-white/5 rounded-xl p-1">
          {['daily', 'weekly', 'monthly'].map((freq) => (
            <motion.button
              key={freq}
              className={`flex-1 py-2 text-xs font-black uppercase tracking-widest rounded-lg capitalize transition-colors ${
                frequency === freq ? 'bg-primary text-deepBlack shadow-lg shadow-gold/10' : 'text-gray-400 hover:text-white'
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
        className="text-center text-xs p-4 rounded-2xl bg-white/[0.02] border border-white/5 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-gray-400">
          Estimated accumulation: <span className="text-[#D4AF37] font-bold">~{goldAccumulation.toFixed(2)}g</span> of gold by next year.
        </p>
      </motion.div>

      <button
        onClick={handleActivatePlan}
        disabled={isSubmitting}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-gold/20 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Play size={14} fill="black" />
        <span>Activate Auto-Pilot</span>
      </button>
    </Card>
  );
};

export default SipConfig;
