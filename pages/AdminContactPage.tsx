

import React, { useState } from 'react';
import { useContact } from '../hooks/useContact';
import { ContactInfo, ContactField, SocialLink, IconNames, IconName } from '../types';
import { CheckCircle2, PlusCircle, Trash2 } from 'lucide-react';
import ConfirmationModal from '../components/ConfirmationModal';

const Card: React.FC<{title: string; children: React.ReactNode, actions?: React.ReactNode}> = ({ title, children, actions }) => (
    <div className="bg-white dark:bg-dark-card shadow-lg rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif font-bold text-brand-primary dark:text-dark-text">{title}</h2>
            {actions && <div>{actions}</div>}
        </div>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const AdminContactPage: React.FC = () => {
    const { contactInfo, updateContactInfo } = useContact();
    const [localContactInfo, setLocalContactInfo] = useState<ContactInfo>(contactInfo);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // --- Confirmation Modal State ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
    const [deleteMessage, setDeleteMessage] = useState('');

    const openDeleteModal = (message: string, onConfirm: () => void) => {
        setDeleteMessage(message);
        setDeleteAction(() => onConfirm);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (deleteAction) {
            deleteAction();
        }
        setIsDeleteModalOpen(false);
        setDeleteAction(null);
        setDeleteMessage('');
    };

    const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalContactInfo(prev => ({ ...prev, [name]: value }));
    };

    // --- Contact Fields Handlers ---
    const handleAddContactField = () => {
        const newField: ContactField = { id: `cf_${Date.now()}`, label: '', value: '', icon: 'Phone' };
        setLocalContactInfo(prev => ({ ...prev, contactFields: [...prev.contactFields, newField] }));
    };
    
    const handleRemoveContactField = (fieldId: string, fieldLabel: string) => {
        openDeleteModal(
            `Are you sure you want to delete the "${fieldLabel || 'Untitled'}" contact field?`,
            () => {
                setLocalContactInfo(prev => ({ ...prev, contactFields: prev.contactFields.filter(f => f.id !== fieldId) }));
            }
        );
    };

    const handleContactFieldChange = (id: string, prop: keyof Omit<ContactField, 'id'>, value: string) => {
        setLocalContactInfo(prev => ({
            ...prev,
            contactFields: prev.contactFields.map(f => f.id === id ? { ...f, [prop]: value } : f)
        }));
    };

    // --- Social Links Handlers ---
    const handleAddSocialLink = () => {
        const newLink: SocialLink = { id: `sl_${Date.now()}`, name: 'New Social', url: '#', icon: 'Instagram' };
        setLocalContactInfo(prev => ({ ...prev, socialLinks: [...prev.socialLinks, newLink] }));
    };

    const handleRemoveSocialLink = (linkId: string, linkName: string) => {
         openDeleteModal(
            `Are you sure you want to delete the "${linkName || 'Untitled'}" social link?`,
            () => {
                setLocalContactInfo(prev => ({ ...prev, socialLinks: prev.socialLinks.filter(l => l.id !== linkId) }));
            }
        );
    };

    const handleSocialLinkChange = (id: string, prop: keyof Omit<SocialLink, 'id'>, value: string) => {
        setLocalContactInfo(prev => ({
            ...prev,
            socialLinks: prev.socialLinks.map(l => l.id === id ? { ...l, [prop]: value } : l)
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');

        try {
            await updateContactInfo(localContactInfo);
            setSuccessMessage('Contact Info saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save contact info:", error);
            alert("An error occurred while saving contact info.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyles = "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";
    const selectStyles = "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";


    return (
        <>
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Confirm Deletion"
                message={deleteMessage}
            />
            <form onSubmit={handleSubmit} className="space-y-8">
                <Card title="Homepage Section Content">
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Section Title</label>
                        <input type="text" name="title" id="title" value={localContactInfo.title} onChange={handleHeaderChange} className={inputStyles} />
                    </div>
                     <div>
                        <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Section Subtitle</label>
                        <textarea name="subtitle" id="subtitle" value={localContactInfo.subtitle} onChange={handleHeaderChange} className={inputStyles} rows={3}></textarea>
                    </div>
                </Card>

                <Card title="Contact Information" actions={
                    <button type="button" onClick={handleAddContactField} className="flex items-center text-sm text-brand-secondary dark:text-dark-accent font-semibold hover:underline">
                        <PlusCircle size={16} className="mr-1" /> Add Field
                    </button>
                }>
                    <div className="space-y-4">
                    {localContactInfo.contactFields.map(field => (
                        <div key={field.id} className="p-4 border rounded-lg dark:border-dark-border space-y-4 bg-gray-50 dark:bg-dark-bg/50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className='md:col-span-2 grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Label</label>
                                        <input type="text" value={field.label} onChange={e => handleContactFieldChange(field.id, 'label', e.target.value)} className={inputStyles} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Value</label>
                                        <input type="text" value={field.value} onChange={e => handleContactFieldChange(field.id, 'value', e.target.value)} className={inputStyles} />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-grow">
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Icon</label>
                                        <select value={field.icon} onChange={e => handleContactFieldChange(field.id, 'icon', e.target.value as IconName)} className={selectStyles}>
                                            {IconNames.map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                                        </select>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveContactField(field.id, field.label)} className="text-red-500 hover:text-red-700 p-2 mt-5"><Trash2 size={20} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </Card>
                
                 <Card title="Social Media Links" actions={
                    <button type="button" onClick={handleAddSocialLink} className="flex items-center text-sm text-brand-secondary dark:text-dark-accent font-semibold hover:underline">
                        <PlusCircle size={16} className="mr-1" /> Add Link
                    </button>
                 }>
                    <div className="space-y-4">
                    {localContactInfo.socialLinks.map(link => (
                        <div key={link.id} className="p-4 border rounded-lg dark:border-dark-border space-y-4 bg-gray-50 dark:bg-dark-bg/50">
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div className='md:col-span-2 grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Name</label>
                                        <input type="text" value={link.name} onChange={e => handleSocialLinkChange(link.id, 'name', e.target.value)} className={inputStyles} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">URL</label>
                                        <input type="url" value={link.url} onChange={e => handleSocialLinkChange(link.id, 'url', e.target.value)} className={inputStyles} />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="flex-grow">
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Icon</label>
                                        <select value={link.icon} onChange={e => handleSocialLinkChange(link.id, 'icon', e.target.value as IconName)} className={selectStyles}>
                                            {IconNames.map(iconName => <option key={iconName} value={iconName}>{iconName}</option>)}
                                        </select>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveSocialLink(link.id, link.name)} className="text-red-500 hover:text-red-700 p-2 mt-5"><Trash2 size={20} /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </Card>

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
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default AdminContactPage;