import React, { HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  // Additional props can be added here if needed
}

const Container: React.FC<ContainerProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('container-custom', className)} {...props}>
      {children}
    </div>
  );
};

export default Container;