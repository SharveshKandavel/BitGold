import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ShieldAlert, ArrowRight, UserCheck, KeyRound, ArrowLeft, Coins } from "lucide-react";

interface SignInPageProps {
  onEnterDemoMode?: () => void;
  onBackToDisclaimer?: () => void;
}

export default function SignInPage({ onEnterDemoMode, onBackToDisclaimer }: SignInPageProps) {
  const [authMethod, setAuthMethod] = useState<"select" | "signin" | "signup">("select");

  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -15, transition: { duration: 0.3 } }
  };

  const handleClerkAction = (type: "signin" | "signup") => {
    const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    if (!publishableKey) {
      import("sonner").then(({ toast }) => {
        toast.error("Cloud Login Unavailable", {
          description: "Secure cloud access is not configured on this server. Please enter as a guest using the Instant Demo Account option.",
          duration: 5000,
        });
      });
      return;
    }
    setAuthMethod(type);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden font-sans">
      {/* Immersive Background Radial Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#BF953F]/10 to-transparent blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#FCF6BA]/5 to-transparent blur-[100px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-lg px-6 py-12 flex flex-col items-center">
        
        {/* Core Animated Container */}
        <AnimatePresence mode="wait">
          {authMethod === "select" ? (
            /* --- STEP 1: Option Selection Screen (Three Options) --- */
            <motion.div
              key="auth-selection"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              {/* Premium Rotating Gold Coin Logo */}
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center select-none" style={{ perspective: 1000 }}>
                <motion.div 
                  className="w-full h-full relative"
                  whileHover={{ scale: 1.08 }}
                  animate={{ 
                    rotateY: [0, 360]
                  }}
                  transition={{ 
                    duration: 8, 
                    ease: "linear", 
                    repeat: Infinity 
                  }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Outer glowing ring */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] blur-md opacity-40" />
                  
                  {/* Gold Coin Body */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] shadow-[0_10px_30px_rgba(212,175,55,0.3)] flex items-center justify-center border border-[#FCF6BA]/40">
                    {/* Inner ring detail */}
                    <div className="absolute inset-1.5 rounded-full border border-black/10 flex items-center justify-center bg-gradient-to-tr from-[#B38728]/10 to-transparent">
                      <span className="text-3xl font-extrabold text-black drop-shadow-md tracking-tight">B</span>
                    </div>
                    {/* Outer edge ridge effect */}
                    <div className="absolute inset-0.5 rounded-full border border-white/20" />
                  </div>
                </motion.div>
              </div>

              <h1 className="text-3xl font-extralight tracking-widest text-center text-white mb-2 uppercase">
                Bit<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728]">Gold</span>
              </h1>
              <p className="text-gray-400 text-xs tracking-wider text-center max-w-sm mb-10 font-light px-4">
                Securely invest your spare change into 99.9% physical gold. Please choose your access method below.
              </p>

              <div className="w-full space-y-4 mb-8">
                {/* 1. Demo Card */}
                <button
                  onClick={onEnterDemoMode}
                  className="w-full text-left p-6 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 hover:border-[#D4AF37]/60 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:bg-white/[0.06] transition-all duration-300 group flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/20 group-hover:scale-105 transition-transform">
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">Instant Demo Account</h3>
                      <p className="text-xs text-gray-400 mt-1">One-click simulated access. Starts with $10,000 CAD.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                </button>

                {/* 2. Cloud Login Card */}
                <button
                  onClick={() => handleClerkAction("signin")}
                  className="w-full text-left p-6 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all duration-300 group flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] group-hover:scale-105 transition-all">
                      <KeyRound size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">Log In to Cloud</h3>
                      <p className="text-xs text-gray-500 mt-1">Access your existing gold portfolio and settings.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                </button>

                {/* 3. Cloud Sign-Up Card */}
                <button
                  onClick={() => handleClerkAction("signup")}
                  className="w-full text-left p-6 rounded-3xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all duration-300 group flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] group-hover:scale-105 transition-all">
                      <Coins size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-white">Register Cloud Account</h3>
                      <p className="text-xs text-gray-500 mt-1">Create a new cloud profile to save your progress.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-600 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Back Button */}
              {onBackToDisclaimer && (
                <button
                  onClick={onBackToDisclaimer}
                  className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={12} />
                  <span>Back to disclaimer</span>
                </button>
              )}
            </motion.div>
          ) : authMethod === "signin" ? (
            /* --- STEP 3A: Clerk Sign-In Form --- */
            <motion.div
              key="clerk-signin"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              {/* Custom Back navigation to go back to choices */}
              <button
                onClick={() => setAuthMethod("select")}
                className="self-start mb-6 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors flex items-center gap-2 border border-white/5"
              >
                <ArrowLeft size={14} />
                <span>Choose Access Method</span>
              </button>

              <SignIn
                appearance={{
                  baseTheme: dark,
                  variables: {
                    fontFamily: "Inter, sans-serif",
                    colorPrimary: "#D4AF37",
                    colorBackground: "#0d0d0d",
                    colorText: "#ffffff",
                    colorTextSecondary: "#a3a3a3",
                  },
                  elements: {
                    card: "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6",
                    headerTitle: "text-white font-light tracking-tight text-xl",
                    headerSubtitle: "text-gray-400 text-sm mt-1",
                    socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/40 text-white transition-all rounded-xl",
                    formButtonPrimary: "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black font-extrabold uppercase tracking-widest text-xs py-3 shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl border-none",
                    footerActionLink: "text-[#D4AF37] hover:text-[#FCF6BA] transition-colors font-semibold",
                    formFieldInput: "bg-neutral-950 border border-white/10 text-white rounded-xl focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:border-opacity-100 transition-all",
                    dividerLine: "bg-white/10",
                    dividerText: "text-gray-500 text-[10px] font-black uppercase tracking-widest",
                    formFieldLabel: "text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1"
                  },
                }}
              />
            </motion.div>
          ) : (
            /* --- STEP 3B: Clerk Sign-Up Form --- */
            <motion.div
              key="clerk-signup"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              {/* Custom Back navigation to go back to choices */}
              <button
                onClick={() => setAuthMethod("select")}
                className="self-start mb-6 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors flex items-center gap-2 border border-white/5"
              >
                <ArrowLeft size={14} />
                <span>Choose Access Method</span>
              </button>

              <SignUp
                appearance={{
                  baseTheme: dark,
                  variables: {
                    fontFamily: "Inter, sans-serif",
                    colorPrimary: "#D4AF37",
                    colorBackground: "#0d0d0d",
                    colorText: "#ffffff",
                    colorTextSecondary: "#a3a3a3",
                  },
                  elements: {
                    card: "bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6",
                    headerTitle: "text-white font-light tracking-tight text-xl",
                    headerSubtitle: "text-gray-400 text-sm mt-1",
                    socialButtonsBlockButton: "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/40 text-white transition-all rounded-xl",
                    formButtonPrimary: "bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black font-extrabold uppercase tracking-widest text-xs py-3 shadow-xl shadow-[#D4AF37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl border-none",
                    footerActionLink: "text-[#D4AF37] hover:text-[#FCF6BA] transition-colors font-semibold",
                    formFieldInput: "bg-neutral-950 border border-white/10 text-white rounded-xl focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:border-opacity-100 transition-all",
                    dividerLine: "bg-white/10",
                    dividerText: "text-gray-500 text-[10px] font-black uppercase tracking-widest",
                    formFieldLabel: "text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-2 ml-1"
                  },
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
