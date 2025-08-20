
import React, { useState } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useRiders } from '../hooks/useRiders';
import { Order, OrderStatus, ClientDetails, Rider, PaymentStatus } from '../types';
import ClientDetailsModal from '../components/ClientDetailsModal';
import DispatchModal from '../components/DispatchModal';

const AdminOrdersPage: React.FC = () => {
    const { orders, updateOrderStatus, updateClientDetails, updateOrderPaymentStatus, assignRiderToOrder } = useOrders();
    const { riders } = useRiders();

    const [selectedOrderForDetails, setSelectedOrderForDetails] = useState<Order | null>(null);
    const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<Order | null>(null);

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        updateOrderStatus(orderId, newStatus);
    };

    const handlePaymentStatusChange = (orderId: string, newStatus: PaymentStatus) => {
        updateOrderPaymentStatus(orderId, newStatus);
    };

    const handleSaveDetails = (orderId: string, details: ClientDetails) => {
        updateClientDetails(orderId, details);
    };

    const handleWhatsAppShare = (order: Order) => {
        const clientPhone = order.clientDetails.phone.replace(/[^0-9]/g, '');
        const itemsSummary = order.items.map(item => `- ${item.name} (Size: ${item.selectedSize}, Color: ${item.selectedColor}) x ${item.quantity}`).join('\n');
        const trackingUrl = `${window.location.origin}/#/track/${order.trackingId}`;
        const message = `Hello ${order.clientDetails.name},\n\nHere is a summary of your Afriblend order (#${order.id}):\n\n${itemsSummary}\n\nTotal: KSH ${Math.round(order.total)}\nStatus: ${order.status}\n\nYou can track your order here:\n${trackingUrl}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${clientPhone}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleDispatch = (riderId: string) => {
        if (!selectedOrderForDispatch) return;

        const rider = riders.find(r => r.id === riderId);
        if (!rider) {
            alert('Selected rider not found.');
            return;
        }

        // 1. Assign rider and update order status
        assignRiderToOrder(selectedOrderForDispatch.id, riderId);

        // 2. Prepare and send WhatsApp message to rider
        const riderPhone = rider.phone.replace(/[^0-9]/g, '');
        const client = selectedOrderForDispatch.clientDetails;
        const itemsSummary = selectedOrderForDispatch.items.map(item => `- ${item.name} (${item.quantity})`).join('\n');
        
        const paymentInfo = selectedOrderForDispatch.paymentStatus === 'Paid'
            ? 'Payment Status: PAID'
            : `Payment Status: UNPAID\nPLEASE COLLECT: KSH ${Math.round(selectedOrderForDispatch.total)}`;

        const message = `DISPATCH\nOrder ID: ${selectedOrderForDispatch.id}\n\nClient: ${client.name}\nPhone: ${client.phone}\nAddress: ${client.address}\n\nItems:\n${itemsSummary}\n\n${paymentInfo}`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${riderPhone}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');

        setSelectedOrderForDispatch(null);
    };

    return (
        <div className="space-y-8">
            {selectedOrderForDetails && (
                <ClientDetailsModal 
                    order={selectedOrderForDetails} 
                    onClose={() => setSelectedOrderForDetails(null)}
                    onSave={handleSaveDetails as any}
                />
            )}
            {selectedOrderForDispatch && (
                <DispatchModal
                    order={selectedOrderForDispatch}
                    riders={riders}
                    onClose={() => setSelectedOrderForDispatch(null)}
                    onDispatch={handleDispatch}
                />
            )}

            <div className="bg-white dark:bg-dark-card shadow-sm border dark:border-dark-border/50 rounded-2xl overflow-hidden">
                <div className="p-6">
                     <h2 className="text-xl font-serif font-bold text-brand-primary dark:text-dark-text">All Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-dark-bg/30">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Order</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Payment</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text">#{order.id.substring(0,6)}...</div>
                                        <div className="text-sm text-gray-500 dark:text-dark-subtext">{new Date(order.orderDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-dark-text">{order.clientDetails.name}</div>
                                        <div className="text-sm text-gray-500 dark:text-dark-subtext">{order.clientDetails.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-900 dark:text-dark-text">KSH {Math.round(order.total)}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select 
                                            value={order.paymentStatus} 
                                            onChange={(e) => handlePaymentStatusChange(order.id, e.target.value as PaymentStatus)} 
                                            className={`p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs focus:ring-brand-accent focus:border-brand-accent bg-transparent ${order.paymentStatus === 'Paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}
                                        >
                                            <option value="Unpaid">Unpaid</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)} className="p-1 border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs focus:ring-brand-accent focus:border-brand-accent bg-transparent text-gray-800 dark:text-gray-200">
                                            <option>Pending Payment</option>
                                            <option>Processing</option>
                                            <option>Out for Delivery</option>
                                            <option>Delivered</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                        <button onClick={() => setSelectedOrderForDetails(order)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-semibold">Details</button>
                                        <button onClick={() => handleWhatsAppShare(order)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 font-semibold">Client</button>
                                        <button onClick={() => setSelectedOrderForDispatch(order)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 font-semibold">Dispatch</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrdersPage;
