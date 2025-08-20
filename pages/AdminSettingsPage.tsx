

import React, { useState, useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { StoreSettings, PaymentMethodDetails, CustomField, HeroSlide } from '../types';
import { CheckCircle2, PlusCircle, Trash2 } from 'lucide-react';
import { INITIAL_STORE_SETTINGS } from '../constants';
import ConfirmationModal from '../components/ConfirmationModal';

// Helper function to convert a file to a Base64 string
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

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

const AdminSettingsPage: React.FC = () => {
    const { settings, updateSettings } = useSettings();
    const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // --- Confirmation Modal State ---
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
    const [deleteMessage, setDeleteMessage] = useState('');
    
     // Keep local state in sync with context
    useEffect(() => {
        setLocalSettings(settings);
    }, [settings]);

    const openDeleteModal = (message: string, onConfirm: () => void) => {
        setDeleteMessage(message);
        setDeleteAction(() => onConfirm); // Store the callback
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
    
    // --- Floating Action Button Handlers ---
    const handleFabChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setLocalSettings(prev => ({
            ...prev,
            fab: {
                ...(prev.fab || INITIAL_STORE_SETTINGS.fab),
                [name]: type === 'checkbox' ? checked : value
            }
        }));
    };

    // --- Hero Slide Handlers ---
    const handleAddHeroSlide = () => {
        const newSlide: HeroSlide = {
            id: `slide_${Date.now()}`,
            src: 'https://picsum.photos/seed/new-slide/1920/1080',
            alt: 'New descriptive alt text',
            title: 'New Slide Title',
            subtitle: 'Compelling new subtitle.',
            link: '/products'
        };
        setLocalSettings(prev => ({
            ...prev,
            heroSlides: [...(prev.heroSlides || []), newSlide]
        }));
    };

    const handleRemoveHeroSlide = (slideId: string, slideTitle: string) => {
        openDeleteModal(
            `Are you sure you want to delete the slide titled "${slideTitle}"?`,
            () => {
                setLocalSettings(prev => ({
                    ...prev,
                    heroSlides: prev.heroSlides.filter(s => s.id !== slideId)
                }));
            }
        );
    };
    
    const handleHeroSlideChange = (slideId: string, field: keyof HeroSlide, value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            heroSlides: prev.heroSlides.map(slide => 
                slide.id === slideId ? { ...slide, [field]: value } : slide
            )
        }));
    };
    
    const handleHeroSlideImageUpload = async (slideId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            try {
                const file = e.target.files[0];
                const base64 = await toBase64(file);
                handleHeroSlideChange(slideId, 'src', base64);
            } catch (error) {
                console.error("Error converting file to Base64", error);
                alert("Failed to upload image.");
            }
        }
    };

    // --- Payment Method Handlers ---
    const handleAddPaymentMethod = () => {
        const newMethod: PaymentMethodDetails = {
            id: `pm_${Date.now()}`,
            name: 'New Payment Method',
            enabled: true,
            instructions: 'Instructions for the customer.',
            fields: [{ id: `f_${Date.now()}`, label: 'Label', value: 'Value' }]
        };
        setLocalSettings(prev => ({ ...prev, paymentMethods: [...prev.paymentMethods, newMethod] }));
    };

    const handleRemovePaymentMethod = (methodId: string, methodName: string) => {
        openDeleteModal(
            `Are you sure you want to delete the "${methodName}" payment method?`,
            () => {
                setLocalSettings(prev => ({
                    ...prev,
                    paymentMethods: prev.paymentMethods.filter(pm => pm.id !== methodId)
                }));
            }
        );
    };

    const handlePaymentMethodChange = (methodId: string, field: keyof PaymentMethodDetails, value: string | boolean) => {
        setLocalSettings(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.map(pm => pm.id === methodId ? { ...pm, [field]: value } : pm)
        }));
    };

    const handleAddField = (methodId: string) => {
        const newField: CustomField = { id: `f_${Date.now()}`, label: '', value: '' };
        setLocalSettings(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.map(pm => pm.id === methodId ? { ...pm, fields: [...pm.fields, newField] } : pm)
        }));
    };

    const handleRemoveField = (methodId: string, fieldId: string) => {
        setLocalSettings(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.map(pm => 
                pm.id === methodId ? { ...pm, fields: pm.fields.filter(f => f.id !== fieldId) } : pm
            )
        }));
    };

    const handleFieldChange = (methodId: string, fieldId: string, prop: 'label' | 'value', value: string) => {
        setLocalSettings(prev => ({
            ...prev,
            paymentMethods: prev.paymentMethods.map(pm => {
                if (pm.id === methodId) {
                    return { ...pm, fields: pm.fields.map(f => f.id === fieldId ? { ...f, [prop]: value } : f) };
                }
                return pm;
            })
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');

        try {
            await updateSettings(localSettings);
            setSuccessMessage('Settings saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
            alert("An error occurred while saving settings.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyles = "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";
    
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
                <Card title="Hero Section Slides" actions={
                    <button type="button" onClick={handleAddHeroSlide} className="flex items-center text-sm text-brand-secondary dark:text-dark-accent font-semibold hover:underline">
                        <PlusCircle size={16} className="mr-1" /> Add Slide
                    </button>
                }>
                    <div className="space-y-6">
                        {(localSettings.heroSlides || []).map((slide, index) => (
                            <div key={slide.id} className="p-4 border rounded-lg dark:border-dark-border space-y-4 bg-gray-50 dark:bg-dark-bg/50">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-gray-700 dark:text-dark-text">Slide {index + 1}</p>
                                    <button type="button" onClick={() => handleRemoveHeroSlide(slide.id, slide.title)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Title</label>
                                        <input type="text" value={slide.title} onChange={(e) => handleHeroSlideChange(slide.id, 'title', e.target.value)} className={inputStyles} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Subtitle</label>
                                        <input type="text" value={slide.subtitle} onChange={(e) => handleHeroSlideChange(slide.id, 'subtitle', e.target.value)} className={inputStyles} />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Image URL</label>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <input 
                                                type="url" 
                                                value={slide.src} 
                                                onChange={(e) => handleHeroSlideChange(slide.id, 'src', e.target.value)} 
                                                className={`${inputStyles} !mt-0 flex-grow`}
                                                placeholder="Paste image URL or upload"
                                            />
                                            <label htmlFor={`hero-upload-${slide.id}`} className="cursor-pointer bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-dark-text dark:hover:bg-gray-500 whitespace-nowrap">
                                                Upload
                                            </label>
                                            <input 
                                                id={`hero-upload-${slide.id}`} 
                                                type="file" 
                                                className="sr-only" 
                                                accept="image/*"
                                                onChange={(e) => handleHeroSlideImageUpload(slide.id, e)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Alt Text</label>
                                        <input type="text" value={slide.alt} onChange={(e) => handleHeroSlideChange(slide.id, 'alt', e.target.value)} className={inputStyles} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Link (e.g. /products)</label>
                                        <input type="text" value={slide.link} onChange={(e) => handleHeroSlideChange(slide.id, 'link', e.target.value)} className={inputStyles} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card title="Payment Methods">
                    <div className="space-y-6">
                        {localSettings.paymentMethods.map((method) => (
                            <div key={method.id} className="p-4 border rounded-lg dark:border-dark-border space-y-4 bg-gray-50 dark:bg-dark-bg/50">
                                <div className="flex justify-between items-start">
                                    <input type="text" value={method.name} onChange={(e) => handlePaymentMethodChange(method.id, 'name', e.target.value)} className="text-lg font-semibold bg-transparent focus:bg-white dark:focus:bg-dark-bg border-b-2 border-transparent focus:border-brand-accent p-1 -m-1" />
                                    <div className='flex items-center space-x-4'>
                                        <label htmlFor={`enabled-${method.id}`} className="flex items-center cursor-pointer">
                                            <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Enabled</span>
                                            <div className="relative">
                                                <input type="checkbox" id={`enabled-${method.id}`} className="sr-only" checked={method.enabled} onChange={(e) => handlePaymentMethodChange(method.id, 'enabled', e.target.checked)} />
                                                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${method.enabled ? 'transform translate-x-6 bg-green-400' : ''}`}></div>
                                            </div>
                                        </label>
                                        <button type="button" onClick={() => handleRemovePaymentMethod(method.id, method.name)} className="text-red-500 hover:text-red-700"><Trash2 size={20} /></button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Instructions at Checkout</label>
                                    <input type="text" value={method.instructions} onChange={(e) => handlePaymentMethodChange(method.id, 'instructions', e.target.value)} className={inputStyles} />
                                </div>
                                
                                <div className="space-y-2 pt-2">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Payment Fields</h4>
                                    <p className="text-xs text-gray-500 dark:text-dark-subtext -mt-2">Use {'{{ORDER_ID}}'} or {'{{CLIENT_NAME}}'} as a value for dynamic info.</p>
                                    {method.fields.map((field) => (
                                        <div key={field.id} className="flex items-center space-x-2">
                                            <input type="text" placeholder="Label (e.g., Account Number)" value={field.label} onChange={(e) => handleFieldChange(method.id, field.id, 'label', e.target.value)} className="w-1/2 border-gray-300 rounded-md shadow-sm p-2 bg-white focus:border-brand-accent focus:ring-brand-accent dark:bg-dark-card dark:border-dark-border" />
                                            <input type="text" placeholder="Value" value={field.value} onChange={(e) => handleFieldChange(method.id, field.id, 'value', e.target.value)} className="w-1/2 border-gray-300 rounded-md shadow-sm p-2 bg-white focus:border-brand-accent focus:ring-brand-accent dark:bg-dark-card dark:border-dark-border" />
                                            <button type="button" onClick={() => handleRemoveField(method.id, field.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={18} /></button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddField(method.id)} className="flex items-center text-sm text-brand-secondary dark:text-dark-accent font-semibold hover:underline">
                                        <PlusCircle size={16} className="mr-1" /> Add Field
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6">
                        <button type="button" onClick={handleAddPaymentMethod} className="w-full bg-brand-secondary/10 dark:bg-dark-accent/10 text-brand-secondary dark:text-dark-accent font-bold py-2 px-4 rounded-md hover:bg-brand-secondary/20 dark:hover:bg-dark-accent/20 transition-colors flex items-center justify-center border-2 border-dashed border-brand-secondary/30 dark:border-dark-accent/30">
                            <PlusCircle className="mr-2" />
                            Add New Payment Method
                        </button>
                    </div>
                </Card>

                <Card title="Floating Action Button">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-dark-subtext">Enable Floating Button</span>
                        <label htmlFor="fab-enabled" className="flex items-center cursor-pointer">
                            <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    id="fab-enabled"
                                    name="enabled"
                                    className="sr-only"
                                    checked={localSettings.fab?.enabled ?? true}
                                    onChange={handleFabChange}
                                />
                                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${localSettings.fab?.enabled ? 'transform translate-x-6 bg-green-400' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="fab-iconUrl" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Main Icon URL</label>
                        <input
                            type="url"
                            name="iconUrl"
                            id="fab-iconUrl"
                            value={localSettings.fab?.iconUrl ?? ''}
                            onChange={handleFabChange}
                            className={inputStyles}
                            placeholder="https://.../icon.svg"
                        />
                    </div>
                    <div>
                        <label htmlFor="fab-whatsappIconUrl" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">WhatsApp Action Icon URL</label>
                        <input
                            type="url"
                            name="whatsappIconUrl"
                            id="fab-whatsappIconUrl"
                            value={localSettings.fab?.whatsappIconUrl ?? ''}
                            onChange={handleFabChange}
                            className={inputStyles}
                            placeholder="https://.../whatsapp.svg"
                        />
                    </div>
                    <div>
                        <label htmlFor="fab-callIconUrl" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Call Action Icon URL</label>
                        <input
                            type="url"
                            name="callIconUrl"
                            id="fab-callIconUrl"
                            value={localSettings.fab?.callIconUrl ?? ''}
                            onChange={handleFabChange}
                            className={inputStyles}
                            placeholder="https://.../call.svg"
                        />
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
                        {isSaving ? 'Saving...' : 'Save All Settings'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default AdminSettingsPage;