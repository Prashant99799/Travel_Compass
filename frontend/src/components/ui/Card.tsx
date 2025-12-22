import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const Component = hover || onClick ? motion.div : 'div';
  
  const baseProps = {
    className: `
      bg-white rounded-2xl border border-slate-100 shadow-sm
      ${paddingClasses[padding]}
      ${hover ? 'transition-shadow duration-200 hover:shadow-md' : ''}
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `
  };

  const motionProps = hover || onClick ? {
    whileHover: { y: -2 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component {...baseProps} {...motionProps} onClick={onClick}>
      {children}
    </Component>
  );
};

export default Card;
