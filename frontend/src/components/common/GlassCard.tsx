import React from 'react';
import { classNames } from '../../utils/helpers';

export interface GlassCardProps {
  variant?: 'default' | 'strong';
  hover?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  variant = 'default',
  hover = true,
  children,
  className,
  onClick,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getBackgroundStyle = () => {
    if (isHovered && hover) {
      return 'rgba(255, 255, 255, 0.15)';
    }
    return variant === 'default' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)';
  };

  const getBackdropClass = () => {
    return variant === 'default' ? 'backdrop-blur-lg' : 'backdrop-blur-2xl';
  };

  const getBorderClass = () => {
    return variant === 'default' ? 'border-white/20' : 'border-white/30';
  };

  return (
    <div
      className={classNames(
        getBackdropClass(),
        'border rounded-xl p-6 transition-all duration-300',
        getBorderClass(),
        hover && 'cursor-pointer',
        className
      )}
      style={{
        backgroundColor: getBackgroundStyle(),
        borderColor: 'rgba(255, 255, 255, ' + (variant === 'default' ? '0.2' : '0.3') + ')',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};
