import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { LogOut, Landmark, Fingerprint, Bell, HelpCircle, ShieldCheck, User, CreditCard, ChevronRight, Settings, ExternalLink, X } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

interface ProfileProps {
  setActiveTab: (tab: string) => void;
}

import { useCurrentUser } from '../hooks/useCurrentUser';

const Profile: React.FC<ProfileProps> = ({ setActiveTab }) => {
  const user = useCurrentUser();
  const bankAccounts = useQuery(api.banking.getBankAccounts, user ? { userId: user._id } : "skip");
  const linkBankAccount = useMutation(api.banking.linkBankAccount);

  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);
  
  const [showLinkBankModal, setShowLinkBankModal] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");
  const [isLinking, setIsLinking] = useState(false);

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const clerk = PUBLISHABLE_KEY ? useClerk() : null;
  const { user: clerkUser, isLoaded } = PUBLISHABLE_KEY ? useUser() : { user: null, isLoaded: true };

  const handleSignOut = () => {
    if (localStorage.getItem('bitgold_demo_mode') === 'true') {
      localStorage.removeItem('bitgold_demo_mode');
      window.location.reload();
    } else if (clerk) {
      clerk.signOut();
    } else {
      console.log("Mock sign out");
    }
  };

  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const ToggleSwitch: React.FC<{ enabled: boolean; setEnabled: (v: boolean) => void }> = ({ enabled, setEnabled }) => (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${enabled ? 'bg-primary' : 'bg-white/10'}`}
    >
      <motion.div
        className="w-4 h-4 bg-white rounded-full"
        animate={{ x: enabled ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );

  return (
    <Container className="pt-4 pb-24 bg-deepBlack h-full overflow-y-auto hide-scrollbar text-white font-sans">
      <motion.div
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
      >
        {/* Header */}
        <motion.div variants={fadeInUp} className="flex justify-between items-center px-6 py-4">
          <h1 className="text-xl font-bold tracking-tight">Account</h1>
          <button className="w-10 h-10 rounded-full glass flex items-center justify-center text-gray-400 hover:text-white" onClick={() => {}}>
            <Settings size={20} />
          </button>
        </motion.div>

        {/* User Identity Card */}
        <motion.div variants={fadeInUp} className="px-6 mb-8">
          <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <ShieldCheck className="text-primary/40" size={40} />
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-primary/30 p-1.5">
                  {user?.picture ? (
                    <img src={user.picture} alt="User" className="w-full h-full rounded-full object-cover shadow-2xl shadow-primary/20" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center text-primary">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-4 border-[#1a1a1a]" />
              </div>
              
              <h2 className="text-2xl font-bold">{user?.name || 'Valued Member'}</h2>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">Premium Member</p>
              
              <div className="flex gap-2 mt-4">
                 <span className="px-3 py-1 rounded-full glass text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/20">
                   Verified ID
                 </span>
                 <span className="px-3 py-1 rounded-full glass text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                   Join 2024
                 </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BitGold Premium Card */}
        <motion.div variants={fadeInUp} className="px-6 mb-8">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#D4AF37] via-[#F7E98D] to-[#B8860B] relative overflow-hidden shadow-xl shadow-gold/20">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 blur-[60px] rounded-full" />
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-10">
                 <p className="text-black font-black italic tracking-tighter text-xl">BITGOLD</p>
                 <CreditCard size={28} className="text-black/80" />
               </div>
               <div className="space-y-4">
                 <p className="text-black font-mono text-lg tracking-[0.2em]">**** **** **** 8821</p>
                 <div className="flex justify-between items-end">
                    <p className="text-black/60 text-[10px] font-bold uppercase tracking-widest">Vault Member since 2024</p>
                    <div className="flex flex-col items-end">
                      <p className="text-black/40 text-[8px] font-black uppercase tracking-widest mb-1">Expires</p>
                      <p className="text-black font-bold text-sm">12/28</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Sections */}
        <div className="px-6 space-y-8 pb-12">
           {/* Section 1: Finances */}
           <div>
             <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-4 ml-2">Wealth Management</h3>
              <div className="space-y-2">
                 <MenuButton 
                   icon={Landmark} 
                   label="Linked Bank Accounts" 
                   value={bankAccounts && bankAccounts.length > 0 ? `${bankAccounts[0].bank_name} ****${bankAccounts[0].last4}` : "None Linked"} 
                   onClick={() => setShowLinkBankModal(true)}
                 />
                 <MenuButton 
                   icon={CreditCard} 
                   label="Payment Methods" 
                   value="Visa, Apple Pay" 
                   onClick={() => setActiveTab && setActiveTab('PaymentMethods')}
                 />
                 <MenuButton icon={ExternalLink} label="Investment Statements" />
              </div>
           </div>

           {/* Section 2: Security */}
           <div>
             <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-4 ml-2">Security & Privacy</h3>
             <div className="space-y-2">
                <ToggleMenuButton icon={Fingerprint} label="Biometric Sign-in" enabled={faceIdEnabled} setEnabled={setFaceIdEnabled} />
                <ToggleMenuButton icon={Bell} label="Price Fluctuations" enabled={priceAlertsEnabled} setEnabled={setPriceAlertsEnabled} />
                <MenuButton icon={ShieldCheck} label="Two-Factor Authentication" value="Enabled" />
             </div>
           </div>

           {/* Section 3: App */}
           <div>
             <h3 className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-4 ml-2">System</h3>
             <div className="space-y-2">
                <MenuButton icon={HelpCircle} label="Concierge Support" value="Live Chat" isGold />
                <button 
                  onClick={handleSignOut}
                  className="w-full p-5 rounded-2xl glass-dark border border-red-500/10 flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 group-hover:bg-red-500 transition-all group-hover:text-white">
                      <LogOut size={20} />
                    </div>
                    <span className="text-sm font-bold text-red-400">Sign Out</span>
                  </div>
                </button>
             </div>
           </div>
         </div>

      </motion.div>

      {/* Link Bank Modal/Drawer */}
      <AnimatePresence>
        {showLinkBankModal && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/10 rounded-t-[2.5rem] p-8 z-50 max-w-md mx-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Link Bank Account</h3>
                <p className="text-gray-500 text-xs mt-1">Simulated via Plaid Core</p>
              </div>
              <button 
                onClick={() => setShowLinkBankModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Select Institution</label>
                <select 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-4 bg-black border border-white/10 text-white rounded-xl focus:ring-primary focus:border-primary text-sm focus:outline-none"
                >
                  <option value="">Choose bank...</option>
                  <option value="Chase Bank">Chase Bank</option>
                  <option value="TD Bank">TD Bank</option>
                  <option value="RBC Royal Bank">RBC Royal Bank</option>
                  <option value="Bank of America">Bank of America</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2">Account Type</label>
                <div className="flex bg-black border border-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => setAccountType("checking")}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${accountType === 'checking' ? 'bg-primary text-black' : 'text-gray-400'}`}
                  >
                    Checking
                  </button>
                  <button 
                    onClick={() => setAccountType("savings")}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${accountType === 'savings' ? 'bg-primary text-black' : 'text-gray-400'}`}
                  >
                    Savings
                  </button>
                </div>
              </div>
            </div>

            <Button
              onClick={async () => {
                if (!user) {
                  toast.error("Sign in required");
                  return;
                }
                if (!bankName) {
                  toast.error("Please select a bank");
                  return;
                }
                setIsLinking(true);
                try {
                  const last4 = Math.floor(1000 + Math.random() * 9000).toString();
                  await linkBankAccount({
                    userId: user._id,
                    bank_name: bankName,
                    last4,
                    type: accountType,
                  });
                  toast.success(`Successfully linked ${bankName} account!`);
                  setBankName("");
                  setShowLinkBankModal(false);
                } catch (err: any) {
                  toast.error(err.message || "Failed to link bank account");
                } finally {
                  setIsLinking(false);
                }
              }}
              disabled={isLinking || !bankName}
              variant="premium"
              className="w-full py-4 rounded-xl text-xs font-black tracking-widest"
            >
              {isLinking ? "Linking Account..." : "Confirm Secure Connection"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Container>
  );
};

const MenuButton = ({ icon: Icon, label, value, isGold, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full p-5 rounded-2xl glass flex items-center justify-between group hover:bg-white/10 transition-all text-left"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isGold ? 'bg-primary text-deepBlack' : 'bg-white/5 text-gray-400'}`}>
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="text-xs text-gray-500 font-bold">{value}</span>}
      <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
    </div>
  </button>
);

const ToggleMenuButton = ({ icon: Icon, label, enabled, setEnabled }: any) => (
  <div className="w-full p-5 rounded-2xl glass flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <ToggleSwitch enabled={enabled} setEnabled={setEnabled} />
  </div>
);

const ToggleSwitch = ({ enabled, setEnabled }: any) => (
  <button
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${enabled ? 'bg-primary' : 'bg-white/10'}`}
  >
    <motion.div
      className="w-4 h-4 bg-white rounded-full shadow-lg"
      animate={{ x: enabled ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </button>
);

export default Profile;
