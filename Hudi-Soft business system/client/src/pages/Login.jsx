import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/slices/authSlice';
import Button from '../components/Button';
import Input from '../components/Input';
import { LayoutGrid, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { isLoading, isError, message } = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="card p-8 md:p-10 space-y-8 glass">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white shadow-premium mb-4">
                            <LayoutGrid size={32} />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-secondary-900 dark:text-white">
                            Enterprise Retail
                        </h1>
                        <p className="text-secondary-500 font-medium">
                            Manage your branches with ease
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="admin@hudi-soft.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {isError && (
                            <p className="text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-200 dark:border-red-500/20 text-center">
                                {message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg flex items-center justify-center gap-2 group"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in to Dashboard'}
                            {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </Button>
                    </form>

                    <div className="text-center">
                        <p className="text-sm text-secondary-500 font-medium">
                            Enterprise Multi-Branch Management System
                        </p>
                        <p className="text-xs text-secondary-400 mt-1">
                            &copy; 2026 Hudi-Soft Systems. All rights reserved.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
