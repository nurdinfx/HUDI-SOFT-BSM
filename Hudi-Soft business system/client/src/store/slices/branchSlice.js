import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/branches';

export const fetchBranches = createAsyncThunk('branches/fetchAll', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const createBranch = createAsyncThunk('branches/create', async (branchData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, branchData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const updateBranch = createAsyncThunk('branches/update', async ({ id, branchData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}/${id}`, branchData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const deleteBranch = createAsyncThunk('branches/delete', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const branchSlice = createSlice({
    name: 'branches',
    initialState: {
        items: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranches.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createBranch.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateBranch.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(deleteBranch.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload);
            });
    },
});

export default branchSlice.reducer;
