import React from 'react';

export const Badge = ({ children, variant = 'teal', dot = false, size = 'md', onClick, className = '' }) => {
  const variantClass = `badge-${variant}`;
  const sizeClass = size === 'sm' ? 'py-0.5 px-1.5 text-[0.675rem]' : size === 'lg' ? 'py-1 px-3 text-[0.8rem]' : 'py-[3px] px-[9px] text-[0.725rem]';

  return (
    <span
      onClick={onClick}
      className={`badge inline-flex items-center gap-1.5 leading-none ${variantClass} ${sizeClass} ${onClick ? 'cursor-pointer' : 'cursor-inherit'} transition-all duration-150 ${className}`}
    >
      {dot && (
        <span
          className={`pulse-indicator ${
            variant === 'rose' ? 'red' : variant === 'emerald' ? 'green' : variant === 'amber' ? 'amber' : 'teal'
          } w-1.5 h-1.5 shrink-0`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};
