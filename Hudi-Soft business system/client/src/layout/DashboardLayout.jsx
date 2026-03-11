import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import {
    LayoutDashboard,
    Store,
    Package,
    ShoppingCart,
    Users,
    Truck,
    CreditCard,
    UserCheck,
    TrendingUp,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Database,
    Receipt,
    UserCog,
    ShieldCheck,
    FileText,
    Bell,
    Search,
    User,
    Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavSection = ({ title, collapsed }) => (
    <div className={`mt-6 mb-2 px-4 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
            <div className="h-px w-8 bg-secondary-200 dark:bg-secondary-800" />
        ) : (
            <span className="text-[10px] uppercase tracking-widest font-bold text-secondary-400 dark:text-secondary-500 px-2">
                {title}
            </span>
        )}
    </div>
);

const SidebarItem = ({ icon: Icon, label, path, active, collapsed }) => (
    <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative mb-1 ${active
            ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
            : 'text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-white'
            }`}
    >
        <div className="flex items-center justify-center min-w-[24px]">
            <Icon size={20} strokeWidth={active ? 2.5 : 2} className={active ? '' : 'group-hover:scale-110 group-hover:text-primary-500 transition-all'} />
        </div>
        {!collapsed && (
            <span className={`font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${active ? 'opacity-100 translate-x-0' : 'opacity-80 group-hover:opacity-100'}`}>
                {label}
            </span>
        )}
        {active && !collapsed && (
            <motion.div
                layoutId="active-pill"
                className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white"
                initial={false}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
        )}
        {collapsed && (
            <div className="absolute left-full ml-4 px-2 py-1 bg-secondary-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 transition-all z-50 whitespace-nowrap">
                {label}
            </div>
        )}
    </Link>
);

const DashboardLayout = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navSections = [
        {
            title: 'Overview',
            items: [
                { name: 'Dashboard', path: '/', icon: LayoutDashboard },
                { name: 'Reports', path: '/reports', icon: TrendingUp, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER'] },
            ]
        },
        {
            title: 'Sell & Transactions',
            items: [
                { name: 'POS Terminal', path: '/pos', icon: ShoppingCart },
                { name: 'Sales History', path: '/sales', icon: Receipt, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER', 'CASHIER'] },
                { name: 'Expenses', path: '/expenses', icon: CreditCard, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER'] },
            ]
        },
        {
            title: 'Stock & Logistics',
            items: [
                { name: 'Product Catalog', path: '/products', icon: Package, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER', 'STOCK_MANAGER'] },
                { name: 'Categories', path: '/categories', icon: Tag, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER', 'STOCK_MANAGER'] },
                { name: 'Purchases', path: '/purchases', icon: FileText, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER', 'STOCK_MANAGER'] },
                { name: 'Inventory', path: '/inventory', icon: Database, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER', 'STOCK_MANAGER'] },
                { name: 'Suppliers', path: '/suppliers', icon: Truck, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER'] },
            ]
        },
        {
            title: 'Management',
            items: [
                { name: 'Customers', path: '/customers', icon: UserCheck, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER', 'CASHIER'] },
                { name: 'Staff Members', path: '/staff', icon: Users, roles: ['SUPER_ADMIN', 'BRANCH_MANAGER'] },
                { name: 'Branches', path: '/branches', icon: Store, roles: ['SUPER_ADMIN'] },
            ]
        },
        {
            title: 'Administration',
            items: [
                { name: 'Users & Roles', path: '/users', icon: UserCog, roles: ['SUPER_ADMIN'] },
                { name: 'System Settings', path: '/settings', icon: Settings, roles: ['SUPER_ADMIN'] },
                { name: 'Audit Log', path: '/audit', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
            ]
        }
    ];

    const isAuthorized = (item) => !item.roles || item.roles.includes(user?.role);

    return (
        <div className="flex h-screen overflow-hidden bg-secondary-50 dark:bg-secondary-950 font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: collapsed ? 84 : 280 }}
                className="bg-white dark:bg-secondary-900 border-r border-secondary-200 dark:border-secondary-800 flex flex-col z-40 relative shadow-sm"
            >
                <div className="h-20 flex items-center px-6 justify-between border-b border-secondary-100 dark:border-secondary-800/50">
                    <AnimatePresence mode="wait">
                        {!collapsed ? (
                            <motion.div
                                key="logo-full"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-2"
                            >
                                <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 text-white">
                                    <Store size={20} />
                                </div>
                                <span className="text-xl font-display font-bold text-secondary-900 dark:text-white tracking-tight">Hudi-Soft</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="logo-mini"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center mx-auto shadow-lg shadow-primary-500/20 text-white"
                            >
                                <Store size={24} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            className="p-1.5 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg text-secondary-400 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pt-4 pb-10 custom-scrollbar px-3">
                    {navSections.map((section, idx) => {
                        const accessibleItems = section.items.filter(isAuthorized);
                        if (accessibleItems.length === 0) return null;

                        return (
                            <div key={idx}>
                                <NavSection title={section.title} collapsed={collapsed} />
                                {accessibleItems.map((item) => (
                                    <SidebarItem
                                        key={item.path}
                                        icon={item.icon}
                                        label={item.name}
                                        path={item.path}
                                        active={location.pathname === item.path}
                                        collapsed={collapsed}
                                    />
                                ))}
                            </div>
                        );
                    })}
                </div>

                {collapsed && (
                    <button
                        onClick={() => setCollapsed(false)}
                        className="mx-auto mb-6 p-2 bg-secondary-100 dark:bg-secondary-800 rounded-full text-secondary-500 hover:text-primary-600 transition-colors"
                    >
                        <ChevronRight size={16} />
                    </button>
                )}

                <div className="p-4 border-t border-secondary-100 dark:border-secondary-800">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all font-semibold ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span>Sign Out</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Navbar */}
                <header className="h-20 sticky top-0 z-30 bg-white/80 dark:bg-secondary-900/80 backdrop-blur-md border-b border-secondary-200 dark:border-secondary-800 px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-display font-bold text-secondary-900 dark:text-white capitalize">
                            {location.pathname === '/' ? 'Overview' : location.pathname.substring(1).replace('/', ' · ')}
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 bg-secondary-100 dark:bg-secondary-800 px-4 py-2 rounded-full border border-secondary-200 dark:border-secondary-700 focus-within:ring-2 focus-within:ring-primary-500/50 transition-all">
                            <Search size={16} className="text-secondary-400" />
                            <input
                                type="text"
                                placeholder="Search everything..."
                                className="bg-transparent border-none outline-none text-sm w-48 text-secondary-900 dark:text-white"
                            />
                        </div>

                        <button className="p-2 text-secondary-400 hover:text-secondary-900 dark:hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-secondary-900"></span>
                        </button>

                        <div className="h-8 w-px bg-secondary-200 dark:bg-secondary-800 mx-1"></div>

                        <div className="flex items-center gap-3 group cursor-pointer">
                            <div className="flex flex-col text-right">
                                <span className="text-sm font-bold text-secondary-900 dark:text-white group-hover:text-primary-600 transition-colors">
                                    {user?.name || 'Admin User'}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-600">
                                    {user?.role?.replace('_', ' ') || 'Super Admin'}
                                </span>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                                {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
