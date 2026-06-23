import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'flat' | 'hero';
}

const Card: React.FC<CardProps> = ({ className, variant = 'primary', children, ...props }) => {
  const variantClass = {
    primary: 'card-primary',
    secondary: 'card-secondary',
    flat: 'card-flat',
    hero: 'card-hero',
  }[variant];

  return (
    <div className={cn(variantClass, className)} {...props}>
      {children}
    </div>
  );
};

export default Card;