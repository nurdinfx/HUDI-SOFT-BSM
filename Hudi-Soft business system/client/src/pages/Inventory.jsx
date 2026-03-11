import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory, updateStock, initializeInventory } from '../store/slices/inventorySlice';
import { fetchBranches } from '../store/slices/branchSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { Package, AlertCircle, History, Search, Loader2, X, ArrowUpCircle, ArrowDownCircle, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';

const StockAdjustmentModal = ({ isOpen, onClose, item, onSubmit }) => {
    const [adjustment, setAdjustment] = useState({
        type: 'IN', // IN or OUT
        quantity: 0,
        reason: ''
    });

    if (!isOpen || !item) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newQuantity = adjustment.type === 'IN'
            ? item.quantity + Number(adjustment.quantity)
            : item.quantity - Number(adjustment.quantity);

        onSubmit({ quantity: newQuantity });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">Adjust Stock</h3>
                <p className="text-secondary-500 text-sm mb-6">Current: <span className="font-bold text-primary-600">{item.quantity} {item.product?.unit}</span> of {item.product?.name}</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex gap-2 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-xl">
                        <button
                            type="button"
                            onClick={() => setAdjustment({ ...adjustment, type: 'IN' })}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${adjustment.type === 'IN' ? 'bg-white dark:bg-secondary-700 text-green-600 shadow-sm' : 'text-secondary-500'}`}
                        >
                            <ArrowUpCircle size={18} /> Stock In
                        </button>
                        <button
                            type="button"
                            onClick={() => setAdjustment({ ...adjustment, type: 'OUT' })}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-bold text-sm transition-all ${adjustment.type === 'OUT' ? 'bg-white dark:bg-secondary-700 text-red-600 shadow-sm' : 'text-secondary-500'}`}
                        >
                            <ArrowDownCircle size={18} /> Stock Out
                        </button>
                    </div>

                    <Input
                        label="Quantity to Adjust"
                        type="number"
                        min="1"
                        value={adjustment.quantity}
                        onChange={(e) => setAdjustment({ ...adjustment, quantity: e.target.value })}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary-900 dark:text-white">Reason / Note</label>
                        <textarea
                            className="w-full px-4 py-3 border dark:border-secondary-800 dark:bg-secondary-900 rounded-xl focus:ring-2 ring-primary-500 outline-none text-sm transition-all min-h-[100px]"
                            placeholder="e.g. Restock from supplier, Damaged goods..."
                            value={adjustment.reason}
                            onChange={(e) => setAdjustment({ ...adjustment, reason: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">Apply Adjustment</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const QuickInitializeModal = ({ isOpen, onClose, products = [], currentBranch, onSubmit }) => {
    const [formData, setFormData] = useState({
        product: '',
        quantity: 0
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">Initialize Stock</h3>

                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary-700 dark:text-secondary-300">Select Product</label>
                        <select
                            className="w-full px-4 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 transition-all text-secondary-900 dark:text-white"
                            value={formData.product}
                            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                            required
                        >
                            <option value="" className="dark:bg-secondary-900">Select a product...</option>
                            {products.map(p => (
                                <option key={p._id} value={p._id} className="dark:bg-secondary-900">{p.name} ({p.sku})</option>
                            ))}
                        </select>
                    </div>

                    <Input
                        label="Initial Quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                        required
                    />

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">Initialize</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Inventory = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { items: inventory, loading } = useSelector(state => state.inventory);
    const { items: branches } = useSelector(state => state.branches);
    const { items: products } = useSelector(state => state.products);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState(user?.role === 'SUPER_ADMIN' ? '' : user?.branch);
    const [adjustModalOpen, setAdjustModalOpen] = useState(false);
    const [initModalOpen, setInitModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const searchFromUrl = queryParams.get('search');
        if (searchFromUrl) {
            setSearchTerm(searchFromUrl);
        }
        dispatch(fetchInventory({ branch: selectedBranch }));
        dispatch(fetchProducts());
        if (user?.role === 'SUPER_ADMIN' && branches.length === 0) {
            dispatch(fetchBranches());
        }
    }, [dispatch, selectedBranch, user, branches.length]);

    const handleAdjustOpen = (item) => {
        setSelectedItem(item);
        setAdjustModalOpen(true);
    };

    const handleAdjustSubmit = async (data) => {
        const result = await dispatch(updateStock({ id: selectedItem._id, data }));
        if (updateStock.fulfilled.match(result)) {
            setAdjustModalOpen(false);
            setSelectedItem(null);
            setSuccessMessage('Stock adjusted successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    const handleInitSubmit = async (data) => {
        const branchToUse = selectedBranch || user?.branch;
        if (!branchToUse) {
            alert('Please select a branch first');
            return;
        }

        const result = await dispatch(initializeInventory({ ...data, branch: branchToUse }));
        if (initializeInventory.fulfilled.match(result)) {
            setInitModalOpen(false);
            setSuccessMessage('Product initialized in inventory!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }
    };

    // Filter products that are NOT already in the shown inventory
    const uninitializedProducts = products.filter(p =>
        !inventory.some(inv => inv.product?._id === p._id)
    );

    const filteredInventory = inventory.filter(item =>
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product?.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const lowStockCount = inventory.filter(item => item.quantity <= item.lowStockThreshold).length;

    return (
        <div className="space-y-6">
            {successMessage && (
                <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle size={20} />
                    <span className="font-bold text-sm">{successMessage}</span>
                </div>
            )}

            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-secondary-900 dark:text-white uppercase tracking-tight">Inventory Management</h2>
                    <p className="text-secondary-500 text-sm">Track and manage stock across all branches.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary" icon={History}>History</Button>
                    <Button variant="primary" icon={Package} onClick={() => setInitModalOpen(true)}>Initialize Stock</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card p-6 border-l-4 border-primary-500">
                    <p className="text-secondary-400 text-xs font-bold uppercase">Total Items</p>
                    <h3 className="text-2xl font-bold mt-1 dark:text-white">{inventory.length}</h3>
                </div>
                <div className="card p-6 border-l-4 border-amber-500">
                    <p className="text-secondary-400 text-xs font-bold uppercase">Low Stock Alert</p>
                    <h3 className="text-2xl font-bold mt-1 text-amber-600 font-display">{lowStockCount} Items</h3>
                </div>
                <div className="card p-6 border-l-4 border-red-500">
                    <p className="text-secondary-400 text-xs font-bold uppercase">Branch Monitoring</p>
                    <h3 className="text-2xl font-bold mt-1 text-red-600 font-display">{user?.role === 'SUPER_ADMIN' ? (selectedBranch ? 'Single Branch' : 'All Branches') : 'Current Branch'}</h3>
                </div>
            </div>

            <div className="card overflow-hidden">
                <div className="p-6 border-b border-secondary-100 dark:border-secondary-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-secondary-50/50 dark:bg-secondary-900/50">
                    <h3 className="font-bold dark:text-white">Stock List</h3>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-2.5 text-secondary-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search product..."
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl text-sm outline-none focus:ring-2 ring-primary-500 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        {user?.role === 'SUPER_ADMIN' && (
                            <select
                                className="px-4 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl text-sm outline-none focus:ring-2 ring-primary-500 transition-all text-secondary-600"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="">All Branches</option>
                                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                            </select>
                        )}
                    </div>
                </div>

                {loading && inventory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-secondary-400">
                        <Loader2 className="animate-spin mb-2" size={40} />
                        <p className="font-medium">Loading inventory...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-secondary-50 dark:bg-secondary-800 text-secondary-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Branch</th>
                                    <th className="px-6 py-4">Quantity</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                                {filteredInventory.map((item) => (
                                    <tr key={item._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-secondary-900 dark:text-white uppercase">{item.product?.name}</p>
                                            <p className="text-[10px] text-secondary-400 font-mono tracking-tighter">SKU: {item.product?.sku}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondary-600 dark:text-secondary-400">{item.branch?.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-secondary-900 dark:text-white">{item.quantity}</span>
                                            <span className="ml-1 text-[10px] text-secondary-400 font-bold uppercase">{item.product?.unit}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {item.quantity <= item.lowStockThreshold ? (
                                                <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-bold rounded-full uppercase tracking-wider">Low Stock</span>
                                            ) : (
                                                <span className="px-3 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-wider">In Stock</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleAdjustOpen(item)}
                                                className="px-4 py-2 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg font-bold text-sm transition-colors"
                                            >
                                                Adjust Stock
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredInventory.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-20 text-center text-secondary-400">
                                            <Package size={48} className="mx-auto mb-4 opacity-20" />
                                            <p className="font-bold text-lg">No inventory records found.</p>
                                            <p className="text-sm">Try adjusting your filters or search term.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <StockAdjustmentModal
                isOpen={adjustModalOpen}
                onClose={() => setAdjustModalOpen(false)}
                item={selectedItem}
                onSubmit={handleAdjustSubmit}
            />

            <QuickInitializeModal
                isOpen={initModalOpen}
                onClose={() => setInitModalOpen(false)}
                products={uninitializedProducts}
                onSubmit={handleInitSubmit}
            />
        </div>
    );
};

export default Inventory;
