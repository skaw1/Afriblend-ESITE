
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { FaqItem } from '../types';
import { INITIAL_FAQS } from '../constants';

interface FaqContextType {
  faqs: FaqItem[];
  updateFaqs: (faqs: FaqItem[]) => Promise<void>;
}

const FaqContext = createContext<FaqContextType | undefined>(undefined);

export const FaqProvider = ({ children }: { children: ReactNode }) => {
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);

  useEffect(() => {
    const faqRef = doc(db, 'content', 'faqs');
    const unsubscribe = onSnapshot(faqRef, (docSnap) => {
        if (docSnap.exists()) {
            setFaqs(docSnap.data().items || []);
        } else {
            console.log("No FAQ document found. Using initial data.");
            setFaqs(INITIAL_FAQS);
        }
    });

    return () => unsubscribe();
  }, []);


  const updateFaqs = async (newFaqs: FaqItem[]) => {
    const faqRef = doc(db, 'content', 'faqs');
    await setDoc(faqRef, { items: newFaqs });
  };

  return React.createElement(FaqContext.Provider, {
    value: { faqs, updateFaqs }
  }, children);
};

export const useFaqs = () => {
  const context = useContext(FaqContext);
  if (context === undefined) {
    throw new Error('useFaqs must be used within a FaqProvider');
  }
  return context;
};