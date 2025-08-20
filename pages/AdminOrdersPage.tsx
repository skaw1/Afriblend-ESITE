

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

            <div className="bg-dark-card shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-black/20">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Order</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Client</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Payment</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-xs font-medium text-gray-100">#{order.id.substring(0,6)}...</div>
                                        <div className="text-xs text-gray-400">{new Date(order.orderDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="text-xs font-medium text-gray-100">{order.clientDetails.name}</div>
                                        <div className="text-xs text-gray-400">{order.clientDetails.phone}</div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className="text-xs text-gray-100">KSH {Math.round(order.total)}</span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <select 
                                            value={order.paymentStatus} 
                                            onChange={(e) => handlePaymentStatusChange(order.id, e.target.value as PaymentStatus)} 
                                            className={`p-1 border-gray-600 rounded-md shadow-sm text-xs focus:ring-brand-accent focus:border-brand-accent bg-gray-800 text-gray-100 ${order.paymentStatus === 'Paid' ? 'text-green-400' : 'text-yellow-400'}`}
                                        >
                                            <option value="Unpaid">Unpaid</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)} className="p-1 border-gray-600 rounded-md shadow-sm text-xs focus:ring-brand-accent focus:border-brand-accent bg-gray-800 text-gray-100">
                                            <option>Pending Payment</option>
                                            <option>Processing</option>
                                            <option>Out for Delivery</option>
                                            <option>Delivered</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-xs font-medium space-x-2">
                                        <button onClick={() => setSelectedOrderForDetails(order)} className="text-indigo-400 hover:text-indigo-300">Details</button>
                                        <button onClick={() => handleWhatsAppShare(order)} className="text-green-400 hover:text-green-300">Client</button>
                                        <button onClick={() => setSelectedOrderForDispatch(order)} className="text-blue-400 hover:text-blue-300">Dispatch</button>
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