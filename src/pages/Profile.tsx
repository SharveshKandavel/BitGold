import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import { LogOut, Landmark, Fingerprint, Bell, HelpCircle, ShieldCheck, User, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming a utility for class names

interface ProfileProps {
  // setActiveTab: (tab: string) => void; // Removed as per new spec
}

const Profile: React.FC<ProfileProps> = () => {
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);

  // Shimmer animation variants
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['-200% 0', '200% 0'],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 3,
          ease: 'linear',
        },
      },
    },
  };

  const ToggleSwitch = ({ enabled, setEnabled }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={enabled}
        onChange={() => setEnabled(!enabled)}
      />
      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
    </label>
  );

  return (
    <Container className="pt-4 pb-[104px] bg-deepBlack min-h-screen text-white font-sans tracking-tight">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 mb-4">
          <h1 className="text-xl font-light text-white">My Account</h1>
          <Button variant="ghost" className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full w-10 h-10 p-0 flex items-center justify-center">
            <LogOut size={20} className="text-red-400" />
          </Button>
        </div>

        {/* The 'Holographic' ID Card */}
        <div className="mx-6 mb-4 p-8 rounded-3xl relative overflow-hidden flex flex-col items-center text-center
                    bg-gradient-to-b from-white/10 to-transparent border border-white/10">
          {/* Shimmer Effect */}
          <motion.div
            className="absolute inset-0 bg-no-repeat bg-[length:200%_100%] z-0"
            style={{ backgroundImage: 'linear-gradient(to right, transparent, rgba(255,255,255,0.1) 50%, transparent)' }}
            variants={shimmerVariants}
            animate="animate"
          />

          {/* Avatar */}
          <div className="relative z-10 w-24 h-24 rounded-full border-2 border-gold p-1 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-gradient-to-tr from-gray-700 to-gray-500 flex items-center justify-center text-3xl font-medium">
              <User size={48} />
            </div>
          </div>

          {/* Name */}
          <h2 className="text-2xl font-light text-white mt-4">Alex Investor</h2>

          {/* Badge */}
          <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mt-2">
            Gold Member • Verified
          </span>

          {/* Stats Grid */}
          <div className="flex justify-center gap-4 mt-4">
            <p className="text-gray-400 text-xs">Joined 2024</p>
            <p className="text-gray-400 text-xs">Vault ID: #8821</p>
          </div>
        </div>



        {/* The 'Vault Status' Banner */}
        <div className="mx-6 mb-4 bg-gradient-to-r from-gold to-yellow-600 rounded-xl p-4 flex items-center justify-between shadow-lg shadow-gold/20">
          <div>
            <p className="text-black font-bold text-sm">Gold Storage: Zurich Vault</p>
            <p className="text-black/80 text-xs">100% Insured & Audited</p>
          </div>
          <ShieldCheck size={24} className="text-black w-6 h-6" />
        </div>

        {/* The 'Gold Card' Component */}
        <div className="mx-6 mb-4 p-6 rounded-2xl relative overflow-hidden shadow-2xl shadow-gold/20
                    bg-gradient-to-br from-[#D4AF37] via-[#F7E98D] to-[#B8860B]">
          {/* BITGOLD Logo Text */}
          <p className="absolute top-4 right-4 text-black tracking-widest font-bold">BITGOLD</p>

          {/* Middle: Microchip icon */}
          <CreditCard size={36} className="text-black mb-8 mt-4" /> {/* Using CreditCard as SimCard alternative */}

          {/* Card Number */}
          <p className="text-black font-mono text-xl mt-8">**** **** **** 4288</p>

          {/* Expiry Date */}
          <p className="text-black font-mono text-sm absolute bottom-4 right-6">09/28</p>
        </div>

        {/* The 'Payment Methods' List */}
        <div className="px-6 mb-4">
          <h2 className="text-lg font-light text-white mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {/* Row 1: Visa */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-white" />
                <span className="text-white">Visa ending in 8888</span>
              </div>
              <span className="bg-gold/20 text-gold px-2 py-1 rounded-full text-xs font-bold uppercase">Default</span>
            </div>

            {/* Row 2: Chase Checking */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Landmark size={20} className="text-white" />
                <span className="text-white">Chase Checking</span>
              </div>
              <span className="text-gray-400 text-xs">Unlink</span>
            </div>
          </div>

          {/* Add New Method Button */}
          <Button variant="ghost" className="w-full p-4 border border-dashed border-white/20 rounded-xl text-center text-gray-400 mt-4 hover:bg-white/5">
            + Add New Method
          </Button>
        </div>

        {/* Settings Menu List */}
        <div className="px-6 pb-32">
          <h2 className="text-lg font-light text-white mb-4">Preferences</h2>
          <div className="space-y-3">
            {/* Row 1 (Bank) */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Landmark size={20} className="text-gray-400" />
                <span className="text-white">Linked Bank Account</span>
              </div>
              <span className="text-gray-400">Chase ****8888</span>
            </div>

            {/* Row 2 (Security) */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Fingerprint size={20} className="text-gray-400" />
                <span className="text-white">Face ID Login</span>
              </div>
              <ToggleSwitch enabled={faceIdEnabled} setEnabled={setFaceIdEnabled} />
            </div>

            {/* Row 3 (Notifications) */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <Bell size={20} className="text-gray-400" />
                <span className="text-white">Price Alerts</span>
              </div>
              <ToggleSwitch enabled={priceAlertsEnabled} setEnabled={setPriceAlertsEnabled} />
            </div>

            {/* Row 4 (Support) */}
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex items-center gap-3">
                <HelpCircle size={20} className="text-gray-400" />
                <span className="text-white">24/7 Concierge</span>
              </div>
              <span className="text-gold">Chat Now</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Container>
  );
};

export default Profile;
