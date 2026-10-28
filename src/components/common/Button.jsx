import React from 'react'

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, danger, ghost
  size = 'md',        // sm, md, lg
  className = '',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md hover:shadow-gray-300'

  const sizes = {
    sm: 'px-4 py-1.5 text-xs',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base font-semibold',
  }

  const variants = {
    primary:
      'bg-mercatto-primary hover:bg-mercatto-deep text-white shadow-xs hover:shadow-md hover:shadow-violet-500/20 focus:ring-mercatto-primary',
    secondary:
      'bg-mercatto-dark hover:bg-slate-900 text-white focus:ring-mercatto-dark',
    outline:
      'border border-mercatto-border dark:border-slate-700 bg-white dark:bg-slate-900 text-mercatto-text dark:text-slate-200 hover:bg-mercatto-surface dark:hover:bg-slate-800 focus:ring-mercatto-primary',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-md focus:ring-rose-500',
    ghost:
      'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-slate-300',
  }

  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <span>Cargando...</span>
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default Button
