import React, { ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'gold';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, className, variant = 'primary', icon, fullWidth, ...props }) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-semibold text-sm transition-all duration-150 active:scale-[0.97]',
        fullWidth && 'w-full',
        {
          'bg-primary text-black px-6 py-3 hover:brightness-110': variant === 'primary',
          'bg-white/[0.05] text-white border border-white/[0.08] px-6 py-3 hover:bg-white/[0.08]': variant === 'secondary',
          'bg-transparent text-gray-400 px-4 py-2 hover:text-white': variant === 'ghost',
          'btn-gold': variant === 'gold',
        },
        className
      )}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;