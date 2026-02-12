import React, { InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, id, error, className, ...props }) => {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-bitgold-lightGold">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn('input-field', error && 'border-red-500', className)}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;