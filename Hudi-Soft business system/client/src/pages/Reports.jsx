import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardStats, fetchBranchPerformance, fetchTimeSeries } from '../store/slices/reportSlice';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, ArrowUpRight, Loader2 } from 'lucide-react';

const Reports = () => {
    const dispatch = useDispatch();
    const { dashboard, branchPerformance, timeSeries, loading } = useSelector(state => state.reports);

    useEffect(() => {
        dispatch(fetchDashboardStats());
        dispatch(fetchBranchPerformance());
        dispatch(fetchTimeSeries());
    }, [dispatch]);

    // Format branch data for chart
    const formattedBranchData = branchPerformance.map(item => ({
        name: item.branchDetails.name,
        sales: item.totalSales
    }));

    if (loading && !dashboard) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-secondary-400 gap-4">
                <Loader2 className="animate-spin" size={48} />
                <p className="text-lg font-medium">Generating reports...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card p-6 border-l-4 border-primary-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-green-500 text-xs font-bold flex items-center gap-1 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded-full">
                            +12% <ArrowUpRight size={14} />
                        </span>
                    </div>
                    <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-1">Total Revenue</h4>
                    <p className="text-3xl font-display font-bold text-secondary-900 dark:text-white">
                        ${dashboard?.revenue?.toLocaleString() || '0'}
                    </p>
                </div>

                <div className="card p-6 border-l-4 border-amber-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 flex items-center justify-center">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-1">Total Expenses</h4>
                    <p className="text-3xl font-display font-bold text-secondary-900 dark:text-white">
                        ${dashboard?.expenses?.toLocaleString() || '0'}
                    </p>
                </div>

                <div className="card p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-600 flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-1">Net Profit</h4>
                    <p className="text-3xl font-display font-bold text-secondary-900 dark:text-white">
                        ${dashboard?.profit?.toLocaleString() || '0'}
                    </p>
                </div>

                <div className="card p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 flex items-center justify-center">
                            <Users size={24} />
                        </div>
                    </div>
                    <h4 className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-1">Total Transactions</h4>
                    <p className="text-3xl font-display font-bold text-secondary-900 dark:text-white">
                        {dashboard?.salesCount || '0'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card p-8 group">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-secondary-900 dark:text-white">Sales vs Expenses</h3>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                                <span className="text-xs font-bold text-secondary-500 uppercase">Sales</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                <span className="text-xs font-bold text-secondary-500 uppercase">Expenses</span>
                            </div>
                        </div>
                    </div>
                    <div className="min-h-[400px] relative" style={{ minHeight: '400px' }}>
                        <ResponsiveContainer width="100%" height={400}>
                            <AreaChart data={timeSeries}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ stroke: '#2563eb', strokeWidth: 2 }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#2563eb" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} dot={{ r: 4, fill: '#2563eb' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                <Area type="monotone" dataKey="expenses" stroke="#f59e0b" fillOpacity={0} strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card p-8">
                    <h3 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Branch Performance</h3>
                    <div className="min-h-[400px] relative" style={{ minHeight: '400px' }}>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={formattedBranchData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
