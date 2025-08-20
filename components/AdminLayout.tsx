
import React, { useState, useRef } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutGrid, Package, Tags, ArrowLeft, LogOut, Settings, Menu, X, HelpCircle, BookUser, FileText, ShoppingCart, Bike, BarChart3, TrendingUp, Image, Search, UserCircle } from 'lucide-react';
import GlobalSearchModal from './GlobalSearchModal';

const AdminLayout: React.FC = () => {
    const { logout, userRole } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/admin/seo-report')) return 'SEO Strategy Report';
        if (path.includes('/admin/image-generator')) return 'AI Image Generator';
        if (path.includes('/admin/reports')) return 'Sales & Stock Reports';
        if (path.includes('/admin/orders')) return 'Order Management';
        if (path.includes('/admin/riders')) return 'Rider Management';
        if (path.includes('/admin/our-story')) return 'Manage Our Story';
        if (path.includes('/admin/contact')) return 'Manage Contact Info';
        if (path.includes('/admin/faq')) return 'Manage FAQs';
        if (path.includes('/admin/settings')) return 'Site Settings';
        if (path.includes('/admin/categories')) return 'Category Management';
        if (path.includes('/admin/products/edit')) return 'Edit Product';
        if (path.includes('/admin/products/new')) return 'Add New Product';
        if (path.includes('/admin/products')) return 'Product Management';
        if (path.includes('/admin/dashboard')) return 'Dashboard';
        return 'Admin';
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `relative flex items-center px-4 py-3 text-gray-300 transition-colors duration-200 transform rounded-md hover:bg-gray-700/50 dark:hover:bg-gray-600/50 ${
            isActive ? 'bg-gray-700 dark:bg-gray-600 text-white' : ''
        }`;

    const closeSidebar = () => setIsSidebarOpen(false);

    const isDeveloper = userRole === 'Developer';

    return (
        <>
            <div className="bg-gray-100 dark:bg-black font-sans">
                {/* Overlay */}
                <div
                    onClick={closeSidebar}
                    className={`fixed inset-0 bg-black/60 z-20 md:hidden transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                />
                
                {/* Sidebar */}
                <aside
                    className={`fixed inset-y-0 left-0 bg-brand-primary dark:bg-dark-card w-64 transform transition-transform duration-300 ease-in-out z-30 flex flex-col md:translate-x-0 ${
                        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex items-center justify-between h-20 px-4 flex-shrink-0">
                        <Link to="/" onClick={closeSidebar}>
                             <img 
                                src="https://res.cloudinary.com/dwwvh34yi/image/upload/v1753865210/Afriblend_uyhbef.png" 
                                alt="Afriblend Logo" 
                                className="h-10 w-auto" 
                              />
                        </Link>
                         <button onClick={closeSidebar} className="md:hidden text-gray-300 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                        <NavLink to="/admin/dashboard" className={navLinkClasses} onClick={closeSidebar}>
                            <LayoutGrid className="mr-3 h-5 w-5" /> Dashboard
                        </NavLink>
                        <NavLink to="/admin/reports" className={navLinkClasses} onClick={closeSidebar}>
                            <BarChart3 className="mr-3 h-5 w-5" /> Reports
                        </NavLink>
                        <NavLink to="/admin/seo-report" className={navLinkClasses} onClick={closeSidebar}>
                            <TrendingUp className="mr-3 h-5 w-5" /> SEO Report
                        </NavLink>
                        <NavLink to="/admin/orders" className={navLinkClasses} onClick={closeSidebar}>
                            <ShoppingCart className="mr-3 h-5 w-5" /> Orders
                        </NavLink>
                        <NavLink to="/admin/products" className={navLinkClasses} onClick={closeSidebar}>
                            <Package className="mr-3 h-5 w-5" /> Products
                        </NavLink>
                        <NavLink to="/admin/riders" className={navLinkClasses} onClick={closeSidebar}>
                            <Bike className="mr-3 h-5 w-5" /> Riders
                        </NavLink>
                        <NavLink to="/admin/categories" className={navLinkClasses} onClick={closeSidebar}>
                            <Tags className="mr-3 h-5 w-5" /> Categories
                        </NavLink>
                         
                        {isDeveloper && (
                            <>
                                <div className="pt-4">
                                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Site Content</p>
                                    <div className="space-y-2 mt-2">
                                        <NavLink to="/admin/our-story" className={navLinkClasses} onClick={closeSidebar}>
                                            <FileText className="mr-3 h-5 w-5" /> Our Story
                                        </NavLink>
                                        <NavLink to="/admin/faq" className={navLinkClasses} onClick={closeSidebar}>
                                            <HelpCircle className="mr-3 h-5 w-5" /> FAQs
                                        </NavLink>
                                        <NavLink to="/admin/contact" className={navLinkClasses} onClick={closeSidebar}>
                                            <BookUser className="mr-3 h-5 w-5" /> Contact Info
                                        </NavLink>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Configuration</p>
                                    <div className="space-y-2 mt-2">
                                        <NavLink to="/admin/settings" className={navLinkClasses} onClick={closeSidebar}>
                                            <Settings className="mr-3 h-5 w-5" /> Site Settings
                                        </NavLink>
                                        <NavLink to="/admin/image-generator" className={navLinkClasses} onClick={closeSidebar}>
                                            <Image className="mr-3 h-5 w-5" /> Image Generator
                                        </NavLink>
                                    </div>
                                </div>
                            </>
                        )}
                    </nav>

                    <div className="px-3 py-4 mt-auto flex-shrink-0">
                        <div className="border-t border-gray-700 dark:border-gray-600 pt-4">
                            <div className="flex items-center space-x-3 px-1">
                                <UserCircle className="h-9 w-9 text-gray-300" />
                                <div>
                                    <p className="font-semibold text-sm text-white">{userRole}</p>
                                </div>
                            </div>
                            <Link to="/" className={`${navLinkClasses({isActive: false})} !mt-4`}>
                                <ArrowLeft className="mr-3 h-5 w-5" /> Back to Store
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
                    <header className="flex justify-between items-center h-20 px-6 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border sticky top-0 z-10">
                        <div className="flex items-center">
                            <button
                                className="text-gray-800 dark:text-dark-text md:hidden mr-4"
                                onClick={() => setIsSidebarOpen(true)}
                                aria-label="Open sidebar"
                            >
                                <Menu className="h-6 w-6"/>
                            </button>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-dark-text">{getPageTitle()}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-dark-subtext font-medium py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-md"
                                aria-label="Open search"
                            >
                                <Search className="mr-2 h-5 w-5" />
                                Search
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center bg-brand-secondary text-white font-bold py-2 px-4 hover:bg-brand-primary transition-colors rounded-md dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90"
                            >
                                <LogOut className="mr-2 h-5 w-5" />
                                Logout
                            </button>
                        </div>
                    </header>
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-black p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
            <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default AdminLayout;
