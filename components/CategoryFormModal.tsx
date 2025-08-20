

import React, { useState, useEffect } from 'react';
import { Category } from '../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string | null, name: string) => void;
  category: Category | null;
}

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSave, category }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(category?.name || '');
  }, [category]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(category?.id || null, name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-dark-text">
              {category ? 'Edit Category' : 'Add New Category'}
            </h3>
            <div className="mt-4">
              <label htmlFor="category-name" className="sr-only">Category Name</label>
              <input
                type="text"
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text"
                required
                autoFocus
              />
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-bg px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-brand-primary text-base font-medium text-white hover:bg-brand-secondary sm:ml-3 sm:w-auto sm:text-sm dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90"
            >
              Save
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm dark:bg-dark-card dark:border-dark-border dark:text-dark-text dark:hover:bg-gray-600"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryFormModal;