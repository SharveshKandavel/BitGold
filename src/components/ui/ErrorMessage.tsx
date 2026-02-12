import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center space-x-2 p-3 bg-red-900/40 border border-red-500 rounded-md text-red-300 ${className}`}
      role="alert"
    >
      <AlertCircle size={20} />
      <p className="text-sm">{message}</p>
    </motion.div>
  );
};

export default ErrorMessage;
