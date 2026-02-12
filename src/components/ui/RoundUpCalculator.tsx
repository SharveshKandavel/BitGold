"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { toast } from "sonner";
import Card from "./Card";
import Input from "./Input";
import Button from "./Button";
import LoadingSpinner from "./LoadingSpinner";

export function RoundUpCalculator() {
  const [purchaseAmount, setPurchaseAmount] = useState("14.37");
  const [isLoading, setIsLoading] = useState(false);
  const goldPricePerGram = 94.27;

  const calculateRoundUp = (amount: string) => {
    const num = parseFloat(amount) || 0;
    const roundedUp = Math.ceil(num);
    const roundUpAmount = roundedUp - num;
    const goldAmount = (roundUpAmount / goldPricePerGram) * 1000;
    return { roundUpAmount, goldAmount };
  };

  const { roundUpAmount, goldAmount } = calculateRoundUp(purchaseAmount);

  const handleInvest = async () => {
    setIsLoading(true);
    // Simulate a Convex mutation call
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

    try {
      // In a real app, this would be a Convex mutation:
      // await addTransaction({ type: "round_up", amount: roundUpAmount, gold: goldAmount });
      toast.success(`✅ ${goldAmount.toFixed(1)}mg gold added to your vault!`);
    } catch (error) {
      toast.error("❌ Failed to invest spare change.");
      console.error("Investment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-title-md mb-4">
        Round Up Your Purchase
      </h3>
      
      <div className="space-y-4">
        <Input
          id="purchaseAmount"
          label="Purchase Amount"
          type="number"
          step="0.01"
          value={purchaseAmount}
          onChange={(e) => setPurchaseAmount(e.target.value)}
          placeholder="0.00"
          disabled={isLoading}
        />

        {roundUpAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bitgold-700/50 border border-bitgold-700 p-4 rounded-container"
          >
            <div className="text-center space-y-2">
              <div className="text-sm text-subtle">Round up calculation:</div>
              <div className="text-lg font-bold text-bitgold-lightGold">
                +${roundUpAmount.toFixed(2)} → {goldAmount.toFixed(1)}mg gold
              </div>
            </div>
          </motion.div>
        )}

        <Button
          onClick={handleInvest}
          disabled={roundUpAmount <= 0 || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            "Invest This Change"
          )}
        </Button>
      </div>
    </Card>
  );
}
