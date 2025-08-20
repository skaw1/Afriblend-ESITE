
import React, { useState, useEffect } from 'react';
import { useOurStory } from '../hooks/useOurStory';
import { OurStoryContent } from '../types';
import { CheckCircle2 } from 'lucide-react';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const AdminOurStoryPage: React.FC = () => {
    const { ourStory, updateOurStory } = useOurStory();
    const [localContent, setLocalContent] = useState<OurStoryContent>(ourStory);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    // This effect ensures that if the `ourStory` data changes in the context
    // (e.g., after a successful save), the local form state is updated to match.
    useEffect(() => {
        setLocalContent(ourStory);
    }, [ourStory]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setLocalContent(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await toBase64(e.target.files[0]);
            setLocalContent(prev => ({ ...prev, imageUrl: base64 }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSuccessMessage('');

        try {
            await updateOurStory(localContent);
            setSuccessMessage('Content saved successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save content:", error);
            alert("An error occurred while saving content.");
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyles = "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white dark:bg-dark-card shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-serif font-bold text-brand-primary dark:text-dark-text mb-4">Edit "Our Story" Section</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Title</label>
                        <input type="text" name="title" id="title" value={localContent.title} onChange={handleInputChange} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="text" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Text Content</label>
                        <textarea name="text" id="text" value={localContent.text} onChange={handleInputChange} className={inputStyles} rows={5}></textarea>
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Image</label>
                         <div className="mt-2 flex items-center space-x-6">
                            <img src={localContent.imageUrl} alt="Current story" className="h-24 w-24 object-cover rounded-md bg-gray-100" />
                             <div className="flex-grow">
                                <label htmlFor="imageUrl" className="block text-xs font-medium text-gray-700 dark:text-dark-subtext">Image URL</label>
                                <input type="url" name="imageUrl" id="imageUrl" value={localContent.imageUrl} onChange={handleInputChange} className={inputStyles} />
                                <span className="text-xs text-gray-500 dark:text-dark-subtext">Or upload a new image:</span>
                                 <input type="file" id="image-upload" onChange={handleImageUpload} accept="image/*" className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-secondary/10 file:text-brand-secondary hover:file:bg-brand-secondary/20 dark:file:bg-dark-accent/10 dark:file:text-dark-accent dark:hover:file:bg-dark-accent/20" />
                            </div>
                         </div>
                    </div>
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
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

export default AdminOurStoryPage;
