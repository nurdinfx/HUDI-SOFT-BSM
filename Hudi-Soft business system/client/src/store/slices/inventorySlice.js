import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/inventory';

export const fetchInventory = createAsyncThunk('inventory/fetchAll', async (filters, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL, { params: filters });
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const updateStock = createAsyncThunk('inventory/update', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, data);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const initializeInventory = createAsyncThunk('inventory/initialize', async (data, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, data);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchInventory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateStock.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(initializeInventory.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            });
    },
});

export default inventorySlice.reducer;
