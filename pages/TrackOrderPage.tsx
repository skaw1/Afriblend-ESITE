

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { OrderStatus } from '../types';
import { Check, Circle } from 'lucide-react';
import { useRiders } from '../hooks/useRiders';

const statusSteps: OrderStatus[] = ['Pending Payment', 'Processing', 'Out for Delivery', 'Delivered'];

const TrackOrderPage: React.FC = () => {
    const { trackingId } = useParams<{ trackingId: string }>();
    const { getOrderByTrackingId } = useOrders();
    const { riders } = useRiders();
    const order = getOrderByTrackingId(trackingId || '');

    if (!order) {
        return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-semibold dark:text-dark-text">Invalid Tracking ID.</h1>
                <p className="mt-2 text-gray-600 dark:text-dark-subtext">Please check the tracking ID and try again.</p>
                <Link to="/track" className="mt-4 inline-block text-brand-secondary dark:text-dark-accent">
                    Try Again
                </Link>
            </div>
        );
    }
    
    const rider = order.riderId ? riders.find(r => r.id === order.riderId) : null;
    const currentStatusIndex = order.status === 'Cancelled' ? -1 : statusSteps.indexOf(order.status);

    return (
        <div className="bg-white dark:bg-dark-bg">
            <div className="container mx-auto px-6 py-12">
                <h1 className="text-3xl md:text-4xl font-serif text-center font-bold text-brand-primary dark:text-dark-text mb-4">Track Your Order</h1>
                <p className="text-center text-gray-600 dark:text-dark-subtext mb-12">Order #{order.id} &bull; Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                
                {/* Status Tracker */}
                <div className="max-w-4xl mx-auto mb-16 p-4">
                     {order.status === 'Cancelled' ? (
                        <div className="text-center p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500">
                             <h3 className="text-2xl font-bold text-red-700 dark:text-red-300">Order Cancelled</h3>
                             <p className="text-red-600 dark:text-red-400 mt-1">This order has been cancelled.</p>
                        </div>
                    ) : (
                        <div className="flex items-start">
                            {statusSteps.map((step, index) => (
                                <React.Fragment key={step}>
                                    <div className="flex flex-col items-center w-1/4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${index <= currentStatusIndex ? 'bg-brand-secondary dark:bg-dark-accent border-brand-secondary dark:border-dark-accent' : 'bg-gray-200 dark:bg-dark-border border-gray-300 dark:border-dark-border'}`}>
                                            {index <= currentStatusIndex ? <Check className="h-6 w-6 text-white dark:text-dark-bg" /> : <Circle className="h-6 w-6 text-gray-500 dark:text-dark-subtext" />}
                                        </div>
                                        <p className={`mt-2 font-semibold text-sm text-center ${index <= currentStatusIndex ? 'text-brand-primary dark:text-dark-text' : 'text-gray-500 dark:text-dark-subtext'}`}>{step}</p>
                                    </div>
                                    {index < statusSteps.length - 1 && (
                                        <div className={`flex-1 h-1 mt-6 ${index < currentStatusIndex ? 'bg-brand-secondary dark:bg-dark-accent' : 'bg-gray-300 dark:bg-dark-border'}`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>

                {/* Order Details */}
                <div className="max-w-2xl mx-auto bg-gray-50 dark:bg-dark-card p-6 rounded-lg space-y-2">
                    <h2 className="text-xl font-bold mb-2 dark:text-dark-text">Order Details</h2>
                    <div className="flex justify-between">
                        <span className="dark:text-dark-text"><strong>Status:</strong></span>
                        <span className={`font-semibold ${order.status === 'Cancelled' ? 'text-red-500' : 'text-brand-secondary dark:text-dark-accent'}`}>{order.status}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="dark:text-dark-text"><strong>Payment Status:</strong></span>
                        <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                           {order.paymentStatus === 'Paid' ? 'Paid' : `Payment due: KSH ${Math.round(order.total)}`}
                        </span>
                    </div>
                    {rider && currentStatusIndex >= 2 && (
                         <div className="flex justify-between">
                            <span className="dark:text-dark-text"><strong>Your Rider:</strong></span>
                            <span className="font-semibold text-brand-primary dark:text-dark-text">{rider.name}</span>
                        </div>
                    )}
                    <p className="dark:text-dark-text !mt-4"><strong>Shipping To:</strong> {order.clientDetails.name}, {order.clientDetails.address}</p>
                    <div className="mt-4 pt-4 border-t dark:border-dark-border">
                        <h3 className="font-semibold mb-2 dark:text-dark-text">Items:</h3>
                        <ul className="space-y-2">
                            {order.items.map(item => (
                                <li key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between text-sm dark:text-dark-subtext">
                                    <span>{item.name} x{item.quantity} ({item.selectedSize})</span>
                                    <span>KSH {Math.round(item.price * item.quantity)}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackOrderPage;