
import React, { useState, useEffect } from 'react';
import { useRiders } from '../hooks/useRiders';
import { Rider } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import { Plus, Trash2, Edit } from 'lucide-react';

// Rider Form Modal (local component)
const RiderFormModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (rider: Omit<Rider, 'id'> | Rider) => void;
    rider: Omit<Rider, 'id'> | Rider | null;
}> = ({ isOpen, onClose, onSave, rider }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    useEffect(() => {
        setName(rider?.name || '');
        setPhone(rider?.phone || '');
    }, [rider]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && phone.trim()) {
            onSave({ ...rider, name, phone } as Omit<Rider, 'id'> | Rider);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-dark-text">
                            {rider && 'id' in rider ? 'Edit Rider' : 'Add New Rider'}
                        </h3>
                        <div className="mt-4 space-y-4">
                            <div>
                                <label htmlFor="rider-name" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Rider Name</label>
                                <input type="text" id="rider-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter rider's name" className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text" required autoFocus />
                            </div>
                            <div>
                                <label htmlFor="rider-phone" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Rider Phone</label>
                                <input 
                                    type="tel" 
                                    id="rider-phone" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    placeholder="+254712345678" 
                                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text" 
                                    required 
                                    pattern="\+[0-9]{1,4}[0-9]{9,}"
                                    title="Please enter the phone number with a country code, starting with a '+' sign."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-bg px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-primary text-base font-medium text-white hover:bg-brand-secondary sm:ml-3 sm:w-auto sm:text-sm dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">Save</button>
                        <button type="button" onClick={onClose} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm dark:bg-dark-card dark:border-dark-border dark:text-dark-text dark:hover:bg-gray-600">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const AdminRidersPage: React.FC = () => {
    const { riders, addRider, updateRider, deleteRider } = useRiders();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRider, setSelectedRider] = useState<Rider | null>(null);

    const openFormModal = (rider: Rider | null = null) => {
        setSelectedRider(rider);
        setIsFormModalOpen(true);
    };

    const handleSaveRider = async (riderData: Omit<Rider, 'id'> | Rider) => {
        if ('id' in riderData) {
            await updateRider(riderData);
        } else {
            await addRider(riderData);
        }
        setIsFormModalOpen(false);
        setSelectedRider(null);
    };

    const openDeleteModal = (rider: Rider) => {
        setSelectedRider(rider);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (selectedRider) {
            await deleteRider(selectedRider.id);
            setIsDeleteModalOpen(false);
            setSelectedRider(null);
        }
    };

    return (
        <>
            <RiderFormModal
                isOpen={isFormModalOpen}
                onClose={() => setIsFormModalOpen(false)}
                onSave={handleSaveRider}
                rider={selectedRider}
            />
            {selectedRider && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Rider"
                    message={`Are you sure you want to delete rider "${selectedRider.name}"? This action cannot be undone.`}
                />
            )}
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border dark:border-dark-border/50">
                <div className="flex justify-between items-center mb-6 pb-4 border-b dark:border-dark-border">
                    <h2 className="text-xl font-serif font-bold text-gray-800 dark:text-dark-text">Manage Riders</h2>
                    <button onClick={() => openFormModal()} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-secondary transition-colors flex items-center dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                        <Plus className="mr-2 h-5 w-5" /> Add Rider
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Phone</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-card dark:divide-dark-border">
                            {riders.map(rider => (
                                <tr key={rider.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text">{rider.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{rider.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                        <button onClick={() => openFormModal(rider)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"><Edit size={18}/></button>
                                        <button onClick={() => openDeleteModal(rider)} className="text-red-600 hover:text-red-900"><Trash2 size={18}/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {riders.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-dark-subtext">No riders found. Add your first rider!</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminRidersPage;