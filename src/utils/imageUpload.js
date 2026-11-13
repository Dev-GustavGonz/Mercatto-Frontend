// imageUpload.js — Normalización, compresión, validaciones y mensajes claros de error para imágenes

import { extractApiErrorMessage } from '@/utils/validators'

export const MAX_INPUT_IMAGE_BYTES = 30 * 1024 * 1024 // Límite aceptado por el bucket de Supabase (30 MB)
const TARGET_OPTIMIZED_BYTES = Math.floor(1.8 * 1024 * 1024) // Objetivo liviano tras optimizar para carga rápida y compatibilidad
const MAX_GIF_BYTES = 28 * 1024 * 1024 // GIFs animados se envían sin rasterizar hasta 28 MB

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
      reject(
        new Error(
          'No se pudo abrir esta imagen porque el archivo está dañado o usa un formato no compatible. Intenta guardarla como JPG o PNG y volver a subirla.'
        )
      )
    }
    img.src = url
  })
}

const canvasToBlob = (canvas, mimeType, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Tu navegador no pudo procesar la imagen para subirla.'))
          return
        }
        resolve(blob)
      },
      mimeType,
      quality
    )
  })

/**
 * Valida una URL de imagen pegada manualmente antes de guardarla en BD.
 */
export const validarUrlImagen = (rawUrl, etiqueta = 'la imagen') => {
  const url = (rawUrl || '').trim()
  if (!url) return null

  const lower = url.toLowerCase()

  if (lower.startsWith('blob:')) {
    return `El enlace de ${etiqueta} ("blob:...") es temporal y solo funciona en la pestaña donde lo copiaste (por ejemplo Gemini o ChatGPT). Descarga la imagen en tu equipo y súbela con el botón «Subir archivo desde PC».`
  }
  // data:image es aceptado como respaldo en caso de que el backend devuelva temporalmente una imagen codificada mientras se sincroniza el almacenamiento en la nube
  if (lower.startsWith('data:') && !lower.startsWith('data:image/')) {
    return `Pegaste un contenido inválido en ${etiqueta}. Usa el botón «Subir archivo desde PC» para subir una imagen estándar.`
  }
  if (lower.startsWith('file://') || /^[a-z]:\\/i.test(url) || url.startsWith('\\\\')) {
    return `Pegaste una ruta local de tu computador en ${etiqueta}. Usa el botón «Subir archivo desde PC» para subirla correctamente.`
  }
  if (/\s/.test(url)) {
    return `El enlace de ${etiqueta} contiene espacios inválidos. Verifica la URL o sube el archivo desde tu PC.`
  }

  const esRutaInternaValida = lower.startsWith('/uploads/') || lower.startsWith('/images/') || lower.startsWith('data:image/')
  const esHttpValida = /^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(url)

  if (!esRutaInternaValida && !esHttpValida) {
    return `El enlace de ${etiqueta} no es válido. Debe comenzar por https:// o http://, o puedes cargar el archivo con «Subir archivo desde PC».`
  }
  if (!lower.startsWith('data:') && url.length > 2000) {
    return `El enlace de ${etiqueta} es demasiado largo (máximo 2000 caracteres). Descarga la imagen y súbela desde tu PC.`
  }

  return null
}

/**
 * Parafrasea errores técnicos del backend/red/validación a un mensaje claro y accionable para el usuario.
 */
export const formatearErrorImagen = (err, fallback = 'No se pudo subir la imagen.') => {
  if (!err) return fallback

  const status = err?.response?.status
  const rawMsg = err?.response ? extractApiErrorMessage(err, '') : err?.message || ''
  const lower = String(rawMsg).toLowerCase()

  if (status === 401) {
    return 'Tu sesión expiró mientras intentabas subir la imagen. Inicia sesión nuevamente e inténtalo otra vez.'
  }
  if (status === 403) {
    return 'Tu cuenta no tiene permisos activos para modificar imágenes de tienda. Verifica tu sesión.'
  }

  // Errores de tamaño máximo del servidor / Nginx / Spring / Supabase (2MB, 10MB, 30MB, 413)
  if (
    status === 413 ||
    lower.includes('tamaño máximo') ||
    lower.includes('supera el tamaño') ||
    lower.includes('maxuploadsize') ||
    lower.includes('payload too large') ||
    lower.includes('exceeds')
  ) {
    const match = rawMsg.match(/(\d+(?:[.,]\d+)?)\s*MB/i)
    const limite = match ? `${match[1]} MB` : 'permitido'
    if (match && Number(match[1].replace(',', '.')) <= 2) {
      return `El servidor backend rechazó el archivo porque aún aplica un límite de ${limite} (aunque en Supabase sea mayor). Prueba con una imagen más liviana o reinicia/redespliega el backend con la configuración de 30 MB.`
    }
    return `La imagen pesa más de lo permitido por el servidor (límite: ${limite}). Usa una imagen más liviana o en formato JPG/WEBP.`
  }

  if (lower.includes('formato') || lower.includes('mime') || lower.includes('no permitido')) {
    return 'El formato de este archivo no es compatible. Usa una imagen JPG, PNG, WEBP o GIF estándar.'
  }

  if (lower.includes('supabase storage') || (status >= 500 && lower.includes('supabase'))) {
    return 'El servicio de almacenamiento (Supabase) rechazó la subida de esta imagen. Verifica que el archivo no supere el límite del bucket o intenta nuevamente.'
  }

  if (err?.code === 'ECONNABORTED' || lower.includes('timeout')) {
    return 'La subida tardó demasiado tiempo y se canceló. Revisa tu conexión o prueba con una imagen más liviana.'
  }

  if (!err?.response && err?.message === 'Network Error') {
    return 'No se pudo conectar con el servidor para subir la imagen. Verifica tu conexión a internet o que el servidor esté encendido.'
  }

  if (status >= 500) {
    return 'Ocurrió un error interno en el servidor al procesar tu imagen. Inténtalo de nuevo en unos momentos.'
  }

  return rawMsg || fallback
}

/**
 * Valida el archivo elegido y lo optimiza automáticamente en el navegador si supera 1.8 MB o usa un formato no nativo (.jfif, .avif, .bmp).
 */
export const prepararImagenParaSubida = async (
  file,
  {
    prefix = 'img',
    maxWidth = 1600,
    maxHeight = 1200,
    maxInputBytes = MAX_INPUT_IMAGE_BYTES,
    targetBytes = TARGET_OPTIMIZED_BYTES,
  } = {}
) => {
  if (!file) {
    throw new Error('No seleccionaste ninguna imagen.')
  }
  if (file.size === 0) {
    throw new Error('El archivo seleccionado está vacío (0 bytes). Descárgalo nuevamente antes de subirlo.')
  }
  if (file.size > maxInputBytes) {
    const megas = (file.size / (1024 * 1024)).toFixed(1)
    const maxMb = Math.round(maxInputBytes / (1024 * 1024))
    throw new Error(
      `La imagen seleccionada pesa ${megas} MB y excede el máximo permitido de ${maxMb} MB. Elige un archivo más liviano.`
    )
  }

  const ext = getLowerExt(file.name)
  const mime = (file.type || '').toLowerCase()
  const looksLikeImage = mime.startsWith('image/') || SUPPORTED_IMAGE_EXTS.includes(ext)

  if (!looksLikeImage || mime === 'image/svg+xml' || ext === '.svg') {
    throw new Error('El archivo elegido no es una imagen válida. Selecciona una imagen JPG, PNG, WEBP o GIF.')
  }

  const stamp = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`

  // Conservar GIFs animados sin rasterizar hasta 28 MB
  if (mime === 'image/gif' || ext === '.gif') {
    if (file.size > MAX_GIF_BYTES) {
      throw new Error('El archivo GIF supera los 28 MB. Usa un GIF más corto o una imagen JPG/PNG.')
    }
    return new File([file], `${prefix}_${stamp}.gif`, { type: 'image/gif' })
  }

  // Si ya está en formato nativo y es liviana (<= 1.8 MB), conservar calidad exacta y normalizar nombre/MIME
  if (
    BACKEND_NATIVE_EXTS.has(ext) &&
    file.size <= targetBytes &&
    (!mime || mime.startsWith('image/'))
  ) {
    const cleanMime = normalizeNativeMime(mime, ext)
    const cleanExt = cleanMime === 'image/png' ? '.png' : cleanMime === 'image/webp' ? '.webp' : '.jpg'
    return new File([file], `${prefix}_${stamp}${cleanExt}`, { type: cleanMime })
  }

  // Optimizar imágenes > 1.8 MB o formatos no nativos (.jfif, .avif, .bmp) a JPEG nítido y liviano
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
      throw new Error('Tu navegador no permite optimizar imágenes automáticamente.')
    }

    let w = targetW
    let h = targetH
    const qualities = [0.9, 0.82, 0.72, 0.6]

    for (let attempt = 0; attempt < 3; attempt++) {
      canvas.width = w
      canvas.height = h
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)
      source.draw(ctx, w, h)

      for (const q of qualities) {
        const blob = await canvasToBlob(canvas, 'image/jpeg', q)
        if (blob.size <= targetBytes) {
          return new File([blob], `${prefix}_${stamp}.jpg`, { type: 'image/jpeg' })
        }
      }
      w = Math.max(320, Math.round(w * 0.75))
      h = Math.max(180, Math.round(h * 0.75))
    }

    throw new Error('No se pudo reducir el peso de esta imagen lo suficiente. Prueba con otra imagen.')
  } finally {
    source.cleanup()
  }
}
