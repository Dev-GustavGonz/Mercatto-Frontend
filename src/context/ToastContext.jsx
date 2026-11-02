import React, { createContext, useContext, useState, useCallback } from 'react'
import { useLanguage } from './LanguageContext'

const ToastContext = createContext(null)

const translateToastMessage = (message, isEn) => {
  if (!isEn || !message) return message
  const msg = String(message)

  if (msg.includes('agregado al carrito') || msg.includes('añadido al carrito')) {
    return msg.replace('agregado al carrito', 'added to cart').replace('añadido al carrito', 'added to cart')
  }
  if (msg.includes('eliminado del carrito')) {
    return msg.replace('eliminado del carrito', 'removed from cart')
  }
  if (msg.includes('Cupón') || msg.includes('cupon')) {
    return msg
      .replace(/Cupón/gi, 'Coupon')
      .replace(/aplicado/gi, 'applied')
      .replace(/inválido o expirado/gi, 'invalid or expired')
  }
  if (msg.includes('guardado en favoritos') || msg.includes('guardar_favoritos')) {
    return 'Saved to favorites'
  }
  if (msg.includes('quitar_favoritos') || msg.includes('eliminado de favoritos')) {
    return 'Removed from favorites'
  }
  if (msg.includes('Bienvenido de vuelta')) {
    return 'Welcome back to Mercatto!'
  }
  if (msg.includes('Bienvenido a Mercatto')) {
    return 'Welcome to Mercatto!'
  }
  if (msg.includes('actualizado con éxito') || msg.includes('actualizada con éxito') || msg.includes('actualizado exitosamente')) {
    return msg
      .replace(/actualizado con éxito|actualizada con éxito|actualizado exitosamente/gi, 'updated successfully')
      .replace(/Categoría/gi, 'Category')
      .replace(/Producto/gi, 'Product')
      .replace(/Perfil/gi, 'Profile')
  }
  if (msg.includes('creado exitosamente') || msg.includes('creada con éxito')) {
    return msg.replace(/creado exitosamente|creada con éxito/gi, 'created successfully')
  }
  if (msg.includes('eliminado con éxito') || msg.includes('eliminada con éxito')) {
    return msg.replace(/eliminado con éxito|eliminada con éxito/gi, 'deleted successfully')
  }
  if (msg.includes('Gracias por tu calificación')) {
    return 'Thank you for your review!'
  }
  if (msg.includes('Mensaje enviado')) {
    return 'Message sent successfully'
  }
  if (msg.includes('Enlace de la tienda copiado')) {
    return 'Store link copied to clipboard'
  }
  if (msg.includes('Dirección guardada')) {
    return 'Address saved successfully'
  }
  if (msg.includes('Dirección eliminada')) {
    return 'Address removed'
  }
  if (msg.includes('Foto actualizada')) {
    return 'Photo updated'
  }
  if (msg.includes('Sesión cerrada')) {
    return 'Signed out successfully'
  }
  if (msg.includes('Ticket radicado con éxito')) {
    return 'Ticket submitted successfully! Our team will respond shortly.'
  }
  return message
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])
  const { idioma } = useLanguage()
  const isEn = (idioma || '').toUpperCase() === 'EN'

  const addToast = useCallback(
    (message, type = 'info', duration = 4000) => {
      const id = Date.now() + Math.random()
      const localizedMessage = translateToastMessage(message, isEn)
      setToasts((prev) => [...prev, { id, message: localizedMessage, type }])

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    },
    [isEn]
  )

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback((msg) => addToast(msg, 'success'), [addToast])
  const error = useCallback((msg) => addToast(msg, 'error'), [addToast])
  const info = useCallback((msg) => addToast(msg, 'info'), [addToast])
  const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      {/* Toast Notification Container Responsivo para Celular y Desktop */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 z-50 flex flex-col gap-2 w-auto sm:w-full sm:max-w-sm pointer-events-none select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 sm:p-4 rounded-2xl shadow-2xl text-white flex items-center justify-between gap-2.5 transition-all transform duration-300 translate-y-0 text-xs sm:text-sm max-w-full backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-600/95 dark:bg-emerald-600 border border-emerald-500/30'
                : toast.type === 'error'
                ? 'bg-rose-600/95 dark:bg-rose-600 border border-rose-500/30'
                : toast.type === 'warning'
                ? 'bg-amber-500/95 dark:bg-amber-600 border border-amber-400/30'
                : 'bg-indigo-600/95 dark:bg-indigo-600 border border-indigo-500/30'
            }`}
          >
            <span className="font-semibold leading-snug break-words flex-1">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition font-bold shrink-0 cursor-pointer text-base"
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider')
  }
  return context
}

export default ToastContext
