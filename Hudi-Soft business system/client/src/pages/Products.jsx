import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct, createProduct, updateProduct } from '../store/slices/productSlice';
import { fetchCategories, createCategory } from '../store/slices/categorySlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { Plus, Search, Filter, MoreHorizontal, Package, X, Loader2 } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, product = null, onSubmit, categories = [] }) => {
    const [formData, setFormData] = React.useState({
        name: product?.name || '',
        sku: product?.sku || '',
        barcode: product?.barcode || '',
        category: product?.category?._id || product?.category || '',
        unit: product?.unit || 'PCS',
        costPrice: product?.costPrice || 0,
        sellingPrice: product?.sellingPrice || 0,
        initialStock: 0,
        description: product?.description || '',
    });

    const [isAddingCategory, setIsAddingCategory] = React.useState(false);
    const [newCategoryName, setNewCategoryName] = React.useState('');
    const dispatch = useDispatch();

    const handleQuickAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        try {
            const resultAction = await dispatch(createCategory({ name: newCategoryName }));
            if (createCategory.fulfilled.match(resultAction)) {
                setFormData({ ...formData, category: resultAction.payload._id });
                setIsAddingCategory(false);
                setNewCategoryName('');
            }
        } catch (err) {
            console.error('Failed to quick add category:', err);
        }
    };

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                sku: product.sku,
                barcode: product.barcode || '',
                category: product.category?._id || product.category || '',
                unit: product.unit || 'PCS',
                costPrice: product.costPrice || 0,
                sellingPrice: product.sellingPrice || 0,
                initialStock: 0,
                description: product.description || '',
            });
        } else {
            setFormData({
                name: '',
                sku: '',
                barcode: '',
                category: '',
                unit: 'PCS',
                costPrice: 0,
                sellingPrice: 0,
                initialStock: 0,
                description: '',
            });
        }
    }, [product, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-2xl p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    {product ? 'Edit Product' : 'Add New Product'}
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Product Name" placeholder="e.g. iPhone 15 Pro" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        <Input label="SKU" placeholder="e.g. APL-IP15P" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} required />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-secondary-700 dark:text-secondary-300">Category</label>
                                <button
                                    type="button"
                                    onClick={() => window.open('/categories', '_blank')}
                                    className="text-[10px] text-secondary-400 hover:text-primary-600 underline ml-2"
                                >
                                    View All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCategory(!isAddingCategory)}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1"
                                >
                                    {isAddingCategory ? 'Cancel' : <><Plus size={14} /> Quick Add</>}
                                </button>
                            </div>
                            {isAddingCategory ? (
                                <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
                                    <input
                                        type="text"
                                        placeholder="New Category Name"
                                        className="flex-1 px-4 py-2 rounded-xl border border-primary-200 dark:border-primary-900 bg-primary-50/30 dark:bg-primary-500/5 outline-none focus:ring-2 focus:ring-primary-500 text-secondary-900 dark:text-white text-sm"
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleQuickAddCategory())}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={handleQuickAddCategory}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20"
                                    >
                                        Add
                                    </button>
                                </div>
                            ) : (
                                <select
                                    className="w-full px-4 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 transition-all text-secondary-900 dark:text-white"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    <option value="" className="dark:bg-secondary-900">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id} className="dark:bg-secondary-900">{cat.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary-700 dark:text-secondary-300">Unit</label>
                            <select
                                className="w-full px-4 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 transition-all text-secondary-900 dark:text-white"
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                required
                            >
                                {['PCS', 'KG', 'LITER', 'BOX', 'PACK'].map(u => (
                                    <option key={u} value={u} className="dark:bg-secondary-900">{u}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Cost Price ($)" type="number" step="0.01" value={formData.costPrice} onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })} required />
                        <Input label="Selling Price ($)" type="number" step="0.01" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })} required />
                    </div>

                    {!product && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                            <Input 
                                label="Initial Stock Level" 
                                type="number" 
                                placeholder="Starting quantity..." 
                                value={formData.initialStock} 
                                onChange={(e) => setFormData({ ...formData, initialStock: parseInt(e.target.value) || 0 })} 
                                required 
                            />
                            <div className="flex flex-col justify-end pb-1">
                                <p className="text-[10px] text-secondary-400 font-medium">This quantity will be initialized across your active branches.</p>
                            </div>
                        </div>
                    )}

                    <Input label="Barcode (Optional)" placeholder="Scan or enter barcode" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} />

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary-700 dark:text-secondary-300">Description</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 transition-all text-secondary-900 dark:text-white"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Product details..."
                        ></textarea>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">{product ? 'Update Details' : 'Save Product'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: products, loading } = useSelector(state => state.products);
    const { items: categories } = useSelector(state => state.categories);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingProduct, setEditingProduct] = React.useState(null);

    React.useEffect(() => {
        dispatch(fetchProducts());
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAddProduct = (data) => {
        if (!data.category) {
            alert('Please select or add a category first');
            return;
        }
        dispatch(createProduct(data));
        setIsModalOpen(false);
    };

    const handleUpdateProduct = (data) => {
        dispatch(updateProduct({ id: editingProduct._id, productData: data }));
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Product Catalog</h3>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" className="flex items-center gap-2">
                        <Filter size={20} />
                        Filter
                    </Button>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <Plus size={20} />
                        Add Product
                    </Button>
                </div>
            </div>

            <div className="card overflow-hidden min-h-[400px]">
                <div className="p-4 border-b border-secondary-100 dark:border-secondary-800 flex items-center gap-4 bg-secondary-50/50 dark:bg-secondary-900/50">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by SKU, Name..."
                            className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-secondary-400 gap-4">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading catalog...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-secondary-50 dark:bg-secondary-800 text-secondary-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price (Sell)</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                                {filteredProducts.map((product) => (
                                    <tr key={product._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                                                    <Package size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-secondary-900 dark:text-white">{product.name}</p>
                                                    <p className="text-[10px] text-secondary-400 font-mono tracking-tighter">{product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 rounded-lg text-xs font-medium">
                                                {product.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-secondary-900 dark:text-white">
                                            ${product.sellingPrice?.toLocaleString() || '0'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button 
                                                    onClick={() => navigate(`/inventory?search=${product.name}`)} 
                                                    className="p-2 hover:bg-green-50 text-secondary-400 hover:text-green-600 rounded-lg transition-colors text-sm flex items-center gap-1 font-bold"
                                                >
                                                    <Package size={14} />
                                                    Stock
                                                </button>
                                                <button onClick={() => { setEditingProduct(product); setIsModalOpen(true); }} className="p-2 hover:bg-primary-50 text-secondary-400 hover:text-primary-600 rounded-lg transition-colors text-sm">
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(product._id)} className="p-2 hover:bg-red-50 text-secondary-400 hover:text-red-600 rounded-lg transition-colors text-sm">
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingProduct(null); }}
                product={editingProduct}
                onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                categories={categories}
            />
        </div>
    );
};

export default Products;
