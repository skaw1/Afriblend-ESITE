import React, { useState, useRef } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutGrid, Package, Tags, ArrowLeft, LogOut, Settings, Menu, X, HelpCircle, BookUser, FileText, ShoppingCart, Bike, BarChart3, TrendingUp, Image, Search, UserCircle } from 'lucide-react';
import GlobalSearchModal from './GlobalSearchModal';

const AdminLayout: React.FC = () => {
    const { logout, userRole } = useAuth();
    const location = ReactRouterDOM.useLocation();
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
        `relative flex items-center px-4 py-3 text-gray-300 transition-colors duration-200 transform rounded-lg hover:bg-gray-700/50 dark:hover:bg-dark-bg ${
            isActive ? 'bg-gray-700/70 dark:bg-dark-bg text-white' : ''
        }`;

    const closeSidebar = () => setIsSidebarOpen(false);

    const isDeveloper = userRole === 'Developer';

    return (
        <>
            <div className="bg-gray-100 dark:bg-dark-bg font-sans">
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
                    <div className="flex items-center justify-between h-20 px-4 flex-shrink-0 border-b border-gray-700/50 dark:border-dark-border">
                        <ReactRouterDOM.Link to="/" onClick={closeSidebar}>
                             <img 
                                src="https://res.cloudinary.com/dwwvh34yi/image/upload/v1753865210/Afriblend_uyhbef.png" 
                                alt="Afriblend Logo" 
                                className="h-10 w-auto" 
                              />
                        </ReactRouterDOM.Link>
                         <button onClick={closeSidebar} className="md:hidden text-gray-300 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    
                    <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto scrollbar-hide">
                        <ReactRouterDOM.NavLink to="/admin/dashboard" className={navLinkClasses} onClick={closeSidebar}>
                            <LayoutGrid className="mr-3 h-5 w-5" /> Dashboard
                        </ReactRouterDOM.NavLink>
                        <ReactRouterDOM.NavLink to="/admin/reports" className={navLinkClasses} onClick={closeSidebar}>
                            <BarChart3 className="mr-3 h-5 w-5" /> Reports
                        </ReactRouterDOM.NavLink>
                        <ReactRouterDOM.NavLink to="/admin/seo-report" className={navLinkClasses} onClick={closeSidebar}>
                            <TrendingUp className="mr-3 h-5 w-5" /> SEO Report
                        </ReactRouterDOM.NavLink>
                        <ReactRouterDOM.NavLink to="/admin/orders" className={navLinkClasses} onClick={closeSidebar}>
                            <ShoppingCart className="mr-3 h-5 w-5" /> Orders
                        </ReactRouterDOM.NavLink>
                        <ReactRouterDOM.NavLink to="/admin/products" className={navLinkClasses} onClick={closeSidebar}>
                            <Package className="mr-3 h-5 w-5" /> Products
                        </ReactRouterDOM.NavLink>
                         <ReactRouterDOM.NavLink to="/admin/categories" className={navLinkClasses} onClick={closeSidebar}>
                            <Tags className="mr-3 h-5 w-5" /> Categories
                        </ReactRouterDOM.NavLink>
                        <ReactRouterDOM.NavLink to="/admin/riders" className={navLinkClasses} onClick={closeSidebar}>
                            <Bike className="mr-3 h-5 w-5" /> Riders
                        </ReactRouterDOM.NavLink>
                         
                        {isDeveloper && (
                            <>
                                <div className="pt-4">
                                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Site Content</p>
                                    <div className="space-y-2 mt-2">
                                        <ReactRouterDOM.NavLink to="/admin/our-story" className={navLinkClasses} onClick={closeSidebar}>
                                            <FileText className="mr-3 h-5 w-5" /> Our Story
                                        </ReactRouterDOM.NavLink>
                                        <ReactRouterDOM.NavLink to="/admin/faq" className={navLinkClasses} onClick={closeSidebar}>
                                            <HelpCircle className="mr-3 h-5 w-5" /> FAQs
                                        </ReactRouterDOM.NavLink>
                                        <ReactRouterDOM.NavLink to="/admin/contact" className={navLinkClasses} onClick={closeSidebar}>
                                            <BookUser className="mr-3 h-5 w-5" /> Contact Info
                                        </ReactRouterDOM.NavLink>
                                    </div>
                                </div>
                                <div className="pt-4">
                                    <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Configuration</p>
                                    <div className="space-y-2 mt-2">
                                        <ReactRouterDOM.NavLink to="/admin/settings" className={navLinkClasses} onClick={closeSidebar}>
                                            <Settings className="mr-3 h-5 w-5" /> Site Settings
                                        </ReactRouterDOM.NavLink>
                                        <ReactRouterDOM.NavLink to="/admin/image-generator" className={navLinkClasses} onClick={closeSidebar}>
                                            <Image className="mr-3 h-5 w-5" /> Image Generator
                                        </ReactRouterDOM.NavLink>
                                    </div>
                                </div>
                            </>
                        )}
                    </nav>

                    <div className="px-3 py-4 mt-auto flex-shrink-0 border-t border-gray-700/50 dark:border-dark-border">
                         <ReactRouterDOM.Link to="/" className={`${navLinkClasses({isActive: false})} !mt-2`}>
                            <ArrowLeft className="mr-3 h-5 w-5" /> Back to Store
                        </ReactRouterDOM.Link>
                         <div className="flex items-center space-x-3 p-3 mt-4 bg-gray-700/50 dark:bg-dark-bg/50 rounded-lg">
                            <UserCircle className="h-9 w-9 text-dark-accent" />
                            <div>
                                <p className="font-semibold text-sm text-white">{userRole}</p>
                            </div>
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
                            <h1 className="text-lg md:text-xl font-bold text-gray-800 dark:text-dark-text">{getPageTitle()}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="flex items-center bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-dark-subtext font-medium py-2 px-4 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-lg"
                                aria-label="Open search"
                            >
                                <Search className="mr-2 h-5 w-5" />
                                <span className="hidden sm:inline">Search...</span>
                            </button>
                            <button
                                onClick={logout}
                                className="flex items-center bg-brand-secondary text-white font-bold py-2 px-4 hover:bg-brand-primary transition-colors rounded-lg dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90"
                            >
                                <LogOut className="mr-2 h-5 w-5" />
                                <span className="hidden sm:inline">Logout</span>
                            </button>
                        </div>
                    </header>
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-dark-bg p-6">
                        <ReactRouterDOM.Outlet />
                    </main>
                </div>
            </div>
            <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default AdminLayout;