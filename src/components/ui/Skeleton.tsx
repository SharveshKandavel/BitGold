import React from 'react';
import { cn } from '../../lib/utils'; // Assuming cn utility is available

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-deepBlack/60', // Adjusted color for dark mode
        className
      )}
    />
  );
};

export default Skeleton;
