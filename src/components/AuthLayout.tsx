import React, { ReactNode } from "react";
import BitGoldLogo from "./brand/BitGoldLogo";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <BitGoldLogo size="lg" variant="full" />
        {title && <h1 className="text-3xl font-bold mt-4">{title}</h1>}
      </div>
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}