import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { useCategories } from '../hooks/useCategories';
import { Frown, ChevronLeft, Search, X, SlidersHorizontal } from 'lucide-react';

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


const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { products } = useProducts();
  const { categories } = useCategories();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // State for pending filters on mobile to prevent re-rendering on every tap
  const [pendingFilters, setPendingFilters] = useState(new URLSearchParams());
  
  // State for the debounced count on the mobile filter button
  const [debouncedProductCount, setDebouncedProductCount] = useState(0);

  useEffect(() => {
    // --- SEO: Set Meta Tags ---
    document.title = 'Shop Our Collection | Afriblend';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', 'Explore our full collection of modern African fashion. Find handcrafted dresses, accessories, menswear, and home decor that tell a story.');
    }
  }, []);

  // Memo for the main product list based on applied filters
  const filteredProducts = useMemo(() => {
    const currentSearchTerm = (searchParams.get('q') || '').toLowerCase();
    const filters = {
        categoryId: searchParams.get('categoryId'),
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : 500,
        size: searchParams.get('size'),
        color: searchParams.get('color'),
        material: searchParams.get('material'),
    };
    return products.filter(product => {
      if (product.isVisible === false) return false;

      const searchMatch = currentSearchTerm === '' || product.name.toLowerCase().includes(currentSearchTerm) || product.description.toLowerCase().includes(currentSearchTerm);
      const categoryMatch = !filters.categoryId || product.categoryId === filters.categoryId;
      const priceMatch = product.price <= filters.maxPrice;
      const sizeMatch = !filters.size || product.sizes.includes(filters.size);
      const colorMatch = !filters.color || product.colors.includes(filters.color);
      const materialMatch = !filters.material || product.material === filters.material;
      return searchMatch && categoryMatch && priceMatch && sizeMatch && colorMatch && materialMatch;
    });
  }, [searchParams, products]);

  // When mobile sidebar opens, copy current filters and set initial count for the button.
  useEffect(() => {
    if (isSidebarOpen) {
      setPendingFilters(new URLSearchParams(searchParams));
      setDebouncedProductCount(filteredProducts.length);
    }
  }, [isSidebarOpen, searchParams, filteredProducts.length]);

  // Debounce the calculation of the pending product count to keep the UI smooth.
  useEffect(() => {
    if (!isSidebarOpen) return;

    const timer = setTimeout(() => {
        const pFilters = {
            q: (pendingFilters.get('q') || '').toLowerCase(),
            categoryId: pendingFilters.get('categoryId'),
            maxPrice: pendingFilters.get('maxPrice') ? Number(pendingFilters.get('maxPrice')) : 500,
            size: pendingFilters.get('size'),
            color: pendingFilters.get('color'),
            material: pendingFilters.get('material'),
        };
        const count = products.filter(product => {
            if (product.isVisible === false) return false;
            const searchMatch = pFilters.q === '' || product.name.toLowerCase().includes(pFilters.q) || product.description.toLowerCase().includes(pFilters.q);
            const categoryMatch = !pFilters.categoryId || product.categoryId === pFilters.categoryId;
            const priceMatch = product.price <= pFilters.maxPrice;
            const sizeMatch = !pFilters.size || product.sizes.includes(pFilters.size);
            const colorMatch = !pFilters.color || product.colors.includes(pFilters.color);
            const materialMatch = !pFilters.material || product.material === pFilters.material;
            return searchMatch && categoryMatch && priceMatch && sizeMatch && colorMatch && materialMatch;
        }).length;
        setDebouncedProductCount(count);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [isSidebarOpen, pendingFilters, products]);


  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024 && isSidebarOpen) {
            setIsSidebarOpen(false);
        }
    };

    if (isSidebarOpen && window.innerWidth < 1024) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }

    window.addEventListener('resize', handleResize);
    
    return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('resize', handleResize);
    };
  }, [isSidebarOpen]);

  // --- Handlers for INSTANTLY updating search params (Desktop) ---
  const handleFilterChange = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };
  const handleSearchChange = (value: string) => {
    handleFilterChange('q', value);
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterChange('maxPrice', e.target.value);
  }
  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  // --- Handlers for updating PENDING filters (Mobile) ---
  const handlePendingFilterChange = (key: string, value: string | null) => {
    setPendingFilters(prev => {
        const newParams = new URLSearchParams(prev);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        return newParams;
    });
  };
  const handlePendingSearchChange = (value: string) => {
    handlePendingFilterChange('q', value);
  }
  const handlePendingPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handlePendingFilterChange('maxPrice', e.target.value);
  }
  const handleClearPendingFilters = () => {
    setPendingFilters(new URLSearchParams());
  }

  // Applies the pending filters and closes the mobile sidebar
  const applyPendingFilters = () => {
    setSearchParams(pendingFilters);
    setIsSidebarOpen(false);
  }

  const allSearchableTerms = useMemo(() => {
    const terms = new Set<string>();
    products.forEach(p => {
        terms.add(p.name);
        if (p.culturalInspiration) terms.add(p.culturalInspiration);
        if (p.material) terms.add(p.material);
    });
    categories.forEach(c => {
        terms.add(c.name);
    });
    return Array.from(terms);
  }, [products, categories]);
  
  // --- Aactive State Selection (chooses between pending or instant) ---
  const isMobileFiltering = isSidebarOpen;
  const activeParams = isMobileFiltering ? pendingFilters : searchParams;
  const activeSearchTerm = activeParams.get('q') || '';

  useEffect(() => {
    if (activeSearchTerm.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const lowerCaseSearch = activeSearchTerm.toLowerCase();
    const matchingSuggestions = allSearchableTerms
        .filter(term => term.toLowerCase().includes(lowerCaseSearch))
        .slice(0, 5); 

    setSuggestions(matchingSuggestions);
  }, [activeSearchTerm, allSearchableTerms]);
  
  const handleActiveSearchChange = (value: string) => {
    isMobileFiltering ? handlePendingSearchChange(value) : handleSearchChange(value);
  }

  const handleActiveSuggestionClick = (suggestion: string) => {
    handleActiveSearchChange(suggestion);
    setSuggestions([]);
  };

  const isAnyFilterActive = useMemo(() => {
    return activeParams.toString() !== '';
  }, [activeParams]);
  
  // Memos for filter options (sizes, colors, etc.)
  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => p.sizes.forEach(s => sizes.add(s)));
    return Array.from(sizes).sort();
  }, [products]);

  const allColors = useMemo(() => {
    const colors = new Set<string>();
    products.forEach(p => p.colors.forEach(c => colors.add(c)));
    return Array.from(colors);
  }, [products]);

  const allMaterials = useMemo(() => {
    const materials = new Set<string>();
    products.forEach(p => {
        if (p.material) materials.add(p.material);
    });
    return Array.from(materials).sort();
  }, [products]);
  
  // FilterContent now uses the "active" state, which is either pending (mobile) or instant (desktop)
  const FilterContent = () => {
    const activeFilters = {
        categoryId: activeParams.get('categoryId'),
        maxPrice: activeParams.get('maxPrice') ? Number(activeParams.get('maxPrice')) : 500,
        size: activeParams.get('size'),
        color: activeParams.get('color'),
        material: activeParams.get('material'),
    };
    const activeHandleFilterChange = isMobileFiltering ? handlePendingFilterChange : handleFilterChange;
    const activeHandlePriceChange = isMobileFiltering ? handlePendingPriceChange : handlePriceChange;
    const activeHandleClearFilters = isMobileFiltering ? handleClearPendingFilters : handleClearFilters;

    return (
        <>
        <Link to="/" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-primary dark:text-dark-subtext dark:hover:text-dark-text mb-6 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
        </Link>
        <div className="flex justify-between items-center pt-6 border-t dark:border-dark-border">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-dark-text">Options</h3>
            {isAnyFilterActive && (
            <button onClick={activeHandleClearFilters} className="text-sm font-semibold text-brand-secondary dark:text-dark-accent hover:underline">
                Clear All
            </button>
            )}
        </div>
        
        <div className="mt-6 mb-6">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-dark-text">Search</label>
            <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                id="search"
                placeholder="Search products..."
                value={activeSearchTerm}
                onChange={e => handleActiveSearchChange(e.target.value)}
                onBlur={() => setTimeout(() => setSuggestions([]), 200)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary sm:text-sm dark:bg-dark-bg dark:border-dark-border dark:text-dark-text dark:placeholder:text-dark-subtext"
                autoComplete="off"
            />
            {activeSearchTerm && (
                <button
                type="button"
                onClick={() => handleActiveSearchChange('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                aria-label="Clear search"
                >
                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </button>
            )}
            {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-md shadow-lg max-h-60 overflow-auto">
                {suggestions.map((suggestion, index) => (
                    <li
                    key={index}
                    className="px-4 py-2 text-sm text-gray-700 dark:text-dark-text cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-bg"
                    onMouseDown={() => handleActiveSuggestionClick(suggestion)}
                    >
                    {suggestion}
                    </li>
                ))}
                </ul>
            )}
            </div>
        </div>

        <div className="mb-6">
            <h3 className="font-semibold mb-2">Category</h3>
            <div className="space-y-2">
            <button onClick={() => activeHandleFilterChange('categoryId', null)} className={`block w-full text-left text-sm ${!activeFilters.categoryId ? 'text-brand-secondary dark:text-dark-accent font-bold' : 'text-gray-600 dark:text-dark-subtext hover:text-brand-primary dark:hover:text-dark-text'}`}>All</button>
            {categories.map(cat => (
                <button key={cat.id} onClick={() => activeHandleFilterChange('categoryId', cat.id.toString())} className={`block w-full text-left text-sm ${activeFilters.categoryId === cat.id ? 'text-brand-secondary dark:text-dark-accent font-bold' : 'text-gray-600 dark:text-dark-subtext hover:text-brand-primary dark:hover:text-dark-text'}`}>{cat.name}</button>
            ))}
            </div>
        </div>

        <div className="mb-6">
            <h3 className="font-semibold mb-2">Price</h3>
            <input type="range" min="0" max="500" value={activeFilters.maxPrice} onChange={activeHandlePriceChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-secondary dark:accent-dark-accent" />
            <div className="flex justify-between text-sm text-gray-600 dark:text-dark-subtext mt-1">
            <span>KSH 0</span>
            <span>KSH {activeFilters.maxPrice}</span>
            </div>
        </div>

        <div className="mb-6">
            <h3 className="font-semibold mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
            {allSizes.map(size => (
                <button
                key={size}
                onClick={() => activeHandleFilterChange('size', activeFilters.size === size ? null : size)}
                className={`px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${activeFilters.size === size ? 'bg-brand-primary text-white border-brand-primary dark:bg-dark-accent dark:text-dark-bg dark:border-dark-accent' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-dark-card dark:text-dark-text dark:border-dark-border dark:hover:bg-gray-700'}`}
                >
                {size}
                </button>
            ))}
            </div>
        </div>
        
        <div className="mb-6">
            <h3 className="font-semibold mb-2">Color</h3>
            <div className="flex flex-wrap gap-3">
            {allColors.map(color => (
                <button
                key={color}
                onClick={() => activeHandleFilterChange('color', activeFilters.color === color ? null : color)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${activeFilters.color === color ? 'border-brand-secondary dark:border-dark-accent ring-2 ring-offset-2 dark:ring-offset-dark-card ring-brand-secondary/70 dark:ring-dark-accent' : 'border-gray-200 dark:border-dark-border hover:border-brand-secondary/50'}`} 
                style={getColorStyle(color)}
                title={color}
                aria-label={color}
                >
                <span className="sr-only">{color}</span>
                </button>
            ))}
            </div>
        </div>
        
        <div className="mb-6">
            <h3 className="font-semibold mb-2">Material</h3>
            <div className="space-y-2">
                <button onClick={() => activeHandleFilterChange('material', null)} className={`block w-full text-left text-sm ${!activeFilters.material ? 'text-brand-secondary dark:text-dark-accent font-bold' : 'text-gray-600 dark:text-dark-subtext hover:text-brand-primary dark:hover:text-dark-text'}`}>All</button>
                {allMaterials.map(material => (
                <button key={material} onClick={() => activeHandleFilterChange('material', material)} className={`block w-full text-left text-sm ${activeFilters.material === material ? 'text-brand-secondary dark:text-dark-accent font-bold' : 'text-gray-600 dark:text-dark-subtext hover:text-brand-primary dark:hover:text-dark-text'}`}>{material}</button>
                ))}
            </div>
        </div>
        </>
    )
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-primary dark:text-dark-text">Our Collection</h1>
        <p className="mt-2 text-gray-600 dark:text-dark-subtext">Explore handcrafted pieces that blend tradition with modern style.</p>
      </div>

      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="w-full flex items-center justify-center p-3 border rounded-md font-semibold text-brand-primary dark:text-dark-text bg-white dark:bg-dark-card hover:bg-gray-50 dark:hover:bg-dark-border"
          aria-controls="filter-sidebar"
          aria-expanded={isSidebarOpen}
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          Filter & Sort
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} aria-hidden="true" />
        )}

        <aside 
          id="filter-sidebar" 
          className={`
            fixed inset-y-0 left-0 z-50 w-[85vw] max-w-sm bg-white dark:bg-dark-card
            transform transition-transform duration-300 ease-in-out
            flex flex-col
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:col-span-1 lg:w-auto lg:h-fit lg:shadow-sm lg:rounded-lg lg:p-6 lg:z-auto lg:inset-auto lg:block
          `}
        >
          <div className="p-6 flex-grow overflow-y-auto">
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <h2 className="text-xl font-semibold text-brand-primary dark:text-dark-text">Filters</h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-1 text-brand-primary dark:text-dark-text"
                aria-label="Close filters"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="hidden lg:block">
              <h2 className="text-xl font-semibold text-brand-primary dark:text-dark-text">Filters</h2>
            </div>
            <div className="mt-4 pt-4 border-t dark:border-dark-border lg:mt-0 lg:pt-0 lg:border-t-0">
              <FilterContent />
            </div>
          </div>
          <div className="flex-shrink-0 p-4 border-t dark:border-dark-border lg:hidden">
            <button
              onClick={applyPendingFilters}
              className="w-full bg-brand-primary text-white font-bold py-3 px-8 text-lg hover:bg-brand-secondary transition-colors dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 rounded-md"
            >
              Show {debouncedProductCount} Results
            </button>
          </div>
        </aside>

        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-dark-card rounded-lg shadow-sm">
                <Frown className="mx-auto h-16 w-16 text-gray-400 dark:text-dark-subtext" />
                <h3 className="mt-4 text-xl font-semibold text-brand-primary dark:text-dark-text">No Products Found</h3>
                <p className="mt-2 text-gray-500 dark:text-dark-subtext">Try adjusting your filters to find what you're looking for.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;