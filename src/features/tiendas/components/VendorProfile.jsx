import React, { useState, useRef, useEffect } from 'react'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import { vendedorService } from '@/features/tiendas'
import { useToast } from '@/hooks/useToast'
import { Upload, Image as ImageIcon, Trash2, Camera, AlertCircle } from 'lucide-react'
import { getMediaUrl } from '@/utils/constants'
import {
  prepararImagenParaSubida,
  validarUrlImagen,
  formatearErrorImagen,
} from '@/utils/imageUpload'

const LETTERS_REGEX = /[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]/
const CITY_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.-]{2,80}$/
const ACCOUNT_CHARS_REGEX = /^[0-9\-\s]+$/

export const VendorProfile = ({ perfil, onActualizado, onPerfilActualizado }) => {
  const [nombreTienda, setNombreTienda] = useState(perfil?.nombreTienda || '')
  const [descripcion, setDescripcion] = useState(perfil?.descripcion || '')
  const [logoUrl, setLogoUrl] = useState(perfil?.logoUrl || '')
  const [portadaUrl, setPortadaUrl] = useState(perfil?.portadaUrl || '')
  const [ciudad, setCiudad] = useState(perfil?.ciudad || '')
  const [direccion, setDireccion] = useState(perfil?.direccion || '')
  const [cuentaBancaria, setCuentaBancaria] = useState(perfil?.cuentaBancaria || '')
  const [banco, setBanco] = useState(perfil?.banco || '')
  const [loading, setLoading] = useState(false)
  const [subiendoLogo, setSubiendoLogo] = useState(false)
  const [subiendoPortada, setSubiendoPortada] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [logoPreviewError, setLogoPreviewError] = useState(false)
  const [portadaPreviewError, setPortadaPreviewError] = useState(false)

  // Sincronizar estado cuando se cargue o actualice el perfil
  useEffect(() => {
    if (perfil) {
      setNombreTienda(perfil.nombreTienda || '')
      setDescripcion(perfil.descripcion || '')
      setLogoUrl(perfil.logoUrl || '')
      setPortadaUrl(perfil.portadaUrl || '')
      setCiudad(perfil.ciudad || '')
      setDireccion(perfil.direccion || '')
      setCuentaBancaria(perfil.cuentaBancaria || '')
      setBanco(perfil.banco || '')
      setFieldErrors({})
      setLogoPreviewError(false)
      setPortadaPreviewError(false)
    }
  }, [perfil])

  const logoInputRef = useRef(null)
  const portadaInputRef = useRef(null)
  const { success, error } = useToast()

  const defaultPortada =
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80'
  const defaultLogo =
    'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=150&auto=format&fit=crop&q=80'

  const setFieldError = (field, message) => {
    setFieldErrors((prev) => ({ ...prev, [field]: message }))
  }

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field] && !prev.general) return prev
      const next = { ...prev }
      delete next[field]
      delete next.general
      return next
    })
  }

  const subirImagenTienda = async (
    e,
    { field, label, prefix, maxWidth, maxHeight, setUploading, setUrl, setPreviewErr, okMsg, failMsg }
  ) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    clearFieldError(field)
    setUploading(true)
    try {
      const prepared = await prepararImagenParaSubida(file, { prefix, maxWidth, maxHeight })
      const res = await vendedorService.subirImagen(prepared)
      if (res?.url) {
        setPreviewErr(false)
        setUrl(res.url)
        clearFieldError(field)
        success(okMsg)
      } else {
        const msg = `El servidor procesó ${label}, pero no devolvió la dirección de la imagen guardada.`
        setFieldError(field, msg)
        error(msg)
      }
    } catch (err) {
      const msg = formatearErrorImagen(err, failMsg)
      setFieldError(field, msg)
      error(msg)
    } finally {
      setUploading(false)
    }
  }

  const handleSubirLogo = (e) =>
    subirImagenTienda(e, {
      field: 'logoUrl',
      label: 'el logo',
      prefix: 'logo',
      maxWidth: 800,
      maxHeight: 800,
      setUploading: setSubiendoLogo,
      setUrl: setLogoUrl,
      setPreviewErr: setLogoPreviewError,
      okMsg: '¡Logo subido exitosamente!',
      failMsg: 'No se pudo subir el logo de la tienda.',
    })

  const handleSubirPortada = (e) =>
    subirImagenTienda(e, {
      field: 'portadaUrl',
      label: 'el banner de portada',
      prefix: 'banner',
      maxWidth: 1600,
      maxHeight: 900,
      setUploading: setSubiendoPortada,
      setUrl: setPortadaUrl,
      setPreviewErr: setPortadaPreviewError,
      okMsg: '¡Banner de portada subido exitosamente!',
      failMsg: 'No se pudo subir el banner de portada.',
    })

  const handleUrlChange = (field, value, label, setter, setPreviewErr) => {
    setter(value)
    setPreviewErr(false)
    const urlError = validarUrlImagen(value, label)
    if (urlError) {
      setFieldError(field, urlError)
    } else {
      clearFieldError(field)
    }
  }

  const validarFormulario = () => {
    const errs = {}

    const logoErr = validarUrlImagen(logoUrl, 'el logo de la tienda')
    if (logoErr) {
      errs.logoUrl = logoErr
    } else if (logoUrl.trim() && logoPreviewError) {
      errs.logoUrl =
        'No se pudo cargar la imagen del logo desde ese enlace. Verifica que la URL sea pública o sube el archivo desde tu PC.'
    }

    const portadaErr = validarUrlImagen(portadaUrl, 'el banner de portada')
    if (portadaErr) {
      errs.portadaUrl = portadaErr
    } else if (portadaUrl.trim() && portadaPreviewError) {
      errs.portadaUrl =
        'No se pudo cargar la imagen del banner desde ese enlace. Verifica que la URL sea pública o sube el archivo desde tu PC.'
    }

    const nombreTrim = nombreTienda.trim().replace(/\s+/g, ' ')
    if (!nombreTrim || nombreTrim.length < 3 || !LETTERS_REGEX.test(nombreTrim)) {
      errs.nombreTienda =
        'El nombre comercial de la tienda debe tener al menos 3 caracteres e incluir letras.'
    } else if (nombreTrim.length > 120) {
      errs.nombreTienda = 'El nombre comercial de la tienda no puede superar los 120 caracteres.'
    }

    if (descripcion.trim().length > 2000) {
      errs.descripcion = 'La descripción no puede superar los 2000 caracteres.'
    }

    const ciudadTrim = ciudad.trim().replace(/\s+/g, ' ')
    if (ciudadTrim && (!CITY_REGEX.test(ciudadTrim) || !LETTERS_REGEX.test(ciudadTrim))) {
      errs.ciudad = 'Ingresa una ciudad válida (solo letras, mínimo 2 caracteres).'
    }

    const dirTrim = direccion.trim()
    if (dirTrim && (dirTrim.length < 4 || dirTrim.length > 250)) {
      errs.direccion = 'La dirección debe tener entre 4 y 250 caracteres.'
    }

    const cuentaTrim = cuentaBancaria.trim()
    const cuentaDigits = cuentaTrim.replace(/\D/g, '')
    if (cuentaTrim) {
      const bancoLower = banco.trim().toLowerCase()
      if (!ACCOUNT_CHARS_REGEX.test(cuentaTrim)) {
        errs.cuentaBancaria = 'El número de cuenta solo puede contener dígitos y guiones.'
      } else if (
        (bancoLower.includes('nequi') || bancoLower.includes('daviplata')) &&
        !/^3\d{9}$/.test(cuentaDigits)
      ) {
        errs.cuentaBancaria =
          'Para Nequi o Daviplata ingresa un número de celular colombiano válido de 10 dígitos (ej: 3001234567).'
      } else if (cuentaDigits.length < 6 || cuentaDigits.length > 20) {
        errs.cuentaBancaria = 'El número de cuenta debe tener entre 6 y 20 dígitos.'
      }
    }

    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading || subiendoLogo || subiendoPortada) return

    const errs = validarFormulario()
    const primerError = Object.values(errs)[0]
    if (primerError) {
      setFieldErrors(errs)
      error(primerError)
      return
    }

    setFieldErrors({})
    setLoading(true)
    try {
      await vendedorService.actualizarPerfil({
        nombreTienda: nombreTienda.trim().replace(/\s+/g, ' '),
        descripcion: descripcion.trim(),
        logoUrl: logoUrl.trim(),
        portadaUrl: portadaUrl.trim(),
        ciudad: ciudad.trim().replace(/\s+/g, ' '),
        direccion: direccion.trim(),
        cuentaBancaria: cuentaBancaria.trim(),
        banco: banco.trim(),
      })
      success('¡Perfil e imágenes de tu tienda actualizados con éxito!')
      if (onActualizado) onActualizado()
      if (onPerfilActualizado) onPerfilActualizado()
    } catch (err) {
      const msg = formatearErrorImagen(err, 'No se pudieron guardar los cambios de la tienda.')
      setFieldErrors({ general: msg })
      error(msg)
    } finally {
      setLoading(false)
    }
  }

  const resumenError = fieldErrors.general || Object.values(fieldErrors)[0]

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-8 shadow-sm"
    >
      <div>
        <h3 className="text-lg font-black text-slate-900 dark:text-white">
          Identidad Visual y Datos de tu Tienda
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Personaliza cómo los clientes verán tu marca en el directorio oficial y en tu vitrina pública.
        </p>
      </div>

      {/* Previsualizador en tiempo real */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Vista previa en vivo para tus clientes
        </label>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-inner">
          <div className="relative h-32 sm:h-40 bg-slate-900 overflow-hidden">
            <img
              key={portadaUrl || 'default-portada'}
              src={portadaPreviewError ? defaultPortada : getMediaUrl(portadaUrl, defaultPortada)}
              alt="Portada de tienda"
              onError={() => {
                if (portadaUrl.trim()) setPortadaPreviewError(true)
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-black/20" />
            <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-indigo-600/90 text-white text-[10px] font-bold backdrop-blur-sm shadow">
              {ciudad || 'Colombia'}
            </span>
          </div>
          <div className="px-5 pb-5 pt-0 flex items-end gap-4 relative">
            <div className="-mt-8 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-xl border-2 border-white dark:border-slate-800 overflow-hidden shrink-0 z-10">
              <img
                key={logoUrl || 'default-logo'}
                src={logoPreviewError ? defaultLogo : getMediaUrl(logoUrl, defaultLogo)}
                alt="Logo tienda"
                onError={() => {
                  if (logoUrl.trim()) setLogoPreviewError(true)
                }}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="pt-2 min-w-0 flex-1">
              <h4 className="text-base font-black text-slate-900 dark:text-white truncate">
                {nombreTienda || 'Nombre de tu Tienda'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {descripcion || 'Agrega una breve descripción de tus productos o servicios...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gestión de Imágenes: Subida directa de archivos o URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* LOGO */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Camera size={14} className="text-indigo-600" />
              <span>Logo de la Tienda</span>
            </label>
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              onChange={handleSubirLogo}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={subiendoLogo}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-indigo-200/50 cursor-pointer transition disabled:opacity-60"
            >
              <Upload size={13} />
              <span>{subiendoLogo ? 'Procesando y subiendo...' : 'Subir archivo desde PC'}</span>
            </button>
          </div>

          <Input
            label=""
            value={logoUrl}
            onChange={(e) =>
              handleUrlChange('logoUrl', e.target.value, 'el logo de la tienda', setLogoUrl, setLogoPreviewError)
            }
            placeholder="O escribe la URL del logo: https://..."
            error={
              fieldErrors.logoUrl ||
              (logoPreviewError && logoUrl.trim()
                ? 'La vista previa no pudo cargar este enlace. Usa una URL pública de imagen o súbela desde tu PC.'
                : undefined)
            }
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>PNG, JPG, WEBP, GIF • Máx. 30 MB (se optimiza automáticamente)</span>
            {logoUrl && (
              <button
                type="button"
                onClick={() => {
                  setLogoUrl('')
                  setLogoPreviewError(false)
                  clearFieldError('logoUrl')
                }}
                className="text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0 ml-2"
              >
                <Trash2 size={11} /> Quitar
              </button>
            )}
          </div>
        </div>

        {/* PORTADA / BANNER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ImageIcon size={14} className="text-indigo-600" />
              <span>Banner de Portada</span>
            </label>
            <input
              type="file"
              ref={portadaInputRef}
              accept="image/*"
              onChange={handleSubirPortada}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => portadaInputRef.current?.click()}
              disabled={subiendoPortada}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 flex items-center gap-1 bg-indigo-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-indigo-200/50 cursor-pointer transition disabled:opacity-60"
            >
              <Upload size={13} />
              <span>{subiendoPortada ? 'Procesando y subiendo...' : 'Subir archivo desde PC'}</span>
            </button>
          </div>

          <Input
            label=""
            value={portadaUrl}
            onChange={(e) =>
              handleUrlChange(
                'portadaUrl',
                e.target.value,
                'el banner de portada',
                setPortadaUrl,
                setPortadaPreviewError
              )
            }
            placeholder="O escribe la URL del banner: https://..."
            error={
              fieldErrors.portadaUrl ||
              (portadaPreviewError && portadaUrl.trim()
                ? 'La vista previa no pudo cargar este enlace. Usa una URL pública de imagen o súbela desde tu PC.'
                : undefined)
            }
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>PNG, JPG, WEBP, GIF • Máx. 30 MB (se optimiza automáticamente)</span>
            {portadaUrl && (
              <button
                type="button"
                onClick={() => {
                  setPortadaUrl('')
                  setPortadaPreviewError(false)
                  clearFieldError('portadaUrl')
                }}
                className="text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0 ml-2"
              >
                <Trash2 size={11} /> Quitar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <Input
          label="Nombre Comercial de la Tienda"
          value={nombreTienda}
          onChange={(e) => {
            setNombreTienda(e.target.value)
            clearFieldError('nombreTienda')
          }}
          error={fieldErrors.nombreTienda}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Descripción de la Tienda y Especialidad
          </label>
          <textarea
            rows={3}
            value={descripcion}
            onChange={(e) => {
              setDescripcion(e.target.value)
              clearFieldError('descripcion')
            }}
            placeholder="Cuenta a los clientes sobre tu experiencia, tipo de productos y garantía..."
            className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900 p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 ${
              fieldErrors.descripcion
                ? 'border-rose-400 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:ring-indigo-500'
            }`}
          />
          {fieldErrors.descripcion && (
            <p className="mt-1 text-xs text-rose-500 font-medium">{fieldErrors.descripcion}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Ciudad de Despacho"
          value={ciudad}
          onChange={(e) => {
            setCiudad(e.target.value)
            clearFieldError('ciudad')
          }}
          placeholder="Ej: Bogotá, Medellín, Cali..."
          error={fieldErrors.ciudad}
        />
        <Input
          label="Dirección Física del Almacén / Oficina"
          value={direccion}
          onChange={(e) => {
            setDireccion(e.target.value)
            clearFieldError('direccion')
          }}
          placeholder="Ej: Calle 100 #15-20 Bodega 4"
          error={fieldErrors.direccion}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <Input
          label="Banco para Liquidaciones de Venta"
          value={banco}
          onChange={(e) => {
            setBanco(e.target.value)
            clearFieldError('banco')
            clearFieldError('cuentaBancaria')
          }}
          placeholder="Ej: Bancolombia, Davivienda, Nequi"
          error={fieldErrors.banco}
        />
        <Input
          label="Número de Cuenta o Celular Nequi/Daviplata"
          value={cuentaBancaria}
          onChange={(e) => {
            setCuentaBancaria(e.target.value)
            clearFieldError('cuentaBancaria')
          }}
          placeholder="Ej: 123-456789-00"
          error={fieldErrors.cuentaBancaria}
        />
      </div>

      {resumenError && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl border border-rose-200 dark:border-rose-800/70 bg-rose-50 dark:bg-rose-950/50 px-4 py-3 text-xs font-semibold text-rose-700 dark:text-rose-300"
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <span>{resumenError}</span>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={subiendoLogo || subiendoPortada}
          className="px-6 py-2.5 rounded-xl font-bold"
        >
          Guardar Cambios de Tienda
        </Button>
      </div>
    </form>
  )
}

export default VendorProfile
