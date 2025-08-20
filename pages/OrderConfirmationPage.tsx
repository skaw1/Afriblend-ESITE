import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { CheckCircle2 } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
    const { orderId } = ReactRouterDOM.useParams<{ orderId: string }>();
    const { getOrderById } = useOrders();
    const order = getOrderById(orderId || '');

    if (!order) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-semibold">Order not found.</h1>
                <ReactRouterDOM.Link to="/" className="mt-4 inline-block text-brand-secondary dark:text-dark-accent">
                    Go to Homepage
                </ReactRouterDOM.Link>
            </div>
        );
    }
    
    const trackingUrl = `${window.location.origin}/track/${order.trackingId}`;

    return (
        <div className="bg-white dark:bg-dark-bg">
            <div className="container mx-auto px-6 py-12 text-center">
                <CheckCircle2 className="mx-auto text-7xl text-green-500" />
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary dark:text-dark-text mt-4">Thank You For Your Order!</h1>
                <p className="mt-2 text-gray-600 dark:text-dark-subtext">Your order has been placed successfully. You can use the link below to track it.</p>
                
                <div className="mt-8 max-w-2xl mx-auto text-left bg-gray-50 dark:bg-dark-card p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">Order Summary (ID: #{order.id})</h2>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Total:</strong> KSH {Math.round(order.total)}</p>
                    <p><strong>Shipping to:</strong> {order.clientDetails.name}, {order.clientDetails.address}</p>
                    <div className="mt-4 pt-4 border-t dark:border-dark-border">
                        <p className="font-semibold">Track your order:</p>
                        <p className="text-sm text-gray-500 dark:text-dark-subtext">Use the link below to track the status of your delivery.</p>
                        <ReactRouterDOM.Link to={`/track/${order.trackingId}`} className="text-brand-secondary dark:text-dark-accent font-bold break-all hover:underline">{trackingUrl}</ReactRouterDOM.Link>
                    </div>
                </div>

                <ReactRouterDOM.Link to="/products" className="mt-8 inline-block bg-brand-secondary text-white font-bold py-3 px-8 text-lg hover:bg-brand-primary transition-colors dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                    Continue Shopping
                </ReactRouterDOM.Link>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;