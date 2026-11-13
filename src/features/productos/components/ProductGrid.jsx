import React from 'react'
import ProductCard from './ProductCard'
import EmptyState from '@/components/common/EmptyState'
import Spinner from '@/components/common/Spinner'
import { useLanguage } from '@/hooks/useLanguage'

export const ProductGrid = ({
  productos = [],
  loading = false,
  onContactClick,
  emptyTitle,
  emptyDescription,
}) => {
  const { t, idioma } = useLanguage()

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 sm:p-4 animate-pulse space-y-3"
          >
            <div className="h-36 sm:h-48 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-3/4 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-4 w-1/2 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="h-8 w-full rounded-xl bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    )
  }

  const defaultTitle = emptyTitle || (idioma === 'EN' ? 'No products found' : 'No encontramos productos')
  const defaultDesc = emptyDescription || (idioma === 'EN' ? 'Try searching with different terms or reset your filters.' : 'Intenta buscar con otros términos o cambia los filtros seleccionados.')

  if (!productos || productos.length === 0) {
    return <EmptyState title={defaultTitle} description={defaultDesc} />
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
      {productos.map((prod) => (
        <ProductCard key={prod.id} producto={prod} onContactClick={onContactClick} />
      ))}
    </div>
  )
}

export default ProductGrid
