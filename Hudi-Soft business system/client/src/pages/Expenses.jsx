import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../store/slices/expenseSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { Search, Plus, CreditCard, Calendar, Tag, MoreVertical, X, Loader2, Trash2, Edit, DollarSign } from 'lucide-react';

const ExpenseModal = ({ isOpen, onClose, expense = null, onSubmit }) => {
    const [formData, setFormData] = useState({
        description: expense?.description || '',
        category: expense?.category || 'OTHER',
        amount: expense?.amount || 0,
        date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        if (expense) {
            setFormData({
                description: expense.description,
                category: expense.category,
                amount: expense.amount,
                date: new Date(expense.date).toISOString().split('T')[0],
            });
        } else {
            setFormData({ description: '', category: 'OTHER', amount: 0, date: new Date().toISOString().split('T')[0] });
        }
    }, [expense, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-secondary-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-6 right-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200">
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    {expense ? 'Edit Expense' : 'Record New Expense'}
                </h3>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                    <Input label="Description" placeholder="e.g. Monthly Rent" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 ml-1">Category</label>
                            <select
                                className="w-full px-4 py-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option value="RENT">Rent</option>
                                <option value="UTILITIES">Utilities</option>
                                <option value="SALARY">Salary</option>
                                <option value="MARKETING">Marketing</option>
                                <option value="SUPPLIES">Supplies</option>
                                <option value="MAINTENANCE">Maintenance</option>
                                <option value="TRANSPORT">Transport</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <Input label="Amount ($)" type="number" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                    </div>
                    <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                    <div className="pt-4 flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="flex-1">{expense ? 'Update Record' : 'Record Expense'}</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Expenses = () => {
    const dispatch = useDispatch();
    const { items: expenses, loading } = useSelector(state => state.expenses);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState(null);

    useEffect(() => {
        dispatch(fetchExpenses());
    }, [dispatch]);

    const handleAddExpense = (data) => {
        dispatch(createExpense(data));
        setIsModalOpen(false);
    };

    const handleUpdateExpense = (data) => {
        dispatch(updateExpense({ id: editingExpense._id, expenseData: data }));
        setIsModalOpen(false);
        setEditingExpense(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this expense record?')) {
            dispatch(deleteExpense(id));
        }
    };

    const filteredExpenses = expenses.filter(e =>
        e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">Expense Tracking</h3>
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 min-w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search expenses..."
                            className="w-full pl-10 pr-4 py-2 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none text-sm bg-white dark:bg-secondary-900"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                        <Plus size={20} />
                        Record Expense
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
                                    <th className="px-6 py-4">Expense Details</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                                {filteredExpenses.map((expense) => (
                                    <tr key={expense._id} className="hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-secondary-900 dark:text-white">
                                            {expense.description}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-2 text-xs font-bold text-secondary-600 uppercase">
                                                <Tag size={14} className="text-primary-500" />
                                                {expense.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-secondary-500 text-sm">
                                            {new Date(expense.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-secondary-900 dark:text-white">
                                            ${expense.amount?.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2 text-secondary-400">
                                                <button onClick={() => { setEditingExpense(expense); setIsModalOpen(true); }} className="p-2 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(expense._id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
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

            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setEditingExpense(null); }}
                expense={editingExpense}
                onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
            />
        </div>
    );
};

export default Expenses;
