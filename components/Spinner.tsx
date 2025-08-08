
import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-12 w-12 border-4',
        lg: 'h-24 w-24 border-8'
    };

    return (
        <div 
            className={`
                ${sizeClasses[size]} 
                border-pink-500 
                border-t-transparent 
                rounded-full 
                animate-spin
            `} 
            role="status"
            aria-label="Loading"
        >
        </div>
    );
};

export default Spinner;
