import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import Container from '../components/ui/Container';

// Automation Components
import RoundUpCard from '../components/automation/RoundUpCard';
import RoundUpCalculator from '../components/ui/RoundUpCalculator';
import SipConfig from '../components/automation/SipConfig';
import GoalTracker from '../components/automation/GoalTracker';

interface VaultPageProps {
  setActiveTab?: (tab: string) => void;
  initialSegment?: 'storage' | 'automation';
}

const VaultPage: React.FC<VaultPageProps> = () => {
  return (
    <Container className="pt-4 pb-24 bg-deepBlack h-full overflow-y-auto hide-scrollbar text-white font-sans">
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">Auto-Invest</h1>
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-primary">
            <RefreshCw size={20} />
          </div>
        </div>

        {/* Auto-Invest Controls */}
        <div className="px-6 space-y-6">
          <RoundUpCard />
          <RoundUpCalculator />
          <SipConfig />
          <GoalTracker />
        </div>
      </motion.div>
    </Container>
  );
};

export default VaultPage;
