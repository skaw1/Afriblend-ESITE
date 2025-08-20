
import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { useCategories } from '../hooks/useCategories';
import { X, CloudUpload, CheckCircle2 } from 'lucide-react';

// Helper function to convert a file to a Base64 string
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const AdminProductFormPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getProductById, addProduct, updateProduct } = useProducts();
    const { categories } = useCategories();
    
    const [product, setProduct] = useState<Omit<Product, 'id' | 'slug' | 'sku' | 'rating' | 'reviewCount'> | Product | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [imageUrlInput, setImageUrlInput] = useState('');
    const formInitialized = useRef(false);

    const isEditing = id !== undefined;

    useEffect(() => {
        // If we're editing, we always load the product data
        if (isEditing && id) {
            const existingProduct = getProductById(id);
            if (existingProduct) {
                setProduct(existingProduct);
            } else {
                // Product might not be loaded yet, wait for products context to update
            }
            return;
        }

        // For a new product, we only initialize the form once.
        if (formInitialized.current) {
             // After initializing, we might need to set the categoryId if it loaded later
            setProduct(p => (p && p.categoryId === "" && categories[0]?.id ? { ...p, categoryId: categories[0].id } : p));
            return;
        }

        const emptyProduct: Omit<Product, 'id' | 'slug' | 'sku' | 'rating' | 'reviewCount'> = {
            name: '',
            categoryId: categories[0]?.id || '',
            price: 0,
            stock: 0,
            description: '',
            details: [],
            images: [],
            sizes: [],
            colors: [],
            culturalInspiration: '',
            material: '',
            isNewArrival: false,
            isBestseller: false,
            isVisible: true,
        };
        setProduct(emptyProduct);
        formInitialized.current = true;
    }, [id, isEditing, getProductById, navigate, categories]);
    
    // Unified input handler
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const target = e.target;
        const name = target.name;

        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setProduct(prev => prev ? ({ ...prev, [name]: target.checked }) : null);
        } else {
            const { value } = target;
            if (name === 'sizes' || name === 'colors' || name === 'details') {
                const arrayValue = value.split(',').map(item => item.trim()).filter(Boolean);
                setProduct(prev => prev ? ({ ...prev, [name]: arrayValue }) : null);
            }
            else {
                const parsedValue = name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value;
                setProduct(prev => prev ? ({ ...prev, [name]: parsedValue }) : null);
            }
        }
    };
    
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            try {
                const fileList = Array.from(e.target.files);
                const base64Promises = fileList.map(file => toBase64(file));
                const base64Images = await Promise.all(base64Promises);

                setProduct(prev => {
                    if (!prev) return null;
                    return { ...prev, images: [...prev.images, ...base64Images] };
                });
            } catch (error) {
                console.error("Error converting files to Base64", error);
                alert("Failed to upload one or more images.");
            }
        }
    };

    const addImagesFromUrls = () => {
        if (imageUrlInput.trim()) {
            const urls = imageUrlInput.split('\n').map(url => url.trim()).filter(Boolean);
            const validUrls: string[] = [];
            urls.forEach(url => {
                 try {
                    new URL(url);
                    validUrls.push(url);
                } catch (_) {
                    console.warn(`Invalid URL skipped: ${url}`);
                }
            });
            
            if (validUrls.length > 0) {
                setProduct(prev => {
                    if (!prev) return null;
                    return { ...prev, images: [...prev.images, ...validUrls]};
                });
                setImageUrlInput('');
            }

            if (validUrls.length !== urls.length) {
                alert("Some URLs were invalid and have been skipped.");
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        setProduct(prev => {
            if (!prev) return null;
            return {
                ...prev,
                images: prev.images.filter((_, index) => index !== indexToRemove)
            };
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!product) return;

        setIsSaving(true);
        if (!product.name || product.price <= 0 || product.images.length === 0) {
            alert('Please fill out all required fields: Name, Price, and at least one Image.');
            setIsSaving(false);
            return;
        }

        try {
            if (isEditing) {
                await updateProduct(product as Product);
                setSuccessMessage('Product updated successfully!');
            } else {
                await addProduct(product as Omit<Product, 'id' | 'slug' | 'sku' | 'rating' | 'reviewCount'>);
                setSuccessMessage('Product created successfully!');
            }
            setTimeout(() => {
                navigate('/admin/products');
            }, 2000);
        } catch (err) {
            console.error("Failed to save product:", err);
            alert("Failed to save product. Please try again.");
            setIsSaving(false);
        }
    };

    const arrayToString = (arr: string[] | undefined) => (arr || []).join(', ');

    if (!product) {
        return <div>Loading...</div>; // Or some other loading indicator
    }
    
    const inputStyles = "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";
    const selectStyles = "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";
    const imageUrlInputStyles = "flex-grow border-gray-300 rounded-l-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Product Name</label>
                    <input id="name" type="text" name="name" value={product.name} onChange={handleInputChange} required className={inputStyles} />
                </div>
                <div>
                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Category</label>
                    <select id="categoryId" name="categoryId" value={product.categoryId} onChange={handleInputChange} className={selectStyles}>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Price (KSH)</label>
                    <input id="price" type="number" name="price" value={product.price} onChange={handleInputChange} required min="0" step="0.01" className={inputStyles} />
                </div>
                 <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Stock</label>
                    <input id="stock" type="number" name="stock" value={product.stock} onChange={handleInputChange} required min="0" className={inputStyles} />
                </div>
            </div>
            
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Description</label>
                <textarea id="description" name="description" value={product.description} onChange={handleInputChange} rows={4} className={inputStyles}></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Images</label>
                <div className="mt-2 p-4 border-2 border-dashed border-gray-200 dark:border-dark-border rounded-lg">
                    {product.images.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-4">
                            {product.images.map((imgSrc, index) => (
                                <div key={index} className="relative group">
                                    <img src={imgSrc} alt={`Product image ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                             <label htmlFor="imageUrls" className="block text-xs font-medium text-gray-700 dark:text-dark-subtext mb-1">Add Image URLs (one per line)</label>
                            <div className="flex items-start">
                                <textarea
                                    id="imageUrls"
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    placeholder="https://.../image1.jpg&#10;https://.../image2.png"
                                    rows={3}
                                    className="flex-grow border-gray-300 rounded-l-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring-brand-accent focus:ring-opacity-50 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text"
                                />
                                <button
                                    type="button"
                                    onClick={addImagesFromUrls}
                                    className="bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-r-md hover:bg-gray-300 dark:bg-gray-600 dark:text-dark-text dark:hover:bg-gray-500 self-stretch"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                         <div className="flex flex-col items-center justify-center">
                            <label htmlFor="file-upload" className="w-full cursor-pointer bg-brand-secondary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-primary transition-colors flex items-center justify-center dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                                <CloudUpload className="mr-2 h-5 w-5" />
                                Upload from Device (Multiple)
                            </label>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" multiple />
                         </div>
                    </div>
                </div>
            </div>
            
            <div>
                <label htmlFor="sizes" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Sizes (comma-separated)</label>
                <input id="sizes" type="text" name="sizes" value={arrayToString(product.sizes)} onChange={handleInputChange} className={inputStyles} />
            </div>
             <div>
                <label htmlFor="colors" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Colors (comma-separated)</label>
                <input id="colors" type="text" name="colors" value={arrayToString(product.colors)} onChange={handleInputChange} className={inputStyles} />
            </div>
             <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Details (comma-separated)</label>
                <input id="details" type="text" name="details" value={arrayToString(product.details)} onChange={handleInputChange} className={inputStyles} />
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="material" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Material</label>
                    <input id="material" type="text" name="material" value={product.material || ''} onChange={handleInputChange} className={inputStyles} />
                </div>
                 <div>
                    <label htmlFor="culturalInspiration" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Cultural Inspiration</label>
                    <input id="culturalInspiration" type="text" name="culturalInspiration" value={product.culturalInspiration || ''} onChange={handleInputChange} className={inputStyles} />
                </div>
             </div>
             
             <div className="flex items-center space-x-8">
                 <div className="flex items-center">
                    <input id="isBestseller" type="checkbox" name="isBestseller" checked={product.isBestseller || false} onChange={handleInputChange} className="h-4 w-4 text-brand-secondary border-gray-300 rounded focus:ring-brand-secondary dark:bg-dark-bg dark:border-dark-border dark:focus:ring-dark-accent dark:checked:bg-dark-accent" />
                    <label htmlFor="isBestseller" className="ml-2 block text-sm text-gray-900 dark:text-dark-subtext">Bestseller</label>
                </div>
                 <div className="flex items-center">
                    <input id="isNewArrival" type="checkbox" name="isNewArrival" checked={product.isNewArrival || false} onChange={handleInputChange} className="h-4 w-4 text-brand-secondary border-gray-300 rounded focus:ring-brand-secondary dark:bg-dark-bg dark:border-dark-border dark:focus:ring-dark-accent dark:checked:bg-dark-accent" />
                    <label htmlFor="isNewArrival" className="ml-2 block text-sm text-gray-900 dark:text-dark-subtext">New Arrival</label>
                </div>
                 <div className="flex items-center">
                    <input id="isVisible" type="checkbox" name="isVisible" checked={product.isVisible !== false} onChange={handleInputChange} className="h-4 w-4 text-brand-secondary border-gray-300 rounded focus:ring-brand-secondary dark:bg-dark-bg dark:border-dark-border dark:focus:ring-dark-accent dark:checked:bg-dark-accent" />
                    <label htmlFor="isVisible" className="ml-2 block text-sm text-gray-900 dark:text-dark-subtext">Visible in Store</label>
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
                    type="button" 
                    onClick={() => navigate('/admin/products')} 
                    disabled={isSaving}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:bg-dark-card dark:border-dark-border dark:text-dark-text dark:hover:bg-gray-600">
                        Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="w-48 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-400 disabled:cursor-not-allowed dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 transition-all">
                    {isSaving ? (successMessage ? 'Saved!' : 'Saving...') : (isEditing ? 'Update Product' : 'Create Product')}
                </button>
            </div>
        </form>
    );
};

export default AdminProductFormPage;