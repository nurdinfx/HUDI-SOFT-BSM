import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/purchases';

export const fetchPurchases = createAsyncThunk('purchases/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const fetchPurchase = createAsyncThunk('purchases/fetchOne', async (id, { rejectWithValue }) => {
    try {
        const response = await api.get(`${API_URL}/${id}`);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const createPurchase = createAsyncThunk('purchases/create', async (purchaseData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, purchaseData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const updatePurchase = createAsyncThunk('purchases/update', async ({ id, purchaseData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, purchaseData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const receivePurchase = createAsyncThunk('purchases/receive', async (id, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}/receive`);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const deletePurchase = createAsyncThunk('purchases/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const purchaseSlice = createSlice({
    name: 'purchases',
    initialState: {
        items: [],
        currentPurchase: null,
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentPurchase: (state) => {
            state.currentPurchase = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPurchases.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchPurchases.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchPurchases.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchPurchase.fulfilled, (state, action) => {
                state.currentPurchase = action.payload;
            })
            .addCase(createPurchase.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updatePurchase.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(receivePurchase.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deletePurchase.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export const { clearCurrentPurchase } = purchaseSlice.actions;
export default purchaseSlice.reducer;
