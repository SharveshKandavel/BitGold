import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, CreditCard, Plus, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BankAccount {
  id: string;
  bank_name: string;
  last4: string;
  type: 'checking' | 'savings';
}

const mockBankAccounts: BankAccount[] = [
  { id: '1', bank_name: 'Bank of America', last4: '1234', type: 'checking' },
  { id: '2', bank_name: 'Wells Fargo', last4: '5678', type: 'savings' },
];

interface SellFlowProps {
  onSellComplete: (amount: number) => void;
  goldAmount: number; // Amount of gold to sell, passed from parent
}

const SellFlow: React.FC<SellFlowProps> = ({ onSellComplete, goldAmount }) => {
  const [selectedBank, setSelectedBank] = useState<BankAccount | null>(mockBankAccounts[0] || null);
  const [isSliding, setIsSliding] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [fundsSent, setFundsSent] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const handleSlide = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current || processing || fundsSent) return;

    const sliderRect = sliderRef.current.getBoundingClientRect();
    const clientX = event.clientX;
    const newProgress = Math.max(0, Math.min(1, (clientX - sliderRect.left) / sliderRect.width));
    setSlideProgress(newProgress);

    if (newProgress >= 0.95 && !isSliding) { // Threshold for completion
      setIsSliding(true);
      setProcessing(true);
      // Simulate API call
      setTimeout(() => {
        setProcessing(false);
        setFundsSent(true);
        toast.success(`$${goldAmount.toFixed(2)} sent to your bank!`, {
          description: `Funds transferred to ${selectedBank?.bank_name} (...${selectedBank?.last4}).`,
        });
        onSellComplete(goldAmount); // Notify parent of completion
        setTimeout(() => {
          // Reset after a short delay
          setFundsSent(false);
          setSlideProgress(0);
          setIsSliding(false);
        }, 3000);
      }, 2000);
    }
  };

  const handlePointerUp = () => {
    if (!isSliding) {
      setSlideProgress(0); // Snap back if not fully slid
    }
  };


  return (
    <div className="space-y-6">
      {/* Bank Selector */}
      <div>
        <h3 className="text-lg font-light tracking-tight text-white mb-3">Send to:</h3>
        {mockBankAccounts.length > 0 ? (
          <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-hide">
            {mockBankAccounts.map((bank) => (
              <motion.button
                key={bank.id}
                className={`flex-shrink-0 p-4 rounded-xl border transition-all duration-200 ${
                  selectedBank?.id === bank.id
                    ? 'border-primary bg-deepBlack/60 shadow-lg'
                    : 'border-white/10 bg-deepBlack/40 hover:border-white/20'
                }`}
                onClick={() => setSelectedBank(bank)}
                whileTap={{ scale: 0.98 }}
              >
                {bank.type === 'checking' ? <Banknote className="mb-2 text-gray-400" /> : <CreditCard className="mb-2 text-gray-400" />}
                <p className="text-sm text-white">{bank.bank_name}</p>
                <p className="text-xs text-gray-400">...{bank.last4}</p>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center rounded-xl border border-white/10 bg-deepBlack/40 text-gray-400">
            <Plus size={24} className="mx-auto mb-2" />
            <p className="text-sm">Link New Bank Account</p>
          </div>
        )}
      </div>

      {/* Slide to Cash Out */}
      <div className="relative w-full h-16 bg-deepBlack/60 rounded-full flex items-center justify-start p-2 border border-white/10 overflow-hidden">
        <AnimatePresence initial={false}>
          {processing ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-primary/20 text-primary font-semibold rounded-full"
            >
              <Loader2 className="animate-spin mr-2" size={20} />
              Processing...
            </motion.div>
          ) : fundsSent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-green-500/20 text-green-400 font-semibold rounded-full"
            >
              <CheckCircle className="mr-2" size={20} />
              Funds Sent!
            </motion.div>
          ) : (
            <motion.div
              key="slider"
              ref={sliderRef}
              className="w-full h-full absolute top-0 left-0"
              onPointerMove={handleSlide}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp} // Also reset if pointer leaves the area
            >
              <motion.div
                className="absolute left-1 top-1 w-14 h-14 bg-primary rounded-full flex items-center justify-center cursor-grab"
                style={{ x: slideProgress * (sliderRef.current ? sliderRef.current.offsetWidth - 70 : 0) }}
                drag="x"
                dragConstraints={{ left: 0, right: sliderRef.current ? sliderRef.current.offsetWidth - 70 : 0 }}
                dragElastic={0}
                onDragStart={() => setSlideProgress(0)}
                onDragEnd={(event, info) => {
                  if (info.point.x / (sliderRef.current?.offsetWidth || 1) > 0.8) { // Check if dragged far enough
                    // Handle actual sell logic here
                    setProcessing(true);
                    setTimeout(() => {
                      setProcessing(false);
                      setFundsSent(true);
                      toast.success(`$${goldAmount.toFixed(2)} sent to your bank!`, {
                        description: `Funds transferred to ${selectedBank?.bank_name} (...${selectedBank?.last4}).`,
                      });
                      onSellComplete(goldAmount); // Notify parent of completion
                      setTimeout(() => {
                        setFundsSent(false);
                        setSlideProgress(0);
                        setIsSliding(false);
                      }, 3000);
                    }, 2000);
                  } else {
                    setSlideProgress(0); // Snap back
                  }
                }}
              >
                <Banknote className="text-deepBlack" size={24} />
              </motion.div>
              <span className="absolute left-1/2 -translate-x-1/2 text-white font-medium">
                Slide to Cash Out
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SellFlow;
