

import React, { useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { Category } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';
import CategoryFormModal from '../components/CategoryFormModal';
import { Plus } from 'lucide-react';

const AdminCategoriesPage: React.FC = () => {
    const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
    const { products } = useProducts();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

    const openFormModal = (category: Category | null = null) => {
        setSelectedCategory(category);
        setIsFormModalOpen(true);
    };

    const closeFormModal = () => {
        setSelectedCategory(null);
        setIsFormModalOpen(false);
    };

    const handleSaveCategory = async (id: string | null, name: string) => {
        if (id) {
            await updateCategory(id, name);
        } else {
            await addCategory(name);
        }
        closeFormModal();
    };

    const openDeleteModal = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setCategoryToDelete(null);
        setIsDeleteModalOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (categoryToDelete) {
            await deleteCategory(categoryToDelete.id);
            closeDeleteModal();
        }
    };
    
    const isCategoryInUse = (categoryId: string): boolean => {
        return products.some(product => product.categoryId === categoryId);
    }

    return (
        <>
            {(isFormModalOpen) && (
                 <CategoryFormModal
                    isOpen={isFormModalOpen}
                    onClose={closeFormModal}
                    onSave={handleSaveCategory}
                    category={selectedCategory}
                />
            )}
            {categoryToDelete && (
                <ConfirmationModal
                    isOpen={isDeleteModalOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleDeleteConfirm}
                    title={isCategoryInUse(categoryToDelete.id) ? "Cannot Delete Category" : "Delete Category"}
                    message={
                        isCategoryInUse(categoryToDelete.id)
                        ? `Cannot delete "${categoryToDelete.name}" because it is currently assigned to one or more products. Please reassign products to another category before deleting.`
                        : `Are you sure you want to delete "${categoryToDelete.name}"? This action cannot be undone.`
                    }
                />
            )}
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Manage Categories</h2>
                    <button onClick={() => openFormModal()} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-md hover:bg-brand-secondary transition-colors flex items-center dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90">
                        <Plus className="mr-2 h-5 w-5" />
                        Add Category
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                         <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Category Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Products</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-card dark:divide-dark-border">
                            {categories.map(category => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-text">{category.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">
                                        {products.filter(p => p.categoryId === category.id).length}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openFormModal(category)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4">Edit</button>
                                        <button onClick={() => openDeleteModal(category)} className={`text-red-600 hover:text-red-900 ${isCategoryInUse(category.id) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {categories.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-dark-subtext">No categories found. Add your first category!</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default AdminCategoriesPage;