import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { ShoppingBag, ChevronLeft } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

  const subtotal = getCartTotal();
  const total = subtotal; // Only item total, no extra charges

  return (
    <div className="bg-white dark:bg-dark-bg">
        <div className="container mx-auto px-6 py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary dark:text-dark-text">Your Shopping Bag</h1>
                 {cartItems.length > 0 && (
                    <ReactRouterDOM.Link to="/products" className="inline-flex items-center text-sm font-medium text-brand-secondary hover:underline dark:text-dark-accent">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Continue Shopping
                    </ReactRouterDOM.Link>
                )}
            </div>
            
            {cartItems.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-gray-300 dark:border-dark-border rounded-lg">
                    <ShoppingBag className="mx-auto h-16 w-16 text-gray-400 dark:text-dark-subtext" />
                    <h2 className="mt-4 text-2xl font-semibold text-brand-primary dark:text-dark-text">Your bag is empty</h2>
                    <p className="mt-2 text-gray-500 dark:text-dark-subtext">Looks like you haven't added anything yet.</p>
                    <ReactRouterDOM.Link to="/products" className="mt-6 inline-block bg-brand-secondary text-white font-bold py-3 px-8 text-lg hover:bg-brand-primary transition-colors dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                        Continue Shopping
                    </ReactRouterDOM.Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {cartItems.map(item => (
                            <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex items-start space-x-4 bg-gray-50 dark:bg-dark-card p-4 rounded-lg">
                                <img src={item.images[0]} alt={item.name} className="w-24 h-32 object-cover rounded-md" />
                                <div className="flex-1">
                                    <h2 className="font-bold text-lg text-brand-primary dark:text-dark-text">{item.name}</h2>
                                    <p className="text-sm text-gray-500 dark:text-dark-subtext">Color: {item.selectedColor}</p>
                                    <p className="text-sm text-gray-500 dark:text-dark-subtext">Size: {item.selectedSize}</p>
                                    <p className="font-semibold text-brand-primary dark:text-dark-text mt-2">KSH {Math.round(item.price)}</p>
                                </div>
                                <div className="flex flex-col items-end justify-between h-full">
                                    <div className="flex items-center border border-gray-300 dark:border-dark-border rounded-md">
                                        <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-200 dark:text-dark-subtext dark:hover:bg-gray-600">-</button>
                                        <span className="px-3 py-1 text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)} className="px-2 py-1 text-gray-600 hover:bg-gray-200 dark:text-dark-subtext dark:hover:bg-gray-600">+</button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)} className="text-sm text-red-500 hover:underline mt-4">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg sticky top-24">
                            <h2 className="text-2xl font-serif font-bold text-brand-primary dark:text-dark-text mb-6">Order Summary</h2>
                            <div className="space-y-3 text-gray-700 dark:text-dark-subtext">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>KSH {Math.round(subtotal)}</span>
                                </div>
                            </div>
                            <div className="border-t border-gray-300 dark:border-dark-border my-4"></div>
                            <div className="flex justify-between font-bold text-lg text-brand-primary dark:text-dark-text">
                                <span>Total</span>
                                <span>KSH {Math.round(total)}</span>
                            </div>
                            <p className="mt-4 text-xs text-gray-500 dark:text-dark-subtext text-center">
                                * Delivery charges vary by location and will be confirmed by the store.
                            </p>
                            <ReactRouterDOM.Link to="/checkout" className="w-full text-center block mt-6 bg-brand-primary text-white py-3 rounded-md font-semibold hover:bg-brand-secondary transition-colors dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                                Proceed to Checkout
                            </ReactRouterDOM.Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default CartPage;