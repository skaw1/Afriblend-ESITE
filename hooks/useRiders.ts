
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Rider } from '../types';
import { INITIAL_RIDERS } from '../constants';

interface RiderContextType {
  riders: Rider[];
  addRider: (rider: Omit<Rider, 'id'>) => Promise<void>;
  updateRider: (rider: Rider) => Promise<void>;
  deleteRider: (id: string) => Promise<void>;
}

const RiderContext = createContext<RiderContextType | undefined>(undefined);

export const RiderProvider = ({ children }: { children: ReactNode }) => {
  const [riders, setRiders] = useState<Rider[]>([]);

  useEffect(() => {
    const ridersCollection = collection(db, 'riders');
    const unsubscribe = onSnapshot(ridersCollection, (snapshot) => {
        const ridersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Rider));
        if (ridersData.length > 0) {
            setRiders(ridersData);
        } else {
             console.log("No riders found in Firestore. Populating with initial data for demo.");
             INITIAL_RIDERS.forEach(rider => {
                 const { id, ...riderData } = rider;
                 addDoc(ridersCollection, riderData);
             });
        }
    });
    return () => unsubscribe();
  }, []);
  
  const addRider = async (riderData: Omit<Rider, 'id'>) => {
    await addDoc(collection(db, 'riders'), riderData);
  };

  const updateRider = async (updatedRider: Rider) => {
    const { id, ...riderData } = updatedRider;
    const riderRef = doc(db, 'riders', id);
    await updateDoc(riderRef, riderData);
  };

  const deleteRider = async (id: string) => {
    const riderRef = doc(db, 'riders', id);
    await deleteDoc(riderRef);
  };

  return React.createElement(RiderContext.Provider, {
    value: { riders, addRider, updateRider, deleteRider }
  }, children);
};

export const useRiders = () => {
  const context = useContext(RiderContext);
  if (context === undefined) {
    throw new Error('useRiders must be used within a RiderProvider');
  }
  return context;
};