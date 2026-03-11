import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBranches, createBranch, updateBranch, deleteBranch } from '../store/slices/branchSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { Plus, Search, Store, MapPin, Phone, Mail, MoreVertical, X, Loader2, Trash2, Edit } from 'lucide-react';

const BranchModal = ({ isOpen, onClose, branch = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: branch?.name || '',
        location: branch?.location || '',
        contactNumber: branch?.contactNumber || '',
        email: branch?.email || '',
        address: branch?.address || '',
    });

    useEffect(() => {
        if (branch) {
            setFormData({
                name: branch.name,
                location: branch.location,
                contactNumber: branch.contactNumber,
                email: branch.email,
                address: branch.address || '',
            });
        } else {
            setFormData({ name: '', location: '', contactNumber: '', email: '', address: '' });
        }
    }, [branch, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    {branch ? 'Edit Branch' : 'Add New Branch'}
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                    <Input label="Branch Name" placeholder="e.g. Main Branch" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Location" placeholder="e.g. New York, USA" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                    <Input label="Contact Number" placeholder="e.g. +1 234 567 890" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} required />
                    <Input label="Email" type="email" placeholder="e.g. branch@hudi.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    <Input label="Full Address" placeholder="e.g. 123 Main St, Suite 100" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">{branch ? 'Update Branch' : 'Create Branch'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BranchCard = ({ branch, onEdit, onDelete }) => (
    <div className="card p-6 flex flex-col gap-4 group">
        <div className="flex items-start justify-between">
            <div className="p-3 rounded-2xl bg-primary-100 text-primary-600">
                <Store size={24} />
            </div>
            <div className="flex gap-2">
                <button onClick={() => onEdit(branch)} className="p-2 hover:bg-primary-50 rounded-lg text-secondary-400 hover:text-primary-600 transition-colors">
                    <Edit size={18} />
                </button>
                <button onClick={() => onDelete(branch._id)} className="p-2 hover:bg-red-50 rounded-lg text-secondary-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
        <div>
            <h3 className="text-lg font-bold text-secondary-900 dark:text-white">{branch.name}</h3>
            <p className="text-sm font-medium text-primary-600">{branch.manager?.name || 'No Manager Assigned'}</p>
        </div>
        <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2 text-sm text-secondary-500">
                <MapPin size={16} />
                <span>{branch.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary-500">
                <Phone size={16} />
                <span>{branch.contactNumber}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-secondary-500">
                <Mail size={16} />
                <span>{branch.email}</span>
            </div>
        </div>
        <div className="pt-4 mt-auto border-t border-secondary-100 dark:border-secondary-800 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                Active
            </span>
            <Button variant="ghost" className="px-2 py-1 text-sm font-bold">Analytics</Button>
        </div>
    </div>
);

const Branches = () => {
    const dispatch = useDispatch();
    const { items: branches, loading } = useSelector(state => state.branches);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);

    useEffect(() => {
        dispatch(fetchBranches());
    }, [dispatch]);

    const handleAddBranch = (data) => {
        dispatch(createBranch(data));
        setIsModalOpen(false);
    };

    const handleUpdateBranch = (data) => {
        dispatch(updateBranch({ id: editingBranch._id, branchData: data }));
        setIsModalOpen(false);
        setEditingBranch(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            dispatch(deleteBranch(id));
        }
    };

    const filteredBranches = branches.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search branches..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={20} />
                    Add New Branch
                </Button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-secondary-400 gap-4">
                    <Loader2 className="animate-spin" size={40} />
                    <p className="font-medium">Loading branches...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBranches.map(branch => (
                        <BranchCard
                            key={branch._id}
                            branch={branch}
                            onEdit={(b) => { setEditingBranch(b); setIsModalOpen(true); }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            <BranchModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingBranch(null); }}
                branch={editingBranch}
                onSubmit={editingBranch ? handleUpdateBranch : handleAddBranch}
            />
        </div>
    );
};

export default Branches;
