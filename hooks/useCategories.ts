
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Category } from '../types';
import { INITIAL_CATEGORIES } from '../constants';

interface CategoryContextType {
  categories: Category[];
  getCategoryById: (id: string) => Category | undefined;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const categoriesCollection = collection(db, 'categories');
    const unsubscribe = onSnapshot(categoriesCollection, (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
         if (categoriesData.length > 0) {
            setCategories(categoriesData);
        } else {
             // This is for demo purposes to ensure the app has data on first run.
             // In a real application, you'd use a dedicated seeding script.
             console.log("No categories found in Firestore. Populating with initial data for demo.");
             INITIAL_CATEGORIES.forEach(category => {
                 const { id, ...catData } = category;
                 addDoc(categoriesCollection, catData);
             });
        }
    });
    return () => unsubscribe();
  }, []);

  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(c => c.id === id);
  };

  const addCategory = async (name: string) => {
    await addDoc(collection(db, 'categories'), { name });
  };

  const updateCategory = async (id: string, name: string) => {
    const categoryRef = doc(db, 'categories', id);
    await updateDoc(categoryRef, { name });
  };

  const deleteCategory = async (id: string) => {
    const categoryRef = doc(db, 'categories', id);
    await deleteDoc(categoryRef);
  };

  return React.createElement(CategoryContext.Provider, {
    value: { categories, getCategoryById, addCategory, updateCategory, deleteCategory }
  }, children);
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};