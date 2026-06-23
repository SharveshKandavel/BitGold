import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeftRight, LayoutDashboard, User } from 'lucide-react';

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Trade', icon: ArrowLeftRight, page: 'Trade' },
  { name: 'Portfolio', icon: LayoutDashboard, page: 'Portfolio' },
  { name: 'Profile', icon: User, page: 'Profile' },
];

interface NavigationProps {
  activeTab: string;
  setActiveTab: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-6 left-4 right-4 h-16 md:bottom-0 md:left-0 md:right-auto md:top-0 md:h-screen md:w-20 md:rounded-r-2xl md:rounded-l-none rounded-2xl glass shadow-2xl shadow-black/50 z-50 transition-all duration-300">
      <div className="flex md:flex-col justify-around items-center h-full md:py-8">
        {navItems.map((item) => (
          <button
            key={item.name}
            data-testid={`${item.page.toLowerCase()}-nav-item`}
            onClick={() => setActiveTab(item.page)}
            className="flex flex-col items-center w-16 md:w-full md:h-16 h-full justify-center transition-transform hover:scale-110 active:scale-95"
          >
            <item.icon
              strokeWidth={1.5}
              className={`transition-colors duration-200 ${
                activeTab === item.page ? 'text-gold' : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
