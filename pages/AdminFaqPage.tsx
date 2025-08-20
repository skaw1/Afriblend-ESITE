
import React, { useState } from 'react';
import { useFaqs } from '../hooks/useFaqs';
import { FaqItem } from '../types';
import { PlusCircle, Trash2, CheckCircle2 } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminFaqPage: React.FC = () => {
    const { faqs, updateFaqs } = useFaqs();
    const [localFaqs, setLocalFaqs] = useState<FaqItem[]>(faqs);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [faqToDelete, setFaqToDelete] = useState<FaqItem | null>(null);

    const handleAddFaq = () => {
        const newFaq: FaqItem = {
            id: `faq_${Date.now()}`,
            q: '',
            a: ''
        };
        setLocalFaqs(prev => [...prev, newFaq]);
    };
    
    const openDeleteModal = (faq: FaqItem) => {
        setFaqToDelete(faq);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setFaqToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (faqToDelete) {
            setLocalFaqs(prev => prev.filter(f => f.id !== faqToDelete.id));
            closeDeleteModal();
        }
    };

    const handleFaqChange = (faqId: string, field: 'q' | 'a', value: string) => {
        setLocalFaqs(prev => prev.map(faq =>
            faq.id === faqId ? { ...faq, [field]: value } : faq
        ));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');

        try {
            await updateFaqs(localFaqs);
            setSuccessMessage('FAQs saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save FAQs:", error);
            alert("An error occurred while saving FAQs.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyles = "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";
    
    return (
        <>
            {faqToDelete && (
                 <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    title="Delete FAQ"
                    message={`Are you sure you want to delete the question: "${faqToDelete.q}"? This action cannot be undone.`}
                />
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-dark-card shadow-lg rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-serif font-bold text-brand-primary dark:text-dark-text">Manage Frequently Asked Questions</h2>
                        <button type="button" onClick={handleAddFaq} className="flex items-center text-sm text-brand-secondary dark:text-dark-accent font-semibold hover:underline">
                            <PlusCircle size={16} className="mr-1" /> Add FAQ
                        </button>
                    </div>
                    <div className="space-y-6">
                        {localFaqs.length > 0 ? localFaqs.map((faq, index) => (
                            <div key={faq.id} className="p-4 border rounded-lg dark:border-dark-border space-y-4 bg-gray-50 dark:bg-dark-bg/50">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-700 dark:text-dark-text">FAQ {index + 1}</p>
                                    <button type="button" onClick={() => openDeleteModal(faq)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Question</label>
                                    <input placeholder="Enter the question" type="text" value={faq.q} onChange={(e) => handleFaqChange(faq.id, 'q', e.target.value)} className={inputStyles} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Answer</label>
                                    <textarea placeholder="Enter the answer" value={faq.a} onChange={(e) => handleFaqChange(faq.id, 'a', e.target.value)} className={inputStyles} rows={3}></textarea>
                                </div>
                            </div>
                        )) : (
                            <p className="text-center text-gray-500 dark:text-dark-subtext py-4">No FAQs yet. Click "Add FAQ" to create one.</p>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-end items-center space-x-4">
                     {successMessage && (
                        <div className="flex items-center text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 rounded-md py-2 px-3 animate-fade-in">
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            <p className="font-semibold text-sm">{successMessage}</p>
                        </div>
                    )}
                    <button 
                        type="submit" 
                        disabled={isSaving} 
                        className="w-48 inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 transition-all">
                        {isSaving ? 'Saving...' : 'Save All FAQs'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default AdminFaqPage;