import React from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeftRight, LayoutDashboard, Gift, User } from 'lucide-react'; // Updated imports

const navItems = [
  { name: 'Home', icon: Home, page: 'Home' },
  { name: 'Trade', icon: ArrowLeftRight, page: 'Trade' },
  { name: 'Portfolio', icon: LayoutDashboard, page: 'Portfolio' }, // New Portfolio item

  { name: 'Profile', icon: User, page: 'Profile' }, // Profile button
];

interface NavigationProps {
  activeTab: string;
  setActiveTab: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="fixed bottom-6 left-4 right-4 h-16 rounded-2xl bg-deepBlack/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            id={`${item.page.toLowerCase()}-nav-item`} // Dynamically set ID based on page name
            onClick={() => setActiveTab(item.page)}
            className="flex flex-col items-center"
            whileTap={{ scale: 0.9 }}
            whileHover={{ y: -2 }}
          >
            <item.icon
              strokeWidth={1.5}
              className={`${
                activeTab === item.page ? 'text-primary drop-shadow-gold' : 'text-gray-400'
              }`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
