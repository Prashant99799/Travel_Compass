import React from 'react';
import { classNames } from '../../utils/helpers.js';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  helperText,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-white mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={classNames(
            'w-full px-4 py-2 rounded-lg glass text-white placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-purple-500',
            icon ? 'pl-10' : '',
            error ? 'ring-2 ring-red-500' : '',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      {helperText && <p className="mt-1 text-sm text-gray-400">{helperText}</p>}
    </div>
  );
};
