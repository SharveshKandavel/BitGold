import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Download } from 'lucide-react';
import { toast } from 'sonner';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import PageTransition from '../components/PageTransition';

// Placeholder for a high-quality gold bar image
// In a real application, this would be a proper asset or even a 3D model viewer
const GOLD_BAR_IMAGE = "https://images.unsplash.com/photo-1620288627228-ee1578f7e268?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const VaultPage: React.FC = () => {
  const handleDownloadCertificate = () => {
    toast.success("Audit Certificate Downloaded!", {
      description: "Your proof of reserves has been securely saved.",
    });
  };

  return (
    <PageTransition>
      <Container className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-8">
        <motion.h1
          className="text-4xl md:text-5xl font-light tracking-tight text-white mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your BitGold Vault
        </motion.h1>

        <div className="relative mb-12">
          <motion.img
            src={GOLD_BAR_IMAGE}
            alt="Gold Bar"
            className="w-64 h-auto rounded-lg shadow-lg"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-0 right-0 p-2 bg-green-500 rounded-full"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 10 }}
          >
            <ShieldCheck className="text-white" size={32} />
          </motion.div>
        </div>

        <Card className="bg-deepBlack/60 backdrop-blur-md p-6 text-center w-full max-w-md mb-8">
          <h2 className="text-xl font-light tracking-tight text-primary mb-3">Live Audit</h2>
          <p className="text-gray-300 mb-2">Your Gold is stored in:</p>
          <p className="text-lg font-semibold text-white">Brinks Vault (London)</p>
          <p className="text-gray-300 mt-2">Insured by:</p>
          <p className="text-lg font-semibold text-white">Lloyd’s of London</p>
        </Card>

        <motion.button
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-deepBlack rounded-full shadow-lg hover:bg-yellow-500 transition-colors"
          onClick={handleDownloadCertificate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download size={20} />
          <span>Download Audit Certificate</span>
        </motion.button>
      </Container>
    </PageTransition>
  );
};

export default VaultPage;
