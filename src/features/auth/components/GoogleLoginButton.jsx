import React, { useEffect, useRef } from 'react'
import { GOOGLE_CLIENT_ID } from '@/utils/constants'

/**
 * Botón "Continuar con Google" usando Google Identity Services (GIS).
 * Requiere el script <script src="https://accounts.google.com/gsi/client">
 * cargado en index.html, y VITE_GOOGLE_CLIENT_ID configurado en .env.
 *
 * Props:
 *  - onCredential(credential): recibe el ID Token (JWT) de Google
 *  - texto: texto alternativo del botón (opcional)
 */
export const GoogleLoginButton = ({ onCredential, texto = 'continue_with' }) => {
  const contenedorRef = useRef(null)
  const onCredentialRef = useRef(onCredential)

  // Mantener la referencia actualizada sin forzar la recreación del botón de Google
  useEffect(() => {
    onCredentialRef.current = onCredential
  }, [onCredential])

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return

    let intentos = 0
    let timeoutId = null
    let cancelado = false

    const inicializar = () => {
      if (cancelado) return
      if (!window.google?.accounts?.id) {
        // El script se carga con "defer", esperar a que esté listo
        if (intentos++ < 25) {
          timeoutId = setTimeout(inicializar, 150)
        }
        return
      }

      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response) => onCredentialRef.current?.(response.credential),
        })

        if (contenedorRef.current && !cancelado) {
          contenedorRef.current.innerHTML = ''
          window.google.accounts.id.renderButton(contenedorRef.current, {
            type: 'standard',
            theme: 'outline',
            size: 'large',
            text: texto,
            shape: 'pill',
            width: 320,
          })
        }
      } catch (err) {
        console.warn('Google Identity Services render error:', err)
      }
    }

    inicializar()

    return () => {
      cancelado = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [texto]) // Solo se recrea si cambia el tipo de texto, NUNCA en cada pulsación de tecla

  if (!GOOGLE_CLIENT_ID) return null

  return (
    <div
      className="flex justify-center items-center min-h-[44px] h-[44px] w-full overflow-hidden"
      ref={contenedorRef}
    />
  )
}

export default GoogleLoginButton
