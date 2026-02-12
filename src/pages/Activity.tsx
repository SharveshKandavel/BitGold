import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion } from 'framer-motion';
import { CirclePlus, CircleMinus } from 'lucide-react';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';

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

const Activity = () => {
  const transactions = useQuery(api.transactions.list);

  return (
    <Container className="py-8">
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <h1 className="text-2xl font-bold">Activity</h1>
        {transactions && transactions.length > 0 ? (
          transactions.map((tx) => (
            <motion.div key={tx._id} variants={itemVariants}>
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {tx.type === 'buy' ? (
                      <CirclePlus className="text-green-500 mr-4" />
                    ) : (
                      <CircleMinus className="text-red-500 mr-4" />
                    )}
                    <div>
                      <p className="font-semibold capitalize">{tx.type} Gold</p>
                      <p className="text-sm text-gray-400">
                        {new Date(tx.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${tx.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">{tx.amount} oz</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
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
