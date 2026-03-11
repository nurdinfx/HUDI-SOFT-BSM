import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/products';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, productData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const updateProduct = createAsyncThunk('products/update', async ({ id, productData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, productData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export default productSlice.reducer;
