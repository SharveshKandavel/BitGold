import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../ui/Card';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: number; // Unix timestamp
  investmentCapability: number; // Monthly investment capability
}

const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Wedding Fund',
    targetAmount: 20000,
    currentAmount: 8500,
    deadline: Date.now() + 31536000000, // 1 year from now
    investmentCapability: 500,
  },
  {
    id: '2',
    name: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: Date.now() + 15768000000, // 6 months from now
    investmentCapability: 200,
  },
  {
    id: '3',
    name: 'New Car',
    targetAmount: 30000,
    currentAmount: 1200,
    deadline: Date.now() + 63072000000, // 2 years from now
    investmentCapability: 700,
  },
];

const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from Convex
    setGoals(mockGoals);
  }, []);

  const calculateTimeToCompletion = (goal: Goal) => {
    const remaining = goal.targetAmount - goal.currentAmount;
    if (remaining <= 0) return 'Achieved!';
    if (goal.investmentCapability <= 0) return 'No progress';

    const months = remaining / goal.investmentCapability;
    if (months < 12) {
      return `${Math.ceil(months)} months`;
    } else {
      return `${(months / 12).toFixed(1)} years`;
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0] && payload[0].payload) {
      const itemPayload = payload[0].payload; // Get the inner payload
      if (itemPayload && itemPayload.goal) { // Check itemPayload and its goal property
        const goal = itemPayload.goal;
        return (
          <div className="bg-deepBlack/80 p-3 rounded-lg shadow-lg border border-white/10 text-white text-sm">
            <p className="font-semibold">{goal.name}</p>
            <p>Progress: {((goal.currentAmount / goal.targetAmount) * 100).toFixed(1)}%</p>
            <p>Time to Completion: {calculateTimeToCompletion(goal)}</p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card className="bg-deepBlack/40 backdrop-blur-md p-6">
      <h3 className="text-xl font-light tracking-tight text-white mb-4">Savings Goals</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progress = Math.min(Math.max(goal.currentAmount / goal.targetAmount, 0), 1); // Clamp between 0 and 1
          const data = [
            { name: 'Progress', value: progress, goal: goal },
            { name: 'Remaining', value: 1 - progress, goal: goal },
          ];

          return (
            <motion.div
              key={goal.id}
              className="relative flex flex-col items-center justify-center bg-deepBlack/60 rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h4 className="text-lg font-light tracking-tight mb-2 text-white">{goal.name}</h4>
              <ResponsiveContainer width="80%" height={120}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={50}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    isAnimationActive={true}
                    animationDuration={1000}
                  >
                    <Cell fill="#D4AF37" stroke="none" /> {/* Primary color for progress */}
                    <Cell fill="#333" stroke="none" /> {/* Darker for remaining */}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-sm text-center text-white">
                <p className="font-bold">{(progress * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-400">${goal.currentAmount.toLocaleString()}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default GoalTracker;
