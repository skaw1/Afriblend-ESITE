import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { Link, useNavigate } from 'react-router-dom';
import { ClientDetails } from '../types';
import { Wallet, ChevronLeft } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const CheckoutPage: React.FC = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { addOrder } = useOrders();
    const { settings } = useSettings();
    const navigate = useNavigate();

    const [clientDetails, setClientDetails] = useState<ClientDetails>({
        name: '',
        address: '',
        phone: ''
    });
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const enabledPaymentMethods = settings.paymentMethods.filter(pm => pm.enabled);

    if (cartItems.length === 0 && !isSubmitting) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-semibold">Your cart is empty.</h1>
                <Link to="/products" className="mt-4 inline-block text-brand-secondary dark:text-dark-accent">
                    Continue Shopping
                </Link>
            </div>
        );
    }
    
    const subtotal = getCartTotal();
    const total = subtotal; // Only item total, no extra charges

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setClientDetails({ ...clientDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentMethod) {
            setError("Please select a payment method.");
            return;
        }
        setError('');
        setIsSubmitting(true);
        
        try {
            const newOrder = await addOrder(cartItems, total, clientDetails, paymentMethod);
            clearCart();
            navigate(`/payment-instructions/${newOrder.id}`);
        } catch (error) {
            console.error("Failed to create order:", error);
            setError("There was a problem placing your order. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-dark-bg">
            <div className="container mx-auto px-6 py-12">
                 <div className="text-center mb-12">
                    <Link to="/cart" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-primary dark:text-dark-subtext dark:hover:text-dark-text mb-4 transition-colors">
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Back to Cart
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary dark:text-dark-text">Checkout</h1>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-16">
                    {/* Shipping & Payment Details */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-brand-primary dark:text-dark-text mb-6">1. Shipping Information</h2>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Full Name</label>
                                    <input type="text" name="name" id="name" required value={clientDetails.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary p-2 dark:bg-dark-card dark:border-dark-border dark:text-dark-text" />
                                </div>
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Address</label>
                                    <input type="text" name="address" id="address" required value={clientDetails.address} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary p-2 dark:bg-dark-card dark:border-dark-border dark:text-dark-text" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Phone Number (with country code, e.g., +254712345678)</label>
                                    <input 
                                        type="tel" 
                                        name="phone" 
                                        id="phone" 
                                        required 
                                        value={clientDetails.phone} 
                                        onChange={handleChange} 
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary p-2 dark:bg-dark-card dark:border-dark-border dark:text-dark-text" 
                                        placeholder="+254712345678"
                                        pattern="\+[0-9]{1,4}[0-9]{9,}"
                                        title="Please enter the phone number with a country code, starting with a '+' sign."
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-serif font-bold text-brand-primary dark:text-dark-text mb-6">2. Payment Method</h2>
                             <div className="space-y-4">
                                {enabledPaymentMethods.map((pm) => (
                                     <button key={pm.id} type="button" onClick={() => setPaymentMethod(pm.name)} className={`w-full flex items-center p-4 border-2 rounded-lg transition-all ${paymentMethod === pm.name ? 'border-brand-secondary dark:border-dark-accent bg-brand-secondary/5 dark:bg-dark-accent/10' : 'border-gray-300 dark:border-dark-border hover:border-brand-secondary/50'}`}>
                                        <Wallet className="h-7 w-7 text-brand-secondary dark:text-dark-accent mr-4 flex-shrink-0" />
                                        <div className="text-left">
                                            <p className="font-semibold">{pm.name}</p>
                                            <p className="text-sm text-gray-500 dark:text-dark-subtext">{pm.instructions}</p>
                                        </div>
                                    </button>
                                ))}

                                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 dark:bg-dark-card p-6 rounded-lg h-fit sticky top-24">
                        <h2 className="text-2xl font-serif font-bold text-brand-primary dark:text-dark-text mb-6">3. Your Order</h2>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <img src={item.images[0]} alt={item.name} className="w-12 h-16 object-cover rounded"/>
                                        <div>
                                            <p className="font-semibold">{item.name} <span className="text-sm font-normal">x {item.quantity}</span></p>
                                            <p className="text-sm text-gray-500 dark:text-dark-subtext">{item.selectedSize}, {item.selectedColor}</p>
                                        </div>
                                    </div>
                                    <p>KSH {Math.round(item.price * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-gray-300 dark:border-dark-border my-4"></div>
                        <div className="space-y-3 text-gray-700 dark:text-dark-subtext">
                            <div className="flex justify-between"><span>Subtotal</span><span>KSH {Math.round(subtotal)}</span></div>
                            <div className="flex justify-between font-bold text-lg text-brand-primary dark:text-dark-text mt-2"><span>Total</span><span>KSH {Math.round(total)}</span></div>
                        </div>
                         <p className="mt-4 text-xs text-gray-500 dark:text-dark-subtext">
                            * Delivery charges vary by location. Please confirm the final amount with the store after placing your order.
                        </p>
                         <button type="submit" disabled={isSubmitting || !paymentMethod} className="w-full mt-6 bg-brand-primary text-white py-3 rounded-md font-semibold hover:bg-brand-secondary transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                            {isSubmitting ? 'Placing Order...' : `Place Order (KSH ${Math.round(total)})`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;