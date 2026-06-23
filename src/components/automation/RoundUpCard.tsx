import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { fetchLiveGoldPrice } from '../../lib/goldApi';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useGold } from '../../context/GoldContext';
import { useAuth } from '@clerk/clerk-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  roundedUp: number;
}

const TROY_OZ_TO_GRAMS = 31.1034768;

const RoundUpCard: React.FC = () => {
  const user = useCurrentUser();
  const { isDemoMode } = useGold();
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const clerkAuth = PUBLISHABLE_KEY ? useAuth() : { isSignedIn: true, isLoaded: true };
  const isAuth = isDemoMode || (clerkAuth.isLoaded && clerkAuth.isSignedIn);

  const executeBuy = useMutation(api.transactions.executeBuy);
  const settings = useQuery(api.automation.getRoundUpSettings, user ? { userId: user._id } : "skip");
  const updateSettings = useMutation(api.automation.updateRoundUpSettings);

  const [isEnabled, setIsEnabled] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [roundUpCount, setRoundUpCount] = useState(0);
  const [livePrice, setLivePrice] = useState(2664.24);

  useEffect(() => {
    if (settings !== undefined && settings !== null) {
      setIsEnabled(settings.enabled);
    }
  }, [settings]);

  useEffect(() => {
    const getPrice = async () => {
      try {
        const newPrice = await fetchLiveGoldPrice();
        setLivePrice(newPrice);
      } catch (err) {
        console.error(err);
      }
    };
    getPrice();
  }, []);

  const pricePerGram = livePrice / TROY_OZ_TO_GRAMS;

  useEffect(() => {
    if (!isEnabled || !user) {
      setTransactions([]);
      return;
    }

    const interval = setInterval(async () => {
      if (roundUpCount >= 6) {
        toast.info("Daily simulated round-up limit reached (6 transactions).");
        setIsEnabled(false);
        return;
      }

      const description = ['Starbucks', 'Grocery Store', 'Coffee Shop', 'Pharmacy', 'Netflix', 'Uber'][Math.floor(Math.random() * 6)];
      const amount = parseFloat((Math.random() * 10 + 1).toFixed(2));
      let roundedUp = 0;

      const remainder = amount % 1;
      if (remainder !== 0) {
        roundedUp = parseFloat((1 - remainder).toFixed(2));
      }

      if (roundedUp > 0) {
        try {
          const goldAmount = roundedUp / pricePerGram;
          
          const currentCadBalance = user.cadBalance ?? 0;
          if (currentCadBalance >= roundedUp) {
            await executeBuy({
              userId: user._id,
              cadAmount: roundedUp,
              goldAmount: goldAmount,
              pricePerGram: pricePerGram,
            });

            const newTransaction: Transaction = {
              id: Date.now(),
              description,
              amount,
              roundedUp,
            };

            setTransactions((prev) => [newTransaction, ...prev].slice(0, 3));
            setRoundUpCount((prev) => prev + 1);
            toast.success(`Invested spare change: +$${roundedUp.toFixed(2)} at ${description}!`);
          } else {
            toast.warning("Round-up paused: Insufficient CAD balance.");
            setIsEnabled(false);
          }
        } catch (error) {
          console.error("Round-up execution failed:", error);
        }
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [isEnabled, user, executeBuy, pricePerGram, roundUpCount]);

  return (
    <div className="card-primary relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="label-section text-gold">Automatic Round-Ups</h3>
        <button
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${
            isEnabled ? 'bg-primary' : 'bg-white/[0.1]'
          }`}
          onClick={async () => {
            if (!isAuth) {
              toast.error("Please sign in to enable round-ups.");
              return;
            }
            if (!user) {
              toast.error("Synchronizing account profile... Please try again in a moment.");
              return;
            }
            const nextState = !isEnabled;
            setIsEnabled(nextState);
            try {
              await updateSettings({
                userId: user._id,
                enabled: nextState,
                multiplier: 1,
                linked_account_mask: "1234",
              });
              toast.success(nextState ? "Automatic Round-Ups enabled!" : "Automatic Round-Ups disabled.");
            } catch (err) {
              console.error(err);
              toast.error("Failed to update settings.");
              setIsEnabled(isEnabled);
            }
          }}
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
        </button>
      </div>

      <p className="label-card leading-relaxed mb-4">
        Automatically invest your spare change from everyday purchases (averaging 5-6 transactions per day). For demonstration, a simulated transaction runs every 45 seconds (max 6).
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
              <p className="text-center label-meta py-4">Waiting for transactions...</p>
            )}
            {transactions.map((tx) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                className="flex justify-between items-center card-secondary p-3"
              >
                <span className="text-xs font-medium text-gray-300">{tx.description} (${tx.amount.toFixed(2)})</span>
                <span className="flex items-center text-gold text-xs font-semibold">
                  <Sparkles size={14} className="text-gold mr-1" />
                  +${tx.roundedUp.toFixed(2)} invested
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 right-4 label-meta">
        Simulated transactions today: <span className="text-primary">{roundUpCount}</span> / 6
      </div>
    </div>
  );
};

export default RoundUpCard;
