import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../store/slices/supplierSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { Search, Plus, Truck, Phone, Mail, MoreVertical, Globe, X, Loader2, Trash2, Edit } from 'lucide-react';

const SupplierModal = ({ isOpen, onClose, supplier = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: supplier?.name || '',
        contactPerson: supplier?.contactPerson || '',
        phone: supplier?.phone || '',
        email: supplier?.email || '',
        address: supplier?.address || '',
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                name: supplier.name,
                contactPerson: supplier.contactPerson || '',
                phone: supplier.phone,
                email: supplier.email,
                address: supplier.address || '',
            });
        } else {
            setFormData({ name: '', contactPerson: '', phone: '', email: '', address: '' });
        }
    }, [supplier, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    {supplier ? 'Edit Supplier' : 'Add New Supplier'}
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                    <Input label="Company Name" placeholder="e.g. TechWorld Distribution" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Contact Person" placeholder="e.g. Mark Evans" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} required />
                    <Input label="Phone Number" placeholder="e.g. +1 555-0201" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    <Input label="Email Address" type="email" placeholder="e.g. sales@techworld.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    <Input label="Address (Optional)" placeholder="e.g. 456 Supply Lane, TX" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">{supplier ? 'Update Supplier' : 'Register Supplier'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Suppliers = () => {
    const dispatch = useDispatch();
    const { items: suppliers, loading } = useSelector(state => state.suppliers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState(null);

    useEffect(() => {
        dispatch(fetchSuppliers());
    }, [dispatch]);

    const handleAddSupplier = (data) => {
        dispatch(createSupplier(data));
        setIsModalOpen(false);
    };

    const handleUpdateSupplier = (data) => {
        dispatch(updateSupplier({ id: editingSupplier._id, supplierData: data }));
        setIsModalOpen(false);
        setEditingSupplier(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            dispatch(deleteSupplier(id));
        }
    };

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Supplier Management</h3>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={20} />
                    Add Supplier
                </Button>
            </div>

            <div className="card overflow-hidden min-h-[400px]">
                <div className="p-4 bg-secondary-50/50 dark:bg-secondary-900/50 border-b border-secondary-100 dark:border-secondary-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search suppliers..."
                            className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-secondary-400 gap-4">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading suppliers...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-secondary-50 dark:bg-secondary-800 text-secondary-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Supplier</th>
                                    <th className="px-6 py-4">Contact Person</th>
                                    <th className="px-6 py-4">Contact Info</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                                {filteredSuppliers.map((supplier) => (
                                    <tr key={supplier._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-accent-100 text-accent-600 flex items-center justify-center">
                                                    <Truck size={20} />
                                                </div>
                                                <span className="font-bold text-secondary-900 dark:text-white">{supplier.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondary-600 font-medium">{supplier.contactPerson}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-secondary-600 flex items-center gap-1 font-medium"><Phone size={14} /> {supplier.phone}</span>
                                                <span className="text-secondary-400 flex items-center gap-1"><Mail size={14} /> {supplier.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => { setEditingSupplier(supplier); setIsModalOpen(true); }} className="p-2 hover:bg-primary-50 text-secondary-400 hover:text-primary-600 rounded-lg transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(supplier._id)} className="p-2 hover:bg-red-50 text-secondary-400 hover:text-red-600 rounded-lg transition-colors">
                                                    <Trash2 size={18} />
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

            <SupplierModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingSupplier(null); }}
                supplier={editingSupplier}
                onSubmit={editingSupplier ? handleUpdateSupplier : handleAddSupplier}
            />
        </div>
    );
};

export default Suppliers;
