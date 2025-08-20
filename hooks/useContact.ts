
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { ContactInfo } from '../types';
import { INITIAL_CONTACT_INFO } from '../constants';

interface ContactContextType {
  contactInfo: ContactInfo;
  updateContactInfo: (contactInfo: ContactInfo) => Promise<void>;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
  const [contactInfo, setContactInfo] = useState<ContactInfo>(INITIAL_CONTACT_INFO);

  useEffect(() => {
    const contactRef = doc(db, 'content', 'contactInfo');
    const unsubscribe = onSnapshot(contactRef, (docSnap) => {
        if (docSnap.exists()) {
            setContactInfo(docSnap.data() as ContactInfo);
        } else {
             console.log("No Contact Info document found. Using initial data.");
             setContactInfo(INITIAL_CONTACT_INFO);
        }
    });
    return () => unsubscribe();
  }, []);

  const updateContactInfo = async (newContactInfo: ContactInfo) => {
    const contactRef = doc(db, 'content', 'contactInfo');
    await setDoc(contactRef, newContactInfo);
  };

  return React.createElement(ContactContext.Provider, {
    value: { contactInfo, updateContactInfo }
  }, children);
};

export const useContact = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};