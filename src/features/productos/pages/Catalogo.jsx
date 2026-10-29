import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productoService } from '@/features/productos'
import ProductGrid from '../components/ProductGrid'
import ProductFilters from '../components/ProductFilters'
import Pagination from '@/components/common/Pagination'
import ModalContactoVendedor from '../components/ModalContactoVendedor'
import { useLanguage } from '@/hooks/useLanguage'

export const Catalogo = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [productos, setProductos] = useState([])
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [productoContacto, setProductoContacto] = useState(null)
  const { t } = useLanguage()

  const categoriaId = searchParams.get('categoriaId') || null
  const marca = searchParams.get('marca') || ''
  const termino = searchParams.get('q') || ''
  const orden = searchParams.get('orden') || 'recientes'
  const pagina = Number(searchParams.get('pagina') || 0)
  const precioMin = searchParams.get('precioMin') ? Number(searchParams.get('precioMin')) : null
  const precioMax = searchParams.get('precioMax') ? Number(searchParams.get('precioMax')) : null
  const soloElite = searchParams.get('soloElite') === 'true'

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true)
      try {
        const data = await productoService.listar({
          categoriaId,
          marca: marca || null,
          q: termino,
          orden,
          pagina,
          precioMin,
          precioMax,
          soloElite: soloElite ? true : undefined,
          tamano: 24,
        })
        let items = data.content || []
        if (soloElite) {
          items = items.filter(p => (p.vendedor?.tipoSuscripcion || p.vendedor?.plan || '').toUpperCase() === 'ELITE')
        }
        // Si no hay un orden de precio o ventas explícito, priorizar por membresía: ÉLITE > PRO > STARTER
        if (!orden || orden === 'recientes') {
          items.sort((a, b) => {
            const getPriority = (p) => {
              const s = (p.vendedor?.tipoSuscripcion || p.vendedor?.plan || '').toUpperCase()
              if (s === 'ELITE') return 3
              if (s === 'PRO') return 2
              return 1
            }
            const pDiff = getPriority(b) - getPriority(a)
            if (pDiff !== 0) return pDiff
            if (b.destacado !== a.destacado) return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0)
            return (b.totalVentas || 0) - (a.totalVentas || 0)
          })
        }
        setProductos(items)
        setTotalPages(data.totalPages || 0)
      } catch {
        setProductos([])
      } finally {
        setLoading(false)
      }
    }
    fetchProductos()
  }, [categoriaId, marca, termino, orden, pagina, precioMin, precioMax, soloElite])

  const handleCategoryChange = (catId) => {
    const next = new URLSearchParams(searchParams)
    if (catId) {
      next.set('categoriaId', catId)
    } else {
      next.delete('categoriaId')
    }
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handleMarcaChange = (nuevaMarca) => {
    const next = new URLSearchParams(searchParams)
    if (nuevaMarca) {
      next.set('marca', nuevaMarca)
    } else {
      next.delete('marca')
    }
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handlePriceChange = ({ min, max }) => {
    const next = new URLSearchParams(searchParams)
    if (min) next.set('precioMin', min)
    else next.delete('precioMin')
    if (max) next.set('precioMax', max)
    else next.delete('precioMax')
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handleSoloEliteChange = (checked) => {
    const next = new URLSearchParams(searchParams)
    if (checked) {
      next.set('soloElite', 'true')
    } else {
      next.delete('soloElite')
    }
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handleOrdenChange = (newOrden) => {
    const next = new URLSearchParams(searchParams)
    next.set('orden', newOrden)
    next.set('pagina', '0')
    setSearchParams(next)
  }

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams)
    next.set('pagina', newPage.toString())
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setSearchParams({})
  }

  return (
    <div className="space-y-6 pb-16 font-sans">
      <div>
        <h1 className="text-2xl font-black text-mercatto-text dark:text-white">
          {termino ? `${t('resultados_para')}: "${termino}"` : t('catalogo_de_productos')}
        </h1>
        <p className="text-xs text-mercatto-muted mt-1">{t('explora_productos_publicados')}</p>
      </div>

      {soloElite && (
        <div className="flex items-center justify-between gap-3 p-3.5 bg-gradient-to-r bg-mercatto-elite-bg/50 border border-amber-300/70 rounded-2xl animate-in fade-in">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-mercatto-elite-text dark:text-amber-200">
            <span className="text-base">👑</span>
            <span>Filtro Exclusivo Activado: Mostrando productos de Tiendas con Plan Élite</span>
          </div>
          <button
            onClick={() => handleSoloEliteChange(false)}
            className="text-xs font-bold text-amber-900 dark:text-amber-100 bg-white/90 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-700 transition cursor-pointer shadow-xs"
          >
            Quitar filtro
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <ProductFilters
            selectedCategory={categoriaId}
            onCategoryChange={handleCategoryChange}
            selectedMarca={marca}
            onMarcaChange={handleMarcaChange}
            priceRange={{ min: precioMin, max: precioMax }}
            onPriceChange={handlePriceChange}
            orden={orden}
            onOrdenChange={handleOrdenChange}
            soloElite={soloElite}
            onSoloEliteChange={handleSoloEliteChange}
            onReset={handleReset}
          />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          <ProductGrid
            productos={productos}
            loading={loading}
            onContactClick={(prod) => setProductoContacto(prod)}
          />

          <Pagination
            currentPage={pagina}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {productoContacto && (
        <ModalContactoVendedor
          isOpen={true}
          producto={productoContacto}
          onClose={() => setProductoContacto(null)}
        />
      )}
    </div>
  )
}

export default Catalogo
