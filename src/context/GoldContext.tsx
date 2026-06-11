import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  isActive: boolean;
}

interface GoldContextType {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  addPaymentMethod: (method: PaymentMethod) => void;
  selectPaymentMethod: (methodId: string) => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  demoIdentifier: string | undefined;
}

const GoldContext = createContext<GoldContextType | undefined>(undefined);

export const GoldProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(() => {
    return localStorage.getItem('bitgold_demo_mode') === 'true';
  });

  const [demoIdentifier, setDemoIdentifier] = useState<string | undefined>(() => {
    return localStorage.getItem('bitgold_demo_identifier') || undefined;
  });

  useEffect(() => {
    if (isDemoMode && !demoIdentifier) {
      const newId = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('bitgold_demo_identifier', newId);
      setDemoIdentifier(newId);
    }
  }, [isDemoMode, demoIdentifier]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', brand: 'Visa', last4: '4242', isActive: true },
    { id: '2', brand: 'Mastercard', last4: '5555', isActive: false },
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(
    paymentMethods[0] || null,
  );

  const addPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) => [
      ...prev.map((pm) => ({ ...pm, isActive: false })),
      { ...method, isActive: true },
    ]);
    setSelectedPaymentMethod({ ...method, isActive: true });
  };

  const selectPaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, isActive: pm.id === methodId })),
    );
    setSelectedPaymentMethod(
      paymentMethods.find((pm) => pm.id === methodId) || null,
    );
  };

  return (
    <GoldContext.Provider
      value={{
        paymentMethods,
        selectedPaymentMethod,
        addPaymentMethod,
        selectPaymentMethod,
        isDemoMode,
        setIsDemoMode,
        demoIdentifier,
      }}
    >
      {children}
    </GoldContext.Provider>
  );
};

export const useGold = () => {
  const context = useContext(GoldContext);
  if (context === undefined) {
    throw new Error('useGold must be used within a GoldProvider');
  }
  return context;
};
