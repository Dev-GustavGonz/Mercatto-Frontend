import React, { useState, useEffect, useRef } from 'react'
import { adminService } from '@/features/admin'
import { productoService } from '@/features/productos'
import Button from '@/components/common/Button'
import Input from '@/components/common/Input'
import Modal from '@/components/common/Modal'
import { useToast } from '@/hooks/useToast'
import { getMediaUrl } from '@/utils/constants'
import { Plus, Trash2, Edit, Upload, Image as ImageIcon, X } from 'lucide-react'

export const CategoryManager = () => {
  const [categorias, setCategorias] = useState([])
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [icono, setIcono] = useState('Tag')
  const [imagenUrl, setImagenUrl] = useState('')
  const [padreId, setPadreId] = useState('')
  const [loading, setLoading] = useState(false)
  const [subiendoImg, setSubiendoImg] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const fileInputRef = useRef(null)
  const { success, error } = useToast()

  const cargar = () => {
    adminService
      .listarCategorias()
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => {
        productoService.listarCategorias().then((data) => setCategorias(data || [])).catch(() => {})
      })
  }

  useEffect(() => {
    cargar()
  }, [])

  const abrirModalCrear = () => {
    setEditando(null)
    setNombre('')
    setDescripcion('')
    setIcono('Tag')
    setImagenUrl('')
    setPadreId('')
    setPreviewError(false)
    setModalAbierto(true)
  }

  const abrirModalEditar = (cat) => {
    setEditando(cat)
    setNombre(cat.nombre)
    setDescripcion(cat.descripcion || '')
    setIcono(cat.icono || 'Tag')
    setImagenUrl(cat.imagenUrl || '')
    setPadreId(cat.padre?.id || '')
    setPreviewError(false)
    setModalAbierto(true)
  }

  const handleSubirImagen = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!tiposPermitidos.includes(file.type)) {
      error('Solo se permiten imágenes en formato JPG, PNG, WEBP o GIF.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      error('La imagen no debe superar los 2 MB.')
      return
    }

    setSubiendoImg(true)
    try {
      const res = await productoService.subirImagen(file)
      if (res?.url) {
        setImagenUrl(res.url)
        setPreviewError(false)
        success('Imagen de categoría subida con éxito')
      } else {
        error('No se recibió la URL de la imagen subida.')
      }
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.response?.data?.message || 'Error al subir la imagen de la categoría'
      error(msg)
    } finally {
      setSubiendoImg(false)
    }
  }

  const handleGuardar = async (e) => {
    e.preventDefault()
    if (!nombre.trim() || nombre.trim().length < 2) {
      error('El nombre de la categoría debe tener al menos 2 caracteres.')
      return
    }
    if (editando && padreId && Number(padreId) === editando.id) {
      error('Una categoría no puede ser subcategoría de sí misma.')
      return
    }
    setLoading(true)
    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      icono: icono.trim() || 'Tag',
      imagenUrl: imagenUrl.trim() || null,
      activo: editando ? (editando.activo ?? true) : true,
      ordenVisual: editando ? (editando.ordenVisual ?? 0) : 0,
    }
    try {
      if (editando) {
        await adminService.actualizarCategoria(editando.id, payload, padreId ? Number(padreId) : null)
        success('Categoría actualizada con éxito')
      } else {
        await adminService.crearCategoria(payload, padreId ? Number(padreId) : null)
        success('Categoría creada con éxito')
      }
      setModalAbierto(false)
      cargar()
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.response?.data?.message || 'Error al guardar categoría'
      error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría? Si contiene productos asociados podría fallar.')) return
    try {
      await adminService.eliminarCategoria(id)
      success('Categoría eliminada con éxito')
      cargar()
    } catch (err) {
      const msg = err.response?.data?.mensaje || err.response?.data?.message || 'Error al eliminar categoría. Verifica que no tenga productos asociados.'
      error(msg)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Gestión de Categorías</h3>
          <p className="text-xs text-slate-500">Organiza las categorías y personaliza sus imágenes en el Marketplace.</p>
        </div>
        <Button variant="primary" size="sm" onClick={abrirModalCrear}>
          <Plus size={14} className="mr-1" />
          <span>Nueva Categoría</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categorias.map((c) => (
          <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                {c.imagenUrl ? (
                  <img
                    src={getMediaUrl(c.imagenUrl)}
                    alt={c.nombre}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                    className="w-full h-full object-contain p-1"
                  />
                ) : (
                  <ImageIcon size={18} className="text-slate-400" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{c.nombre}</h4>
                  {c.padre && (
                    <span className="px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[9px] font-bold shrink-0">
                      {c.padre.nombre}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">{c.descripcion || 'Sin descripción'}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0">
              <button onClick={() => abrirModalEditar(c)} title="Editar categoría e imagen" className="p-1.5 text-slate-400 hover:text-indigo-600 cursor-pointer">
                <Edit size={14} />
              </button>
              <button onClick={() => handleEliminar(c.id)} title="Eliminar categoría" className="p-1.5 text-slate-400 hover:text-rose-500 cursor-pointer">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalAbierto && (
        <Modal isOpen={true} onClose={() => setModalAbierto(false)} title={editando ? 'Editar Categoría' : 'Nueva Categoría'}>
          <form onSubmit={handleGuardar} className="space-y-4">
            <Input label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            <Input label="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <Input label="Icono Lucide" value={icono} onChange={(e) => setIcono(e.target.value)} placeholder="Ej: Smartphone, Laptop, Shirt" />

            {/* Imagen de Categoría */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-violet-600" />
                  <span>Imagen de la Categoría</span>
                </label>
                <div className="flex items-center gap-2">
                  {imagenUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagenUrl('')
                        setPreviewError(false)
                      }}
                      className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                    >
                      <X size={12} />
                      <span>Quitar</span>
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleSubirImagen}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={subiendoImg}
                    className="text-xs font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/50 hover:bg-violet-100 px-3 py-1.5 rounded-xl border border-violet-200 dark:border-violet-800 flex items-center gap-1.5 cursor-pointer transition disabled:opacity-50"
                  >
                    <Upload size={13} />
                    <span>{subiendoImg ? 'Subiendo...' : imagenUrl ? 'Cambiar imagen' : 'Subir imagen'}</span>
                  </button>
                </div>
              </div>

              {imagenUrl && !previewError ? (
                <div className="w-full h-32 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={getMediaUrl(imagenUrl)}
                    alt="Vista previa de categoría"
                    onError={() => setPreviewError(true)}
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-24 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 flex flex-col items-center justify-center text-slate-400 text-[11px] gap-1">
                  <ImageIcon size={20} />
                  <span>{previewError ? 'No se pudo cargar la imagen desde esa URL' : 'Sin imagen personalizada (se usará imagen por defecto)'}</span>
                </div>
              )}

              <Input
                label=""
                value={imagenUrl}
                onChange={(e) => {
                  setImagenUrl(e.target.value)
                  setPreviewError(false)
                }}
                placeholder="O pega la URL de la imagen (https://... o /images/...)"
              />
              <p className="text-[10px] text-slate-400">
                Formatos permitidos: JPG, PNG, WEBP o GIF (máx. 2 MB).
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Categoría Padre (Opcional)
              </label>
              <select
                value={padreId}
                onChange={(e) => setPadreId(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Ninguna (Categoría Principal)</option>
                {categorias
                  .filter((c) => !editando || c.id !== editando.id)
                  .map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalAbierto(false)}>Cancelar</Button>
              <Button type="submit" variant="primary" loading={loading || subiendoImg}>Guardar</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

export default CategoryManager
