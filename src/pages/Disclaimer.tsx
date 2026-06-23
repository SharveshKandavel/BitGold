import React from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowRight, UserCheck, Coins } from "lucide-react";
import { fadeIn } from "../lib/animations";

interface DisclaimerPageProps {
  onAcknowledge: () => void;
}

export default function DisclaimerPage({ onAcknowledge }: DisclaimerPageProps) {
  return (
    <div className="h-full min-h-full w-full flex items-center justify-center bg-[#050505] text-white relative overflow-hidden">
      {/* Immersive Background Radial Glow */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#D4AF37]/10 to-transparent blur-[120px] rounded-full" />
      
      <div className="relative z-10 w-full max-w-lg px-6 py-12 flex flex-col items-center">
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="w-full flex flex-col items-center"
        >
          {/* Logo / Badge */}
          <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-[#BF953F] to-[#B38728] flex items-center justify-center shadow-lg mb-8">
            <ShieldAlert size={28} className="text-black" />
          </div>

          <h1 className="text-3xl font-light tracking-widest text-center uppercase mb-2">
            BitGold <span className="text-[#D4AF37] font-bold italic">Vault</span>
          </h1>
          <p className="label-overline mb-8">
            Sandbox Environment
          </p>

          {/* Disclaimer Panel */}
          <div className="w-full card-primary mb-8 space-y-5">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                <Coins size={16} />
              </div>
              <div>
                <h3 className="label-section mb-1">Fintech Simulator</h3>
                <p className="label-card leading-relaxed">
                  This is a financial simulator. No real money, credit cards, or actual bank accounts are linked to this platform.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] shrink-0">
                <UserCheck size={16} />
              </div>
              <div>
                <h3 className="label-section mb-1">Simulated Capital</h3>
                <p className="label-card leading-relaxed">
                  Every user is allocated a sandbox starting balance of <span className="text-[#D4AF37] font-bold">$10,000 CAD</span> to experiment with gold investments.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onAcknowledge}
            className="w-full btn-gold shadow-xl shadow-[#D4AF37]/20 flex items-center justify-center gap-2"
          >
            <span>Acknowledge & Proceed</span>
            <ArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
