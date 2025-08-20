
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { StoreSettings } from '../types';
import { INITIAL_STORE_SETTINGS } from '../constants';

interface SettingsContextType {
  settings: StoreSettings;
  updateSettings: (settings: StoreSettings) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);

  useEffect(() => {
    const settingsRef = doc(db, 'settings', 'main');
    const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
        if (docSnap.exists()) {
            setSettings(docSnap.data() as StoreSettings);
        } else {
            // Document doesn't exist, maybe initialize it or use defaults
            console.log("No settings document found in Firestore. Using initial settings.");
            setSettings(INITIAL_STORE_SETTINGS);
        }
    });

    return () => unsubscribe();
  }, []);

  const updateSettings = async (newSettings: StoreSettings) => {
    const settingsRef = doc(db, 'settings', 'main');
    await setDoc(settingsRef, newSettings);
  };

  return React.createElement(SettingsContext.Provider, {
    value: { settings, updateSettings }
  }, children);
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};