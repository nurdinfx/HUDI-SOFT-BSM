import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/sales';

export const createSale = createAsyncThunk('sales/create', async (saleData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, saleData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const fetchSales = createAsyncThunk('sales/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const saleSlice = createSlice({
    name: 'sales',
    initialState: {
        items: [],
        loading: false,
        error: null,
        lastSale: null,
    },
    reducers: {
        clearLastSale: (state) => {
            state.lastSale = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createSale.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSale.fulfilled, (state, action) => {
                state.loading = false;
                state.lastSale = action.payload;
                state.items.unshift(action.payload);
            })
            .addCase(createSale.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchSales.fulfilled, (state, action) => {
                state.items = action.payload;
            });
    },
});

export const { clearLastSale } = saleSlice.actions;
export default saleSlice.reducer;
