import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInventory } from '../store/slices/inventorySlice';
import { fetchBranches } from '../store/slices/branchSlice';
import { fetchSettings } from '../store/slices/settingsSlice';
import { createSale } from '../store/slices/saleSlice';
import Button from '../components/Button';
import {
    Search,
    ShoppingCart,
    User,
    Trash2,
    Plus,
    Minus,
    Ticket,
    CreditCard,
    Printer,
    ChevronRight,
    Loader2,
    Package,
    Barcode
} from 'lucide-react';

const POS = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { items: inventory, loading: inventoryLoading } = useSelector(state => state.inventory);
    const { items: branches } = useSelector(state => state.branches);
    const { data: settings } = useSelector(state => state.settings);
    const { loading: saleLoading } = useSelector(state => state.sales);

    const [cart, setCart] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBranch, setSelectedBranch] = useState(user?.role === 'SUPER_ADMIN' ? '' : user?.branch);

    useEffect(() => {
        dispatch(fetchInventory({ branch: selectedBranch || user?.branch }));
        dispatch(fetchSettings());
        if (user?.role === 'SUPER_ADMIN') {
            dispatch(fetchBranches());
        }
    }, [dispatch, user, selectedBranch]);

    // Handle Barcode Scan
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchTerm.length >= 8) { // Typical barcode length
                const product = inventory.find(i => i.product.barcode === searchTerm);
                if (product) {
                    addToCart(product);
                    setSearchTerm(''); // Clear for next scan
                }
            }
        }, 100);
        return () => clearTimeout(delaySearch);
    }, [searchTerm, inventory]);

    const addToCart = (item) => {
        const product = item.product;
        if (item.quantity <= 0) {
            alert('Item out of stock!');
            return;
        }

        const existingItem = cart.find(cartItem => cartItem._id === product._id);
        const currentQtyInCart = existingItem ? existingItem.qty : 0;

        if (currentQtyInCart + 1 > item.quantity) {
            alert('Cannot add more. Insufficient stock!');
            return;
        }

        if (existingItem) {
            setCart(cart.map(cartItem =>
                cartItem._id === product._id ? { ...cartItem, qty: cartItem.qty + 1 } : cartItem
            ));
        } else {
            setCart([...cart, {
                ...product,
                qty: 1,
                price: product.sellingPrice,
                available: item.quantity
            }]);
        }
    };

    const updateQty = (id, delta) => {
        setCart(cart.map(item => {
            if (item._id === id) {
                const newQty = Math.max(1, item.qty + delta);
                if (newQty > item.available) {
                    alert('Insufficient stock!');
                    return item;
                }
                return { ...item, qty: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item._id !== id));
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        const saleData = {
            items: cart.map(item => ({
                product: item._id,
                quantity: item.qty,
                price: item.price,
                total: item.price * item.qty
            })),
            subtotal: subtotal,
            tax: tax,
            totalAmount: total,
            paymentMethod: 'CASH',
            branch: selectedBranch || user?.branch
        };

        const result = await dispatch(createSale(saleData));
        if (createSale.fulfilled.match(result)) {
            alert('Sale completed successfully!');
            setCart([]);
            dispatch(fetchInventory({ branch: selectedBranch || user?.branch })); // Refresh stock
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product?.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product?.barcode?.includes(searchTerm)
    );

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const taxRate = settings?.taxRate || 0;
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[calc(100vh-140px)]">
            {/* Product Selection Area */}
            <div className="xl:col-span-2 space-y-6 flex flex-col">
                <div className="flex items-center gap-4 bg-white dark:bg-secondary-900 p-2 rounded-2xl border border-secondary-200 dark:border-secondary-800 shadow-premium">
                    <div className="p-3 bg-primary-50 dark:bg-primary-500/10 text-primary-600 rounded-xl">
                        <Barcode size={24} />
                    </div>
                    <input
                        type="text"
                        placeholder="Scan barcode or type product name..."
                        className="flex-1 bg-transparent border-none outline-none text-lg font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                    {user?.role === 'SUPER_ADMIN' && (
                        <select
                            className="bg-secondary-50 dark:bg-secondary-800 border-l border-secondary-100 dark:border-secondary-800 px-4 py-2 text-sm font-bold outline-none rounded-r-xl"
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                        >
                            <option value="">All Branches</option>
                            {branches.map(b => (
                                <option key={b._id} value={b._id}>{b.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {inventoryLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-secondary-400 gap-4">
                            <Loader2 className="animate-spin" size={40} />
                            <p className="font-medium">Loading inventory...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredInventory.map((item) => (
                                <div
                                    key={item._id}
                                    onClick={() => addToCart(item)}
                                    className="card p-4 cursor-pointer hover:border-primary-500 hover:ring-2 hover:ring-primary-500/10 active:scale-95 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center text-secondary-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors">
                                            <Package size={24} />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-secondary-900 dark:text-white uppercase truncate">{item.product?.name}</h4>
                                            <p className="text-xs font-medium text-secondary-500">{item.product?.sku}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-lg font-bold text-primary-600">${item.product?.sellingPrice?.toLocaleString()}</p>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.quantity > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {item.quantity} in stock
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Cart Area */}
            <div className="xl:col-span-2 flex flex-col gap-6">
                <div className="flex-1 card flex flex-col overflow-hidden glass">
                    <div className="p-6 border-b border-secondary-100 dark:border-secondary-800 flex items-center justify-between">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <ShoppingCart className="text-primary-600" size={24} />
                            Current Order
                        </h3>
                        <span className="text-sm font-bold bg-primary-100 text-primary-600 px-3 py-1 rounded-full uppercase">
                            LIVE SESSION
                        </span>
                    </div>

                    <div className="p-4 bg-secondary-50 dark:bg-secondary-800/50 border-b border-secondary-100 dark:border-secondary-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white dark:bg-secondary-900 rounded-lg text-secondary-400 shadow-sm border border-secondary-200 dark:border-secondary-700">
                                <User size={20} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-secondary-900 dark:text-white">Walk-in Customer</p>
                                <p className="text-xs text-secondary-500">Retail price tier</p>
                            </div>
                            <Button variant="secondary" className="px-3 py-1 text-xs font-bold">Change</Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-secondary-300 opacity-50">
                                <ShoppingCart size={64} className="mb-4" />
                                <p className="text-lg font-bold">Cart is empty</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item._id} className="flex items-center gap-4 group">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-secondary-900 dark:text-white">{item.name}</h4>
                                        <p className="text-xs text-secondary-500">{item.sku}</p>
                                    </div>
                                    <div className="flex items-center gap-3 bg-secondary-50 dark:bg-secondary-800 p-1 rounded-lg">
                                        <button onClick={() => updateQty(item._id, -1)} className="p-1 hover:bg-white dark:hover:bg-secondary-700 rounded-md text-secondary-500 transition-colors shadow-sm"><Minus size={16} /></button>
                                        <span className="w-8 text-center font-bold text-secondary-900 dark:text-white">{item.qty}</span>
                                        <button onClick={() => updateQty(item._id, 1)} className="p-1 hover:bg-white dark:hover:bg-secondary-700 rounded-md text-secondary-500 transition-colors shadow-sm"><Plus size={16} /></button>
                                    </div>
                                    <div className="w-24 text-right">
                                        <p className="font-bold text-secondary-900 dark:text-white">${(item.price * item.qty).toLocaleString()}</p>
                                    </div>
                                    <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 bg-secondary-50 dark:bg-secondary-800/50 space-y-3">
                        <div className="flex justify-between text-secondary-500 font-medium text-sm">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-secondary-500 font-medium text-sm">
                            <span>Tax ({taxRate}%)</span>
                            <span>${tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t border-secondary-200 dark:border-secondary-700">
                            <span className="text-xl font-bold text-secondary-900 dark:text-white">Grand Total</span>
                            <span className="text-3xl font-display font-bold text-primary-600">${total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="secondary" className="py-4 flex flex-col items-center gap-1 h-auto font-bold">
                        <Printer size={24} />
                        <span>Hold Bill</span>
                    </Button>
                    <Button variant="secondary" className="py-4 flex flex-col items-center gap-1 h-auto font-bold">
                        <Ticket size={24} />
                        <span>Discount</span>
                    </Button>
                    <Button
                        onClick={handleCheckout}
                        disabled={cart.length === 0 || saleLoading}
                        className="col-span-2 py-6 text-xl flex items-center justify-center gap-3 h-auto group bg-green-600 hover:bg-green-700 disabled:bg-secondary-300 disabled:opacity-50"
                    >
                        {saleLoading ? <Loader2 className="animate-spin" size={28} /> : <CreditCard size={28} />}
                        {saleLoading ? 'Processing...' : 'Complete Payment'}
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default POS;
