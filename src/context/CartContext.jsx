import React, { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '@/utils/storage'
import { pedidoService } from '../features/pedidos'
import { useToast } from './ToastContext'
import { useLanguage } from './LanguageContext'

export const getItemPrice = (producto, variante = null) => {
  if (variante && typeof variante === 'object') {
    const vOferta = Number(variante.precioOferta)
    if (!isNaN(vOferta) && vOferta > 0) return vOferta
    const vPrecio = Number(variante.precio)
    if (!isNaN(vPrecio) && vPrecio > 0) return vPrecio
  }
  if (producto && typeof producto === 'object') {
    const pOferta = Number(producto.precioOferta)
    if (!isNaN(pOferta) && pOferta > 0) return pOferta
    const pPrecio = Number(producto.precio)
    if (!isNaN(pPrecio) && pPrecio > 0) return pPrecio
  }
  return 0
}

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => storage.get('mercatto_cart', []))
  const [cupon, setCupon] = useState(() => storage.get('mercatto_coupon', null))
  const [drawerAbierto, setDrawerAbierto] = useState(false)
  const { success, error: toastError } = useToast()
  const { idioma } = useLanguage()
  const isEn = (idioma || '').toUpperCase() === 'EN'

  useEffect(() => {
    storage.set('mercatto_cart', items)
  }, [items])

  useEffect(() => {
    storage.set('mercatto_coupon', cupon)
  }, [cupon])

  const agregarItem = (producto, variante = null, cantidad = 1) => {
    if (!producto) return

    let varObj = variante
    let cant = typeof cantidad === 'number' && cantidad > 0 ? cantidad : 1

    // Si el 2do argumento fue enviado como número (ej. agregarItem(item, 1)), normalizar
    if (typeof variante === 'number') {
      cant = variante > 0 ? variante : 1
      varObj = null
    } else if (variante && typeof variante !== 'object') {
      varObj = null
    }

    // Asegurar objeto de producto con precios numéricos garantizados
    const prodLimpio = {
      ...producto,
      precio: Number(producto.precio) || 0,
      precioOferta: producto.precioOferta != null ? Number(producto.precioOferta) : null,
    }

    setItems((prev) => {
      const index = prev.findIndex(
        (i) => i.producto.id === prodLimpio.id && (i.variante?.id || null) === (varObj?.id || null)
      )

      if (index > -1) {
        const nuevos = [...prev]
        nuevos[index].cantidad += cant
        nuevos[index].producto = { ...nuevos[index].producto, ...prodLimpio }
        if (varObj) nuevos[index].variante = varObj
        return nuevos
      } else {
        return [...prev, { producto: prodLimpio, variante: varObj, cantidad: cant }]
      }
    })

    const prodTitulo = prodLimpio.titulo || prodLimpio.nombre || ''
    success(isEn ? `"${prodTitulo}" added to cart` : `"${prodTitulo}" agregado al carrito`)
  }

  const eliminarItem = (productoId, varianteId = null) => {
    setItems((prev) =>
      prev.filter(
        (i) => !(i.producto.id === productoId && (i.variante?.id || null) === (varianteId || null))
      )
    )
  }

  const actualizarCantidad = (productoId, varianteId = null, cantidad) => {
    if (cantidad <= 0) {
      eliminarItem(productoId, varianteId)
      return
    }
    setItems((prev) =>
      prev.map((i) => {
        if (i.producto.id === productoId && (i.variante?.id || null) === (varianteId || null)) {
          return { ...i, cantidad }
        }
        return i
      })
    )
  }

  const limpiarCarrito = () => {
    setItems([])
    setCupon(null)
    storage.remove('mercatto_cart')
    storage.remove('mercatto_coupon')
  }

  const subtotal = items.reduce((acc, item) => {
    const precio = getItemPrice(item.producto, item.variante)
    return acc + precio * (item.cantidad || 1)
  }, 0)

  const descuento = cupon ? (cupon.descuento || 0) : 0
  const costoEnvio = subtotal >= 150000 || subtotal === 0 ? 0 : 12000
  const total = Math.max(0, subtotal - descuento + costoEnvio)
  const totalItems = items.reduce((acc, item) => acc + item.cantidad, 0)

  const aplicarCupon = async (codigo) => {
    try {
      const res = await pedidoService.validarCupon(codigo, subtotal)
      if (res?.exito) {
        setCupon(res)
        success(isEn ? `Coupon '${codigo}' applied: -$${res.descuento}` : `Cupón '${codigo}' aplicado: -$${res.descuento}`)
        return { exito: true }
      }
    } catch (err) {
      const msg = err.response?.data?.mensaje || (isEn ? 'Invalid or expired coupon' : 'Cupón inválido o expirado')
      toastError(msg)
      return { exito: false, mensaje: msg }
    }
  }

  const removerCupon = () => {
    setCupon(null)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        descuento,
        costoEnvio,
        total,
        cupon,
        drawerAbierto,
        setDrawerAbierto,
        agregarItem,
        eliminarItem,
        actualizarCantidad,
        limpiarCarrito,
        aplicarCupon,
        removerCupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider')
  }
  return context
}

export default CartContext
