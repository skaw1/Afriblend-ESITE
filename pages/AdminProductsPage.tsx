import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ConfirmationModal from '../components/ConfirmationModal';
import { Product } from '../types';
import { useCategories } from '../hooks/useCategories';
import { Search, Plus } from 'lucide-react';

const AdminProductsPage: React.FC = () => {
    const { products, deleteProduct, updateProduct } = useProducts();
    const { getCategoryById } = useCategories();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    const openDeleteModal = (product: Product) => {
        setProductToDelete(product);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setProductToDelete(null);
        setIsModalOpen(false);
    };

    const handleDeleteConfirm = () => {
        if (productToDelete) {
            deleteProduct(productToDelete.id);
            closeDeleteModal();
        }
    };
    
    const handleVisibilityToggle = (productToToggle: Product) => {
        updateProduct({
            ...productToToggle,
            isVisible: !(productToToggle.isVisible !== false)
        });
    };
    
    return (
        <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
            {productToDelete && (
                <ConfirmationModal
                    isOpen={isModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Product"
                    message={`Are you sure you want to delete "${productToDelete.name}"? This action cannot be undone.`}
                />
            )}
            <div className="flex justify-between items-center mb-6">
                <div className="relative w-full max-w-xs">
                     <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-secondary dark:bg-dark-bg dark:border-dark-border dark:text-dark-text dark:placeholder-dark-subtext dark:focus:ring-dark-accent"
                    />
                    <div className="absolute top-0 left-0 inline-flex items-center p-2 mt-1 ml-1">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                </div>
                <Link to="/admin/products/new" className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-secondary transition-colors flex items-center dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                    <Plus className="mr-2 h-5 w-5" />
                    Add Product
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Visibility</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-card dark:divide-dark-border">
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <img className="h-10 w-10 rounded-full object-cover" src={product.images[0]} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-dark-text">{product.name}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{getCategoryById(product.categoryId)?.name || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">KSH {Math.round(product.price)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">{product.stock}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <label htmlFor={`visible-${product.id}`} className="flex items-center cursor-pointer">
                                        <div className="relative">
                                            <input type="checkbox" id={`visible-${product.id}`} className="sr-only" checked={product.isVisible !== false} onChange={() => handleVisibilityToggle(product)} />
                                            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${product.isVisible !== false ? 'transform translate-x-6 bg-green-400' : ''}`}></div>
                                        </div>
                                    </label>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link to={`/admin/products/edit/${product.id}`} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">Edit</Link>
                                    <button onClick={() => openDeleteModal(product)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             {filteredProducts.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500 dark:text-dark-subtext">No products found.</p>
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;