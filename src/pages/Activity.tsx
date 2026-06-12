import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion } from 'framer-motion';
import { CirclePlus, CircleMinus } from 'lucide-react';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface ActivityProps {
  setActiveTab?: (tab: string) => void;
}

import { useCurrentUser } from '../hooks/useCurrentUser';

const Activity: React.FC<ActivityProps> = ({ setActiveTab }) => {
  const user = useCurrentUser();
  const transactions = useQuery(
    api.transactions.getUserTransactions,
    user ? { userId: user._id } : "skip",
  );

  if (user === undefined || (user && transactions === undefined)) {
    return (
      <Container className="py-8 flex items-center justify-center min-h-[50vh] font-sans">
        <LoadingSpinner size={32} className="text-primary" />
      </Container>
    );
  }

  return (
    <Container className="py-8 h-full overflow-y-auto font-sans">
      <motion.div
        className="space-y-4 pb-32"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <h1 className="text-2xl font-bold">Activity</h1>
        {!user ? (
          <Card>
            <p className="text-center text-gray-500">Sign in to view your activity.</p>
          </Card>
        ) : transactions && transactions.length > 0 ? (
          transactions.map((tx) => {
            const isBuy = tx.type === 'buy';
            const isSell = tx.type === 'sell';
            const isDeposit = tx.type === 'deposit';
            const isWithdraw = tx.type === 'withdraw';
            const isRedeem = tx.type === 'redeem';

            let icon = <CirclePlus className="text-green-500 mr-4" />;
            let title = "Transaction";
            let cadDisplay = `$${tx.cadAmount.toFixed(2)}`;
            let goldDisplay = `${tx.goldAmount.toFixed(4)}g`;

            if (isBuy) {
              icon = <CirclePlus className="text-green-500 mr-4" />;
              title = "Bought Gold";
              cadDisplay = `$${tx.cadAmount.toFixed(2)}`;
              goldDisplay = `+${tx.goldAmount.toFixed(4)}g`;
            } else if (isSell) {
              icon = <CircleMinus className="text-red-500 mr-4" />;
              title = "Sold Gold";
              cadDisplay = `$${tx.cadAmount.toFixed(2)}`;
              goldDisplay = `-${tx.goldAmount.toFixed(4)}g`;
            } else if (isDeposit) {
              icon = <CirclePlus className="text-emerald-400 mr-4" />;
              title = "Deposited Funds";
              cadDisplay = `+$${tx.cadAmount.toFixed(2)}`;
              goldDisplay = "";
            } else if (isWithdraw) {
              icon = <CircleMinus className="text-amber-500 mr-4" />;
              title = "Withdrew Funds";
              cadDisplay = `-$${tx.cadAmount.toFixed(2)}`;
              goldDisplay = "";
            } else if (isRedeem) {
              icon = <CircleMinus className="text-red-400 mr-4" />;
              title = "Redeemed Gold";
              cadDisplay = "Redemption";
              goldDisplay = `-${tx.goldAmount.toFixed(4)}g`;
            }

            return (
              <motion.div key={tx._id} variants={itemVariants}>
                <Card>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center font-sans">
                      {icon}
                      <div>
                        <p className="font-semibold">{title}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(tx.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right font-sans">
                      {cadDisplay && <p className="font-semibold">{cadDisplay}</p>}
                      {goldDisplay && <p className="text-sm text-gray-400">{goldDisplay}</p>}
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card>
            <p className="text-center text-gray-500">No transactions yet.</p>
          </Card>
        )}
      </motion.div>
    </Container>
  );
};

export default Activity;
