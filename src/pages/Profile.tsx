import React, { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { LogOut, Landmark, Fingerprint, Bell, HelpCircle, ShieldCheck, User, CreditCard, ChevronRight, Settings, ExternalLink, X, Trash2, ArrowLeftRight, Plus, RefreshCw } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { staggerContainer, staggerItem } from '../lib/animations';

interface ProfileProps {
  setActiveTab: (tab: string) => void;
}

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

  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState<"checking" | "savings">("checking");
  const [isLinking, setIsLinking] = useState(false);

  const [transferAmount, setTransferAmount] = useState("");
  const [transferDirection, setTransferDirection] = useState<"deposit" | "withdraw">("deposit");
  const [isTransferring, setIsTransferring] = useState(false);

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const clerk = PUBLISHABLE_KEY ? useClerk() : null;
  const { user: clerkUser } = PUBLISHABLE_KEY ? useUser() : { user: null };
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

  return (
    <div className="page-container">
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Header */}
        <motion.div variants={staggerItem} className="page-header px-1">
          <h1 className="page-title">Account</h1>
          <button className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-colors" onClick={() => {}}>
            <Settings size={20} />
          </button>
        </motion.div>

        {/* User Identity Card */}
        <motion.div variants={staggerItem} className="mb-6">
          <div className="card-hero relative p-8 flex flex-col items-center overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <ShieldCheck className="text-primary/20" size={40} />
            </div>
            
            <div className="flex flex-col items-center relative z-10">
              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full border-2 border-primary/30 p-1">
                  {user?.picture ? (
                    <img src={user.picture} alt="User" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white/[0.05] flex items-center justify-center text-primary">
                      <User size={40} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-black" />
              </div>
              
              <h2 className="text-2xl font-semibold text-white">{displayName}</h2>
              <p className="label-meta mt-1 text-gold">Premium Member</p>
              
              <div className="flex gap-2 mt-4">
                 <span className="px-3 py-1 rounded-full bg-primary/10 text-xs font-semibold text-primary border border-primary/20">
                   Verified ID
                 </span>
                 <span className="px-3 py-1 rounded-full bg-white/[0.05] text-xs font-medium text-gray-400 border border-white/[0.05]">
                   Join 2024
                 </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BitGold Premium Card */}
        <motion.div variants={staggerItem} className="mb-8">
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#D4AF37] to-[#B38728] relative overflow-hidden shadow-xl shadow-gold/10">
            <div className="relative z-10">
               <div className="flex justify-between items-start mb-10">
                 <p className="text-black font-bold italic tracking-tighter text-xl">BITGOLD</p>
                 <CreditCard size={28} className="text-black/80" />
               </div>
               <div className="space-y-4">
                 <p className="text-black font-mono text-lg tracking-[0.2em]">**** **** **** 8821</p>
                 <div className="flex justify-between items-end">
                    <p className="text-black/60 text-xs font-semibold uppercase">Vault Member since 2024</p>
                    <div className="flex flex-col items-end">
                      <p className="text-black/40 text-[9px] font-bold uppercase tracking-widest mb-1">Expires</p>
                      <p className="text-black font-bold text-sm">12/28</p>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Sections */}
        <div className="space-y-8 pb-12">
           {/* Section 1: Finances */}
           <motion.div variants={staggerItem}>
             <h3 className="label-section ml-2 mb-2">Wealth Management</h3>
              <div className="card-primary px-0 py-2">
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
                 <MenuButton icon={ExternalLink} label="Investment Statements" isLast />
              </div>
           </motion.div>

           {/* Section 2: Security */}
           <motion.div variants={staggerItem}>
             <h3 className="label-section ml-2 mb-2">Security & Privacy</h3>
             <div className="card-primary px-0 py-2">
                <ToggleMenuButton icon={Fingerprint} label="Biometric Sign-in" enabled={faceIdEnabled} setEnabled={setFaceIdEnabled} />
                <ToggleMenuButton icon={Bell} label="Price Fluctuations" enabled={priceAlertsEnabled} setEnabled={setPriceAlertsEnabled} />
                <MenuButton icon={ShieldCheck} label="Two-Factor Authentication" value="Enabled" isLast />
             </div>
           </motion.div>

           {/* Section 3: App */}
           <motion.div variants={staggerItem}>
             <h3 className="label-section ml-2 mb-2">System</h3>
             <div className="card-primary px-0 py-2">
                <MenuButton icon={HelpCircle} label="Concierge Support" value="Live Chat" isGold />
                <button 
                  onClick={handleResetPortfolio}
                  disabled={isResetting}
                  className="card-flat w-full flex items-center justify-between group hover:bg-white/[0.02] px-4 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                      <RefreshCw size={20} className={isResetting ? "animate-spin" : ""} />
                    </div>
                    <span className="text-sm font-semibold text-amber-400">
                      {isResetting ? "Resetting Portfolio..." : "Reset Simulation Portfolio"}
                    </span>
                  </div>
                </button>
                <button 
                  onClick={handleSignOut}
                  className="card-flat w-full flex items-center justify-between group hover:bg-white/[0.02] px-4 py-4 border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                      <LogOut size={20} />
                    </div>
                    <span className="text-sm font-semibold text-red-400">Sign Out</span>
                  </div>
                </button>
             </div>
           </motion.div>
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
            className="fixed bottom-0 left-0 right-0 bg-deepBlack border-t border-white/[0.08] rounded-t-3xl p-6 z-40 max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[85vh] hide-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium text-white">Bank Accounts</h3>
                <p className="label-meta mt-1">Manage your linked funding sources</p>
              </div>
              <button 
                onClick={() => setShowBankManager(false)}
                className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {bankAccounts && bankAccounts.length > 0 ? (
                bankAccounts.map((account: any) => (
                  <div key={account._id} className="card-secondary relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-25">
                      <Landmark className="text-primary" size={60} />
                    </div>

                    <div className="relative z-10 flex flex-col justify-between h-36">
                      <div>
                        <h4 className="text-sm font-semibold text-white tracking-wide uppercase truncate pr-16">{account.account_name || 'Unnamed Account'}</h4>
                        <p className="label-meta mt-0.5">{displayName}</p>
                      </div>

                      <div>
                        <p className="text-xs font-mono text-gray-300 tracking-wider">
                          {account.bank_name} &bull;&bull;&bull;&bull; {account.last4}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-semibold text-gray-300 uppercase">
                            {account.type}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">
                            RTN: •••••{account.routing_number ? account.routing_number.slice(-4) : '****'}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-end border-t border-white/[0.05] pt-2 mt-2">
                        <div>
                          <p className="label-overline">Available Balance</p>
                          <p className="text-lg font-semibold text-primary mt-1">${account.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedAccountForTransfer(account);
                              setTransferAmount("");
                              setTransferDirection("deposit");
                              setShowTransferModal(true);
                            }}
                            className="p-2 bg-primary/20 text-primary rounded-xl hover:bg-primary hover:text-black transition-colors"
                            title="Transfer Funds"
                          >
                            <ArrowLeftRight size={16} />
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
                            className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                            title="Disconnect Account"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="card-secondary text-center py-8">
                  <Landmark className="mx-auto text-gray-500 mb-3" size={32} />
                  <p className="text-sm font-medium text-white">No bank accounts linked</p>
                  <p className="label-meta mt-1">Link an account to enable funding and withdrawals.</p>
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
              variant="gold"
              className="w-full flex items-center justify-center gap-2"
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
            className="fixed bottom-0 left-0 right-0 bg-deepBlack border-t border-white/[0.08] rounded-t-3xl p-6 z-50 max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[85vh] hide-scrollbar"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium text-white">Link Bank Account</h3>
                <p className="label-meta mt-1">Configure your mock banking connection</p>
              </div>
              <button 
                onClick={() => setShowLinkBankModal(false)}
                className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block label-overline mb-2">Select Institution</label>
                <select 
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full p-4 bg-white/[0.03] border border-white/[0.05] text-white rounded-xl focus:ring-primary focus:border-primary text-sm focus:outline-none"
                >
                  <option value="">Choose bank...</option>
                  <option value="Chase Bank">Chase Bank</option>
                  <option value="TD Bank">TD Bank</option>
                  <option value="RBC Royal Bank">RBC Royal Bank</option>
                  <option value="Bank of America">Bank of America</option>
                  <option value="Wells Fargo">Wells Fargo</option>
                </select>
              </div>

              <Input id="account-name" label="Account Nickname" placeholder="e.g. My Checking Account" type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              <Input id="account-number" label="Account Number" placeholder="Enter 8-12 digits" type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))} />
              <Input id="routing-number" label="Routing Number" placeholder="Enter 9 digits" type="text" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ""))} />

              <div>
                <label className="block label-overline mb-2">Account Type</label>
                <div className="flex bg-white/[0.03] border border-white/[0.05] rounded-xl p-1">
                  <button 
                    onClick={() => setAccountType("checking")}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${accountType === 'checking' ? 'bg-primary text-black' : 'text-gray-400'}`}
                  >
                    Checking
                  </button>
                  <button 
                    onClick={() => setAccountType("savings")}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${accountType === 'savings' ? 'bg-primary text-black' : 'text-gray-400'}`}
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
              variant="gold"
              className="w-full"
            >
              {isLinking ? "Linking Account..." : "Confirm & Credit $10,000"}
            </Button>
            <p className="label-meta text-center mt-3">
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
            className="fixed bottom-0 left-0 right-0 bg-deepBlack border-t border-white/[0.08] rounded-t-3xl p-6 z-50 max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium text-white">Transfer Funds</h3>
                <p className="label-meta mt-1">Move cash between your bank & BitGold</p>
              </div>
              <button 
                onClick={() => setShowTransferModal(false)}
                className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.05] mb-6 flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="label-overline">Bank Balance</p>
                <p className="text-sm font-semibold text-white mt-1">${selectedAccountForTransfer.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="label-meta mt-0.5 truncate">{selectedAccountForTransfer.account_name}</p>
              </div>
              <div className="px-2 text-primary">
                <ArrowLeftRight size={16} />
              </div>
              <div className="text-center flex-1">
                <p className="label-overline">BitGold Cash</p>
                <p className="text-sm font-semibold text-white mt-1">${(user?.cadBalance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                <p className="label-meta mt-0.5">App Portfolio</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block label-overline mb-2">Direction</label>
                <div className="flex bg-white/[0.03] border border-white/[0.05] rounded-xl p-1">
                  <button 
                    onClick={() => setTransferDirection("deposit")}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${transferDirection === 'deposit' ? 'bg-primary text-black' : 'text-gray-400'}`}
                  >
                    Deposit to App
                  </button>
                  <button 
                    onClick={() => setTransferDirection("withdraw")}
                    className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors ${transferDirection === 'withdraw' ? 'bg-primary text-black' : 'text-gray-400'}`}
                  >
                    Withdraw to Bank
                  </button>
                </div>
              </div>

              <div>
                <label className="block label-overline mb-2">Amount (CAD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => /^\d*\.?\d*$/.test(e.target.value) && setTransferAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-4 bg-white/[0.03] border border-white/[0.05] text-white rounded-xl focus:ring-primary focus:border-primary text-sm focus:outline-none font-semibold"
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
              variant="gold"
              className="w-full"
            >
              {isTransferring ? "Processing..." : "Confirm Transfer"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuButton = ({ icon: Icon, label, value, isGold, isLast, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`card-flat w-full flex items-center justify-between group hover:bg-white/[0.02] px-4 py-4 ${isLast ? 'border-b-0' : ''}`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isGold ? 'bg-primary/10 text-primary' : 'bg-white/[0.05] text-gray-400 group-hover:bg-white/[0.1] group-hover:text-white transition-colors'}`}>
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      {value && <span className="label-meta">{value}</span>}
      <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
    </div>
  </button>
);

const ToggleMenuButton = ({ icon: Icon, label, enabled, setEnabled, isLast }: any) => (
  <div className={`card-flat w-full flex items-center justify-between px-4 py-4 ${isLast ? 'border-b-0' : ''}`}>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-white/[0.05] flex items-center justify-center text-gray-400">
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium text-white">{label}</span>
    </div>
    <ToggleSwitch enabled={enabled} setEnabled={setEnabled} />
  </div>
);

const ToggleSwitch = ({ enabled, setEnabled }: any) => (
  <button
    onClick={() => setEnabled(!enabled)}
    className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ${enabled ? 'bg-primary' : 'bg-white/[0.1]'}`}
  >
    <motion.div
      className="w-4 h-4 bg-white rounded-full shadow-lg"
      animate={{ x: enabled ? 24 : 0 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    />
  </button>
);

export default Profile;
