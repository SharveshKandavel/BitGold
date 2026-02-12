import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface LocationContextType {
  currentLocation: string;
  navigate: (path: string) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  const navigate = useCallback((path: string) => {
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", path);
    }
    setCurrentLocation(path);
  }, []);

  return (
    <LocationContext.Provider value={{ currentLocation, navigate }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
