

import React, { useState } from 'react';
import { Order, ClientDetails } from '../types';
import { X } from 'lucide-react';

interface ClientDetailsModalProps {
  order: Order;
  onClose: () => void;
  onSave: (orderId: string, details: ClientDetails) => void;
}

const ClientDetailsModal: React.FC<ClientDetailsModalProps> = ({ order, onClose, onSave }) => {
    const [details, setDetails] = useState<ClientDetails>(order.clientDetails);
    const [isSaving, setIsSaving] = useState(false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };
    
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // Simulate save
        setTimeout(() => {
            onSave(order.id, details);
            setIsSaving(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-gray-200 dark:border-dark-border flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-xl font-serif text-brand-primary dark:text-dark-text">Order Details (#{order.id})</h2>
                         <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                             order.paymentStatus === 'Paid' 
                             ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' 
                             : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                         }`}>
                            {order.paymentStatus}
                        </span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:text-dark-subtext dark:hover:text-dark-text">
                        <X className="h-8 w-8" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6 space-y-6">
                        {/* Order Items */}
                        <div>
                            <h3 className="text-lg font-semibold text-brand-primary dark:text-dark-text mb-2">Items</h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-2 bg-gray-50 dark:bg-dark-bg/50 rounded-md">
                                        <img src={item.images[0]} alt={item.name} className="w-16 h-20 object-cover rounded"/>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-brand-primary dark:text-dark-text">{item.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-dark-subtext">
                                                Size: {item.selectedSize} &bull; Color: {item.selectedColor}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-dark-subtext">
                                                {item.quantity} x KSH {Math.round(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Client Details Form */}
                        <form id={`client-details-form-${order.id}`} onSubmit={handleSave} className="space-y-4">
                            <h3 className="text-lg font-semibold text-brand-primary dark:text-dark-text mb-2 pt-4 border-t dark:border-dark-border">Client Details</h3>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Full Name</label>
                                <input type="text" name="name" id="name" required value={details.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary p-2 dark:bg-gray-700 dark:border-dark-border dark:text-dark-text" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Address</label>
                                <input type="text" name="address" id="address" required value={details.address} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary p-2 dark:bg-gray-700 dark:border-dark-border dark:text-dark-text" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Phone Number</label>
                                <input type="tel" name="phone" id="phone" required value={details.phone} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary p-2 dark:bg-gray-700 dark:border-dark-border dark:text-dark-text" />
                            </div>
                        </form>
                    </div>
                </div>
                 <div className="px-6 py-4 bg-gray-50 dark:bg-dark-bg flex justify-end space-x-3 flex-shrink-0 border-t dark:border-dark-border">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-dark-card dark:border-dark-border dark:text-dark-text dark:hover:bg-gray-600">Cancel</button>
                    <button type="submit" form={`client-details-form-${order.id}`} disabled={isSaving} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-secondary hover:bg-brand-primary disabled:bg-gray-400 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                       {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailsModal;