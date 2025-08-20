
import React, { useState, useMemo } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';
import { Link } from 'react-router-dom';
import { Banknote, Package, Receipt, ShoppingCart } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon }: { title: string; value: string | number; icon: React.ElementType }) => (
    <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg flex items-center space-x-4">
        <div className="bg-brand-secondary/10 dark:bg-dark-accent/10 p-4 rounded-full">
            <Icon className="h-8 w-8 text-brand-secondary dark:text-dark-accent" />
        </div>
        <div>
            <h3 className="text-lg font-semibold text-gray-500 dark:text-dark-subtext">{title}</h3>
            <p className="text-3xl font-bold text-brand-primary dark:text-dark-text">{value}</p>
        </div>
    </div>
);

const AdminReportsPage: React.FC = () => {
    const { orders } = useOrders();
    const { products } = useProducts();

    const [filter, setFilter] = useState('all');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const filteredSales = useMemo(() => {
        const successfulOrders = orders.filter(o => o.status === 'Delivered' && o.paymentStatus === 'Paid');

        if (filter === 'all') {
            return successfulOrders;
        }

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let startDate: Date;
        let endDate: Date;

        switch (filter) {
            case 'today':
                startDate = today;
                endDate = new Date(today);
                endDate.setDate(endDate.getDate() + 1);
                break;
            case 'yesterday':
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - 1);
                endDate = today;
                break;
            case 'week':
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - today.getDay());
                endDate = new Date(today);
                endDate.setDate(endDate.getDate() + 1);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setDate(endDate.getDate() + 1);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear() + 1, 0, 1);
                break;
            case 'custom':
                if (customStartDate && customEndDate) {
                    startDate = new Date(customStartDate);
                    endDate = new Date(customEndDate);
                    endDate.setDate(endDate.getDate() + 1);
                } else {
                    return [];
                }
                break;
            default:
                return successfulOrders;
        }

        return successfulOrders.filter(order => {
            const orderDate = new Date(order.orderDate);
            return orderDate >= startDate && orderDate < endDate;
        });

    }, [orders, filter, customStartDate, customEndDate]);

    const reportData = useMemo(() => {
        const totalRevenue = filteredSales.reduce((acc, order) => acc + order.total, 0);
        const unitsSold = filteredSales.reduce((acc, order) => acc + order.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0);
        const numberOfOrders = filteredSales.length;

        return { totalRevenue, unitsSold, numberOfOrders };
    }, [filteredSales]);

    const currentStockValue = useMemo(() => {
        return products.reduce((acc, product) => acc + (product.price * product.stock), 0);
    }, [products]);
    
    const inputStyles = "border-gray-300 rounded-md shadow-sm p-2 bg-gray-100 focus:border-brand-accent focus:ring-brand-accent focus:ring-opacity-50 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text";

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-dark-card p-6 rounded-lg shadow-lg">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <h2 className="text-xl font-serif font-bold text-brand-primary dark:text-dark-text">Sales & Stock Report</h2>
                    <div className="flex flex-wrap items-center gap-4">
                        <select
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className={inputStyles}
                        >
                            <option value="all">All Time</option>
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="year">This Year</option>
                            <option value="custom">Custom</option>
                        </select>
                        {filter === 'custom' && (
                            <div className="flex items-center gap-2">
                                <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className={inputStyles}/>
                                <span>to</span>
                                <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className={inputStyles}/>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`KSH ${Math.round(reportData.totalRevenue)}`} icon={Banknote} />
                <StatCard title="Units Sold" value={reportData.unitsSold} icon={ShoppingCart} />
                <StatCard title="Orders" value={reportData.numberOfOrders} icon={Receipt} />
                <StatCard title="Current Stock Value" value={`KSH ${Math.round(currentStockValue)}`} icon={Package} />
            </div>

            <div className="bg-white dark:bg-dark-card shadow-lg rounded-lg overflow-hidden">
                <h3 className="p-6 text-lg font-semibold text-brand-primary dark:text-dark-text border-b dark:border-dark-border">
                    Sales for Selected Period
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-border">
                         <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-dark-subtext uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-dark-card dark:divide-dark-border">
                            {filteredSales.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                                       <Link to={`/admin/orders`}>#{order.id}</Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{new Date(order.orderDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-text">{order.clientDetails.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-subtext">{order.items.reduce((acc, i) => acc + i.quantity, 0)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-dark-text">KSH {Math.round(order.total)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredSales.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-gray-500 dark:text-dark-subtext">No sales recorded for this period.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminReportsPage;
