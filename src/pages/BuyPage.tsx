import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGold } from "../context/GoldContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { toast } from "sonner"; // For success toast

export function BuyPage() {
  const { goldBalance, cadBalance, addGold, deductCad } = useGold();
  const [cadAmount, setCadAmount] = useState<string>("");
  const [goldAmount, setGoldAmount] = useState<number>(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Hardcoded values for now, could be fetched from an API in a real app
  const goldPricePerGram = 89.24;
  const feePercentage = 0.005; // 0.5% fee

  useEffect(() => {
    const amount = parseFloat(cadAmount);
    if (!isNaN(amount) && amount > 0) {
      const fee = amount * feePercentage;
      const amountAfterFee = amount - fee;
      setGoldAmount(amountAfterFee / goldPricePerGram);
    } else {
      setGoldAmount(0);
    }
  }, [cadAmount]);

  const handleCadAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value)) {
      setCadAmount(value);
    }
  };

  const handleConfirmPurchase = () => {
    const amount = parseFloat(cadAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount to buy gold.");
      return;
    }
    if (amount > cadBalance) {
      toast.error("Insufficient CAD balance to complete this purchase.");
      return;
    }

    setShowSuccessAnimation(true);
    addGold(goldAmount);
    deductCad(amount);

    // Reset after animation
    setTimeout(() => {
      setShowSuccessAnimation(false);
      setCadAmount("");
      setGoldAmount(0);
      toast.success(`Successfully purchased ${goldAmount.toFixed(4)}g of gold!`);
    }, 2000); // Duration of the animation
  };

  const totalAmount = parseFloat(cadAmount) || 0;
  const fee = totalAmount * feePercentage;
  const netInvestment = totalAmount - fee;

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] bg-[#0D0D0D] text-bitgold-lightGold flex flex-col items-center justify-start pt-16 pb-24 relative overflow-hidden">
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-gradient-to-br from-[#FFC107]/50 to-[#FFC107]/0 flex items-center justify-center z-50 rounded-full"
            style={{ borderRadius: '50%', width: '150vw', height: '150vh' }} // Large circle animation
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white text-3xl font-bold"
            >
              Purchase Confirmed!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm flex flex-col items-center gap-6"
      >
        <p className="text-sm font-medium">CAD Balance: ${cadBalance.toFixed(2)}</p>

        <div className="relative w-full text-center">
          <Input
            type="text"
            placeholder="0.00"
            value={cadAmount}
            onChange={handleCadAmountChange}
            className="w-full text-center text-6xl font-bold bg-transparent border-none focus:outline-none caret-[#FFC107] text-[#FFC107] p-0 h-auto"
            inputMode="decimal"
          />
          <span className="absolute left-1/2 -translate-x-1/2 bottom-2 text-2xl font-bold text-[#FFC107] pointer-events-none">
            $
          </span>
        </div>

        {goldAmount > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg text-bitgold-lightGold mt-4"
          >
            You will receive ≈{" "}
            <span className="text-[#FFC107] font-semibold">
              {goldAmount.toFixed(4)}g
            </span>
          </motion.p>
        )}

        <Card className="w-full bg-white/5 p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4 text-white">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Gold Price (per gram):</span>
              <span className="font-medium">${goldPricePerGram.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Investment Amount:</span>
              <span className="font-medium">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-yellow-500">
              <span>Fee ({(feePercentage * 100).toFixed(1)}%):</span>
              <span className="font-medium">-${fee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10 text-white text-lg font-bold">
              <span>Total:</span>
              <span>${netInvestment.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleConfirmPurchase}
          className="w-full bg-[#FFC107] text-[#0D0D0D] font-bold py-3 rounded-full text-lg shadow-lg hover:bg-yellow-400 transition-colors"
          disabled={!cadAmount || parseFloat(cadAmount) <= 0 || showSuccessAnimation}
        >
          Confirm Purchase
        </Button>
      </motion.div>
    </div>
  );
}
