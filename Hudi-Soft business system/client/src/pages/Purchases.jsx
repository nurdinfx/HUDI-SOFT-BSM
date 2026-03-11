import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPurchases, createPurchase, receivePurchase, deletePurchase } from '../store/slices/purchaseSlice';
import { fetchSuppliers } from '../store/slices/supplierSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchBranches } from '../store/slices/branchSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { Search, Plus, FileText, Calendar, CheckCircle, Clock, MoreVertical, X, Loader2, Trash2, Package, Tag } from 'lucide-react';

const PurchaseModal = ({ isOpen, onClose, onSubmit }) => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { items: suppliers } = useSelector(state => state.suppliers);
    const { items: products } = useSelector(state => state.products);
    const { items: branches } = useSelector(state => state.branches);

    const [formData, setFormData] = useState({
        supplier: '',
        branch: user?.role === 'SUPER_ADMIN' ? '' : user?.branch,
        items: [],
    });

    const [currentItem, setCurrentItem] = useState({ product: '', quantity: 1, costPrice: 0 });

    useEffect(() => {
        dispatch(fetchSuppliers());
        dispatch(fetchProducts());
        if (user?.role === 'SUPER_ADMIN') {
            dispatch(fetchBranches());
        }
    }, [dispatch, user]);

    const addItem = () => {
        if (!currentItem.product || currentItem.quantity <= 0) return;
        const product = products.find(p => p._id === currentItem.product);
        setFormData({
            ...formData,
            items: [...formData.items, { ...currentItem, name: product.name, total: currentItem.quantity * currentItem.costPrice }]
        });
        setCurrentItem({ product: '', quantity: 1, costPrice: 0 });
    };

    const removeItem = (index) => {
        setFormData({ ...formData, items: formData.items.filter((_, i) => i !== index) });
    };

    const totalAmount = formData.items.reduce((acc, item) => acc + item.total, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.supplier || formData.items.length === 0) return;
        if (user?.role === 'SUPER_ADMIN' && !formData.branch) {
            alert('Please select a branch');
            return;
        }
        onSubmit({ ...formData, totalAmount });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">Create Purchase Order</h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 ml-1">Supplier</label>
                            <select
                                className="w-full px-4 py-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                required
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                            </select>
                        </div>

                        {user?.role === 'SUPER_ADMIN' && (
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 ml-1">Assign to Branch</label>
                                <select
                                    className="w-full px-4 py-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                    value={formData.branch}
                                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                    required
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-xl border border-secondary-100 dark:border-secondary-800">
                        <h4 className="font-bold text-sm text-secondary-900 dark:text-white">Add Items</h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            <div className="md:col-span-2">
                                <select
                                    className="w-full px-4 py-2 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-lg outline-none text-sm"
                                    value={currentItem.product}
                                    onChange={(e) => setCurrentItem({ ...currentItem, product: e.target.value })}
                                >
                                    <option value="">Select Product</option>
                                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                                </select>
                            </div>
                            <Input placeholder="Qty" type="number" value={currentItem.quantity} onChange={(e) => setCurrentItem({ ...currentItem, quantity: Number(e.target.value) })} />
                            <Input placeholder="Cost" type="number" step="0.01" value={currentItem.costPrice} onChange={(e) => setCurrentItem({ ...currentItem, costPrice: Number(e.target.value) })} />
                        </div>
                        <Button type="button" variant="secondary" className="w-full py-2" onClick={addItem}>Add to List</Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-secondary-100 dark:border-secondary-800 text-secondary-500 font-bold">
                                    <th className="py-2">Item</th>
                                    <th className="py-2">Qty</th>
                                    <th className="py-2">Cost</th>
                                    <th className="py-2 text-right">Total</th>
                                    <th className="py-2"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-50 dark:divide-secondary-800">
                                {formData.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="py-2 font-medium text-secondary-900 dark:text-white">{item.name}</td>
                                        <td className="py-2">{item.quantity}</td>
                                        <td className="py-2">${item.costPrice}</td>
                                        <td className="py-2 text-right font-bold">${item.total.toLocaleString()}</td>
                                        <td className="py-2 text-right">
                                            <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-secondary-200 dark:border-secondary-700">
                        <span className="text-lg font-bold text-secondary-900 dark:text-white">Total Amount:</span>
                        <span className="text-2xl font-bold text-primary-600">${totalAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1" disabled={formData.items.length === 0}>Create PO</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Purchases = () => {
    const dispatch = useDispatch();
    const { items: purchases, loading } = useSelector(state => state.purchases);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchPurchases());
    }, [dispatch]);

    const handleCreatePurchase = (data) => {
        dispatch(createPurchase(data));
        setIsModalOpen(false);
    };

    const handleReceive = (id) => {
        if (window.confirm('Mark these goods as received? This will update inventory.')) {
            dispatch(receivePurchase(id));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this purchase order?')) {
            dispatch(deletePurchase(id));
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'RECEIVED': return 'bg-green-100 text-green-600';
            case 'ORDERED': return 'bg-blue-100 text-blue-600';
            case 'PENDING': return 'bg-amber-100 text-amber-600';
            default: return 'bg-secondary-100 text-secondary-600';
        }
    };

    const filteredPurchases = purchases.filter(p =>
        p.purchaseOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.supplier?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Purchase Orders</h3>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search POs..."
                            className="w-full pl-10 pr-4 py-2 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none text-sm bg-white dark:bg-secondary-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <Plus size={20} />
                        Create Order
                    </Button>
                </div>
            </div>

            <div className="card overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-secondary-400 gap-4">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading ledger...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-secondary-50 dark:bg-secondary-800 text-secondary-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">PO Number</th>
                                    <th className="px-6 py-4">Supplier</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                                {filteredPurchases.map((purchase) => (
                                    <tr key={purchase._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center">
                                                    <FileText size={20} />
                                                </div>
                                                <span className="font-bold text-secondary-900 dark:text-white">{purchase.purchaseOrderNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondary-600 font-medium">{purchase.supplier?.name}</td>
                                        <td className="px-6 py-4 text-secondary-500 text-sm">
                                            {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-secondary-900 dark:text-white">
                                            ${purchase.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(purchase.status)}`}>
                                                {purchase.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {purchase.status !== 'RECEIVED' ? (
                                                    <>
                                                        <Button onClick={() => handleReceive(purchase._id)} variant="ghost" className="px-3 py-1 text-xs text-green-600 hover:bg-green-50 font-bold uppercase">Mark Received</Button>
                                                        <button onClick={() => handleDelete(purchase._id)} className="p-2 hover:bg-red-50 text-secondary-400 hover:text-red-600 rounded-lg transition-colors">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <CheckCircle size={20} className="text-green-500" />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <PurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreatePurchase}
            />
        </div>
    );
};

export default Purchases;
