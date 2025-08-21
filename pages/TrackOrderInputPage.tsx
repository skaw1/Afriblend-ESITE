import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { Compass } from 'lucide-react';

const TrackOrderInputPage: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { getOrderByTrackingId, getOrdersByPhone, getOrderById } = useOrders();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const trimmedInput = inputValue.trim();

        if(!trimmedInput) {
            return;
        }

        // Check if it's a tracking ID first
        const orderByTrackingId = getOrderByTrackingId(trimmedInput);
        if (orderByTrackingId) {
            navigate(`/track/${orderByTrackingId.trackingId}`);
            return;
        }

        // Check if it's an Order ID
        const orderByOrderId = getOrderById(trimmedInput);
        if (orderByOrderId) {
            navigate(`/track/${orderByOrderId.trackingId}`);
            return;
        }
        
        // If not, check if it's a phone number
        const ordersByPhone = getOrdersByPhone(trimmedInput);
        if (ordersByPhone.length > 0) {
            if (ordersByPhone.length === 1) {
                navigate(`/track/${ordersByPhone[0].trackingId}`);
            } else {
                navigate(`/orders-by-phone/${trimmedInput}`);
            }
            return;
        }

        // If no order found
        setError('No order found with that Order ID, Tracking ID, or Phone Number. Please check your details and try again.');
    }

    return (
        <div className="container mx-auto px-6 py-20 text-center min-h-[50vh] flex flex-col justify-center items-center">
            <Compass className="h-16 w-16 text-brand-secondary dark:text-dark-accent" />
            <h1 className="text-3xl font-serif font-bold text-brand-primary dark:text-dark-text mt-4">Track Your Order</h1>
            <p className="mt-2 text-gray-600 dark:text-dark-subtext">Enter your order ID, tracking ID, or phone number below to see the status of your delivery.</p>
            <form onSubmit={handleSubmit} className="mt-8 max-w-md mx-auto w-full">
                <div className="flex">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter Order ID, Tracking ID, or Phone Number" 
                        className="flex-grow bg-white dark:bg-dark-card dark:text-dark-text dark:placeholder:text-dark-subtext border border-r-0 border-gray-300 dark:border-dark-border px-3 py-3 focus:outline-none focus:ring-2 focus:ring-brand-secondary dark:focus:ring-dark-accent rounded-l-md"
                    />
                    <button type="submit" className="bg-brand-primary hover:bg-brand-secondary text-white font-semibold px-6 py-3 transition-colors rounded-r-md dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">Track</button>
                </div>
                 {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
            </form>
        </div>
    );
}

export default TrackOrderInputPage;