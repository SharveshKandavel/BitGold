import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Plus } from "lucide-react";
import { useGold } from "../context/GoldContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import { cn } from "../lib/utils"; // Assuming cn utility is available

export function PaymentMethodsPage() {
  const { paymentMethods, selectedPaymentMethod, selectPaymentMethod, addPaymentMethod } = useGold();
  const [showAddMethodTray, setShowAddMethodTray] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");

  const handleAddCard = () => {
    // Basic validation
    if (newCardNumber.length < 16 || newCardExpiry.length < 5) {
      alert("Please enter valid card details.");
      return;
    }

    const newMethod = {
      id: (paymentMethods.length + 1).toString(), // Simple ID generation
      brand: "Visa", // Mock brand
      last4: newCardNumber.slice(-4),
      isActive: true,
    };
    addPaymentMethod(newMethod);
    setNewCardNumber("");
    setNewCardExpiry("");
    setShowAddMethodTray(false);
  };

  return (
    <div className="min-h-[calc(100vh-theme(spacing.16))] bg-[#0D0D0D] text-bitgold-lightGold flex flex-col items-center justify-start pt-8 pb-24 relative overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-8 text-white"
      >
        Payment Methods
      </motion.h1>

      <div className="w-full max-w-sm px-4 space-y-4">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * parseInt(method.id) }}
            className={cn(
              "relative bg-white/5 p-4 rounded-xl shadow-lg backdrop-blur-md cursor-pointer",
              "border border-white/10 transition-all duration-200 ease-in-out",
              selectedPaymentMethod?.id === method.id && "border-[#FFC107] ring-2 ring-[#FFC107]/50"
            )}
            onClick={() => selectPaymentMethod(method.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard size={24} className="text-[#FFC107]" />
                <div>
                  <p className="font-semibold text-white">{method.brand} ending in {method.last4}</p>
                  <p className="text-sm text-gray-400">Card holder name</p> {/* Mock data */}
                </div>
              </div>
              {selectedPaymentMethod?.id === method.id && (
                <span className="text-[#FFC107] text-xs font-medium px-2 py-1 rounded-full bg-[#FFC107]/20">Active</span>
              )}
            </div>
          </motion.div>
        ))}

        <Button
          onClick={() => setShowAddMethodTray(true)}
          className="w-full bg-transparent border border-dashed border-gray-600 text-gray-300 py-3 rounded-xl text-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-colors mt-6"
        >
          <Plus size={24} />
          Add Payment Method
        </Button>
      </div>

      <AnimatePresence>
        {showAddMethodTray && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-[#1A1A1A] rounded-t-3xl shadow-xl p-6 z-50 max-w-md mx-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Add New Card</h2>
              <Button onClick={() => setShowAddMethodTray(false)} className="text-gray-400 hover:text-white">
                Close
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                id="card-number"
                placeholder="Card Number"
                type="text"
                value={newCardNumber}
                onChange={(e) => setNewCardNumber(e.target.value)}
                className="w-full p-3 bg-[#0D0D0D] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-[#FFC107] focus:border-[#FFC107]"
              />
              <Input
                id="card-expiry"
                placeholder="MM/YY"
                type="text"
                value={newCardExpiry}
                onChange={(e) => setNewCardExpiry(e.target.value)}
                className="w-full p-3 bg-[#0D0D0D] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-[#FFC107] focus:border-[#FFC107]"
              />
              <Button
                onClick={handleAddCard}
                className="w-full bg-[#FFC107] text-[#0D0D0D] font-bold py-3 rounded-lg text-lg shadow-lg hover:bg-yellow-400 transition-colors mt-4"
              >
                Save Card
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
