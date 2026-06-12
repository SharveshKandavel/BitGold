import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Container from '../components/ui/Container';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { LogOut, Landmark, Fingerprint, Bell, HelpCircle, ShieldCheck, User, CreditCard, ChevronRight, Settings, ExternalLink, X, Trash2, ArrowLeftRight, Plus, RefreshCw } from 'lucide-react';
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
  const deleteBankAccount = useMutation(api.banking.deleteBankAccount);
  const transferFunds = useMutation(api.banking.transferFunds);
  const resetPortfolio = useMutation(api.users.resetPortfolio);

  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [priceAlertsEnabled, setPriceAlertsEnabled] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  
  const [showBankManager, setShowBankManager] = useState(false);
  const [showLinkBankModal, setShowLinkBankModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedAccountForTransfer, setSelectedAccountForTransfer] = useState<any>(null);

  // Link bank account form fields
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");
  const [isLinking, setIsLinking] = useState(false);

  // Transfer form fields
  const [transferAmount, setTransferAmount] = useState("");
  const [transferDirection, setTransferDirection] = useState<"deposit" | "withdraw">("deposit");
  const [isTransferring, setIsTransferring] = useState(false);

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const clerk = PUBLISHABLE_KEY ? useClerk() : null;
  const { user: clerkUser, isLoaded } = PUBLISHABLE_KEY ? useUser() : { user: null, isLoaded: true };
  const dbName = user?.name && user.name !== "New User" ? user.name : user?.email;
  const clerkName = clerkUser?.fullName || clerkUser?.primaryEmailAddress?.emailAddress;
  const displayName = dbName || clerkName || 'Valued Member';

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

  const handleResetPortfolio = async () => {
    if (!user) {
      toast.error("Sign in required to reset portfolio");
      return;
    }
    if (confirm("Are you sure you want to reset your portfolio? This will set your balances to $10,000.00 CAD and 10g Gold, and clear your simulation history.")) {
      setIsResetting(true);
      try {
        await resetPortfolio({ userId: user._id });
        toast.success("Simulation portfolio reset successfully!");
      } catch (err: any) {
        toast.error(err.message || "Failed to reset portfolio");
      } finally {
        setIsResetting(false);
      }
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
              
              <h2 className="text-2xl font-bold">{displayName}</h2>
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
                   value={bankAccounts && bankAccounts.length > 0 ? `${bankAccounts.length} Connected` : "None Linked"} 
                   onClick={() => setShowBankManager(true)}
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
                  onClick={handleResetPortfolio}
                  disabled={isResetting}
                  className="w-full p-5 rounded-2xl glass-dark border border-amber-500/10 flex items-center justify-between group hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 transition-all group-hover:text-black">
                      <RefreshCw size={20} className={isResetting ? "animate-spin" : ""} />
                    </div>
                    <span className="text-sm font-bold text-amber-400">
                      {isResetting ? "Resetting Portfolio..." : "Reset Simulation Portfolio"}
                    </span>
                  </div>
                </button>
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

      {/* Bank Accounts Manager Drawer */}
      <AnimatePresence>
        {showBankManager && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/10 rounded-t-[2.5rem] p-6 z-40 max-w-md mx-auto shadow-2xl overflow-y-auto max-h-[85vh] hide-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-sans">Bank Accounts</h3>
                <p className="text-gray-500 text-xs mt-1 font-sans">Manage your linked funding sources</p>
              </div>
              <button 
                onClick={() => setShowBankManager(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {bankAccounts && bankAccounts.length > 0 ? (
                bankAccounts.map((account: any) => (
                  <div key={account._id} className="relative p-5 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 overflow-hidden shadow-lg">
                    {/* Golden design overlay */}
                    <div className="absolute top-0 right-0 p-4 opacity-25">
                      <Landmark className="text-primary" size={60} />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-36">
                      <div>
                        {/* Account Name on top */}
                        <h4 className="text-sm font-bold text-white tracking-wide uppercase truncate pr-16 font-sans">{account.account_name || 'Unnamed Account'}</h4>
                        <p className="text-[10px] text-gray-400 font-medium tracking-widest mt-0.5 font-sans">{displayName}</p>
                      </div>

                      <div>
                        <p className="text-xs font-mono text-gray-300 tracking-wider">
                          {account.bank_name} &bull;&bull;&bull;&bull; {account.last4}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-bold text-gray-400 uppercase tracking-widest font-sans">
                            {account.type}
                          </span>
                          <span className="text-[9px] font-mono text-gray-500">
                            RTN: •••••{account.routing_number ? account.routing_number.slice(-4) : '****'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end border-t border-white/5 pt-2 mt-2">
                        <div>
                          <p className="text-[8px] text-gray-500 uppercase tracking-widest font-bold font-sans">Available Balance</p>
                          <p className="text-lg font-bold text-primary font-sans">${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedAccountForTransfer(account);
                              setTransferAmount("");
                              setTransferDirection("deposit");
                              setShowTransferModal(true);
                            }}
                            className="p-2 bg-primary/20 text-primary rounded-xl hover:bg-primary hover:text-black transition-all"
                            title="Transfer Funds"
                          >
                            <ArrowLeftRight size={14} />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Are you sure you want to disconnect ${account.account_name || account.bank_name}?`)) {
                                try {
                                  await deleteBankAccount({ bankAccountId: account._id });
                                  toast.success("Account disconnected successfully");
                                } catch (err: any) {
                                  toast.error(err.message || "Failed to disconnect account");
                                }
                              }
                            }}
                            className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            title="Disconnect Account"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 border border-dashed border-white/10 rounded-3xl text-center">
                  <Landmark className="mx-auto text-gray-600 mb-3" size={32} />
                  <p className="text-gray-400 text-sm font-semibold font-sans">No bank accounts linked</p>
                  <p className="text-gray-600 text-xs mt-1 font-sans">Link an account to enable funding and withdrawals.</p>
                </div>
              )}
            </div>

            <Button
              onClick={() => {
                setBankName("");
                setAccountName("");
                setRoutingNumber("");
                setAccountNumber("");
                setAccountType("checking");
                setShowLinkBankModal(true);
              }}
              variant="premium"
              className="w-full py-4 rounded-xl text-xs font-black tracking-widest flex items-center justify-center gap-2 font-sans"
            >
              <Plus size={16} />
              Link Bank Account
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Link Bank Account Form Drawer */}
      <AnimatePresence>
        {showLinkBankModal && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/10 rounded-t-[2.5rem] p-8 z-50 max-w-md mx-auto shadow-2xl overflow-y-auto max-h-[85vh] hide-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-sans">Link Bank Account</h3>
                <p className="text-gray-500 text-xs mt-1 font-sans">Configure your mock banking connection</p>
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
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 font-sans">Select Institution</label>
                <select 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-4 bg-black border border-white/10 text-white rounded-xl focus:ring-primary focus:border-primary text-sm focus:outline-none font-sans"
                >
                  <option value="">Choose bank...</option>
                  <option value="Chase Bank">Chase Bank</option>
                  <option value="TD Bank">TD Bank</option>
                  <option value="RBC Royal Bank">RBC Royal Bank</option>
                  <option value="Bank of America">Bank of America</option>
                  <option value="Wells Fargo">Wells Fargo</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 font-sans">Account Nickname</label>
                <Input
                  id="account-name"
                  placeholder="e.g. My Checking Account"
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full p-4 bg-black border border-white/10 text-white rounded-xl focus:ring-primary focus:border-primary text-sm focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 font-sans">Account Number</label>
                <Input
                  id="account-number"
                  placeholder="Enter 8-12 digits"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full p-4 bg-black border border-white/10 text-white rounded-xl focus:ring-primary focus:border-primary text-sm focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 font-sans">Routing Number</label>
                <Input
                  id="routing-number"
                  placeholder="Enter 9 digits"
                  type="text"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ""))}
                  className="w-full p-4 bg-black border border-white/10 text-white rounded-xl focus:ring-primary focus:border-primary text-sm focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 font-sans">Account Type</label>
                <div className="flex bg-black border border-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => setAccountType("checking")}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all font-sans ${accountType === 'checking' ? 'bg-primary text-black' : 'text-gray-400'}`}
                  >
                    Checking
                  </button>
                  <button 
                    onClick={() => setAccountType("savings")}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all font-sans ${accountType === 'savings' ? 'bg-primary text-black' : 'text-gray-400'}`}
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
                if (!accountName.trim()) {
                  toast.error("Please enter an account nickname");
                  return;
                }
                if (accountNumber.length < 8) {
                  toast.error("Account number must be 8-12 digits");
                  return;
                }
                if (routingNumber.length !== 9) {
                  toast.error("Routing number must be exactly 9 digits");
                  return;
                }
                setIsLinking(true);
                try {
                  await linkBankAccount({
                    userId: user._id,
                    bank_name: bankName,
                    account_name: accountName,
                    routing_number: routingNumber,
                    account_number: accountNumber,
                    type: accountType,
                  });
                  toast.success(`Successfully linked ${accountName}!`);
                  setBankName("");
                  setAccountName("");
                  setRoutingNumber("");
                  setAccountNumber("");
                  setShowLinkBankModal(false);
                } catch (err: any) {
                  toast.error(err.message || "Failed to link bank account");
                } finally {
                  setIsLinking(false);
                }
              }}
              disabled={isLinking || !bankName || !accountName || accountNumber.length < 8 || routingNumber.length !== 9}
              variant="premium"
              className="w-full py-4 rounded-xl text-xs font-black tracking-widest font-sans"
            >
              {isLinking ? "Linking Account..." : "Confirm & Credit $10,000"}
            </Button>
            <p className="text-[10px] text-gray-500 text-center mt-3 font-sans">
              * Newly linked mock accounts automatically start with a $10,000.00 CAD balance.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transfer Funds Drawer */}
      <AnimatePresence>
        {showTransferModal && selectedAccountForTransfer && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-[#121212] border-t border-white/10 rounded-t-[2.5rem] p-8 z-50 max-w-md mx-auto shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-sans">Transfer Funds</h3>
                <p className="text-gray-500 text-xs mt-1 font-sans">Move cash between your bank & BitGold</p>
              </div>
              <button 
                onClick={() => setShowTransferModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 mb-6 flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold font-sans">Bank Balance</p>
                <p className="text-sm font-bold text-white mt-1 font-sans">${selectedAccountForTransfer.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-[8px] text-gray-500 font-mono mt-0.5 truncate">{selectedAccountForTransfer.account_name}</p>
              </div>
              <div className="px-2 text-primary">
                <ArrowLeftRight size={16} />
              </div>
              <div className="text-center flex-1">
                <p className="text-[9px] text-gray-500 uppercase tracking-widest font-bold font-sans">BitGold Cash</p>
                <p className="text-sm font-bold text-white mt-1 font-sans">${(user?.cadBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="text-[8px] text-gray-500 mt-0.5 font-sans font-medium">App Portfolio</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 font-sans">Direction</label>
                <div className="flex bg-black border border-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => setTransferDirection("deposit")}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all font-sans ${transferDirection === 'deposit' ? 'bg-primary text-black' : 'text-gray-400'}`}
                  >
                    Deposit to App
                  </button>
                  <button 
                    onClick={() => setTransferDirection("withdraw")}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all font-sans ${transferDirection === 'withdraw' ? 'bg-primary text-black' : 'text-gray-400'}`}
                  >
                    Withdraw to Bank
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-widest mb-2 font-sans">Amount (CAD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium font-sans">$</span>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setTransferAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-4 bg-black border border-white/10 text-white rounded-xl focus:ring-primary focus:border-primary text-sm focus:outline-none font-sans font-bold"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={async () => {
                if (!user) return;
                const amount = Number(transferAmount);
                if (isNaN(amount) || amount <= 0) {
                  toast.error("Please enter a valid amount");
                  return;
                }
                setIsTransferring(true);
                try {
                  await transferFunds({
                    userId: user._id,
                    bankAccountId: selectedAccountForTransfer._id,
                    amount,
                    direction: transferDirection,
                  });
                  toast.success(`Successfully transferred $${amount.toLocaleString()}!`);
                  setTransferAmount("");
                  setShowTransferModal(false);
                } catch (err: any) {
                  toast.error(err.message || "Transfer failed");
                } finally {
                  setIsTransferring(false);
                }
              }}
              disabled={isTransferring || !transferAmount || Number(transferAmount) <= 0}
              variant="premium"
              className="w-full py-4 rounded-xl text-xs font-black tracking-widest font-sans"
            >
              {isTransferring ? "Processing..." : "Confirm Transfer"}
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
