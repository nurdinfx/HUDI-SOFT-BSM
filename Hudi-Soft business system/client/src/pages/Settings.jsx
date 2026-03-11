import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings } from '../store/slices/settingsSlice';
import { Globe, DollarSign, Bell, Shield, Save, Loader2, CheckCircle } from 'lucide-react';
import Button from '../components/Button';

const Settings = () => {
    const dispatch = useDispatch();
    const { data: settings, loading } = useSelector(state => state.settings);
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        companyName: '',
        currency: 'USD',
        taxRate: 0,
        timezone: 'UTC'
    });

    useEffect(() => {
        dispatch(fetchSettings());
    }, [dispatch]);

    useEffect(() => {
        if (settings) {
            setFormData({
                companyName: settings.companyName || '',
                currency: settings.currency || 'USD',
                taxRate: settings.taxRate || 0,
                timezone: settings.timezone || 'UTC',
                invoicePrefix: settings.invoicePrefix || 'INV-',
                lowStockAlert: settings.lowStockAlert !== undefined ? settings.lowStockAlert : true,
                backupEnabled: settings.backupEnabled !== undefined ? settings.backupEnabled : false
            });
        }
    }, [settings]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateSettings(formData));
        alert('Settings updated successfully!');
    };

    if (loading && !settings) {
        return (
            <div className="flex flex-col items-center justify-center py-40 text-secondary-400">
                <Loader2 className="animate-spin mb-2" size={40} />
                <p className="font-medium text-lg">Loading System Configuration...</p>
            </div>
        );
    }

    const tabs = [
        { id: 'general', name: 'General Config', icon: Globe },
        { id: 'financials', name: 'Financials', icon: DollarSign },
        { id: 'notifications', name: 'Notifications', icon: Bell },
        { id: 'security', name: 'Security', icon: Shield },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="card p-8 space-y-8 glass transition-all overflow-hidden">
                        <div className="space-y-3">
                            <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Company Name</label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                className="w-full px-5 py-4 bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-2xl focus:ring-4 ring-primary-500/10 focus:border-primary-500 outline-none transition-all text-lg font-bold text-secondary-900 dark:text-white"
                                placeholder="Enter your company name"
                            />
                            <p className="text-[10px] text-secondary-400 italic">This name will appear on all reports and invoices.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Base Currency</label>
                                <select
                                    value={formData.currency}
                                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                    className="w-full px-5 py-4 bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-2xl focus:ring-4 ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-secondary-900 dark:text-white"
                                >
                                    <option value="USD">USD ($)</option>
                                    <option value="EUR">EUR (€)</option>
                                    <option value="GBP">GBP (£)</option>
                                    <option value="KES">KES (Sh)</option>
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">System Timezone</label>
                                <select
                                    value={formData.timezone}
                                    onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                                    className="w-full px-5 py-4 bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-2xl focus:ring-4 ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-secondary-900 dark:text-white"
                                >
                                    <option value="UTC">UTC (Universal Coordinated Time)</option>
                                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'financials':
                return (
                    <div className="card p-8 space-y-8 glass transition-all overflow-hidden">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Default Tax Rate (%)</label>
                                <input
                                    type="number"
                                    value={formData.taxRate}
                                    onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })}
                                    className="w-full px-5 py-4 bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-2xl focus:ring-4 ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-secondary-900 dark:text-white"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-secondary-400 uppercase tracking-widest">Invoice Prefix</label>
                                <input
                                    type="text"
                                    value={formData.invoicePrefix}
                                    onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                                    className="w-full px-5 py-4 bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-2xl focus:ring-4 ring-primary-500/10 focus:border-primary-500 outline-none transition-all font-bold text-secondary-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 'notifications':
                return (
                    <div className="card p-8 space-y-8 glass transition-all overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-2xl">
                            <div>
                                <h4 className="font-bold text-secondary-900 dark:text-white uppercase tracking-wider text-xs">Low Stock Alerts</h4>
                                <p className="text-[10px] text-secondary-400">Receive notifications when items reach their threshold.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.lowStockAlert}
                                    onChange={(e) => setFormData({ ...formData, lowStockAlert: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                );
            case 'security':
                return (
                    <div className="card p-8 space-y-8 glass transition-all overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-2xl">
                            <div>
                                <h4 className="font-bold text-secondary-900 dark:text-white uppercase tracking-wider text-xs">Automated Backups</h4>
                                <p className="text-[10px] text-secondary-400">Enable daily encrypted backups to secure storage.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.backupEnabled}
                                    onChange={(e) => setFormData({ ...formData, backupEnabled: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                            </label>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-3xl font-bold text-secondary-900 dark:text-white font-display uppercase tracking-tight">System Settings</h2>
                <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">Configure global system parameters, business rules, and security preferences.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                    <nav className="flex flex-col gap-2 p-1 bg-secondary-50 dark:bg-secondary-900/50 rounded-2xl border border-secondary-100 dark:border-secondary-800 sticky top-24">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-bold text-[10px] transition-all text-left uppercase tracking-widest ${activeTab === tab.id
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 active:scale-95'
                                        : 'text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                                        }`}
                                >
                                    <Icon size={14} /> {tab.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="md:col-span-3">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {renderTabContent()}

                        <div className="flex justify-end pt-4">
                            <Button type="submit" variant="primary" icon={Save} className="px-10 py-4 text-xs uppercase tracking-widest font-black shadow-2xl shadow-primary-500/40 hover:-translate-y-1 active:translate-y-0 transition-all">
                                Save Settings
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
