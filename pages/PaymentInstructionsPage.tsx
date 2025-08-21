import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useOrders } from '../hooks/useOrders';
import { CheckCircle2, Copy, Check, Phone } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';

const PaymentInstructionsPage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { getOrderById } = useOrders();
    const { settings } = useSettings();
    const order = getOrderById(orderId || '');
    const [copied, setCopied] = useState(false);

    if (!order) {
        return <Navigate to="/track" replace />;
    }

    const paymentMethodDetails = settings.paymentMethods.find(pm => pm.name === order.paymentMethod);

    if (!paymentMethodDetails) {
         return (
            <div className="container mx-auto px-6 py-12 text-center">
                <h1 className="text-2xl font-semibold">Payment method not available.</h1>
                <p className="text-sm">Please contact support.</p>
            </div>
        );
    }
    
    const renderFieldValue = (value: string) => {
        if (!order) return value;
        if (value === '{{ORDER_ID}}') return order.id.toString();
        if (value === '{{CLIENT_NAME}}') return order.clientDetails.name;
        return value;
    };

    const copyText = paymentMethodDetails.fields.map(field => {
        return `${field.label}: ${renderFieldValue(field.value)}`;
    }).join(', ') + `, Amount to Pay: KSH ${Math.round(order.total)}`;


    const handleCopy = () => {
        navigator.clipboard.writeText(copyText).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const handlePay = () => {
        // This is a generic way to open the phone dialer, mainly for M-Pesa's USSD code
        window.location.href = 'tel:*334#';
    }

    return (
        <div className="bg-white dark:bg-dark-bg">
            <div className="container mx-auto px-6 py-12 text-center animate-fade-in">
                <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary dark:text-dark-text mt-4">Thank You! Your Order is Placed.</h1>
                <p className="mt-2 text-gray-600 dark:text-dark-subtext max-w-2xl mx-auto">Please complete your payment using the details below to start processing your order.</p>
                
                <div className="mt-8 max-w-md mx-auto text-left bg-gray-50 dark:bg-dark-card p-8 rounded-lg shadow-lg border border-gray-200 dark:border-dark-border">
                    <h2 className="text-xl font-bold mb-4 text-center text-brand-primary dark:text-dark-text">Pay with {order.paymentMethod}</h2>
                    <div className="space-y-4 text-lg">
                       {paymentMethodDetails.fields.map(field => (
                           <div key={field.id} className="flex justify-between">
                                <span className="text-gray-500 dark:text-dark-subtext">{field.label}:</span>
                                <strong className="text-brand-primary dark:text-dark-text text-right">{renderFieldValue(field.value)}</strong>
                           </div>
                       ))}
                       <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-dark-border">
                           <span className="text-gray-500 dark:text-dark-subtext">Amount to Pay:</span>
                           <strong className="text-brand-secondary dark:text-dark-accent text-2xl">KSH {Math.round(order.total)}</strong>
                       </div>
                    </div>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={handleCopy} className="w-full bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-dark-text font-semibold py-3 px-4 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors flex items-center justify-center">
                            {copied ? <Check className="mr-2 h-5 w-5" /> : <Copy className="mr-2 h-5 w-5" />}
                            {copied ? 'Copied!' : 'Copy Details'}
                        </button>
                         <button onClick={handlePay} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-md hover:bg-green-600 transition-colors flex items-center justify-center">
                            <Phone className="mr-2 h-5 w-5" />
                            Pay with M-Pesa
                        </button>
                    </div>
                </div>

                <div className="mt-8">
                     <p className="text-sm text-gray-500 dark:text-dark-subtext">Once payment is sent, your order status will be updated to 'Processing'.</p>
                    <Link to={`/track/${order.trackingId}`} className="mt-4 inline-block bg-brand-secondary text-white font-bold py-3 px-8 text-lg hover:bg-brand-primary transition-colors dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                        Check Order Status
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentInstructionsPage;