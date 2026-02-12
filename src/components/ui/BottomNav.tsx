"use client";

import { Home, CreditCard, TrendingUp } from "lucide-react"; // Updated imports
import { cn } from "../../lib/utils";
import NavLink from "./NavLink";
import { useLocation } from "../../context/LocationContext";
import { motion } from "framer-motion"; // Import motion

export function BottomNav() {
  const { currentLocation } = useLocation();

  const tabs = [
    { id: "/", label: "Home", icon: Home },
    { id: "/pay", label: "Pay", icon: CreditCard }, // New tab for Payment Methods
    { id: "/buy", label: "Buy", icon: TrendingUp }, // New tab for Buy Flow
  ];

  const activeTabIndex = tabs.findIndex(tab => tab.id === currentLocation);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40">
      <div className="relative flex justify-around items-center h-16 max-w-lg mx-auto">
        {/* Sliding Highlight */}
        {activeTabIndex !== -1 && (
          <motion.div
            layoutId="activeTabHighlight"
            className="absolute bottom-0 h-0.5 bg-[#FFC107]"
            initial={false}
            animate={{
              left: `${(activeTabIndex / tabs.length) * 100}%`,
              width: `${(1 / tabs.length) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}

        {tabs.map((tab, index) => {
          const isActive = currentLocation === tab.id;
          const IconComponent = tab.icon;
          return (
            <NavLink
              key={tab.id}
              to={tab.id}
              className={cn(
                "flex flex-col items-center justify-center p-2 text-xs font-medium relative z-10 flex-1",
                "text-gray-500 hover:text-[#FFC107] transition-colors duration-200 ease-in-out",
                isActive && "text-[#FFC107]"
              )}
            >
              <IconComponent size={20} className="mb-1" />
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
