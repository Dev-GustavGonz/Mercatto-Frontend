import React from 'react'

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    xs: 'h-3 w-3 border-[1.5px]',
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[2.5px]',
  }

  return (
    <div className={`flex justify-center items-center py-2 ${className}`}>
      <div
        className={`animate-[spin_0.5s_linear_infinite] rounded-full border-slate-200 dark:border-slate-800 border-t-violet-600 dark:border-t-violet-400 ${sizes[size]}`}
      />
    </div>
  )
}

export default Spinner
