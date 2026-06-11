import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'premium';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof HTMLMotionProps<"button"> | 'children'>, Omit<HTMLMotionProps<"button">, 'children'> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', icon, ...props }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        'inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all duration-200',
        {
          'bg-primary text-deepBlack shadow-lg shadow-primary/20 hover:bg-bitgold-lightGold': variant === 'primary',
          'bg-white/5 text-white border border-white/10 hover:bg-white/10': variant === 'secondary',
          'bg-transparent text-gray-400 hover:text-white': variant === 'ghost',
          'bg-gradient-to-r from-bitgold-gold via-bitgold-lightGold to-bitgold-gold text-deepBlack shadow-xl shadow-gold/30': variant === 'premium',
        },
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;