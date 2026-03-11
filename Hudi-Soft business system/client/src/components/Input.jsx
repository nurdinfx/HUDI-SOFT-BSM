import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Input = ({ label, error, className, ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 ml-1">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    'w-full px-4 py-3 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-800 rounded-xl outline-none transition-all duration-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 placeholder:text-secondary-400',
                    error && 'border-red-500 focus:ring-red-500/20 focus:border-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <p className="text-xs font-medium text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
};

export default Input;
