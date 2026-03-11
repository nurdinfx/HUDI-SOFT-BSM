import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/staff';

export const fetchStaff = createAsyncThunk('staff/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const createStaff = createAsyncThunk('staff/create', async (staffData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, staffData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const updateStaff = createAsyncThunk('staff/update', async ({ id, staffData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, staffData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const deleteStaff = createAsyncThunk('staff/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

const staffSlice = createSlice({
    name: 'staff',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaff.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStaff.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchStaff.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createStaff.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateStaff.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export default staffSlice.reducer;
