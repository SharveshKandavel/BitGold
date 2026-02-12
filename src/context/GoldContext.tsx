import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a payment method
interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  isActive: boolean;
}

// Define the shape of the GoldContext state
interface GoldContextType {
  goldBalance: number;
  cadBalance: number;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod | null;
  addGold: (amount: number) => void;
  deductCad: (amount: number) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  selectPaymentMethod: (methodId: string) => void;
  updateCadBalance: (amount: number) => void;
  updateGoldBalance: (amount: number) => void;
}

// Create the context with default values
const GoldContext = createContext<GoldContextType | undefined>(undefined);

// GoldProvider component
export const GoldProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [goldBalance, setGoldBalance] = useState<number>(0.52);
  const [cadBalance, setCadBalance] = useState<number>(47.53);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', brand: 'Visa', last4: '4242', isActive: true },
    { id: '2', brand: 'Mastercard', last4: '5555', isActive: false },
  ]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(paymentMethods[0] || null);

  const addGold = (amount: number) => {
    setGoldBalance((prev) => prev + amount);
  };

  const deductCad = (amount: number) => {
    setCadBalance((prev) => prev - amount);
  };

  const addPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev.map(pm => ({ ...pm, isActive: false })), { ...method, isActive: true }]);
    setSelectedPaymentMethod({ ...method, isActive: true });
  };

  const selectPaymentMethod = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((pm) => ({ ...pm, isActive: pm.id === methodId }))
    );
    setSelectedPaymentMethod(paymentMethods.find(pm => pm.id === methodId) || null);
  };
  
  const updateCadBalance = (amount: number) => {
    setCadBalance(amount);
  };

  const updateGoldBalance = (amount: number) => {
    setGoldBalance(amount);
  };


  return (
    <GoldContext.Provider
      value={{
        goldBalance,
        cadBalance,
        paymentMethods,
        selectedPaymentMethod,
        addGold,
        deductCad,
        addPaymentMethod,
        selectPaymentMethod,
        updateCadBalance,
        updateGoldBalance
      }}
    >
      {children}
    </GoldContext.Provider>
  );
};

// Custom hook to use the GoldContext
export const useGold = () => {
  const context = useContext(GoldContext);
  if (context === undefined) {
    throw new Error('useGold must be used within a GoldProvider');
  }
  return context;
};
