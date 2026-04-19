import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  headerAction?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  icon,
  children,
  className = '',
  bodyClassName = '',
  headerAction,
  noPadding = false,
}) => {
  const hasHeader = title || icon || headerAction;

  return (
    <div
      className={`rounded-2xl transition-all duration-200 ${className}`}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {hasHeader && (
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid var(--border-color)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <div className="shrink-0 text-brand-blue">{icon}</div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {headerAction && (
            <div className="shrink-0 ml-3">{headerAction}</div>
          )}
        </div>
      )}
      <div className={noPadding ? bodyClassName : `p-5 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};
