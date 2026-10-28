import React, { useEffect, useState } from 'react'
import { productoService } from '@/features/productos'
import { tiendaService } from '@/features/tiendas'
import Button from '@/components/common/Button'
import { Filter, RotateCcw, Tag, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export const ProductFilters = ({
  selectedCategory,
  onCategoryChange,
  selectedMarca,
  onMarcaChange,
  priceRange,
  onPriceChange,
  orden,
  onOrdenChange,
  soloElite = false,
  onSoloEliteChange,
  onReset,
}) => {
  const [categorias, setCategorias] = useState([])
  const [marcas, setMarcas] = useState([])
  const [precioMin, setPrecioMin] = useState(priceRange.min || '')
  const [precioMax, setPrecioMax] = useState(priceRange.max || '')
  const { t } = useLanguage()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    productoService.listarCategorias().then((data) => setCategorias(data || [])).catch(() => {})
    tiendaService.listarMarcas().then((data) => setMarcas(data || [])).catch(() => {})
  }, [])

  const handleApplyPrice = (e) => {
    e.preventDefault()
    onPriceChange({ min: precioMin ? Number(precioMin) : null, max: precioMax ? Number(precioMax) : null })
  }

  const filtrosActivosCount = (selectedCategory ? 1 : 0) + (selectedMarca ? 1 : 0) + (soloElite ? 1 : 0) + (precioMin || precioMax ? 1 : 0)

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-mercatto-border dark:border-slate-800">
      {/* Header con botón expandible en vista móvil */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 font-bold text-slate-800 dark:text-white text-sm cursor-pointer lg:cursor-default"
        >
          <Filter size={16} className="text-mercatto-primary" />
          <span>{t('filtros_dinamicos')}</span>
          {filtrosActivosCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-mercatto-soft dark:bg-violet-950 text-mercatto-deep dark:text-violet-300 text-[10px] font-black">
              {filtrosActivosCount}
            </span>
          )}
          <span className="lg:hidden text-slate-400 ml-1">
            {mobileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>

        <div className="flex items-center gap-2">
          {filtrosActivosCount > 0 && (
            <button
              onClick={() => {
                setPrecioMin('')
                setPrecioMax('')
                if (onSoloEliteChange) onSoloEliteChange(false)
                onReset()
              }}
              className="text-xs text-slate-400 hover:text-mercatto-primary flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>{t('limpiar')}</span>
            </button>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden text-xs font-bold text-violet-600 dark:text-violet-400"
          >
            {mobileOpen ? 'Ocultar' : 'Filtrar'}
          </button>
        </div>
      </div>

      {/* Contenido de filtros: siempre visible en desktop, colapsable en móvil */}
      <div className={`${mobileOpen ? 'block' : 'hidden lg:block'} space-y-6 pt-4`}>
      {/* Filtro Exclusivo Plan Élite */}
      <div className="p-3.5 rounded-2xl bg-mercatto-elite-bg/40 border border-amber-300/60 dark:border-amber-500/20 shadow-xs">
        <label className="flex items-center justify-between cursor-pointer select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-mercatto-elite-bg text-mercatto-elite dark:text-amber-400 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              👑
            </div>
            <div>
              <span className="block text-xs font-black text-slate-900 dark:text-white leading-tight">
                Tiendas Plan Élite
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Solo tiendas VIP verificadas
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={Boolean(soloElite)}
            onChange={(e) => onSoloEliteChange && onSoloEliteChange(e.target.checked)}
            className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Ordenamiento */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          {t('ordenar_por')}
        </label>
        <select
          value={orden}
          onChange={(e) => onOrdenChange(e.target.value)}
          className="w-full text-xs font-medium bg-slate-50 dark:bg-slate-800 border border-mercatto-border dark:border-slate-700 rounded-xl p-2.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="recientes">{t('mas_recientes')}</option>
          <option value="precio_asc">{t('menor_precio')}</option>
          <option value="precio_desc">{t('mayor_precio')}</option>
          <option value="calificacion">{t('mejor_valorados')}</option>
          <option value="ventas">{t('mas_vendidos')}</option>
        </select>
      </div>

      {/* Categorías Dinámicas */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
          <Layers size={13} className="text-indigo-500" />
          <span>{t('categorias')} ({categorias.length})</span>
        </label>
        <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              !selectedCategory
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-mercatto-primary font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {t('todas_las_categorias')}
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                String(selectedCategory) === String(cat.id)
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-mercatto-primary font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Marcas Dinámicas */}
      {marcas && marcas.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Tag size={13} className="text-indigo-500" />
              <span>{t('marcas_oficiales')} ({marcas.length})</span>
            </label>
            {selectedMarca && (
              <button
                onClick={() => onMarcaChange('')}
                className="text-[10px] text-mercatto-primary hover:underline font-semibold"
              >
                {t('view_all')}
              </button>
            )}
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => onMarcaChange('')}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                !selectedMarca
                  ? 'bg-indigo-50 dark:bg-indigo-950/40 text-mercatto-primary font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('view_all')}
            </button>
            {marcas.map((m) => (
              <button
                key={m}
                onClick={() => onMarcaChange(selectedMarca === m ? '' : m)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center justify-between ${
                  selectedMarca === m
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-mercatto-primary font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{m}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rango de Precios */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          {t('precio')}
        </label>
        <form onSubmit={handleApplyPrice} className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder={t('min')}
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-mercatto-border dark:border-slate-700 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <input
              type="number"
              placeholder={t('max')}
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-mercatto-border dark:border-slate-700 rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="w-full text-xs">
            {t('aplicar')}
          </Button>
        </form>
      </div>
      </div>
    </div>
  )
}

export default ProductFilters
