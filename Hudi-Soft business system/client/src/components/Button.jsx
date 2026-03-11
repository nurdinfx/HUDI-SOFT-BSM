import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({ className, variant = 'primary', ...props }) => {
    const variants = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800',
        secondary: 'bg-secondary-200 text-secondary-900 hover:bg-secondary-300 active:bg-secondary-400 dark:bg-secondary-800 dark:text-secondary-100 dark:hover:bg-secondary-700',
        outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-950',
        ghost: 'text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-800',
        danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    };

    return (
        <button
            className={twMerge(
                'px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-premium hover:shadow-premium-hover',
                variants[variant],
                className
            )}
            {...props}
        />
    );
};

export default Button;
