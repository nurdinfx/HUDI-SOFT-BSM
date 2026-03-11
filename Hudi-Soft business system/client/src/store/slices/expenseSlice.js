import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/expenses';

export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const createExpense = createAsyncThunk('expenses/create', async (expenseData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, expenseData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const updateExpense = createAsyncThunk('expenses/update', async ({ id, expenseData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, expenseData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const deleteExpense = createAsyncThunk('expenses/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const expenseSlice = createSlice({
    name: 'expenses',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
            })
            .addCase(updateExpense.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export default expenseSlice.reducer;
