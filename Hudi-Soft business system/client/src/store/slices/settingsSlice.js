import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/settings';

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

export const updateSettings = createAsyncThunk('settings/update', async (settingsData, { rejectWithValue }) => {
    try {
        const response = await api.put(API_URL, settingsData);
        return response.data.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.data = action.payload;
            });
    },
});

export default settingsSlice.reducer;
