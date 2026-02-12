import React, { useState } from "react";
import QRCode from "qrcode.react";
import { useQuery, useAction } from "convex/react";
import { useConvexAuth } from "@convex-dev/auth/react"; // Import useConvexAuth
import { api } from "../../convex/_generated/api";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Input from "./ui/Input";
import LoadingSpinner from "./ui/LoadingSpinner"; // Import LoadingSpinner
import { toast } from "sonner";
import { AuthLayout } from "./AuthLayout"; // Using AuthLayout for consistent styling

export function TwoFactorSetup() {
  const { isAuthenticated, isLoading } = useConvexAuth(); // Get authentication state
  const user = useQuery(api.users.getMe); // Use the new getMe query
  const generateSecret = useAction(api.twoFactor.generate2FASecret);
  const verifyAndEnable = useAction(api.twoFactor.verifyAndEnable2FA);
  const [isSetupStarted, setIsSetupStarted] = useState(false);
  const [tempSecret, setTempSecret] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleStartSetup = async () => {
    try {
      const { secret, otpauthUrl } = await generateSecret();
      setTempSecret(secret);
      setOtpauthUrl(otpauthUrl);
      setIsSetupStarted(true);
      toast.info("Scan the QR code with your authenticator app.");
    } catch (error: any) {
      toast.error(error.message || "Failed to generate 2FA secret.");
    }
  };

  const handleVerifySetup = async () => {
    if (!tempSecret || !verificationCode) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    setIsVerifying(true);
    try {
      const success = await verifyAndEnable({
        secret: tempSecret,
        code: verificationCode,
      });
      if (success) {
        toast.success("2FA enabled successfully!");
        setIsSetupStarted(false); // Reset setup UI
        setTempSecret(null);
        setOtpauthUrl(null);
        setVerificationCode("");
        // Potentially refresh user data to show 2FA is enabled
      } else {
        toast.error("Invalid verification code.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to verify 2FA.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading || user === undefined) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated || user === null) {
    return (
      <Card className="text-center">
        <p className="text-red-500 text-lg">Please log in to manage Two-Factor Authentication.</p>
      </Card>
    );
  }

  if (user?.is2FAEnabled) {
    return (
      <Card className="text-center">
        <p className="text-white text-lg">Two-Factor Authentication is currently enabled.</p>
        {/* Add option to disable 2FA later if needed */}
      </Card>
    );
  }

  return (
    <AuthLayout title="Two-Factor Authentication">
      <div className="space-y-4">
        {!isSetupStarted ? (
          <>
            <p className="text-gray-400 text-center">
              Enhance your account security with Two-Factor Authentication.
            </p>
            <Button
              onClick={handleStartSetup}
              className="w-full bg-[#FFC107] text-black font-bold py-3 rounded-lg text-lg hover:bg-yellow-400 transition-colors"
            >
              Enable 2FA
            </Button>
          </>
        ) : (
          <>
            <p className="text-gray-400 text-center mb-4">
              Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy) and enter the 6-digit code below.
            </p>
            {otpauthUrl && (
              <div className="flex justify-center mb-6">
                <Card className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg">
                  <QRCode value={otpauthUrl} size={200} level="H" fgColor="#FFC107" bgColor="#0D0D0D" />
                </Card>
              </div>
            )}
            <div>
              <Input
                type="text"
                placeholder="6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-3 bg-white/5 border-none rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FFC107] focus:outline-none text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            <Button
              onClick={handleVerifySetup}
              className="w-full bg-[#FFC107] text-black font-bold py-3 rounded-lg text-lg hover:bg-yellow-400 transition-colors"
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify and Enable 2FA"}
            </Button>
            <Button
              onClick={() => setIsSetupStarted(false)}
              className="w-full mt-2 bg-transparent text-gray-400 py-3 rounded-lg text-lg border border-gray-700 hover:bg-white/5 transition-colors"
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </AuthLayout>
  );
}