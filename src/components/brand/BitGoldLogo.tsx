import React from 'react';

interface BitGoldLogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon' | 'text';
  className?: string;
}

export default function BitGoldLogo({ 
  size = 'md', 
  variant = 'full',
  className = ''
}: BitGoldLogoProps) {
  
  // Size mappings
  const sizeMap = {
    sm: { coin: 'w-6 h-6', text: 'text-lg' },
    md: { coin: 'w-8 h-8', text: 'text-2xl' },
    lg: { coin: 'w-10 h-10', text: 'text-3xl' }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Gold Coin Icon - inspired by bitgold.lovable.app (polished gold coin with 'B' symbol) */}
      <div className={`relative ${sizeMap[size].coin}`}>
        {/* Outer gold circle with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-bitgold-gold to-bitgold-lightGold shadow-lg"></div>
        {/* Inner shine effect */}
        <div className="absolute inset-[2px] rounded-full bg-gradient-to-br from-yellow-300/30 to-transparent"></div>
        {/* "B" for BitGold, styled like Bitcoin symbol for recognizability */}
        <span className="absolute inset-0 flex items-center justify-center text-white font-bold drop-shadow-md">
          B
        </span>
      </div>
      
      {/* Text Section - only show if variant is 'full' or 'text' */}
      {variant !== 'icon' && (
        <div className="flex flex-col">
          <span className={`font-bold ${sizeMap[size].text} text-gold-gradient tracking-tight`}>
            BitGold
          </span>
        </div>
      )}
    </div>
  );
}
