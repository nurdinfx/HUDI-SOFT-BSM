import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/categories';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const createCategory = createAsyncThunk('categories/create', async (categoryData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, categoryData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    },
});

export default categorySlice.reducer;
