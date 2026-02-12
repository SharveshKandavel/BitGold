import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { Gem } from "lucide-react"; // Import Gem icon

interface PortfolioCardProps {
  totalGold: number;
  currentValue: number;
  totalInvested: number;
}

export function PortfolioCard({ totalGold, currentValue, totalInvested }: PortfolioCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPercentage, setShowPercentage] = useState(true);
  const gainLoss = currentValue - totalInvested;
  const gainLossPercentage = ((gainLoss / totalInvested) * 100);
  const isPositive = gainLoss >= 0;

  // Mock data for recent transactions
  const recentTransactions = [
    { type: 'Buy', amount: 0.005, value: 9.75, date: '2023-10-26' },
    { type: 'Round-up', amount: 0.0001, value: 0.19, date: '2023-10-25' },
    { type: 'Buy', amount: 0.01, value: 19.50, date: '2023-10-20' },
  ];

  return (
    <div className="border-t-4 border-bitgold-gold">
      <div 
        className="flex items-center gap-2 mb-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Gem size={24} className="text-white" /> {/* Replaced emoji with Gem icon */}
        <h3 className="text-xl font-bold text-white">Your Gold Portfolio</h3>
        <span className="ml-auto text-darkGray">{isExpanded ? '▲' : '▼'}</span>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        <div className="text-center">
          <div className="text-title-lg text-bitgold-gold mb-1">
            {totalGold.toFixed(3)}g
          </div>
          <div className="text-sm text-darkGray uppercase tracking-wide">Total Gold Owned</div>
        </div>
        
        <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
          <div className="flex justify-between items-center">
            <div className="text-sm text-darkGray">Current Value</div>
            <div className="text-lg text-white">
              ${currentValue.toFixed(2)}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm text-darkGray">Total Invested</div>
            <div className="text-lg text-white">
              ${totalInvested.toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center items-center gap-2 pt-2">
          <div className={cn(
            "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
            isPositive 
              ? "bg-[#4ADE80]/20 text-[#4ADE80]" 
              : "bg-red-500/20 text-red-400"
          )}>
            {showPercentage ? (
              <span>{isPositive ? "+" : ""}{gainLossPercentage.toFixed(1)}%</span>
            ) : (
              <span>{isPositive ? "+" : ""}${gainLoss.toFixed(2)}</span>
            )}
          </div>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowPercentage(!showPercentage); }}
            className="text-xs text-darkGray px-2 py-1 rounded-full border border-white/10"
          >
            {showPercentage ? '$' : '%'}
          </button>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ overflow: 'hidden' }}
      >
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <h4 className="text-sm font-bold text-white mb-2">Recent Activity</h4>
            <div className="space-y-2">
              {recentTransactions.map((tx, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-darkGray">{tx.date}</span>
                  <span className="text-white">{tx.type}: {tx.amount}g (${tx.value.toFixed(2)})</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
