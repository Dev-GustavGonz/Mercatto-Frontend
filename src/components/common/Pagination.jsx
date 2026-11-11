import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i)
      return pages
    }
    pages.push(0)
    const start = Math.max(1, currentPage - 1)
    const end = Math.min(totalPages - 2, currentPage + 1)
    if (start > 1) pages.push('ellipsis-start')
    for (let i = start; i <= end; i++) pages.push(i)
    if (end < totalPages - 2) pages.push('ellipsis-end')
    pages.push(totalPages - 1)
    return pages
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 py-6">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      {getPageNumbers().map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="px-2 text-xs font-bold text-slate-400 select-none">
            …
          </span>
        ) : (
          <button
            type="button"
            key={item}
            onClick={() => onPageChange(item)}
            className={`min-w-[36px] h-9 px-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              item === currentPage
                ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600'
            }`}
          >
            {item + 1}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
        aria-label="Página siguiente"
      >
        <ChevronRight size={18} />
      </button>

      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2">
        Página {currentPage + 1} de {totalPages}
      </span>
    </div>
  )
}

export default Pagination
