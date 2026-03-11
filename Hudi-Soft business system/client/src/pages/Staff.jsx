import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '../store/slices/staffSlice';
import { fetchBranches } from '../store/slices/branchSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { Search, Plus, UserCheck, Briefcase, Calendar, MoreVertical, DollarSign, X, Loader2, Trash2, Edit } from 'lucide-react';

const StaffModal = ({ isOpen, onClose, member = null, branches = [], onSubmit }) => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        role: 'CASHIER',
        salary: 0,
        phone: '',
        branch: '',
    });

    React.useEffect(() => {
        if (isOpen) {
            if (member) {
                setFormData({
                    name: member.user?.name || member.name || '',
                    email: member.user?.email || member.email || '',
                    role: member.user?.role || member.role || 'CASHIER',
                    salary: member.salary || 0,
                    phone: member.phone || '',
                    branch: member.user?.branch?._id || member.user?.branch || member.branch || '',
                });
            } else {
                setFormData({ name: '', email: '', role: 'CASHIER', salary: 0, phone: '', branch: '' });
            }
        }
    }, [member, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    {member ? 'Edit Employee' : 'Add New Employee'}
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                    <Input label="Full Name" placeholder="e.g. John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    <Input label="Email Address" type="email" placeholder="e.g. john@hudi.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 ml-1">Role</label>
                            <select
                                className="w-full px-4 py-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="CASHIER">Cashier</option>
                                <option value="BRANCH_MANAGER">Branch Manager</option>
                                <option value="INVENTORY_MANAGER">Inventory Manager</option>
                                <option value="STOCK_MANAGER">Stock Manager</option>
                            </select>
                        </div>
                        <Input label="Monthly Salary" type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 ml-1">Branch</label>
                            <select
                                className="w-full px-4 py-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={formData.branch}
                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                required
                            >
                                <option value="">Select Branch</option>
                                {Array.isArray(branches) && branches.map(b => (
                                    <option key={b._id} value={b._id}>{b.name}</option>
                                ))}
                            </select>
                        </div>
                        <Input label="Phone Number" placeholder="e.g. +1 555-0301" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">{member ? 'Update Staff' : 'Register Staff'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Staff = () => {
    const dispatch = useDispatch();
    const { items: staff, loading } = useSelector(state => state.staff);
    const { items: branches } = useSelector(state => state.branches);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingMember, setEditingMember] = React.useState(null);

    React.useEffect(() => {
        dispatch(fetchStaff());
        dispatch(fetchBranches());
    }, [dispatch]);

    const handleAddStaff = (data) => {
        dispatch(createStaff(data));
        setIsModalOpen(false);
    };

    const handleUpdateStaff = (data) => {
        dispatch(updateStaff({ id: editingMember._id, staffData: data }));
        setIsModalOpen(false);
        setEditingMember(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee record?')) {
            dispatch(deleteStaff(id));
        }
    };

    const getRoleStyle = (role) => {
        switch (role) {
            case 'BRANCH_MANAGER': return 'bg-purple-100 text-purple-600';
            case 'CASHIER': return 'bg-blue-100 text-blue-600';
            case 'INVENTORY_MANAGER': return 'bg-amber-100 text-amber-600';
            case 'STOCK_MANAGER': return 'bg-green-100 text-green-600';
            default: return 'bg-secondary-100 text-secondary-600';
        }
    };

    const filteredStaff = Array.isArray(staff) ? staff.filter(s =>
        s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Staff & HR</h3>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search staff..."
                            className="w-full pl-10 pr-4 py-2 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none text-sm bg-white dark:bg-secondary-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <Plus size={20} />
                        Add Employee
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-secondary-400 gap-4">
                    <Loader2 className="animate-spin" size={40} />
                    <p className="font-medium">Loading staff records...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredStaff.map((member) => (
                        <div key={member._id} className="card p-6 flex flex-col items-center text-center relative group">
                            <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingMember(member); setIsModalOpen(true); }} className="p-2 hover:bg-primary-50 rounded-lg text-secondary-400 hover:text-primary-600 transition-colors">
                                    <Edit size={16} />
                                </button>
                                <button onClick={() => handleDelete(member._id)} className="p-2 hover:bg-red-50 rounded-lg text-secondary-400 hover:text-red-600 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 flex items-center justify-center text-2xl font-bold mb-4 shadow-inner uppercase">
                                {(member.user?.name || 'S').split(' ').map(n => n[0]).join('')}
                            </div>
                            <h4 className="text-lg font-bold text-secondary-900 dark:text-white truncate w-full px-2">
                                {member.user?.name || 'Staff Member'}
                            </h4>
                            <span className="text-xs text-secondary-400 mb-2 truncate w-full px-2">
                                {member.user?.email || member.employeeId}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 ${getRoleStyle(member.user?.role || 'CASHIER')}`}>
                                {(member.user?.role || 'CASHIER').replace('_', ' ')}
                            </span>
                            <div className="w-full pt-4 border-t border-secondary-100 dark:border-secondary-800 grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-secondary-400 uppercase font-bold">Salary</span>
                                    <span className="text-sm font-bold text-secondary-900 dark:text-white flex items-center justify-center gap-1">
                                        <DollarSign size={14} className="text-green-500" /> {member.salary?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-secondary-400 uppercase font-bold">Branch</span>
                                    <span className="text-sm font-bold text-secondary-600 dark:text-secondary-400 truncate px-1">
                                         {member.user?.branch?.name || (Array.isArray(branches) && branches.find(b => b._id === (member.user?.branch || member.branch))?.name) || 'Main Branch'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <StaffModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingMember(null); }}
                member={editingMember}
                branches={branches}
                onSubmit={editingMember ? handleUpdateStaff : handleAddStaff}
            />
        </div>
    );
};

export default Staff;
