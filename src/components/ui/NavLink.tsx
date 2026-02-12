import React, { AnchorHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';
import { useLocation } from '../../context/LocationContext'; // Assuming a LocationContext for routing

interface NavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, className, ...props }) => {
  const { currentLocation, navigate } = useLocation();
  const isActive = currentLocation === to;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={cn(
        'interactive-element',
        'px-3 py-2 rounded-md text-sm font-medium',
        isActive ? 'bg-bitgold-700 text-bitgold-gold' : 'text-bitgold-lightGold hover:bg-bitgold-700 hover:text-bitgold-gold',
        className
      )}
      aria-current={isActive ? 'page' : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

export default NavLink;