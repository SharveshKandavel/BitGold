import React, { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { AuthLayout } from "./AuthLayout";
import Button from "./ui/Button";
import Input from "./ui/Input";
import { toast } from "sonner";

interface TwoFactorChallengeProps {
  email: string;
  onVerified: () => void;
  onBackToSignIn: () => void;
}

export function TwoFactorChallenge({ email, onVerified, onBackToSignIn }: TwoFactorChallengeProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const validate2FA = useAction(api.twoFactor.validate2FA);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error("Please enter a 6-digit code.");
      return;
    }
    setIsVerifying(true);
    try {
      const isValid = await validate2FA({ code, email });
      if (isValid) {
        toast.success("Two-Factor Authentication successful!");
        onVerified();
      } else {
        toast.error("Invalid 2FA code.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to validate 2FA.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <AuthLayout title="Two-Factor Authentication">
      <p className="text-gray-400 text-center mb-6">
        Please enter the 6-digit code from your authenticator app.
      </p>
      <div>
        <Input
          type="text"
          placeholder="XXXXXX"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 bg-white/5 border-none rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FFC107] focus:outline-none text-center text-lg tracking-widest"
          maxLength={6}
          inputMode="numeric"
        />
      </div>
      <Button
        onClick={handleVerify}
        className="w-full bg-[#FFC107] text-black font-bold py-3 rounded-lg text-lg hover:bg-yellow-400 transition-colors mt-4"
        disabled={isVerifying || code.length !== 6}
      >
        {isVerifying ? "Verifying..." : "Verify Code"}
      </Button>
      <p className="text-center text-gray-400 text-sm mt-4">
        <button onClick={onBackToSignIn} className="text-[#FFC107] hover:underline">
          Back to Sign In
        </button>
      </p>
    </AuthLayout>
  );
}