import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/reports';

export const fetchDashboardStats = createAsyncThunk('reports/fetchDashboard', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`${API_URL}/dashboard`);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const fetchBranchPerformance = createAsyncThunk('reports/fetchBranches', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`${API_URL}/branches`);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

export const fetchTimeSeries = createAsyncThunk('reports/fetchTimeSeries', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(`${API_URL}/timeseries`);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response?.data || 'Something went wrong');
    }
});

const reportSlice = createSlice({
    name: 'reports',
    initialState: {
        dashboard: null,
        branchPerformance: [],
        timeSeries: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboard = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBranchPerformance.fulfilled, (state, action) => {
                state.branchPerformance = action.payload;
            })
            .addCase(fetchTimeSeries.fulfilled, (state, action) => {
                state.timeSeries = action.payload;
            });
    },
});

export default reportSlice.reducer;
