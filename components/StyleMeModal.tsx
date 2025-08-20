/*
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getStyleRecommendation, StyleRecommendation } from '../services/geminiService';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import { useCategories } from '../hooks/useCategories';
import { X, LoaderCircle } from 'lucide-react';

interface StyleMeModalProps {
  onClose: () => void;
}

const StyleMeModal: React.FC<StyleMeModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<StyleRecommendation | null>(null);
  const { products, getProductById } = useProducts();
  const { categories } = useCategories();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const visibleProducts = products.filter(p => p.isVisible !== false);
      const result = await getStyleRecommendation(prompt, visibleProducts, categories);
      setRecommendation(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-brand-bg dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-dark-border flex justify-between items-center">
          <h2 className="text-2xl font-serif text-brand-primary dark:text-dark-text">AI Stylist</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 dark:text-dark-subtext dark:hover:text-dark-text">
            <X className="h-8 w-8" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!recommendation && (
            <form onSubmit={handleSubmit}>
              <p className="text-brand-primary dark:text-dark-text mb-4">Describe the occasion or look you're going for, and I'll create a style for you!</p>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'A chic outfit for a gallery opening' or 'Something comfortable but stylish for a weekend brunch.'"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-secondary focus:outline-none transition dark:bg-dark-bg dark:border-dark-border dark:text-dark-text dark:placeholder:text-dark-subtext dark:focus:ring-dark-accent"
                rows={4}
                disabled={isLoading}
              />
              <button
                type="submit"
                className="mt-4 w-full bg-brand-primary text-white py-3 rounded-md font-semibold hover:bg-brand-secondary transition-colors disabled:bg-gray-400 flex items-center justify-center dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 dark:disabled:bg-gray-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Styling...
                  </>
                ) : "Get My Style"}
              </button>
              {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </form>
          )}

          {recommendation && (
            <div className="animate-fade-in">
              <div className="bg-white dark:bg-dark-bg p-4 rounded-lg border border-brand-accent/30 dark:border-dark-accent/30">
                 <p className="text-brand-primary dark:text-dark-text italic">"{recommendation.stylistMessage}"</p>
                 <p className="text-right text-sm font-semibold text-brand-secondary dark:text-dark-accent mt-2">- Zola, Your AI Stylist</p>
              </div>

              <h3 className="text-xl font-serif text-brand-primary dark:text-dark-text mt-6 mb-4">Your Curated Look:</h3>
              <div className="space-y-4">
                {recommendation.recommendedProducts.map(({ productId, reason }) => {
                  const product = getProductById(productId);
                  if (!product) return null;
                  return (
                    <div key={productId} className="bg-white dark:bg-dark-bg p-4 rounded-lg shadow-sm flex items-start space-x-4">
                      <img src={product.images[0]} alt={product.name} className="w-24 h-24 object-cover rounded-md"/>
                      <div className="flex-1">
                        <Link to={`/product/${product.slug}`} onClick={onClose} className="font-bold text-brand-primary dark:text-dark-text hover:text-brand-secondary dark:hover:text-dark-accent">{product.name}</Link>
                        <p className="text-sm text-gray-600 dark:text-dark-subtext mt-1">{reason}</p>
                        <p className="text-sm font-semibold text-brand-primary dark:text-dark-text mt-2">KSH {Math.round(product.price)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => setRecommendation(null)}
                className="mt-6 w-full bg-brand-secondary text-white py-3 rounded-md font-semibold hover:bg-brand-primary transition-colors dark:bg-dark-border dark:hover:bg-opacity-80"
              >
                Try Another Look
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StyleMeModal;
*/
