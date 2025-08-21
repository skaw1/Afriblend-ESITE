import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { convertGoogleDriveUrl } from '../utils/imageUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  
  const generateAltText = (prod: Product) => {
    return `${prod.name}. A ${prod.material || ''} product inspired by ${prod.culturalInspiration || 'African heritage'}. ${prod.description.substring(0, 80)}...`;
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block overflow-hidden">
      <div className="relative h-[220px] sm:h-[280px] overflow-hidden bg-gray-200 dark:bg-dark-border">
        <img
          src={convertGoogleDriveUrl(product.images[0])}
          alt={generateAltText(product)}
          className="absolute inset-0 h-full w-full object-contain opacity-100 group-hover:opacity-0 transition-opacity duration-500"
        />
        <img
          src={convertGoogleDriveUrl(product.images[1] || product.images[0])}
          alt={generateAltText(product)}
          className="absolute inset-0 h-full w-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      </div>
      <div className="pt-4 text-center">
        <h3 className="text-lg font-semibold text-brand-primary dark:text-dark-text group-hover:text-brand-secondary dark:group-hover:text-dark-accent transition-colors">{product.name}</h3>
        <p className="mt-2 font-semibold text-brand-primary dark:text-dark-text">KSH {Math.round(product.price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;