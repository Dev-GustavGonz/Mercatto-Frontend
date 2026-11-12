import React, { useEffect, useMemo, useState } from 'react'
import { getMediaUrl } from '@/utils/constants'
import { resolveProductImage } from '@/utils/productUtils'

const FALLBACK_IMAGE = '/images/bento/headphones.png'

export const ProductImages = ({ imagenes = [], titulo = 'Producto', producto = null }) => {
  const defaultImage = useMemo(
    () => (producto ? resolveProductImage(producto) : FALLBACK_IMAGE),
    [producto]
  )

  const lista = useMemo(() => {
    const raw = Array.isArray(imagenes) ? imagenes : []
    const validas = raw
      .filter((img) => img && typeof img.url === 'string' && img.url.trim() !== '')
      .sort((a, b) => {
        const aPrin = a.principal || a.esPrincipal ? 1 : 0
        const bPrin = b.principal || b.esPrincipal ? 1 : 0
        if (aPrin !== bPrin) return bPrin - aPrin
        return (a.ordenVisual ?? 0) - (b.ordenVisual ?? 0)
      })
      .map((img, idx) => ({
        ...img,
        id: img.id ?? idx,
        url: getMediaUrl(img.url, defaultImage),
      }))
      .filter((img) => img.url && img.url.trim() !== '')

    return validas.length > 0 ? validas : [{ id: 0, url: defaultImage }]
  }, [imagenes, defaultImage])

  const [activa, setActiva] = useState(lista[0]?.url || defaultImage)

  useEffect(() => {
    setActiva(lista[0]?.url || defaultImage)
  }, [lista, defaultImage])

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      {lista.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto max-h-96 pb-2 md:pb-0">
          {lista.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setActiva(img.url)}
              className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                activa === img.url ? 'border-indigo-600 scale-95 shadow-md' : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={`Vista ${idx + 1}`}
                onError={(e) => {
                  e.currentTarget.onerror = null
                  e.currentTarget.src = FALLBACK_IMAGE
                }}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 aspect-square rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-4">
        <img
          src={activa}
          alt={titulo}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = FALLBACK_IMAGE
          }}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-500 mix-blend-multiply dark:mix-blend-normal"
        />
      </div>
    </div>
  )
}

export default ProductImages
