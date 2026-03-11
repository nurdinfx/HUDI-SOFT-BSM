import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, fetchTimeSeries } from '../store/slices/reportSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, ShoppingBag, CreditCard, ArrowUpRight, ArrowDownRight, MoreVertical, Loader2 } from 'lucide-react';
import Button from '../components/Button';

const Overview = () => {
    const dispatch = useDispatch();
    const { dashboard, timeSeries, loading } = useSelector(state => state.reports);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchTimeSeries());
    }, [dispatch]);

    const stats = [
        { title: 'Total Revenue', value: `$${dashboard?.revenue?.toLocaleString() || '0'}`, trend: '+12.5%', isUp: true, icon: TrendingUp, color: 'text-primary-600', bg: 'bg-primary-50' },
        { title: 'Active Customers', value: dashboard?.activeCustomers?.toLocaleString() || '0', trend: '+5.2%', isUp: true, icon: Users, color: 'text-green-600', bg: 'bg-green-50' },
        { title: 'Total Sales', value: dashboard?.salesCount?.toLocaleString() || '0', trend: '-2.4%', isUp: false, icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
        { title: 'Net Profit', value: `$${dashboard?.profit?.toLocaleString() || '0'}`, trend: '+8.1%', isUp: true, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];

    if (loading && !dashboard) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-secondary-400 gap-4">
                <Loader2 className="animate-spin" size={48} />
                <p className="text-lg font-medium">Loading Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="card p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <span className={`flex items-center gap-1 text-xs font-bold ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trend}
                                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            </span>
                        </div>
                        <div>
                            <p className="text-secondary-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                            <h3 className="text-3xl font-display font-bold text-secondary-900 dark:text-white">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Revenue Overview</h3>
                            <p className="text-secondary-400 text-sm">Monthly sales performance</p>
                        </div>
                        <Button variant="secondary" className="text-xs px-3">View Report</Button>
                    </div>
                    <div className="min-h-[400px] w-full min-w-0 relative" style={{ minHeight: '400px' }}>
                        {timeSeries && timeSeries.length > 0 ? (
                            <ResponsiveContainer width="100%" height={400}>
                                <AreaChart data={timeSeries}>
                                    <defs>
                                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="#2563eb"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorRevenue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-secondary-300">
                                <p>No data available for chart</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="card p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Recent Sales</h3>
                        <MoreVertical size={20} className="text-secondary-400 cursor-pointer" />
                    </div>
                    <div className="flex-1 space-y-6">
                        {dashboard?.recentSales?.length > 0 ? (
                            dashboard.recentSales.map((sale) => (
                                <div key={sale._id} className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-900 dark:text-white font-bold group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors uppercase">
                                        {(sale.customer?.name || 'Walk-in').substring(0, 2)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-secondary-900 dark:text-white truncate">
                                            {sale.customer?.name || 'Walk-in Customer'}
                                        </p>
                                        <p className="text-xs text-secondary-400">
                                            {new Date(sale.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <span className="font-bold text-secondary-900 dark:text-white">
                                        +${sale.totalAmount?.toLocaleString()}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-secondary-300 opacity-50">
                                <ShoppingBag size={48} className="mb-2" />
                                <p>No sales today</p>
                            </div>
                        )}
                    </div>
                    <Button variant="ghost" className="w-full mt-8 text-primary-600">View All Sales</Button>
                </div>
            </div>
        </div>
    );
};

export default Overview;
