import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// Automation Components
import RoundUpCard from '../components/automation/RoundUpCard';
import RoundUpCalculator from '../components/ui/RoundUpCalculator';
import SipConfig from '../components/automation/SipConfig';

import { staggerContainer, staggerItem } from '../lib/animations';

interface VaultPageProps {
  setActiveTab?: (tab: string) => void;
  initialSegment?: 'storage' | 'automation';
}

const VaultPage: React.FC<VaultPageProps> = () => {
  return (
    <div className="page-container">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="page-header px-1 mb-2">
          <h1 className="page-title">Auto-Invest</h1>
          <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-primary">
            <RefreshCw size={20} />
          </div>
        </motion.div>

        {/* Auto-Invest Controls */}
        <motion.div variants={staggerItem} className="space-y-6">
          <RoundUpCard />
          <RoundUpCalculator />
          <SipConfig />

        </motion.div>
      </motion.div>
    </div>
  );
};

export default VaultPage;
