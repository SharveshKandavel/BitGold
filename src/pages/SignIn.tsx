import React, { useState } from "react";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { dark } from "@clerk/themes";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, UserCheck, KeyRound, ArrowLeft, Coins } from "lucide-react";
import { fadeIn } from "../lib/animations";

interface SignInPageProps {
  onEnterDemoMode?: () => void;
  onBackToDisclaimer?: () => void;
}

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    fontFamily: "Inter, sans-serif",
    colorPrimary: "#D4AF37",
    colorBackground: "#0d0d0d",
    colorText: "#ffffff",
    colorTextSecondary: "#a3a3a3",
  },
  elements: {
    card: "card-primary shadow-2xl p-6",
    headerTitle: "text-white font-light tracking-tight text-xl",
    headerSubtitle: "text-gray-400 text-sm mt-1",
    socialButtonsBlockButton: "bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] text-white transition-all rounded-xl",
    formButtonPrimary: "btn-gold w-full py-3 shadow-xl shadow-[#D4AF37]/20 border-none",
    footerActionLink: "text-[#D4AF37] hover:text-[#FCF6BA] transition-colors font-semibold",
    formFieldInput: "bg-neutral-950 border border-white/[0.08] text-white rounded-xl focus:ring-[#D4AF37] focus:border-[#D4AF37] focus:border-opacity-100 transition-all",
    dividerLine: "bg-white/10",
    dividerText: "label-overline",
    formFieldLabel: "label-meta mb-2 ml-1"
  },
};

export default function SignInPage({ onEnterDemoMode, onBackToDisclaimer }: SignInPageProps) {
  const [authMethod, setAuthMethod] = useState<"select" | "signin" | "signup">("select");

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
    <div className="h-full min-h-full w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden">
      {/* Immersive Background Radial Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#D4AF37]/5 to-transparent blur-[120px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-lg px-6 py-12 flex flex-col items-center">
        
        {/* Core Animated Container */}
        <AnimatePresence mode="wait">
          {authMethod === "select" ? (
            /* --- STEP 1: Option Selection Screen --- */
            <motion.div
              key="auth-selection"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              {/* Simplified Gold Logo */}
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center select-none">
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#BF953F] to-[#B38728] flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-3xl font-extrabold text-black drop-shadow-sm tracking-tight">B</span>
                </motion.div>
              </div>

              <h1 className="text-3xl font-light tracking-widest text-center text-white mb-2 uppercase">
                Bit<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#BF953F] to-[#B38728]">Gold</span>
              </h1>
              <p className="text-gray-400 text-xs tracking-wider text-center max-w-sm mb-10 font-light px-4">
                Securely invest your spare change into 99.9% physical gold. Please choose your access method below.
              </p>

              <div className="w-full space-y-4 mb-8">
                {/* 1. Demo Card */}
                <button
                  onClick={onEnterDemoMode}
                  className="w-full text-left card-secondary hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all duration-300 group flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#BF953F] to-[#B38728] flex items-center justify-center text-black shadow-md group-hover:scale-105 transition-transform">
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <h2 className="label-section text-white text-base font-medium">Instant Demo Account</h2>
                      <p className="label-meta mt-1 text-gray-400">One-click simulated access. Starts with $10,000 CAD.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>

                {/* 2. Cloud Login Card */}
                <button
                  onClick={() => handleClerkAction("signin")}
                  className="w-full text-left card-secondary hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all duration-300 group flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center text-gray-400 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] group-hover:scale-105 transition-all">
                      <KeyRound size={20} />
                    </div>
                    <div>
                      <h2 className="label-section text-white text-base font-medium">Log In to Cloud</h2>
                      <p className="label-meta mt-1 text-gray-400">Access your existing gold portfolio and settings.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>

                {/* 3. Cloud Sign-Up Card */}
                <button
                  onClick={() => handleClerkAction("signup")}
                  className="w-full text-left card-secondary hover:border-[#D4AF37]/40 hover:bg-white/[0.04] transition-all duration-300 group flex items-center justify-between"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.05] flex items-center justify-center text-gray-400 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37] group-hover:scale-105 transition-all">
                      <Coins size={20} />
                    </div>
                    <div>
                      <h2 className="label-section text-white text-base font-medium">Register Cloud Account</h2>
                      <p className="label-meta mt-1 text-gray-400">Create a new cloud profile to save your progress.</p>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Back Button */}
              {onBackToDisclaimer && (
                <button
                  onClick={onBackToDisclaimer}
                  className="label-overline text-gray-400 hover:text-white transition-colors flex items-center gap-2"
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
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              {/* Custom Back navigation */}
              <button
                onClick={() => setAuthMethod("select")}
                className="self-start mb-6 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] label-overline text-gray-300 hover:text-white transition-colors flex items-center gap-2 border border-white/[0.05]"
              >
                <ArrowLeft size={14} />
                <span>Choose Access Method</span>
              </button>

              <SignIn appearance={clerkAppearance} />
            </motion.div>
          ) : (
            /* --- STEP 3B: Clerk Sign-Up Form --- */
            <motion.div
              key="clerk-signup"
              variants={fadeIn}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full flex flex-col items-center"
            >
              {/* Custom Back navigation */}
              <button
                onClick={() => setAuthMethod("select")}
                className="self-start mb-6 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] label-overline text-gray-300 hover:text-white transition-colors flex items-center gap-2 border border-white/[0.05]"
              >
                <ArrowLeft size={14} />
                <span>Choose Access Method</span>
              </button>

              <SignUp appearance={clerkAppearance} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
