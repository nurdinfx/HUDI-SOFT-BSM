import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSales } from '../store/slices/saleSlice';
import { fetchBranches } from '../store/slices/branchSlice';
import { Search, Filter, Eye, Printer, Download, Loader2, X, ShoppingCart, User, Calendar, MapPin, ReceiptText } from 'lucide-react';
import Button from '../components/Button';

const SaleDetailsModal = ({ isOpen, onClose, sale }) => {
    if (!isOpen || !sale) return null;

    const subtotal = sale.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0) || 0;
    const tax = sale.totalAmount - subtotal;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 no-print">
            <div className="bg-white dark:bg-secondary-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300 flex flex-col">
                {/* Header - Hidden on Print */}
                <div className="p-8 border-b border-secondary-100 dark:border-secondary-800 flex justify-between items-center bg-secondary-50/50 dark:bg-secondary-900/50 no-print">
                    <div>
                        <h3 className="text-2xl font-black text-secondary-900 dark:text-white uppercase tracking-tighter flex items-center gap-2">
                            <ReceiptText className="text-primary-600" size={28} />
                            Sale #{sale.invoiceNumber}
                        </h3>
                        <p className="text-secondary-500 text-xs font-bold uppercase mt-1">Transaction Detailed Record</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-secondary-200 dark:hover:bg-secondary-800 rounded-full transition-all text-secondary-400">
                        <X size={24} />
                    </button>
                </div>

                {/* Printable Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar print:p-0 print:overflow-visible" id="printable-receipt">
                    {/* Invoice Branding - Only Visible on Print */}
                    <div className="hidden print:block text-center border-b-2 border-dashed border-secondary-200 pb-6 mb-6">
                        <h1 className="text-2xl font-black uppercase tracking-widest">HUDI SOFT RETAIL</h1>
                        <p className="text-[10px] font-bold text-secondary-500 uppercase">Official Sales Receipt</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 flex items-center justify-center text-primary-600 print:hidden">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Customer</p>
                                    <p className="font-bold text-secondary-900 dark:text-white">{sale.customer?.name || 'Walk-in Customer'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-400 print:hidden">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Branch Outlet</p>
                                    <p className="font-bold text-secondary-900 dark:text-white">{sale.branch?.name || 'Main Branch'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-400 print:hidden">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Date & Time</p>
                                    <p className="font-bold text-secondary-900 dark:text-white">{new Date(sale.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 print:hidden">
                                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600">
                                    <ShoppingCart size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-secondary-400 uppercase tracking-widest">Status</p>
                                    <span className="text-[10px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded-full uppercase">VERIFIED</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-black text-secondary-400 uppercase tracking-widest flex items-center gap-2 print:border-b print:pb-2">
                            <ShoppingCart size={14} className="print:hidden" /> Itemized Order
                        </h4>
                        <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-2xl border border-secondary-100 dark:border-secondary-800 overflow-hidden print:bg-transparent print:border-none">
                            <table className="w-full text-left">
                                <thead className="bg-secondary-100/50 dark:bg-secondary-800/50 text-[10px] font-black text-secondary-500 uppercase tracking-widest print:bg-transparent print:text-secondary-900">
                                    <tr>
                                        <th className="px-6 py-3">Description</th>
                                        <th className="px-6 py-3 text-center">Qty</th>
                                        <th className="px-6 py-3 text-right">Price</th>
                                        <th className="px-6 py-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800 print:divide-secondary-200">
                                    {sale.items?.map((item, idx) => (
                                        <tr key={idx} className="text-sm">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-secondary-900 dark:text-white uppercase truncate max-w-[200px] print:max-w-none">{item.product?.name || 'Unknown Product'}</p>
                                                <p className="text-[10px] text-secondary-400 font-mono">SKU: {item.product?.sku}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-secondary-600 print:text-secondary-900">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right text-secondary-600 print:text-secondary-900">${item.price?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right font-bold text-secondary-900 dark:text-white print:text-secondary-900">${(item.price * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="pt-6 border-t-2 border-dashed border-secondary-200">
                        <div className="max-w-xs ml-auto space-y-2 print:max-w-none">
                            <div className="flex justify-between text-secondary-500 font-bold text-xs uppercase tracking-wider print:text-secondary-900">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-secondary-500 font-bold text-xs uppercase tracking-wider print:text-secondary-900">
                                <span>Tax (16%)</span>
                                <span>${tax.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t-2 border-primary-500/20 print:border-secondary-900">
                                <span className="text-lg font-black text-secondary-900 dark:text-white uppercase print:text-xl">Total Amount</span>
                                <span className="text-3xl font-black text-primary-600 font-display print:text-2xl print:text-secondary-900">${sale.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Print Footer */}
                    <div className="hidden print:block text-center pt-10">
                        <p className="text-xs font-bold uppercase">Thank you for shopping with us!</p>
                        <p className="text-[10px] text-secondary-400 mt-1">This is a computer-generated receipt.</p>
                        <div className="mt-4 text-[8px] opacity-30">HUDI SOFT RETAIL SYSTEM v1.0 • {new Date().toISOString()}</div>
                    </div>
                </div>

                {/* Footer Actions - Hidden on Print */}
                <div className="p-8 bg-secondary-50 dark:bg-secondary-900/50 border-t border-secondary-100 dark:border-secondary-800 no-print">
                    <div className="flex gap-4">
                        <Button variant="secondary" icon={Download} className="flex-1 uppercase text-[10px] font-black tracking-widest py-4">Download PDF</Button>
                        <Button variant="primary" icon={Printer} className="flex-1 uppercase text-[10px] font-black tracking-widest py-4 shadow-xl shadow-primary-500/20" onClick={() => window.print()}>Print Receipt</Button>
                    </div>
                </div>
            </div>

            {/* Print Injected Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { margin: 0; }
                    body * { visibility: hidden; }
                    #printable-receipt, #printable-receipt * { visibility: visible; }
                    #printable-receipt {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        background: white !important;
                        color: black !important;
                    }
                    .no-print { display: none !important; }
                }
            `}} />
        </div>
    );
};

const Sales = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { items: sales, loading } = useSelector(state => state.sales);
    const { items: branches } = useSelector(state => state.branches);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [selectedSale, setSelectedSale] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isFastPrinting, setIsFastPrinting] = useState(false);

    useEffect(() => {
        dispatch(fetchSales());
        if (user?.role === 'SUPER_ADMIN' && branches.length === 0) {
            dispatch(fetchBranches());
        }
    }, [dispatch, user, branches.length]);

    useEffect(() => {
        if (isFastPrinting && selectedSale && isDetailsOpen) {
            const timer = setTimeout(() => {
                window.print();
                setIsFastPrinting(false);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isFastPrinting, selectedSale, isDetailsOpen]);

    const handleViewDetails = (sale) => {
        setSelectedSale(sale);
        setIsDetailsOpen(true);
        setIsFastPrinting(false);
    };

    const handleFastPrint = (sale) => {
        setSelectedSale(sale);
        setIsDetailsOpen(true);
        setIsFastPrinting(true);
    };

    const filteredSales = sales.filter(sale =>
        (sale.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sale.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (!selectedBranch || sale.branch === selectedBranch)
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-600';
            case 'HOLD': return 'bg-amber-100 text-amber-600';
            case 'CANCELLED': return 'bg-red-100 text-red-600';
            default: return 'bg-secondary-100 text-secondary-600';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-3xl font-black text-secondary-900 dark:text-white font-display">Sales Repository</h3>
                    <p className="text-secondary-500 text-sm mt-1">Audit and analyze your branch transaction history in real-time.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="secondary" icon={Download} className="font-bold text-xs uppercase tracking-widest shadow-sm">Export Ledger</Button>
                </div>
            </div>

            <div className="card overflow-hidden glass">
                <div className="p-6 border-b border-secondary-100 dark:border-secondary-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-secondary-50/30 dark:bg-secondary-900/30">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find invoice or customer..."
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-2xl outline-none text-sm font-bold focus:ring-4 ring-primary-500/10 focus:border-primary-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {user?.role === 'SUPER_ADMIN' && (
                            <select
                                className="px-4 py-3 bg-white dark:bg-secondary-900 border-2 border-secondary-100 dark:border-secondary-800 rounded-2xl outline-none text-xs font-black uppercase tracking-widest text-secondary-600 focus:border-primary-500 shadow-sm"
                                value={selectedBranch}
                                onChange={(e) => setSelectedBranch(e.target.value)}
                            >
                                <option value="">All Regions</option>
                                {branches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
                            </select>
                        )}
                        <Button variant="secondary" icon={Filter} className="text-xs uppercase font-black px-6 shadow-sm">Filters</Button>
                    </div>
                </div>

                {loading && sales.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-secondary-400 gap-4">
                        <Loader2 className="animate-spin" size={48} />
                        <p className="font-black text-xs uppercase tracking-[0.2em]">Synchronizing Records...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-secondary-50 dark:bg-secondary-800 text-secondary-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-secondary-100 dark:border-secondary-800">
                                    <th className="px-8 py-5">Invoice</th>
                                    <th className="px-8 py-5">Client Profile</th>
                                    <th className="px-8 py-5">Timestamp</th>
                                    <th className="px-8 py-5">Branch Outlet</th>
                                    <th className="px-8 py-5">Amount</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-center">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                                {filteredSales.map((sale) => (
                                    <tr key={sale._id} className="hover:bg-primary-50/30 dark:hover:bg-primary-500/5 transition-all group">
                                        <td className="px-8 py-5">
                                            <span className="font-black text-secondary-900 dark:text-white uppercase tracking-tighter text-lg">#{sale.invoiceNumber}</span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-[10px] font-black text-secondary-500">
                                                    {(sale.customer?.name || 'W').charAt(0)}
                                                </div>
                                                <p className="text-sm text-secondary-700 dark:text-secondary-300 font-bold">
                                                    {sale.customer?.name || 'Walk-in Customer'}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-secondary-500 text-xs font-bold">
                                            {new Date(sale.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className="text-[10px] font-black text-primary-600 bg-primary-50 dark:bg-primary-500/10 px-3 py-1 rounded-full uppercase truncate">
                                                {sale.branch?.name || 'Main Branch'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-lg font-black text-secondary-900 dark:text-white font-display">
                                            ${sale.totalAmount?.toLocaleString()}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusStyle('COMPLETED')}`}>
                                                VERIFIED
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(sale)}
                                                    title="Deep View"
                                                    className="p-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 hover:bg-primary-600 hover:text-white hover:border-primary-600 rounded-2xl transition-all shadow-sm active:scale-95 text-secondary-400"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleFastPrint(sale)}
                                                    title="Fast Print"
                                                    className="p-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 hover:bg-secondary-600 hover:text-white hover:border-secondary-600 rounded-2xl transition-all shadow-sm active:scale-95 text-secondary-400"
                                                >
                                                    <Printer size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredSales.length === 0 && (
                                    <tr>
                                        <td colSpan="7" className="px-8 py-32 text-center text-secondary-400">
                                            <div className="max-w-xs mx-auto space-y-4">
                                                <ReceiptText size={64} className="mx-auto opacity-10" />
                                                <p className="font-bold text-lg uppercase tracking-widest">Archive Empty</p>
                                                <p className="text-xs">No transactions match your current search parameters or regional filters.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <SaleDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                sale={selectedSale}
            />
        </div>
    );
};

export default Sales;
