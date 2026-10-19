import React from 'react'
import { PackageOpen } from 'lucide-react'
import Button from './Button'

export const EmptyState = ({
  icon: Icon = PackageOpen,
  title = 'No hay elementos para mostrar',
  description = 'Intenta ajustar tus filtros o buscar con otros términos.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
