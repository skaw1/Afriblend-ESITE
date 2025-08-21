

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Order, CartItem, ClientDetails, OrderStatus, PaymentStatus } from '../types';
import { useProducts } from './useProducts';
import { INITIAL_ORDERS } from '../constants';

// Helper to generate a random tracking ID
const generateTrackingId = () => 'AFB' + Math.random().toString(36).substr(2, 9).toUpperCase();


interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], total: number, clientDetails: ClientDetails, paymentMethod: string) => Promise<Order>;
  getOrderById: (id: string) => Order | undefined;
  getOrderByTrackingId: (trackingId: string) => Order | undefined;
  getOrdersByPhone: (phone: string) => Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateClientDetails: (orderId: string, details: ClientDetails) => void;
  updateOrderPaymentStatus: (orderId: string, paymentStatus: PaymentStatus) => void;
  assignRiderToOrder: (orderId: string, riderId: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { getProductById, updateProduct } = useProducts();

  useEffect(() => {
    const ordersCollection = collection(db, 'orders');
    const unsubscribe = onSnapshot(ordersCollection, (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        if (ordersData.length > 0) {
            setOrders(ordersData.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
        } else {
            // If the collection is empty in Firestore, you might want to initialize it with default data
            // For now, we'll just set it to an empty array or the initial constant data
            // In a real app, you'd have a separate seeding script.
             console.log("No orders found in Firestore. Populating with initial data for demo.");
             INITIAL_ORDERS.forEach(order => {
                const { id, ...orderData } = order;
                // This is a simple seeding mechanism for the demo.
                // In a real app, you would use a backend script.
                // We are not using addDoc here to avoid a write loop on initial load.
             });
             setOrders(INITIAL_ORDERS as unknown as Order[]);
        }
    });

    return () => unsubscribe();
  }, []);


  const addOrder = async (items: CartItem[], total: number, clientDetails: ClientDetails, paymentMethod: string): Promise<Order> => {
    const newOrderData = {
        trackingId: generateTrackingId(),
        clientDetails,
        items,
        total,
        status: 'Pending Payment' as OrderStatus,
        paymentStatus: 'Unpaid' as PaymentStatus,
        orderDate: new Date().toISOString(),
        paymentMethod,
    };
    const docRef = await addDoc(collection(db, 'orders'), newOrderData);
    const newOrder = { id: docRef.id, ...newOrderData } as Order;

    // Optimistically update the local state to prevent race conditions on navigation
    setOrders(prevOrders => [
        newOrder,
        ...prevOrders
    ].sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));

    return newOrder;
  };
  
  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  }

  const getOrderByTrackingId = (trackingId: string) => {
      return orders.find(order => order.trackingId.toLowerCase() === trackingId.toLowerCase());
  }
  
  const getOrdersByPhone = (phone: string) => {
      return orders.filter(order => order.clientDetails.phone.replace(/\s/g,'') === phone.replace(/\s/g,''));
  }

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    const wasConditionMet = orderToUpdate.status === 'Delivered' && orderToUpdate.paymentStatus === 'Paid';
    const isConditionMet = status === 'Delivered' && orderToUpdate.paymentStatus === 'Paid';

    if (isConditionMet && !wasConditionMet) {
        orderToUpdate.items.forEach(item => {
            const product = getProductById(item.id);
            if (product) {
                const newStock = product.stock - item.quantity;
                updateProduct({ ...product, stock: newStock < 0 ? 0 : newStock });
            }
        });
    }

    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status });
  };

  const updateClientDetails = async (orderId: string, details: ClientDetails) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { clientDetails: details });
  };

  const updateOrderPaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    const orderToUpdate = orders.find(o => o.id === orderId);
    if (!orderToUpdate) return;

    const wasConditionMet = orderToUpdate.status === 'Delivered' && orderToUpdate.paymentStatus === 'Paid';
    const isConditionMet = orderToUpdate.status === 'Delivered' && paymentStatus === 'Paid';

    if (isConditionMet && !wasConditionMet) {
        orderToUpdate.items.forEach(item => {
            const product = getProductById(item.id);
            if (product) {
                const newStock = product.stock - item.quantity;
                updateProduct({ ...product, stock: newStock < 0 ? 0 : newStock });
            }
        });
    }

    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { paymentStatus });
  };
  
  const assignRiderToOrder = async (orderId: string, riderId: string) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { riderId, status: 'Out for Delivery' });
  };

  return React.createElement(OrderContext.Provider, {
    value: { orders, addOrder, getOrderById, getOrderByTrackingId, getOrdersByPhone, updateOrderStatus, updateClientDetails, updateOrderPaymentStatus, assignRiderToOrder }
  }, children);
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
