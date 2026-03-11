import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, createCategory } from '../store/slices/categorySlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { Plus, Search, Tag, MoreVertical, X, Loader2, Trash2, Edit } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, category = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description || '',
            });
        } else {
            setFormData({ name: '', description: '' });
        }
    }, [category, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    {category ? 'Edit Category' : 'Add New Category'}
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                    <Input label="Category Name" placeholder="e.g. Electronics" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-secondary-700 dark:text-secondary-300">Description</label>
                        <textarea
                            className="w-full px-4 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 transition-all text-secondary-900 dark:text-white"
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Category details..."
                        ></textarea>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">{category ? 'Update Category' : 'Create Category'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CategoryCard = ({ category, onEdit, onDelete }) => (
    <div className="card p-6 flex flex-col gap-4 group">
        <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-primary-100 text-primary-600">
                <Tag size={24} />
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onEdit(category)} className="p-2 hover:bg-primary-50 rounded-lg text-secondary-400 hover:text-primary-600 transition-colors">
                    <Edit size={18} />
                </button>
                <button onClick={() => onDelete(category._id)} className="p-2 hover:bg-red-50 rounded-lg text-secondary-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
        <div>
            <h3 className="text-lg font-bold text-secondary-900 dark:text-white">{category.name}</h3>
            <p className="text-sm text-secondary-500 line-clamp-2">{category.description || 'No description provided'}</p>
        </div>
        <div className="pt-4 mt-auto border-t border-secondary-100 dark:border-secondary-800 flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${category.isActive ? 'bg-green-100 text-green-600' : 'bg-secondary-100 text-secondary-600'}`}>
                {category.isActive ? 'Active' : 'Inactive'}
            </span>
        </div>
    </div>
);

const Categories = () => {
    const dispatch = useDispatch();
    const { items: categories, loading } = useSelector(state => state.categories);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleAddCategory = (data) => {
        dispatch(createCategory(data));
        setIsModalOpen(false);
    };

    const handleUpdateCategory = (data) => {
        // Update logic (assuming updateCategory action exists or will be added)
        console.log('Update category', data);
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            // Delete logic (assuming deleteCategory action exists or will be added)
            console.log('Delete category', id);
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={20} />
                    Add Category
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-secondary-400 gap-4">
                    <Loader2 className="animate-spin" size={40} />
                    <p className="font-medium">Loading categories...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredCategories.map(category => (
                        <CategoryCard
                            key={category._id}
                            category={category}
                            onEdit={(c) => { setEditingCategory(c); setIsModalOpen(true); }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingCategory(null); }}
                category={editingCategory}
                onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
            />
        </div>
    );
};

export default Categories;
