import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion } from 'framer-motion';
import { CirclePlus, CircleMinus } from 'lucide-react';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { staggerContainer, staggerItem } from '../lib/animations';

interface ActivityProps {
  setActiveTab?: (tab: string) => void;
}

const Activity: React.FC<ActivityProps> = ({ setActiveTab }) => {
  const user = useCurrentUser();
  const transactions = useQuery(
    api.transactions.getUserTransactions,
    user ? { userId: user._id } : "skip",
  );

  if (user === undefined || (user && transactions === undefined)) {
    return (
      <div className="page-container justify-center items-center">
        <LoadingSpinner size={32} className="text-primary" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <motion.div
        className="space-y-4 pb-32"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.div variants={staggerItem} className="page-header px-1">
          <h1 className="page-title">Activity</h1>
        </motion.div>
        
        {!user ? (
          <motion.div variants={staggerItem} className="card-primary">
            <p className="text-center label-card">Sign in to view your activity.</p>
          </motion.div>
        ) : transactions && transactions.length > 0 ? (
          <motion.div variants={staggerItem} className="card-primary px-0 py-2">
            {transactions.map((tx, idx, arr) => {
              const isBuy = tx.type === 'buy';
              const isSell = tx.type === 'sell';
              const isDeposit = tx.type === 'deposit';
              const isWithdraw = tx.type === 'withdraw';
              const isRedeem = tx.type === 'redeem';

              let icon = <CirclePlus size={20} className="text-emerald-400" />;
              let iconBg = 'bg-emerald-500/10';
              let title = "Transaction";
              let cadDisplay = `$${tx.cadAmount.toFixed(2)}`;
              let goldDisplay = `${tx.goldAmount.toFixed(4)}g`;

              if (isBuy) {
                icon = <CirclePlus size={20} className="text-emerald-400" />;
                iconBg = 'bg-emerald-500/10';
                title = "Bought Gold";
                cadDisplay = `$${tx.cadAmount.toFixed(2)}`;
                goldDisplay = `+${tx.goldAmount.toFixed(4)}g`;
              } else if (isSell) {
                icon = <CircleMinus size={20} className="text-red-400" />;
                iconBg = 'bg-red-500/10';
                title = "Sold Gold";
                cadDisplay = `$${tx.cadAmount.toFixed(2)}`;
                goldDisplay = `-${tx.goldAmount.toFixed(4)}g`;
              } else if (isDeposit) {
                icon = <CirclePlus size={20} className="text-emerald-400" />;
                iconBg = 'bg-emerald-500/10';
                title = "Deposited Funds";
                cadDisplay = `+$${tx.cadAmount.toFixed(2)}`;
                goldDisplay = "";
              } else if (isWithdraw) {
                icon = <CircleMinus size={20} className="text-amber-400" />;
                iconBg = 'bg-amber-500/10';
                title = "Withdrew Funds";
                cadDisplay = `-$${tx.cadAmount.toFixed(2)}`;
                goldDisplay = "";
              } else if (isRedeem) {
                icon = <CircleMinus size={20} className="text-red-400" />;
                iconBg = 'bg-red-500/10';
                title = "Redeemed Gold";
                cadDisplay = "Redemption";
                goldDisplay = `-${tx.goldAmount.toFixed(4)}g`;
              }

              return (
                <div key={tx._id} className={`card-flat flex items-center justify-between group transition-colors hover:bg-white/[0.02] px-4 ${idx === arr.length - 1 ? 'border-b-0' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
                      {icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{title}</p>
                      <p className="label-timestamp">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {goldDisplay && <p className="text-sm font-medium text-white">{goldDisplay}</p>}
                    {cadDisplay && <p className="label-meta">{cadDisplay}</p>}
                  </div>
                </div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div variants={staggerItem} className="card-primary">
            <p className="text-center label-card">No transactions yet.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Activity;
