import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';
import { useRiders } from '../hooks/useRiders';
import { Product, Order, Rider } from '../types';
import { Search, X, Package, ShoppingCart, Bike, LayoutGrid, FileText, Settings, Tags } from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AdminPage {
  title: string;
  path: string;
  icon: React.ElementType;
}

const adminPages: AdminPage[] = [
  { title: 'Dashboard', path: '/admin/dashboard', icon: LayoutGrid },
  { title: 'Products', path: '/admin/products', icon: Package },
  { title: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { title: 'Riders', path: '/admin/riders', icon: Bike },
  { title: 'Categories', path: '/admin/categories', icon: Tags },
  { title: 'Site Settings', path: '/admin/settings', icon: Settings },
  { title: 'Our Story', path: '/admin/our-story', icon: FileText },
];

const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { products } = useProducts();
  const { orders } = useOrders();
  const { riders } = useRiders();

  useEffect(() => {
    if (!isOpen) {
      // Reset query when modal is closed
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const searchResults = useMemo(() => {
    if (query.trim().length < 2) {
      return null;
    }

    const lowerCaseQuery = query.toLowerCase();

    const filteredProducts = products
      .filter(p =>
        p.name.toLowerCase().includes(lowerCaseQuery) ||
        p.sku.toLowerCase().includes(lowerCaseQuery) ||
        p.description.toLowerCase().includes(lowerCaseQuery)
      )
      .slice(0, 5);

    const filteredOrders = orders
      .filter(o =>
        String(o.id).includes(lowerCaseQuery) ||
        o.trackingId.toLowerCase().includes(lowerCaseQuery) ||
        o.clientDetails.name.toLowerCase().includes(lowerCaseQuery) ||
        o.clientDetails.phone.includes(lowerCaseQuery)
      )
      .slice(0, 5);

    const filteredRiders = riders
      .filter(r =>
        r.name.toLowerCase().includes(lowerCaseQuery) ||
        r.phone.includes(lowerCaseQuery)
      )
      .slice(0, 5);
      
    const filteredAdminPages = adminPages
      .filter(p => p.title.toLowerCase().includes(lowerCaseQuery))
      .slice(0, 5);

    return {
      products: filteredProducts,
      orders: filteredOrders,
      riders: filteredRiders,
      adminPages: filteredAdminPages
    };
  }, [query, products, orders, riders]);

  if (!isOpen) return null;

  const hasResults = searchResults && (
    searchResults.products.length > 0 ||
    searchResults.orders.length > 0 ||
    searchResults.riders.length > 0 ||
    searchResults.adminPages.length > 0
  );

  const ResultSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
      <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-dark-subtext">{title}</h3>
      <ul className="divide-y divide-gray-100 dark:divide-dark-border">{children}</ul>
    </div>
  );
  
  const ResultLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
     <Link to={to} onClick={onClose} className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
        {children}
     </Link>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 animate-fade-in" onClick={onClose}>
      <div 
        className="relative mx-auto mt-[10vh] w-full max-w-2xl bg-white dark:bg-dark-card rounded-lg shadow-2xl flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-dark-border flex items-center">
            <Search className="h-5 w-5 text-gray-400 dark:text-dark-subtext" />
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search for products, orders, pages..."
                className="w-full ml-3 bg-transparent focus:outline-none text-lg text-brand-primary dark:text-dark-text"
                autoFocus
            />
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-dark-text">
                <X className="h-6 w-6" />
            </button>
        </div>
        <div className="overflow-y-auto">
            {!searchResults && (
                <div className="text-center p-16 text-gray-400 dark:text-dark-subtext">
                    <p>Start typing to search across the admin panel.</p>
                </div>
            )}
            {searchResults && !hasResults && (
                 <div className="text-center p-16 text-gray-400 dark:text-dark-subtext">
                    <p>No results found for "{query}".</p>
                </div>
            )}
            {hasResults && (
                <div className="py-2">
                    {searchResults.products.length > 0 && (
                        <ResultSection title="Products">
                            {searchResults.products.map(p => (
                                <li key={`prod-${p.id}`}>
                                    <ResultLink to={`/admin/products/edit/${p.id}`}>
                                        <div className="flex items-center space-x-3">
                                            <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-md object-cover flex-shrink-0" />
                                            <div className="text-sm">
                                                <p className="font-semibold text-brand-primary dark:text-dark-text">{p.name}</p>
                                                <p className="text-gray-500 dark:text-dark-subtext">SKU: {p.sku}</p>
                                            </div>
                                        </div>
                                    </ResultLink>
                                </li>
                            ))}
                        </ResultSection>
                    )}
                     {searchResults.orders.length > 0 && (
                        <ResultSection title="Orders">
                            {searchResults.orders.map(o => (
                                <li key={`order-${o.id}`}>
                                    <ResultLink to={`/admin/orders`}>
                                        <div className="text-sm">
                                            <p className="font-semibold text-brand-primary dark:text-dark-text">Order #{o.id} - {o.clientDetails.name}</p>
                                            <p className="text-gray-500 dark:text-dark-subtext">Status: {o.status} &bull; Total: KSH {Math.round(o.total)}</p>
                                        </div>
                                    </ResultLink>
                                </li>
                            ))}
                        </ResultSection>
                    )}
                    {searchResults.riders.length > 0 && (
                        <ResultSection title="Riders">
                            {searchResults.riders.map(r => (
                                <li key={`rider-${r.id}`}>
                                    <ResultLink to={`/admin/riders`}>
                                        <div className="text-sm">
                                            <p className="font-semibold text-brand-primary dark:text-dark-text">{r.name}</p>
                                            <p className="text-gray-500 dark:text-dark-subtext">{r.phone}</p>
                                        </div>
                                    </ResultLink>
                                </li>
                            ))}
                        </ResultSection>
                    )}
                     {searchResults.adminPages.length > 0 && (
                        <ResultSection title="Admin Pages">
                            {searchResults.adminPages.map(page => (
                                <li key={`page-${page.path}`}>
                                    <ResultLink to={page.path}>
                                        <div className="flex items-center space-x-3 text-sm">
                                            <page.icon className="h-5 w-5 text-gray-500 dark:text-dark-subtext" />
                                            <p className="font-semibold text-brand-primary dark:text-dark-text">{page.title}</p>
                                        </div>
                                    </ResultLink>
                                </li>
                            ))}
                        </ResultSection>
                    )}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;