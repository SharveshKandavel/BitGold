"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { fetchLiveGoldPrice } from "../../lib/goldApi";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

import { useCurrentUser } from "../../hooks/useCurrentUser";

export function RoundUpCalculator() {
  const user = useCurrentUser();
  const executeBuy = useMutation(api.transactions.executeBuy);

  const [purchaseAmount, setPurchaseAmount] = useState("14.37");
  const [isLoading, setIsLoading] = useState(false);
  const [livePrice, setLivePrice] = useState(2664.24);

  const TROY_OZ_TO_GRAMS = 31.1034768;

  useEffect(() => {
    const getPrice = async () => {
      try {
        const newPrice = await fetchLiveGoldPrice();
        setLivePrice(newPrice);
      } catch (err) {
        console.error("Failed to fetch gold price", err);
      }
    };
    getPrice();
    const interval = setInterval(getPrice, 30000);
    return () => clearInterval(interval);
  }, []);

  const pricePerGram = livePrice / TROY_OZ_TO_GRAMS;

  const calculateRoundUp = (amount: string) => {
    const num = parseFloat(amount) || 0;
    if (num <= 0) return { roundUpAmount: 0, goldWeight: 0 };
    const roundedUp = Math.ceil(num);
    const roundUpAmount = roundedUp - num;
    const goldWeight = pricePerGram > 0 ? roundUpAmount / pricePerGram : 0;
    return { roundUpAmount, goldWeight };
  };

  const { roundUpAmount, goldWeight } = calculateRoundUp(purchaseAmount);

  const handleInvest = async () => {
    if (!user) {
      toast.error("Please sign in to invest.");
      return;
    }
    if (roundUpAmount <= 0) {
      toast.error("No spare change to invest.");
      return;
    }

    const cadBalance = user.cadBalance ?? 0;
    if (cadBalance < roundUpAmount) {
      toast.error("Insufficient CAD balance to complete this transaction.");
      return;
    }

    setIsLoading(true);
    try {
      await executeBuy({
        userId: user._id,
        cadAmount: roundUpAmount,
        goldAmount: goldWeight,
        pricePerGram: pricePerGram,
      });
      toast.success(`✅ Saved! Purchased ${goldWeight.toFixed(4)}g of physical gold.`);
      setPurchaseAmount("");
    } catch (error: any) {
      toast.error(error.message || "Failed to invest spare change.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-deepBlack/40 border border-white/10 backdrop-blur-md">
      <h3 className="text-sm font-bold uppercase tracking-widest text-[#D4AF37] mb-4">
        Manual Transaction for round-off
      </h3>
      
      <div className="space-y-4">
        <Input
          id="purchaseAmount"
          label="Enter Test Purchase Amount"
          type="number"
          step="0.01"
          value={purchaseAmount}
          onChange={(e) => setPurchaseAmount(e.target.value)}
          placeholder="0.00"
          disabled={isLoading}
          className="bg-[#1A1A1A] border-white/10 text-white rounded-xl focus:ring-[#D4AF37] focus:border-[#D4AF37]"
        />

        {roundUpAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/5 p-4 rounded-2xl"
          >
            <div className="text-center space-y-1">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Spare change calculation:</div>
              <div className="text-sm font-bold text-gold-premium">
                +${roundUpAmount.toFixed(2)} CAD → ≈ {goldWeight.toFixed(4)}g Gold
              </div>
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleInvest}
          disabled={roundUpAmount <= 0 || isLoading || !user}
          variant="gold"
          className="w-full py-4 rounded-xl text-xs font-black tracking-widest"
        >
          {isLoading ? (
            <LoadingSpinner size={16} />
          ) : (
            "Invest Spare Change"
          )}
        </Button>
      </div>
    </Card>
  );
}
export default RoundUpCalculator;
