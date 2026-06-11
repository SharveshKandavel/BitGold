import React from "react";
import { motion, Variants } from "framer-motion";
import { ShieldAlert, ArrowRight, UserCheck, Coins } from "lucide-react";
import Button from "../components/ui/Button";

interface DisclaimerPageProps {
  onAcknowledge: () => void;
}

export default function DisclaimerPage({ onAcknowledge }: DisclaimerPageProps) {
  const fadeInUp: Variants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden font-sans">
      {/* Immersive Background Radial Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#BF953F]/10 to-transparent blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-[#FCF6BA]/5 to-transparent blur-[100px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-lg px-6 py-12 flex flex-col items-center">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="w-full flex flex-col items-center"
        >
          {/* Logo / Badge */}
          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] flex items-center justify-center shadow-[0_10px_30px_rgba(212,175,55,0.25)] mb-8">
            <ShieldAlert size={28} className="text-black" />
          </div>

          <h1 className="text-3xl font-light tracking-widest text-center uppercase mb-2">
            BitGold <span className="text-[#D4AF37] font-bold italic">Vault</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            Sandbox Environment
          </p>

          {/* Disclaimer Glass Panel */}
          <div className="w-full p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl mb-8 space-y-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Coins size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-1">Fintech Simulator</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  This is a financial simulator. No real money, credit cards, or actual bank accounts are linked to this platform.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                <UserCheck size={16} />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-1">Simulated Capital</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every user is allocated a sandbox starting balance of <span className="text-[#D4AF37] font-bold">$10,000 CAD</span> to experiment with gold investments.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onAcknowledge}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#FCF6BA] to-[#B38728] text-black font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-gold/20 hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>Acknowledge & Proceed</span>
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
