import React, { useState, useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';
import { Notification } from '../types';
import { Link } from 'react-router-dom';
import { useNotification } from '../App';
import { Banknote, Hourglass, Package, Receipt } from 'lucide-react';


const StatCard = ({ title, value, icon: Icon, linkTo, gradient }: { title: string; value: string | number; icon: React.ElementType; linkTo?: string; gradient: string }) => {
    const content = (
         <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-md border border-transparent dark:border-dark-border/50 hover:border-brand-secondary/20 dark:hover:border-dark-accent/30 transition-all duration-300 transform hover:-translate-y-1 group">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">{title}</p>
                    <p className="text-3xl font-bold text-brand-primary dark:text-dark-text mt-2">{value}</p>
                </div>
                <div className={`p-4 rounded-lg ${gradient} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                </div>
            </div>
        </div>
    );

    if (linkTo) {
        return <Link to={linkTo} className="block">{content}</Link>;
    }
    return <div>{content}</div>;
}


const AdminDashboardPage: React.FC = () => {
    const { orders } = useOrders();
    const { products } = useProducts();
    const { notification, updateNotification } = useNotification();
    
    const [localNotification, setLocalNotification] = useState<Notification>(notification);
    const [isNotificationSaved, setIsNotificationSaved] = useState(false);

    useEffect(() => {
        setLocalNotification(notification);
    }, [notification]);
    
    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.currentTarget;
        const name = target.name;
        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            setLocalNotification(prev => ({
                ...prev,
                [name]: target.checked
            }));
        } else {
            setLocalNotification(prev => ({
                ...prev,
                [name]: target.value
            }));
        }
    };

    const handleNotificationSave = () => {
        updateNotification(localNotification);
        setIsNotificationSaved(true);
        setTimeout(() => setIsNotificationSaved(false), 2000);
    };

    const totalSales = orders.reduce((acc, order) => (order.status === 'Delivered' && order.paymentStatus === 'Paid') ? acc + order.total : acc, 0);
    const pendingOrdersCount = orders.filter(o => o.status === 'Processing' || o.status === 'Out for Delivery' || o.status === 'Pending Payment').length;

    const inputStyles = "mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring focus:ring-brand-accent focus:ring-opacity-50 transition-all duration-200 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";

    return (
        <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <StatCard title="Total Sales" value={`KSH ${Math.round(totalSales)}`} icon={Banknote} gradient="bg-gradient-to-br from-green-500 to-green-400" />
                 <StatCard title="Pending Orders" value={pendingOrdersCount} icon={Hourglass} linkTo="/admin/orders" gradient="bg-gradient-to-br from-yellow-500 to-yellow-400" />
                 <StatCard title="Total Products" value={products.length} icon={Package} linkTo="/admin/products" gradient="bg-gradient-to-br from-blue-500 to-blue-400" />
                 <StatCard title="Total Orders" value={orders.length} icon={Receipt} linkTo="/admin/orders" gradient="bg-gradient-to-br from-indigo-500 to-indigo-400" />
            </div>
            
            {/* Notification Management Panel */}
            <div className="bg-white dark:bg-dark-card shadow-md border dark:border-dark-border/50 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4 pb-4 border-b dark:border-dark-border">
                    <div>
                        <h2 className="text-xl font-serif font-bold text-brand-primary dark:text-dark-text">Sales Notification Popup</h2>
                        <p className="text-sm text-gray-500 dark:text-dark-subtext mt-1">Control the promotional popup shown to users.</p>
                    </div>
                    <label htmlFor="isActive" className="flex items-center cursor-pointer">
                        <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">Activate</span>
                        <div className="relative">
                            <input type="checkbox" id="isActive" name="isActive" className="sr-only" checked={localNotification.isActive} onChange={handleNotificationChange} />
                            <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                            <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${localNotification.isActive ? 'transform translate-x-6 bg-green-400' : ''}`}></div>
                        </div>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Title</label>
                        <input type="text" name="title" id="title" value={localNotification.title} onChange={handleNotificationChange} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Message</label>
                        <input type="text" name="message" id="message" value={localNotification.message} onChange={handleNotificationChange} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="linkLabel" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Button Label</label>
                        <input type="text" name="linkLabel" id="linkLabel" value={localNotification.linkLabel} onChange={handleNotificationChange} className={inputStyles} />
                    </div>
                    <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Button Link (e.g., /products)</label>
                        <input type="text" name="link" id="link" value={localNotification.link} onChange={handleNotificationChange} className={inputStyles} />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="displayType" className="block text-sm font-medium text-gray-700 dark:text-dark-subtext">Display Style</label>
                        <select
                            name="displayType"
                            id="displayType"
                            value={localNotification.displayType || 'popup'}
                            onChange={handleNotificationChange}
                            className={inputStyles}
                        >
                            <option value="popup">Bottom-right Popup</option>
                            <option value="modal">Center Modal</option>
                        </select>
                    </div>
                </div>
                 <div className="mt-6 flex justify-end">
                    <button onClick={handleNotificationSave} className={`py-2 px-6 font-semibold rounded-md text-white transition-colors ${isNotificationSaved ? 'bg-green-500' : 'bg-brand-primary hover:bg-brand-secondary dark:bg-dark-accent dark:text-dark-bg dark:hover:bg-opacity-90'}`}>
                        {isNotificationSaved ? 'Saved!' : 'Save Notification'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;