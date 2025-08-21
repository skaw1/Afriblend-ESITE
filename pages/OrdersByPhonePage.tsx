import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { ChevronRight } from 'lucide-react';

const OrdersByPhonePage: React.FC = () => {
    const { phone } = useParams<{ phone: string }>();
    const { getOrdersByPhone } = useOrders();

    if (!phone) {
        return <Navigate to="/track" replace />;
    }

    const orders = getOrdersByPhone(phone);

    if (orders.length === 0) {
        return (
             <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-semibold dark:text-dark-text">No orders found for this phone number.</h1>
                <p className="mt-2 text-gray-600 dark:text-dark-subtext">Please check the phone number and try again.</p>
                <Link to="/track" className="mt-4 inline-block text-brand-secondary dark:text-dark-accent">
                    Try Again
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-dark-bg min-h-[60vh]">
            <div className="container mx-auto px-6 py-12">
                 <h1 className="text-3xl md:text-4xl font-serif text-center font-bold text-brand-primary dark:text-dark-text mb-4">Your Orders</h1>
                <p className="text-center text-gray-600 dark:text-dark-subtext mb-12">Showing all orders associated with the phone number: {phone}</p>
                
                <div className="max-w-3xl mx-auto space-y-6">
                    {orders.map(order => (
                        <Link to={`/track/${order.trackingId}`} key={order.id} className="block bg-gray-50 dark:bg-dark-card p-6 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-lg text-brand-primary dark:text-dark-text">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500 dark:text-dark-subtext">
                                        Placed on: {new Date(order.orderDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                     <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300' :
                                        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                                     }`}>{order.status}</span>
                                     <p className="text-lg font-bold text-brand-primary dark:text-dark-text mt-1">KSH {Math.round(order.total)}</p>
                                </div>
                                <ChevronRight className="h-6 w-6 text-gray-400 dark:text-dark-subtext" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrdersByPhonePage;