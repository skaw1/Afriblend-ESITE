
import React, { useState } from 'react';
import { Order, Rider } from '../types';
import { X } from 'lucide-react';

interface DispatchModalProps {
    order: Order;
    riders: Rider[];
    onClose: () => void;
    onDispatch: (riderId: string) => void;
}

const DispatchModal: React.FC<DispatchModalProps> = ({ order, riders, onClose, onDispatch }) => {
    const [selectedRiderId, setSelectedRiderId] = useState<string>(riders[0]?.id || '');

    const handleDispatchClick = () => {
        if (!selectedRiderId) {
            alert('Please select a rider.');
            return;
        }
        onDispatch(selectedRiderId);
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-dark-text">Dispatch Order #{order.id}</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:text-dark-subtext dark:hover:text-dark-text">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    {riders.length > 0 ? (
                        <div>
                            <label htmlFor="rider-select" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Select a rider to dispatch</label>
                            <select
                                id="rider-select"
                                value={selectedRiderId}
                                onChange={(e) => setSelectedRiderId(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm rounded-md dark:bg-dark-bg dark:border-dark-border dark:text-dark-text"
                            >
                                {riders.map(rider => (
                                    <option key={rider.id} value={rider.id}>
                                        {rider.name} - {rider.phone}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-dark-subtext p-4 border-2 border-dashed rounded-md">
                            No riders available. Please add a rider from the 'Riders' tab first.
                        </p>
                    )}
                </div>
                <div className="bg-gray-50 dark:bg-dark-bg px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                        type="button"
                        onClick={handleDispatchClick}
                        disabled={riders.length === 0 || !selectedRiderId}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                        Confirm Dispatch
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm dark:bg-dark-card dark:border-dark-border dark:text-dark-text dark:hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DispatchModal;
