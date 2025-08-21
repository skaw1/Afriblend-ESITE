import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useCategories } from '../hooks/useCategories';
import { ChevronLeft } from 'lucide-react';
import { Product } from '../types';
import { convertGoogleDriveUrl } from '../utils/imageUtils';

// --- Color Map Helper ---
const colorMap: { [key: string]: string } = {
  // Single Colors
  'royal blue': '#4169E1',
  'sunset orange': '#FD5E53',
  'emerald green': '#50C878',
  'ruby red': '#E0115F',
  'indigo blue': '#4B0082',
  'forest green': '#228B22',
  'indigo': '#4B0082',
  'red': '#FF0000',
  'black': '#000000',
  'white': '#FFFFFF',
  
  // Gradients for multi-color names
  'rainbow': 'linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)',
  'monochrome': 'linear-gradient(to right, #000000, #888888, #FFFFFF)',
  'black/gold': 'linear-gradient(45deg, black 49%, gold 51%)',
  'navy/blue': 'linear-gradient(45deg, navy 49%, blue 51%)',
  'black/white': 'linear-gradient(45deg, black 49%, white 51%)',
  'rust/cream': 'linear-gradient(45deg, #B7410E 49%, #FFFDD0 51%)',
  'natural/gold': 'linear-gradient(45deg, #F0EAD6 49%, gold 51%)',
  'black/cream': 'linear-gradient(45deg, black 49%, #FFFDD0 51%)'
};

const getColorStyle = (colorName: string): React.CSSProperties => {
  const normalizedColor = colorName.toLowerCase();
  const colorValue = colorMap[normalizedColor];
  
  if (!colorValue) {
    // Fallback for simple CSS colors not in the map (e.g. 'blue', 'green')
    return { backgroundColor: normalizedColor.replace(/\s/g, '') };
  }
  
  if (colorValue.startsWith('linear-gradient')) {
    return { backgroundImage: colorValue };
  }
  
  return { backgroundColor: colorValue };
};


const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug } = useProducts();
  const product = getProductBySlug(slug || '');
  const { addToCart } = useCart();
  const { getCategoryById } = useCategories();
  
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdded, setIsAdded] = useState(false);
  
  const category = product ? getCategoryById(product.categoryId) : null;

  useEffect(() => {
    if (product) {
      setSelectedImage(product.images[0] || '');
      setSelectedSize(product.sizes[0] || '');
      setSelectedColor(product.colors[0] || '');

      // --- SEO: Set Meta Tags ---
      document.title = `${product.name} | Afriblend`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', product.description);
      }
    }
  }, [product]);

  useEffect(() => {
    if (!product || !category) return;
    
    // --- SEO: Add Schema.org JSON-LD ---
    const productSchema = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": product.images,
      "description": product.description,
      "sku": product.sku,
      "brand": {
        "@type": "Brand",
        "name": "Afriblend"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating,
        "reviewCount": product.reviewCount
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "KES",
        "price": product.price.toFixed(2),
        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Afriblend"
        }
      }
    };
    
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [{
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `${window.location.origin}/`
        },{
            "@type": "ListItem",
            "position": 2,
            "name": "Products",
            "item": `${window.location.origin}/products`
        },{
            "@type": "ListItem",
            "position": 3,
            "name": category.name,
            "item": `${window.location.origin}/products?categoryId=${category.id}`
        },{
            "@type": "ListItem",
            "position": 4,
            "name": product.name
        }]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema';
    script.innerHTML = JSON.stringify([productSchema, breadcrumbSchema]);
    document.head.appendChild(script);

    return () => {
      const scriptTag = document.getElementById('product-schema');
      if (scriptTag) {
        document.head.removeChild(scriptTag);
      }
    };
  }, [product, category]);

  if (!product || product.isVisible === false) {
    return <div className="text-center py-20">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };
  
  const generateAltText = (prod: Product, index: number) => {
    return `${prod.name} - View ${index + 1}. A ${prod.material || ''} product inspired by ${prod.culturalInspiration || 'African heritage'}.`;
  };

  return (
    <div className="bg-white dark:bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 py-8 md:py-12">
        <Link to="/products" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-primary dark:text-dark-subtext dark:hover:text-dark-text mb-4 transition-colors">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Collection
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-12 gap-y-8">
          
          {/* Image Gallery (Sticky on desktop) */}
          <div className="lg:col-span-2 lg:sticky lg:top-24 h-fit">
            {/* Main Image */}
            <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100 dark:bg-dark-card shadow-sm">
              <img 
                src={convertGoogleDriveUrl(selectedImage)} 
                alt={generateAltText(product, product.images.indexOf(selectedImage))} 
                className="w-full h-full object-contain transition-opacity duration-300"
              />
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
                {product.images.map((img, index) => (
                  <button 
                    key={index} 
                    onClick={() => setSelectedImage(img)} 
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 transition-all ${selectedImage === img ? 'border-brand-secondary dark:border-dark-accent scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img 
                      src={convertGoogleDriveUrl(img)} 
                      alt={generateAltText(product, index)} 
                      className="w-full h-full object-contain bg-gray-100 dark:bg-dark-card"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-3">
            <div className="py-2">
              <Link to={`/products?categoryId=${product.categoryId}`} className="text-xs sm:text-sm text-gray-500 hover:text-brand-primary dark:text-dark-subtext dark:hover:text-dark-text">{category?.name || 'Category'}</Link>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-serif font-bold text-brand-primary dark:text-dark-text mt-1 sm:mt-2">{product.name}</h1>
              
              <p className="text-2xl md:text-3xl font-semibold text-brand-primary dark:text-dark-text mt-4 sm:mt-6">KSH {Math.round(product.price)}</p>

              {/* Options */}
              <div className="mt-6 space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-brand-primary dark:text-dark-text">Color: <span className="font-normal">{selectedColor}</span></h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.colors.map(color => (
                      <button 
                        key={color} 
                        onClick={() => setSelectedColor(color)} 
                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-brand-secondary dark:border-dark-accent ring-2 ring-offset-2 dark:ring-offset-dark-bg ring-brand-secondary/70 dark:ring-dark-accent' : 'border-gray-200 dark:border-dark-border hover:border-brand-secondary/50'}`} 
                        style={getColorStyle(color)}
                      >
                        <span className="sr-only">{color}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-brand-primary dark:text-dark-text">Size: <span className="font-normal">{selectedSize}</span></h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes.map(size => (
                      <button 
                        key={size} 
                        onClick={() => setSelectedSize(size)} 
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 border rounded-md text-sm font-medium transition-colors ${selectedSize === size ? 'bg-brand-primary text-white border-brand-primary dark:bg-dark-accent dark:text-dark-bg dark:border-dark-accent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-dark-card dark:text-dark-text dark:border-dark-border dark:hover:bg-gray-700'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to Bag Button */}
              <div className="mt-8">
                <button 
                  onClick={handleAddToCart} 
                  className={`w-full py-3 px-8 rounded-md font-bold text-white transition-colors duration-300 ${isAdded ? 'bg-green-500' : 'bg-brand-secondary hover:bg-brand-primary dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90'}`}
                >
                  {isAdded ? 'Added to Bag!' : 'Add to Bag'}
                </button>
              </div>

              {/* Description and Details */}
              <div className="mt-10 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-brand-primary dark:text-dark-text mb-2 font-serif">Description</h3>
                  <p className="text-gray-600 dark:text-dark-subtext leading-relaxed text-sm sm:text-base">{product.description}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-brand-primary dark:text-dark-text mb-2 font-serif">Details</h3>
                  <ul className="list-disc list-inside text-gray-600 dark:text-dark-subtext space-y-1 text-sm sm:text-base">
                      {product.details.map((detail, i) => <li key={i}>{detail}</li>)}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;