import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { tiendaService } from '@/features/tiendas'
import { Store, Search, MapPin, Star, ShieldCheck, CheckCircle2, Package, Tag, ArrowRight, MessageSquare, Sparkles } from 'lucide-react'
import Spinner from '@/components/common/Spinner'
import EmptyState from '@/components/common/EmptyState'
import { getMediaUrl } from '@/utils/constants'
import { useLanguage } from '@/hooks/useLanguage'

export const DirectorioTiendas = () => {
  const [tiendas, setTiendas] = useState([])
  const [marcas, setMarcas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [marcaFiltro, setMarcaFiltro] = useState('')
  const { t, idioma } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const [tiendasData, marcasData] = await Promise.all([
        tiendaService.listarTiendas(),
        tiendaService.listarMarcas(),
      ])
      setTiendas(tiendasData || [])
      setMarcas(marcasData || [])
    } catch (err) {
      console.error('Error al cargar directorio de tiendas:', err)
    } finally {
      setCargando(false)
    }
  }

  // Filtrado local dinámico
  const tiendasFiltradas = tiendas.filter((t) => {
    const coincideTexto =
      !busqueda.trim() ||
      t.nombreTienda?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.ciudad?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.marcas?.some((m) => m.toLowerCase().includes(busqueda.toLowerCase()))

    const coincideMarca =
      !marcaFiltro ||
      t.marcas?.some((m) => m.toLowerCase() === marcaFiltro.toLowerCase())

    return coincideTexto && coincideMarca
  })

  return (
    <div className="space-y-10 pb-20 font-sans">
      {/* Hero Banner Directorio */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mercatto-surface0/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30 backdrop-blur-sm">
            <Sparkles size={14} className="text-amber-400" />
            <span>{t('proveedores_certificados')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {t('directorio_tiendas_titulo')}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t('directorio_tiendas_sub')}
          </p>

          {/* Search bar inside banner */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t('buscar_tiendas')}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 text-white placeholder-slate-400 rounded-2xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white/15 backdrop-blur-md text-sm transition"
              />
              {busqueda && (
                <button
                  onClick={() => setBusqueda('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-mercatto-primary/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Marcas Destacadas Bar */}
      {marcas.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Tag size={16} className="text-mercatto-primary" />
              <span>{t('marcas_oficiales')} ({marcas.length})</span>
            </h2>
            {marcaFiltro && (
              <button
                onClick={() => setMarcaFiltro('')}
                className="text-xs font-semibold text-rose-500 hover:text-rose-600 underline cursor-pointer"
              >
                {t('limpiar')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setMarcaFiltro('')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                !marcaFiltro
                  ? 'bg-mercatto-primary text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-mercatto-border dark:border-slate-700 hover:border-indigo-400'
              }`}
            >
              {t('todas_las_categorias')}
            </button>
            {marcas.map((m) => (
              <button
                key={m}
                onClick={() => setMarcaFiltro(marcaFiltro === m ? '' : m)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  marcaFiltro === m
                    ? 'bg-mercatto-primary text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-mercatto-border dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                <span>{m}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Resultados y Contador */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>{tiendasFiltradas.length} {t('tiendas_oficiales')}</span>
        {(busqueda || marcaFiltro) && (
          <span>{busqueda && `"${busqueda}"`} {marcaFiltro && `[Marca: ${marcaFiltro}]`}</span>
        )}
      </div>

      {/* Grid de Tiendas */}
      {cargando ? (
        <Spinner size="lg" className="py-24" />
      ) : tiendasFiltradas.length === 0 ? (
        <EmptyState
          title={idioma === 'EN' ? 'No stores found' : 'No se encontraron tiendas'}
          description={idioma === 'EN' ? 'Try searching with different terms or reset your filters.' : 'Intenta buscar con otros términos o retira los filtros aplicados.'}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiendasFiltradas.map((tienda, idx) => {
            const portadasColeccion = [
              'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&auto=format&fit=crop&q=80'
            ]

            const detectarPortada = () => {
              if (tienda.portadaUrl) return tienda.portadaUrl
              const txt = `${tienda.nombreTienda} ${tienda.descripcion} ${tienda.marcas?.join(' ')}`.toLowerCase()
              if (txt.includes('gadget') || txt.includes('tecno') || txt.includes('celular') || txt.includes('apple') || txt.includes('sony') || txt.includes('nintendo')) {
                return portadasColeccion[0]
              }
              if (txt.includes('zapato') || txt.includes('calzado') || txt.includes('nike') || txt.includes('adidas') || txt.includes('puma') || txt.includes('sneaker')) {
                return portadasColeccion[1]
              }
              if (txt.includes('app') || txt.includes('software') || txt.includes('licencia') || txt.includes('adobe') || txt.includes('microsoft') || txt.includes('digital')) {
                return portadasColeccion[2]
              }
              if (txt.includes('ropa') || txt.includes('moda') || txt.includes('boutique') || txt.includes('vestir')) {
                return portadasColeccion[3]
              }
              if (txt.includes('deporte') || txt.includes('gym') || txt.includes('fitness')) {
                return portadasColeccion[4]
              }
              return portadasColeccion[idx % portadasColeccion.length]
            }

            const portadaElegida = detectarPortada()

            return (
              <div
                key={tienda.id}
                className="group bg-white dark:bg-slate-900 rounded-3xl border border-mercatto-border dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Banner / Portada */}
                <div className="relative h-32 bg-slate-900 overflow-hidden">
                  <img
                    src={getMediaUrl(portadaElegida, portadasColeccion[0])}
                    alt={tienda.nombreTienda}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-black/30" />

                  {tienda.tipoSuscripcion && tienda.tipoSuscripcion !== 'STARTER' && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md backdrop-blur-sm">
                      {tienda.tipoSuscripcion}
                    </span>
                  )}
                </div>

                {/* Info Container */}
                <div className="p-6 pt-0 flex-1 flex flex-col">
                  {/* Store Logo overlapping banner */}
                  <div className="flex items-end justify-between -mt-8 mb-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-lg border-2 border-white dark:border-slate-800 overflow-hidden">
                      <img
                        src={getMediaUrl(tienda.logoUrl, 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150&auto=format&fit=crop&q=80')}
                        alt={tienda.nombreTienda}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span>{(tienda.calificacion || 5.0).toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-mercatto-primary transition truncate">
                        {tienda.nombreTienda}
                      </h3>
                      <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin size={12} />
                      <span>{tienda.ciudad || 'Colombia'}</span>
                    </p>

                    <p className="text-xs text-slate-500 line-clamp-2 pt-1">
                      {tienda.descripcion || (idioma === 'EN' ? 'Verified official store at Mercatto with direct warranty.' : 'Tienda oficial verificada en Mercatto con catálogo completo de productos directos de fábrica.')}
                    </p>
                  </div>

                  {/* Marcas que maneja */}
                  {tienda.marcas && tienda.marcas.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {t('marcas_oficiales')}
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {tienda.marcas.slice(0, 3).map((m) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botones de acción */}
                  <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                    <Link
                      to={`/tienda/${tienda.id}`}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-mercatto-primary text-white font-bold text-xs text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                      <span>{t('ver_tienda')}</span>
                      <ArrowRight size={14} />
                    </Link>

                    {tienda.usuarioId && (
                      <button
                        onClick={() => navigate(`/mensajes?vendedorId=${tienda.usuarioId}`)}
                        className="p-2.5 rounded-xl border border-mercatto-border dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-mercatto-surface hover:text-mercatto-primary dark:hover:bg-slate-800 transition cursor-pointer"
                        title={t('contacto')}
                      >
                        <MessageSquare size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default DirectorioTiendas
