import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Toaster } from 'sonner';
import Navigation from './components/Navigation';
import { Home } from './pages/Home';
import Portfolio from './pages/Portfolio';
import Trade from './pages/Trade';
import Profile from './pages/Profile';
import Activity from './pages/Activity';
import VaultPage from './pages/Vault';
import RedeemPage from './pages/Redeem';
import { PaymentMethodsPage } from './pages/PaymentMethodsPage';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import { useAuth } from "@clerk/clerk-react";
import SignInPage from "./pages/SignIn";
import DisclaimerPage from "./pages/Disclaimer";
import { useGold } from './context/GoldContext';
import { useCurrentUser } from './hooks/useCurrentUser';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [tradeInitialMode, setTradeInitialMode] = useState<'Buy' | 'Sell'>('Buy');
  const [vaultInitialSegment, setVaultInitialSegment] = useState<'storage' | 'automation'>('storage');

  const { isDemoMode, setIsDemoMode, demoIdentifier } = useGold();

  const navigateToTrade = (mode: 'Buy' | 'Sell') => {
    setTradeInitialMode(mode);
    setActiveTab('Trade');
  };

  const navigateToVault = (segment: 'storage' | 'automation') => {
    setVaultInitialSegment(segment);
    setActiveTab('Vault');
  };

  const enterDemoMode = () => {
    localStorage.setItem('bitgold_demo_mode', 'true');
    setIsDemoMode(true);
  };

  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(() => {
    return localStorage.getItem('bitgold_disclaimer_acknowledged') === 'true';
  });

  const acknowledgeDisclaimer = () => {
    localStorage.setItem('bitgold_disclaimer_acknowledged', 'true');
    setDisclaimerAcknowledged(true);
  };

  const resetDisclaimer = () => {
    localStorage.removeItem('bitgold_disclaimer_acknowledged');
    setDisclaimerAcknowledged(false);
  };

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const authState = PUBLISHABLE_KEY ? useAuth() : { isLoaded: true, isSignedIn: true };
  const { isLoaded, isSignedIn } = authState;

  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const user = useCurrentUser();

  useEffect(() => {
    // If Clerk signs in, we should exit demo mode automatically
    if (isSignedIn && isDemoMode) {
      localStorage.removeItem('bitgold_demo_mode');
      setIsDemoMode(false);
    }
  }, [isSignedIn, isDemoMode, setIsDemoMode]);

  useEffect(() => {
    // If Clerk is not set up OR user has clicked Demo Mode, automatically log them in
    // We only call ensureCurrentUser if we don't have a user record yet
    const shouldEnsure = (isLoaded && isSignedIn && user === null) || (isDemoMode && user === null);
    if (shouldEnsure) {
      ensureCurrentUser({ demoIdentifier: isDemoMode ? demoIdentifier : undefined });
    }
  }, [isLoaded, isSignedIn, user, ensureCurrentUser, isDemoMode, demoIdentifier]);

  const renderPage = () => {
    switch (activeTab) {
      case 'Home':
        return <Home setActiveTab={setActiveTab} navigateToTrade={navigateToTrade} navigateToVault={navigateToVault} />;
      case 'Portfolio':
        return <Portfolio setActiveTab={setActiveTab} />;
      case 'Trade':
        return <Trade setActiveTab={setActiveTab} initialMode={tradeInitialMode} />;
      case 'Activity':
        return <Activity setActiveTab={setActiveTab} />;
      case 'Profile':
        return <Profile setActiveTab={setActiveTab} />;
      case 'Vault':
        return <VaultPage setActiveTab={setActiveTab} initialSegment={vaultInitialSegment} />;
      case 'Redeem':
        return <RedeemPage setActiveTab={setActiveTab} />;
      case 'PaymentMethods':
        return <PaymentMethodsPage />;
      default:
        return <Home setActiveTab={setActiveTab} navigateToTrade={navigateToTrade} navigateToVault={navigateToVault} />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deepBlack text-bitgold-lightGold">
        Loading authentication...
      </div>
    );
  }

  const isAuthenticated = isDemoMode || (PUBLISHABLE_KEY && isSignedIn);

  if (!disclaimerAcknowledged) {
    return (
      <div className="h-screen w-full bg-deepBlack text-bitgold-lightGold overflow-hidden flex flex-col">
        <Toaster theme="dark" position="bottom-right" />
        <main className="flex-1 overflow-hidden relative">
          <DisclaimerPage onAcknowledge={acknowledgeDisclaimer} />
        </main>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-deepBlack text-bitgold-lightGold overflow-hidden flex flex-col">
      <Toaster theme="dark" position="bottom-right" />
      <main className="flex-1 overflow-hidden relative">
        {isAuthenticated ? (
          <AnimatePresence mode="wait">
            <PageTransition key={activeTab}>
              {renderPage()}
            </PageTransition>
          </AnimatePresence>
        ) : (
          <SignInPage onEnterDemoMode={enterDemoMode} onBackToDisclaimer={resetDisclaimer} />
        )}
      </main>
      {isAuthenticated && (
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}
