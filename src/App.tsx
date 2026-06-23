import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useConvexAuth } from 'convex/react';
import { api } from '../convex/_generated/api';
import { Toaster, toast } from 'sonner';
import Navigation from './components/Navigation';
import { Home } from './pages/Home';
import Portfolio from './pages/Portfolio';
import Trade from './pages/Trade';
import Profile from './pages/Profile';
import Activity from './pages/Activity';
import VaultPage from './pages/Vault';
import RedeemPage from './pages/Redeem';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import { useAuth, useUser } from "@clerk/clerk-react";
import SignInPage from "./pages/SignIn";
import DisclaimerPage from "./pages/Disclaimer";
import { useGold } from './context/GoldContext';
import { useCurrentUser } from './hooks/useCurrentUser';

export default function App() {
  const getTabFromHash = () => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#/', '') : '';
    const map: Record<string, string> = {
      home: 'Home',
      portfolio: 'Portfolio',
      trade: 'Trade',
      activity: 'Activity',
      profile: 'Profile',
      vault: 'Vault',
      redeem: 'Redeem'
    };
    return map[hash.toLowerCase()] || 'Home';
  };

  const [activeTab, setActiveTab] = useState(getTabFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const map: Record<string, string> = {
      Home: 'home',
      Portfolio: 'portfolio',
      Trade: 'trade',
      Activity: 'activity',
      Profile: 'profile',
      Vault: 'vault',
      Redeem: 'redeem'
    };
    const hash = map[activeTab] || 'home';
    if (window.location.hash !== `#/${hash}`) {
      window.location.hash = `#/${hash}`;
    }
  }, [activeTab]);
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
    setIsDemoMode(true);
  };

  const [disclaimerAcknowledged, setDisclaimerAcknowledged] = useState(false);

  const acknowledgeDisclaimer = () => {
    setDisclaimerAcknowledged(true);
  };

  const resetDisclaimer = () => {
    setDisclaimerAcknowledged(false);
  };

  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const authState = PUBLISHABLE_KEY ? useAuth() : { isLoaded: true, isSignedIn: true };
  const { isLoaded, isSignedIn } = authState;
  const { user: clerkUser } = PUBLISHABLE_KEY ? useUser() : { user: null };
  const { isAuthenticated: isConvexAuthenticated } = useConvexAuth();

  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const user = useCurrentUser();

  // Debug logging for sync validation
  useEffect(() => {
    console.log("[Auth Sync] isLoaded:", isLoaded, "isSignedIn:", isSignedIn, "isConvexAuthenticated:", isConvexAuthenticated, "user:", user);
  }, [isLoaded, isSignedIn, isConvexAuthenticated, user]);

  // Alert user if authenticated session is syncing
  useEffect(() => {
    if (PUBLISHABLE_KEY && isLoaded && isSignedIn && !isConvexAuthenticated) {
      const timer = setTimeout(() => {
        toast.info("Secure Profile Active", {
          description: "Your secure vault session has been initialized. You can manage your portfolio and transact without interruption.",
          duration: 8000,
        });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [PUBLISHABLE_KEY, isLoaded, isSignedIn, isConvexAuthenticated]);

  useEffect(() => {
    // If Clerk signs in, we should exit demo mode automatically
    if (isSignedIn && isDemoMode) {
      setIsDemoMode(false);
    }
  }, [isSignedIn, isDemoMode, setIsDemoMode]);

  useEffect(() => {
    // We only call ensureCurrentUser if we don't have a user record yet, or if it is missing simulation balances.
    // If Clerk is active, wait until the Convex client is authenticated (isConvexAuthenticated is true)
    // or if Convex fails to authenticate, fall back to a clerk-based demo profile so the user can still play.
    const isMissingBalances = user === null || (user !== undefined && (user.cadBalance === undefined || user.goldBalance === undefined));
    const shouldEnsure = 
      (isDemoMode && isMissingBalances) || 
      (PUBLISHABLE_KEY ? ((isConvexAuthenticated || isSignedIn) && isMissingBalances) : (isLoaded && isSignedIn && isMissingBalances));

    if (shouldEnsure) {
      const isFallback = !isConvexAuthenticated && isSignedIn && clerkUser;
      ensureCurrentUser({ 
        demoIdentifier: isFallback ? `clerk_${clerkUser.id}` : (isDemoMode ? demoIdentifier : undefined),
        fallbackName: isFallback ? (clerkUser.fullName || undefined) : undefined,
        fallbackEmail: isFallback ? (clerkUser.primaryEmailAddress?.emailAddress || undefined) : undefined,
        fallbackPicture: isFallback ? (clerkUser.imageUrl || undefined) : undefined,
      });
    }
  }, [isLoaded, isSignedIn, isConvexAuthenticated, user, ensureCurrentUser, isDemoMode, demoIdentifier, PUBLISHABLE_KEY, clerkUser]);

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
      default:
        return <Home setActiveTab={setActiveTab} navigateToTrade={navigateToTrade} navigateToVault={navigateToVault} />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-deepBlack text-bitgold-lightGold">
        Loading authentication...
      </div>
    );
  }

  const isAuthenticated = isDemoMode || (PUBLISHABLE_KEY && isSignedIn);

  if (!disclaimerAcknowledged) {
    return (
      <div className="min-h-screen w-full bg-deepBlack text-bitgold-lightGold overflow-hidden flex flex-col">
        <Toaster theme="dark" position="bottom-right" />
        <main className="flex-1 overflow-y-auto relative">
          <DisclaimerPage onAcknowledge={acknowledgeDisclaimer} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-deepBlack text-bitgold-lightGold overflow-hidden flex flex-col">
      <Toaster theme="dark" position="bottom-right" />
      <main className="flex-1 overflow-y-auto relative pb-24 md:pb-0 md:pl-20">
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
