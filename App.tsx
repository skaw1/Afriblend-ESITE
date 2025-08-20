

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import AboutPage from './pages/AboutPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './hooks/useCart';
import { AuthProvider } from './hooks/useAuth';
import { OrderProvider } from './hooks/useOrders';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import TrackOrderInputPage from './pages/TrackOrderInputPage';
import { ProductProvider } from './hooks/useProducts';
import AdminLayout from './components/AdminLayout';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminProductFormPage from './pages/AdminProductFormPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import { ThemeProvider } from './hooks/useTheme';
import PaymentInstructionsPage from './pages/PaymentInstructionsPage';
import OrdersByPhonePage from './pages/OrdersByPhonePage';
import { Notification, UserRole } from './types';
import { INITIAL_NOTIFICATION } from './constants';
import { CategoryProvider } from './hooks/useCategories';
import { Megaphone, X } from 'lucide-react';
import AdminSettingsPage from './pages/AdminSettingsPage';
import { SettingsProvider } from './hooks/useSettings';
import FloatingActionButton from './components/FloatingActionButton';
import { FaqProvider } from './hooks/useFaqs';
import AdminFaqPage from './pages/AdminFaqPage';
import { ContactProvider } from './hooks/useContact';
import { OurStoryProvider } from './hooks/useOurStory';
import AdminContactPage from './pages/AdminContactPage';
import AdminOurStoryPage from './pages/AdminOurStoryPage';
import { RiderProvider } from './hooks/useRiders';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminRidersPage from './pages/AdminRidersPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminSeoReportPage from './pages/AdminSeoReportPage';
import AdminImageGeneratorPage from './pages/AdminImageGeneratorPage';


// --- Notification Context System ---
interface NotificationContextType {
  notification: Notification;
  updateNotification: (notification: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<Notification>(() => {
    try {
      const localData = localStorage.getItem('afriblend-notification');
      return localData ? JSON.parse(localData) : INITIAL_NOTIFICATION;
    } catch (error) {
      console.error("Could not parse notification from localStorage", error);
      return INITIAL_NOTIFICATION;
    }
  });

  useEffect(() => {
    localStorage.setItem('afriblend-notification', JSON.stringify(notification));
  }, [notification]);

  const updateNotification = (newNotification: Notification) => {
    setNotification(newNotification);
  };

  return React.createElement(NotificationContext.Provider, {
    value: { notification, updateNotification }
  }, children);
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// --- Notification Components ---

const SalesModal: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="relative bg-white dark:bg-dark-card rounded-lg shadow-2xl w-full max-w-md text-center overflow-hidden" onClick={e => e.stopPropagation()}>
        <img src="https://picsum.photos/seed/sale-banner/600/300" alt="Special Sale" className="w-full h-48 object-cover"/>
        <button onClick={onClose} className="absolute top-2 right-2 text-white bg-black/30 rounded-full p-1 hover:bg-black/50 transition-colors">
          <X className="h-6 w-6" />
        </button>
        <div className="p-8">
          <h2 className="text-3xl font-serif font-bold text-brand-primary dark:text-dark-text">{notification.title}</h2>
          <p className="mt-2 text-gray-600 dark:text-dark-subtext">{notification.message}</p>
          {notification.link && notification.linkLabel && (
            <Link 
              to={notification.link} 
              onClick={onClose} 
              className="mt-6 inline-block w-full bg-brand-secondary text-white font-bold py-3 px-8 text-lg hover:bg-brand-primary transition-transform duration-300 hover:scale-105 dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90 rounded-md"
            >
              {notification.linkLabel}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const NotificationPopup: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  return (
    <div className="fixed bottom-5 right-5 w-full max-w-sm z-50 animate-slide-up-fade-in">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-2xl border dark:border-dark-border">
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <Megaphone className="h-6 w-6 text-brand-accent dark:text-dark-accent" />
                    </div>
                    <div className="ml-3 w-0 flex-1">
                        <p className="text-sm font-bold text-brand-primary dark:text-dark-text">{notification.title}</p>
                        <p className="mt-1 text-sm text-gray-600 dark:text-dark-subtext">{notification.message}</p>
                        {notification.link && notification.linkLabel && (
                             <div className="mt-3">
                                 <Link to={notification.link} onClick={onClose} className="text-sm font-bold text-brand-secondary dark:text-dark-accent hover:underline">
                                    {notification.linkLabel}
                                </Link>
                             </div>
                        )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={onClose} className="inline-flex text-gray-400 dark:text-dark-subtext hover:text-gray-500 dark:hover:text-dark-text">
                            <span className="sr-only">Close</span>
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

const NotificationDisplayController: React.FC = () => {
  const { notification } = useNotification();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!notification.isActive) {
      setIsVisible(false);
      return;
    }

    const dismissedDataRaw = sessionStorage.getItem('afriblend-notification-dismissed');
    const dismissedData = dismissedDataRaw ? JSON.parse(dismissedDataRaw) : {};

    const notificationId = `${notification.title}-${notification.message}`;
    
    if (dismissedData.id === notificationId) {
      // This exact notification was dismissed in this session.
      return;
    }

    // Show notification after a delay
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [notification]);

  const handleClose = () => {
    setIsVisible(false);
    // Store the ID of the dismissed notification to prevent it from showing again in the same session
    const notificationId = `${notification.title}-${notification.message}`;
    sessionStorage.setItem('afriblend-notification-dismissed', JSON.stringify({ id: notificationId }));
  };

  if (!isVisible) {
    return null;
  }

  if (notification.displayType === 'modal') {
    return <SalesModal notification={notification} onClose={handleClose} />;
  }

  // Default to 'popup'
  return <NotificationPopup notification={notification} onClose={handleClose} />;
};


const PublicLayout: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        // If there's a hash, scroll to the element
        if (location.hash) {
            const id = location.hash.substring(1); // remove #
            const element = document.getElementById(id);
            if (element) {
                // Use a timeout to ensure the page has rendered before scrolling
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        } else {
            // Otherwise, scroll to the top of the page on navigation
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <div className="bg-brand-bg dark:bg-dark-bg text-brand-primary dark:text-dark-text font-sans flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <NotificationDisplayController />
            <FloatingActionButton />
        </div>
    );
};


const App: React.FC = () => {
  const storeOwnerRoles: UserRole[] = ['Store Owner', 'Developer'];
  const developerRoles: UserRole[] = ['Developer'];
  
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <ContactProvider>
            <OurStoryProvider>
              <SettingsProvider>
                <CartProvider>
                  <CategoryProvider>
                    <FaqProvider>
                      <RiderProvider>
                        <ProductProvider>
                          <OrderProvider>
                            <NotificationProvider>
                              <Routes>
                                {/* Admin login route - no layout */}
                                <Route path="/admin/login" element={<AdminLoginPage />} />

                                {/* Protected Admin routes with AdminLayout */}
                                <Route
                                  path="/admin"
                                  element={
                                    <ProtectedRoute>
                                      <AdminLayout />
                                    </ProtectedRoute>
                                  }
                                >
                                  <Route index element={<Navigate to="dashboard" replace />} />
                                  <Route path="dashboard" element={<ProtectedRoute allowedRoles={storeOwnerRoles}><AdminDashboardPage /></ProtectedRoute>} />
                                  <Route path="reports" element={<ProtectedRoute allowedRoles={storeOwnerRoles}><AdminReportsPage /></ProtectedRoute>} />
                                  <Route path="seo-report" element={<ProtectedRoute allowedRoles={storeOwnerRoles}><AdminSeoReportPage /></ProtectedRoute>} />
                                  <Route path="orders" element={<ProtectedRoute allowedRoles={storeOwnerRoles}><AdminOrdersPage /></ProtectedRoute>} />
                                  <Route path="products" element={<ProtectedRoute allowedRoles={storeOwnerRoles}><AdminProductsPage /></ProtectedRoute>} />
                                  <Route path="products/new" element={<ProtectedRoute allowedRoles={storeOwnerRoles}><AdminProductFormPage /></ProtectedRoute>} />
                                  <Route path="products/edit/:id" element={<ProtectedRoute allowedRoles={storeOwnerRoles}><AdminProductFormPage /></ProtectedRoute>} />
                                  <Route path="riders" element={<ProtectedRoute allowedRoles={storeOwnerRoles}><AdminRidersPage /></ProtectedRoute>} />
                                  <Route path="categories" element={<ProtectedRoute allowedRoles={storeOwnerRoles}><AdminCategoriesPage /></ProtectedRoute>} />

                                  <Route path="settings" element={<ProtectedRoute allowedRoles={developerRoles}><AdminSettingsPage /></ProtectedRoute>} />
                                  <Route path="image-generator" element={<ProtectedRoute allowedRoles={developerRoles}><AdminImageGeneratorPage /></ProtectedRoute>} />
                                  <Route path="faq" element={<ProtectedRoute allowedRoles={developerRoles}><AdminFaqPage /></ProtectedRoute>} />
                                  <Route path="contact" element={<ProtectedRoute allowedRoles={developerRoles}><AdminContactPage /></ProtectedRoute>} />
                                  <Route path="our-story" element={<ProtectedRoute allowedRoles={developerRoles}><AdminOurStoryPage /></ProtectedRoute>} />
                                </Route>

                                {/* Public routes with PublicLayout */}
                                <Route element={<PublicLayout />}>
                                  <Route path="/" element={<HomePage />} />
                                  <Route path="/products" element={<ProductsPage />} />
                                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                                  <Route path="/cart" element={<CartPage />} />
                                  <Route path="/about" element={<AboutPage />} />
                                  <Route path="/checkout" element={<CheckoutPage />} />
                                  <Route path="/payment-instructions/:orderId" element={<PaymentInstructionsPage />} />
                                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                                  <Route path="/track" element={<TrackOrderInputPage />} />
                                  <Route path="/track/:trackingId" element={<TrackOrderPage />} />
                                  <Route path="/orders-by-phone/:phone" element={<OrdersByPhonePage />} />
                                </Route>
                              </Routes>
                            </NotificationProvider>
                          </OrderProvider>
                        </ProductProvider>
                      </RiderProvider>
                    </FaqProvider>
                  </CategoryProvider>
                </CartProvider>
              </SettingsProvider>
            </OurStoryProvider>
          </ContactProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;