import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/customers';

export const fetchCustomers = createAsyncThunk('customers/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const createCustomer = createAsyncThunk('customers/create', async (customerData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, customerData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const updateCustomer = createAsyncThunk('customers/update', async ({ id, customerData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, customerData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const deleteCustomer = createAsyncThunk('customers/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const customerSlice = createSlice({
    name: 'customers',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCustomers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCustomer.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteCustomer.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export default customerSlice.reducer;
