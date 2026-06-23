import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { toast } from 'sonner';
import { Calendar, Trash2, Play } from 'lucide-react';
import { useGold } from '../../context/GoldContext';
import { useAuth } from '@clerk/clerk-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

type Frequency = 'daily' | 'weekly' | 'monthly';

const SipConfig: React.FC = () => {
  const user = useCurrentUser();
  const { isDemoMode } = useGold();
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const clerkAuth = PUBLISHABLE_KEY ? useAuth() : { isSignedIn: true, isLoaded: true };
  const isAuth = isDemoMode || (clerkAuth.isLoaded && clerkAuth.isSignedIn);

  const recurringBuys = useQuery(api.automation.getRecurringBuys, user ? { userId: user._id } : "skip");
  const createRecurringBuy = useMutation(api.automation.createRecurringBuy);
  const deleteRecurringBuy = useMutation(api.automation.deleteRecurringBuy);

  const [amount, setAmount] = useState(20);
  const [frequency, setFrequency] = useState<Frequency>('weekly');
  const [goldAccumulation, setGoldAccumulation] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const GOLD_PRICE_PER_GRAM = 64.3;

  useEffect(() => {
    let annualInvestment = 0;
    if (frequency === 'daily') {
      annualInvestment = amount * 365;
    } else if (frequency === 'weekly') {
      annualInvestment = amount * 52;
    } else {
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
      <div className="card-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 text-primary/[0.05]">
          <Calendar size={80} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" />
            <h3 className="label-overline text-primary">Active Auto-Pilot Plan</h3>
          </div>

          <h3 className="value-lg tracking-tight text-white mb-1">
            ${activePlan.amount} <span className="label-meta uppercase">/ {activePlan.frequency}</span>
          </h3>
          <p className="label-card mb-6">
            Your systematic plan is active. Next execution: {new Date(activePlan.next_execution).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}.
          </p>

          <div className="h-[1px] w-full bg-white/[0.08] my-6" />

          <button
            onClick={handleCancelPlan}
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={14} />
            <span>Cancel Auto-Pilot</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-primary">
      <h3 className="label-section text-gold mb-2">Auto-Pilot: Recurring Buy</h3>
      <p className="label-card leading-relaxed mb-6">
        Schedule regular automatic purchases of gold to build your wealth steadily over time.
      </p>

      <div className="mb-6">
        <label htmlFor="sip-amount" className="block label-overline mb-2">
          Amount: <span className="text-primary">${amount}</span>
        </label>
        <input
          id="sip-amount"
          type="range"
          min="5"
          max="100"
          step="5"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2 bg-white/[0.1] rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between label-meta mt-2">
          <span>$5</span>
          <span>$100</span>
        </div>
      </div>

      <div className="mb-6">
        <p className="block label-overline mb-2">Frequency:</p>
        <div className="flex bg-white/[0.03] border border-white/[0.05] rounded-xl p-1">
          {['daily', 'weekly', 'monthly'].map((freq) => (
            <button
              key={freq}
              className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${
                frequency === freq ? 'bg-primary text-black' : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setFrequency(freq as Frequency)}
            >
              {freq}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center card-secondary mb-6">
        <p className="text-xs text-gray-400">
          Estimated accumulation: <span className="text-gold font-semibold">~{goldAccumulation.toFixed(2)}g</span> of gold by next year.
        </p>
      </div>

      <button
        onClick={handleActivatePlan}
        disabled={isSubmitting}
        className="btn-gold w-full flex items-center justify-center gap-2"
      >
        <Play size={14} fill="black" />
        <span>Activate Auto-Pilot</span>
      </button>
    </div>
  );
};

export default SipConfig;
