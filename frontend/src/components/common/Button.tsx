import React from 'react';
import { classNames } from '../../utils/helpers.js';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2';

  const variantClasses: Record<string, string> = {
    primary: 'bg-gradient-primary text-white hover:shadow-lg',
    secondary: 'bg-gradient-secondary text-white hover:shadow-lg',
    outline: 'border-2 border-white text-white transition-all duration-200',
    ghost: 'text-white transition-all duration-200',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const getHoverStyle = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      };
    }
    return {};
  };

  return (
    <button
      className={classNames(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        (loading || disabled) && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseEnter={(e) => {
        if ((variant === 'outline' || variant === 'ghost') && !disabled) {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'outline' || variant === 'ghost') {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '';
        }
      }}
      disabled={loading || disabled}
      {...props}
    >
      {loading && <span className="animate-spin">⏳</span>}
      {icon && !loading && icon}
      {children}
    </button>
  );
};
