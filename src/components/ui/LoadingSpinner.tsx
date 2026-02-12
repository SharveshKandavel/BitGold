import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, className }) => {
  return (
    <motion.div
      className={`inline-block border-2 border-current border-t-transparent rounded-full ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ ease: "linear", duration: 0.8, repeat: Infinity }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </motion.div>
  );
};

export default LoadingSpinner;
