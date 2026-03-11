import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../store/slices/customerSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { Search, Plus, User, Phone, Mail, MoreVertical, CreditCard, X, Loader2, Trash2, Edit } from 'lucide-react';

const CustomerModal = ({ isOpen, onClose, customer = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: customer?.name || '',
        phone: customer?.phone || '',
        email: customer?.email || '',
        address: customer?.address || '',
    });

    useEffect(() => {
        if (customer) {
            setFormData({
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                address: customer.address || '',
            });
        } else {
            setFormData({ name: '', phone: '', email: '', address: '' });
        }
    }, [customer, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    {customer ? 'Edit Customer' : 'Add New Customer'}
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                    <Input label="Full Name" placeholder="e.g. Alice Johnson" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Phone Number" placeholder="e.g. +1 555-0101" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    <Input label="Email Address" type="email" placeholder="e.g. alice@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    <Input label="Address (Optional)" placeholder="e.g. 123 Main St, NY" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">{customer ? 'Update Customer' : 'Register Customer'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Customers = () => {
    const dispatch = useDispatch();
    const { items: customers, loading } = useSelector(state => state.customers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);

    useEffect(() => {
        dispatch(fetchCustomers());
    }, [dispatch]);

    const handleAddCustomer = (data) => {
        dispatch(createCustomer(data));
        setIsModalOpen(false);
    };

    const handleUpdateCustomer = (data) => {
        dispatch(updateCustomer({ id: editingCustomer._id, customerData: data }));
        setIsModalOpen(false);
        setEditingCustomer(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            dispatch(deleteCustomer(id));
        }
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Customer CRM</h3>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <Plus size={20} />
                    New Customer
                </Button>
            </div>

            <div className="card overflow-hidden min-h-[400px]">
                <div className="p-4 bg-secondary-50/50 dark:bg-secondary-900/50 border-b border-secondary-100 dark:border-secondary-800">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            className="w-full pl-10 pr-4 py-2 bg-transparent outline-none text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-secondary-400 gap-4">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading CRM...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-secondary-50 dark:bg-secondary-800 text-secondary-500 text-xs font-bold uppercase tracking-wider">
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Loyalty Points</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                                    {customer.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <span className="font-bold text-secondary-900 dark:text-white">{customer.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-secondary-600 flex items-center gap-1 font-medium"><Phone size={14} /> {customer.phone}</span>
                                                <span className="text-secondary-400 flex items-center gap-1"><Mail size={14} /> {customer.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-600 text-[10px] font-bold uppercase">
                                                {customer.loyaltyPoints || 0} Points
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-[10px] font-bold uppercase">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => { setEditingCustomer(customer); setIsModalOpen(true); }} className="p-2 hover:bg-primary-50 text-secondary-400 hover:text-primary-600 rounded-lg transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(customer._id)} className="p-2 hover:bg-red-50 text-secondary-400 hover:text-red-600 rounded-lg transition-colors">
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

            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingCustomer(null); }}
                customer={editingCustomer}
                onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}
            />
        </div>
    );
};

export default Customers;
