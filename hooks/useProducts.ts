
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../constants';


interface ProductContextType {
  products: Product[];
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  addProduct: (product: Omit<Product, 'id' | 'slug' | 'sku' | 'rating' | 'reviewCount'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const slugify = (text: string) => text.toLowerCase().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const productsCollection = collection(db, 'products');
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
        const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        if (productsData.length > 0) {
            setProducts(productsData);
        } else {
            // In a real app, this seeding should be done via a backend script, not on the client.
            // This is included for demonstration purposes.
            console.log("No products found in Firestore. Populating with initial data for demo.");
            INITIAL_PRODUCTS.forEach(product => {
                const { id, ...productData } = product; // Exclude numeric id from constant
                addDoc(productsCollection, productData);
            });
        }
    });

    return () => unsubscribe();
  }, []);


  const getProductById = (id: string): Product | undefined => {
    return products.find(p => p.id === id);
  };
  
  const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'slug' | 'sku' | 'rating' | 'reviewCount'>) => {
    const tempId = Date.now();
    const newProductData = {
      ...productData,
      slug: `${slugify(productData.name || 'new-product')}-${tempId}`,
      sku: `AFB-NEW-${tempId}`,
      rating: 0,
      reviewCount: 0,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'products'), newProductData);
  };
  
  const updateProduct = async (updatedProduct: Product) => {
    const { id, ...productData } = updatedProduct;
    const newSlug = `${slugify(productData.name)}-${id}`;
    const productRef = doc(db, 'products', id);
    await updateDoc(productRef, { ...productData, slug: newSlug });
  };

  const deleteProduct = async (id: string) => {
    const productRef = doc(db, 'products', id);
    await deleteDoc(productRef);
  };

  return React.createElement(ProductContext.Provider, {
    value: { products, getProductById, getProductBySlug, addProduct, updateProduct, deleteProduct }
  }, children);
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};