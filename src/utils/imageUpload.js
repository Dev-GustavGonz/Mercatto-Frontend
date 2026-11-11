// imageUpload.js — Normalización, compresión y conversión de imágenes antes de subirlas al backend

const MAX_UPLOAD_BYTES = 28 * 1024 * 1024 // Margen seguro bajo el límite de 30 MB de Supabase y el servidor
const SUPPORTED_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.jfif', '.bmp', '.avif']
const BACKEND_NATIVE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp'])

const getLowerExt = (filename = '') => {
  const idx = filename.lastIndexOf('.')
  return idx >= 0 ? filename.slice(idx).toLowerCase() : ''
}

const normalizeNativeMime = (mime, ext) => {
  const clean = (mime || '').toLowerCase().split(';')[0].trim()
  if (clean === 'image/jpg' || clean === 'image/pjpeg') return 'image/jpeg'
  if (clean === 'image/x-png') return 'image/png'
  if (['image/jpeg', 'image/png', 'image/webp'].includes(clean)) return clean
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  return 'image/jpeg'
}

const loadImageBitmapOrElement = async (file) => {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file)
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
        cleanup: () => bitmap.close?.(),
      }
    } catch {
      // Fallback a HTMLImageElement si createImageBitmap no soporta este codec/archivo
    }
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h),
        cleanup: () => URL.revokeObjectURL(url),
      })
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('No se pudo leer la imagen seleccionada. Intenta guardarla como JPG o PNG.'))
    }
    img.src = url
  })
}

const canvasToBlob = (canvas, mimeType, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo procesar la imagen para subirla.'))
          return
        }
        resolve(blob)
      },
      mimeType,
      quality
    )
  })

/**
 * Garantiza que cualquier imagen seleccionada desde el PC cumpla con:
 * - Formato aceptado por el backend (JPG/PNG/WEBP/GIF), convirtiendo .jfif/.avif/.bmp automáticamente
 * - Tamaño <= 28 MB (redimensionando y recomprimiendo proporcionalmente si excede)
 * - Nombre de archivo corto y limpio para evitar desbordar límites de URL en base de datos
 */
export const prepararImagenParaSubida = async (
  file,
  { prefix = 'img', maxWidth = 1600, maxHeight = 1200, maxBytes = MAX_UPLOAD_BYTES } = {}
) => {
  if (!file) {
    throw new Error('No se seleccionó ningún archivo.')
  }

  const ext = getLowerExt(file.name)
  const mime = (file.type || '').toLowerCase()
  const looksLikeImage = mime.startsWith('image/') || SUPPORTED_IMAGE_EXTS.includes(ext)

  if (!looksLikeImage || mime === 'image/svg+xml' || ext === '.svg') {
    throw new Error('Formato no válido. Selecciona una imagen JPG, PNG, WEBP o GIF.')
  }

  const stamp = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`

  // Mantener GIFs que ya cumplen tamaño (para conservar animación si aplica)
  if ((mime === 'image/gif' || ext === '.gif') && file.size <= maxBytes) {
    return new File([file], `${prefix}_${stamp}.gif`, { type: 'image/gif' })
  }

  // Si ya está en formato nativo y dentro del tamaño límite, solo normalizamos nombre corto y MIME
  if (
    BACKEND_NATIVE_EXTS.has(ext) &&
    file.size <= maxBytes &&
    (!mime || mime.startsWith('image/'))
  ) {
    const cleanMime = normalizeNativeMime(mime, ext)
    const cleanExt = cleanMime === 'image/png' ? '.png' : cleanMime === 'image/webp' ? '.webp' : '.jpg'
    return new File([file], `${prefix}_${stamp}${cleanExt}`, { type: cleanMime })
  }

  // Convertir o comprimir imágenes grandes (> 1.85 MB) o formatos como .jfif / .avif / .bmp
  const source = await loadImageBitmapOrElement(file)
  try {
    let targetW = source.width || maxWidth
    let targetH = source.height || maxHeight

    const ratio = Math.min(1, maxWidth / targetW, maxHeight / targetH)
    targetW = Math.max(1, Math.round(targetW * ratio))
    targetH = Math.max(1, Math.round(targetH * ratio))

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Tu navegador no soporta el procesamiento de imágenes.')
    }

    const render = (w, h, fillWhite) => {
      canvas.width = w
      canvas.height = h
      ctx.clearRect(0, 0, w, h)
      if (fillWhite) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, w, h)
      }
      source.draw(ctx, w, h)
    }

    // Intentar primero JPEG de alta calidad (rellenando fondo blanco por si trae transparencia)
    let w = targetW
    let h = targetH
    const qualities = [0.9, 0.82, 0.72, 0.6]

    for (let attempt = 0; attempt < 3; attempt++) {
      render(w, h, true)
      for (const q of qualities) {
        const blob = await canvasToBlob(canvas, 'image/jpeg', q)
        if (blob.size <= maxBytes) {
          return new File([blob], `${prefix}_${stamp}.jpg`, { type: 'image/jpeg' })
        }
      }
      w = Math.max(320, Math.round(w * 0.75))
      h = Math.max(180, Math.round(h * 0.75))
    }

    throw new Error('La imagen es demasiado pesada incluso tras optimizarla. Prueba con una más liviana.')
  } finally {
    source.cleanup()
  }
}
