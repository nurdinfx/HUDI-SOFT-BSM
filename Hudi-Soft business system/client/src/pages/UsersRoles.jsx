import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserPlus, Shield, UserCheck, Search, Loader2, X, Trash2, Edit, Store } from 'lucide-react';
import { fetchStaff, createStaff, deleteStaff } from '../store/slices/staffSlice';
import { fetchBranches } from '../store/slices/branchSlice';
import Button from '../components/Button';
import Input from '../components/Input';

const UserModal = ({ isOpen, onClose, user = null, branches = [], onSubmit }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'CASHIER',
        branch: user?.branch || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                role: user.role,
                branch: user.branch?._id || user.branch || '',
            });
        } else {
            setFormData({ name: '', email: '', password: '', role: 'CASHIER', branch: '' });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    {user ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                    <Input label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Email Address" type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    {!user && (
                        <Input label="Password" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary-700 dark:text-secondary-300">Role</label>
                            <select 
                                className="w-full px-4 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 transition-all text-secondary-900 dark:text-white"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                required
                            >
                                <option value="SUPER_ADMIN">Super Admin</option>
                                <option value="BRANCH_MANAGER">Branch Manager</option>
                                <option value="CASHIER">Cashier</option>
                                <option value="STOCK_MANAGER">Stock Manager</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-secondary-700 dark:text-secondary-300">Branch</label>
                            <select 
                                className="w-full px-4 py-2 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-transparent outline-none focus:ring-2 focus:ring-primary-500 transition-all text-secondary-900 dark:text-white"
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                required={formData.role !== 'SUPER_ADMIN'}
                                disabled={formData.role === 'SUPER_ADMIN'}
                            >
                                <option value="">Select Branch</option>
                                {branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">{user ? 'Update Employee' : 'Create Account'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const UsersRoles = () => {
    const dispatch = useDispatch();
    const { items: staff, loading } = useSelector(state => state.staff);
    const { items: branches } = useSelector(state => state.branches);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        dispatch(fetchStaff());
        dispatch(fetchBranches());
    }, [dispatch]);

    const handleAddUser = (data) => {
        dispatch(createStaff(data));
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this employee?')) {
            dispatch(deleteStaff(id));
        }
    };

    const filteredStaff = Array.isArray(staff) ? staff.filter(s => {
        const name = s.name || '';
        const email = s.email || '';
        const search = searchTerm.toLowerCase();
        return name.toLowerCase().includes(search) || email.toLowerCase().includes(search);
    }) : [];

    const getRoleBadge = (role) => {
        switch(role) {
            case 'SUPER_ADMIN': return <span className="px-2 py-1 bg-primary-100 text-primary-600 text-[10px] font-bold rounded-full">SUPER ADMIN</span>;
            case 'BRANCH_MANAGER': return <span className="px-2 py-1 bg-green-100 text-green-600 text-[10px] font-bold rounded-full">MANAGER</span>;
            case 'STOCK_MANAGER': return <span className="px-2 py-1 bg-orange-100 text-orange-600 text-[10px] font-bold rounded-full">STOCK</span>;
            default: return <span className="px-2 py-1 bg-secondary-100 text-secondary-600 text-[10px] font-bold rounded-full">CASHIER</span>;
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">Users & Roles</h2>
                    <p className="text-secondary-500 text-sm">Manage store employees and system permissions.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <UserPlus size={20} />
                    Add Employee
                </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-secondary-400 gap-4">
                        <Loader2 className="animate-spin" size={40} />
                        <p className="font-medium">Loading employees...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-secondary-50 dark:bg-secondary-800/50 border-b border-secondary-100 dark:border-secondary-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary-400 uppercase">Employee</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary-400 uppercase">Role</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary-400 uppercase">Branch</th>
                                    <th className="px-6 py-4 text-xs font-bold text-secondary-400 uppercase text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                                {filteredStaff.map(s => (
                                    <tr key={s._id} className="hover:bg-secondary-50/50 dark:hover:bg-secondary-800/30 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                                {s.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-secondary-900 dark:text-white">{s.name}</p>
                                                <p className="text-xs text-secondary-400">{s.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getRoleBadge(s.role)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-secondary-600 dark:text-secondary-400">
                                                <Store size={14} />
                                                {s.branch?.name || (s.role === 'SUPER_ADMIN' ? 'All Branches' : 'N/A')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 text-secondary-400">
                                                <button onClick={() => { setEditingUser(s); setIsModalOpen(true); }} className="p-2 hover:bg-primary-50 rounded-lg hover:text-primary-600 transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(s._id)} className="p-2 hover:bg-red-50 rounded-lg hover:text-red-600 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredStaff.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-20 text-center text-secondary-400">
                                            No employees found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <UserModal 
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingUser(null); }}
                user={editingUser}
                branches={branches}
                onSubmit={handleAddUser}
            />
        </div>
    );
};

export default UsersRoles;
