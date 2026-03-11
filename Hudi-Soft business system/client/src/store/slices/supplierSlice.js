import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/suppliers';

export const fetchSuppliers = createAsyncThunk('suppliers/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const createSupplier = createAsyncThunk('suppliers/create', async (supplierData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, supplierData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const updateSupplier = createAsyncThunk('suppliers/update', async ({ id, supplierData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, supplierData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const deleteSupplier = createAsyncThunk('suppliers/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const supplierSlice = createSlice({
    name: 'suppliers',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuppliers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSuppliers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchSuppliers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createSupplier.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateSupplier.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteSupplier.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export default supplierSlice.reducer;
