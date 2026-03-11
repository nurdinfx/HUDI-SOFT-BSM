import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/audit';

export const fetchAuditLogs = createAsyncThunk('audit/fetchLogs', async (params, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL, { params });
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const auditSlice = createSlice({
    name: 'audit',
    initialState: {
        logs: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuditLogs.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload;
            })
            .addCase(fetchAuditLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default auditSlice.reducer;
