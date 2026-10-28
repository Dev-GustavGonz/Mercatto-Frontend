import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import GoogleLoginButton from '../components/GoogleLoginButton'
import MercattoLogo from '@/components/common/MercattoLogo'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [recordarme, setRecordarme] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, loginGoogle } = useAuth()
  const { success, error } = useToast()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'

  const irSegunRol = (res) => {
    const rol = res?.usuario?.rol
    let destino = redirectUrl
    if (rol === 'VENDEDOR') {
      destino = '/vendedor'
    } else if (rol === 'ADMIN') {
      destino = '/admin'
    }
    window.location.replace(destino)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const emailTrim = email.trim()
    if (!emailTrim) {
      error('Por favor ingresa tu correo electrónico')
      return
    }

    if (!/\S+@\S+\.\S+/.test(emailTrim)) {
      error('El formato del correo electrónico no es válido')
      return
    }

    if (!password) {
      error('Por favor ingresa tu contraseña')
      return
    }

    setLoading(true)
    const res = await login(emailTrim, password, recordarme)
    setLoading(false)

    if (res?.exito) {
      success('¡Bienvenido de vuelta a Mercatto!')
      irSegunRol(res)
    } else {
      error(res?.mensaje || 'Error al iniciar sesión. Verifica tus credenciales.')
    }
  }

  const handleGoogle = async (credential) => {
    setLoading(true)
    const res = await loginGoogle(credential)
    setLoading(false)

    if (res?.exito) {
      success('¡Bienvenido a Mercatto!')
      irSegunRol(res)
    } else {
      error(res?.mensaje || 'No se pudo iniciar sesión con Google')
    }
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-mercatto-border/90 dark:border-slate-800 shadow-2xl shadow-violet-500/5 space-y-6">
        
        {/* Cabecera Oficial Mercatto con el logo estilizado */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex justify-center transition-transform hover:scale-105" title="Volver al inicio">
            <MercattoLogo className="text-3xl sm:text-4xl" />
          </Link>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('iniciar_sesion')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('login_sub')}
          </p>
        </div>

        {/* Formulario de Login con validaciones */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('correo_electronico')}
            type="email"
            placeholder={t('correo_placeholder') || 'ejemplo@mercatto.com'}
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label={t('contrasena')}
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
              />
              {t('recordarme')}
            </label>

            <Link 
              to="/recuperar-password" 
              className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
            >
              {t('olvidaste_contrasena')}
            </Link>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className="w-full font-bold bg-mercatto-primary hover:bg-mercatto-deep text-white shadow-lg shadow-violet-500/25 mt-2 cursor-pointer" 
            loading={loading}
          >
            <LogIn size={18} className="mr-2" />
            <span>{t('ingresar_a_mercatto')}</span>
          </Button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
          <span className="text-xs text-slate-400 font-medium">{t('o_continua_con')}</span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        </div>

        <GoogleLoginButton onCredential={handleGoogle} texto="signin_with" />

        <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {t('no_tienes_cuenta')}{' '}
          <Link to="/registro" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">
            {t('registrate_aqui')}
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Login
