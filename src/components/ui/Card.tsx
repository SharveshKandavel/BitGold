import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion'; // Import motion

interface CardProps extends HTMLMotionProps<"div"> {
  // Additional props can be added here if needed
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <motion.div // Changed to motion.div
      className={cn('card', className)} 
      whileTap={{ scale: 0.98 }} // Added haptic effect
      whileHover={{ translateY: -2 }} // Add whileHover effect
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;