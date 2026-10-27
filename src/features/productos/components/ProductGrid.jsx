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
    return <Spinner size="lg" className="py-20" />
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
