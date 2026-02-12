import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { GoldProvider } from './context/GoldContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Trade from './pages/Trade';
import Profile from './pages/Profile';
import Activity from './pages/Activity';
import VaultPage from './pages/Vault'; // Import VaultPage
import RedeemPage from './pages/Redeem'; // Import RedeemPage




import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');


  const renderPage = () => {
    switch (activeTab) {
      case 'Home':
        return <Home setActiveTab={setActiveTab} />;
      case 'Portfolio':
        return <Portfolio />;
      case 'Trade':
        return <Trade />;
      case 'Activity':
        return <Activity />;
      case 'Profile':
        return <Profile setActiveTab={setActiveTab} />;
      case 'Vault': // New Vault page
        return <VaultPage />;
      case 'Redeem': // New Redeem page
        return <RedeemPage />;


      default:
        return <Home />;
    }
  };

  return (
    <GoldProvider>
      <div className="min-h-screen w-full bg-deepBlack text-bitgold-lightGold">
        <Toaster theme="dark" position="bottom-right" />
        <main className="pb-24">
          <AnimatePresence mode="wait">
            <PageTransition key={activeTab}>
              {renderPage()}
            </PageTransition>
          </AnimatePresence>
        </main>
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

    </GoldProvider>
  );
}
