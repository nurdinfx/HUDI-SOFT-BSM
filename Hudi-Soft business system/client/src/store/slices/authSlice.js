import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = '/api/v1/auth';

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await api.post(`${API_URL}/login`, userData);
        if (response.data.success) {
            localStorage.setItem('token', response.data.token);
            return response.data;
        }
    } catch (error) {
        const message = error.response?.data?.message || error.message || 'Unable to connect to the server.';
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    isError: false,
    message: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
            state.token = null;
        },
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            });
    },
});

export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;
