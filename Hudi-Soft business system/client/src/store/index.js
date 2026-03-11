import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import branchReducer from './slices/branchSlice';
import customerReducer from './slices/customerSlice';
import supplierReducer from './slices/supplierSlice';
import staffReducer from './slices/staffSlice';
import expenseReducer from './slices/expenseSlice';
import saleReducer from './slices/saleSlice';
import purchaseReducer from './slices/purchaseSlice';
import reportReducer from './slices/reportSlice';
import inventoryReducer from './slices/inventorySlice';
import settingsReducer from './slices/settingsSlice';
import auditReducer from './slices/auditSlice';
import categoryReducer from './slices/categorySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        branches: branchReducer,
        customers: customerReducer,
        suppliers: supplierReducer,
        staff: staffReducer,
        expenses: expenseReducer,
        sales: saleReducer,
        purchases: purchaseReducer,
        reports: reportReducer,
        inventory: inventoryReducer,
        settings: settingsReducer,
        audit: auditReducer,
        categories: categoryReducer,
    },
});
