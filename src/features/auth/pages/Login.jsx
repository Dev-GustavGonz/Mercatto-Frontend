import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import GoogleLoginButton from '../components/GoogleLoginButton'
import MercattoLogo from '@/components/common/MercattoLogo'
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [recordarme, setRecordarme] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, loginGoogle } = useAuth()
  const { success, error } = useToast()
  const { t, idioma } = useLanguage()
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
      error(idioma === 'EN' ? 'Please enter your email address' : 'Por favor ingresa tu correo electrónico')
      return
    }

    if (!/\S+@\S+\.\S+/.test(emailTrim)) {
      error(idioma === 'EN' ? 'Invalid email format' : 'El formato del correo electrónico no es válido')
      return
    }

    if (!password) {
      error(idioma === 'EN' ? 'Please enter your password' : 'Por favor ingresa tu contraseña')
      return
    }

    setLoading(true)
    const res = await login(emailTrim, password, recordarme)
    setLoading(false)

    if (res?.exito) {
      success(idioma === 'EN' ? 'Welcome back to Mercatto!' : '¡Bienvenido de vuelta a Mercatto!')
      irSegunRol(res)
    } else {
      error(res?.mensaje || (idioma === 'EN' ? 'Login failed. Check your credentials.' : 'Error al iniciar sesión. Verifica tus credenciales.'))
    }
  }

  const handleGoogle = async (credential) => {
    setLoading(true)
    const res = await loginGoogle(credential)
    setLoading(false)

    if (res?.exito) {
      success(idioma === 'EN' ? 'Welcome to Mercatto!' : '¡Bienvenido a Mercatto!')
      irSegunRol(res)
    } else {
      error(res?.mensaje || (idioma === 'EN' ? 'Could not sign in with Google' : 'No se pudo iniciar sesión con Google'))
    }
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-12 bg-white dark:bg-slate-950">
      
      {/* Columna Izquierda: Ocupa toda la altura de la pantalla en desktop */}
      <div className="lg:col-span-5 xl:col-span-5 relative hidden lg:flex flex-col justify-between p-8 xl:p-12 min-h-screen bg-slate-950 text-white overflow-hidden">
        {/* Imagen de fondo e-commerce con iluminación violeta limpia sin personas */}
        <img 
          src="/images/login-ecommerce.jpg" 
          alt="Mercatto Marketplace" 
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75] contrast-110"
        />

        {/* Gradientes para asegurar tono de marca Mercatto y máxima legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-violet-950/60 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/95 pointer-events-none" />

        {/* Logo oficial con colores originales directamente sobre el fondo sin caja blanca */}
        <div className="relative z-10 self-start pt-2">
          <MercattoLogo 
            variant="onDark"
            size={42} 
            showSlogan={true} 
          />
        </div>

        {/* Tarjeta de beneficios en la parte inferior */}
        <div className="relative z-10 space-y-3 bg-slate-950/80 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={15} className="text-violet-400" />
            <span>Del barrio a tu pantalla</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Conecta directamente con marcas y tiendas verificadas. Disfruta de pagos 100% seguros y envíos directos a tu puerta.
          </p>
          <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-300 font-semibold border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>100% Protegido</span>
            </div>
            <span className="text-white/30">•</span>
            <div>Envíos directos a todo el país</div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Ocupa toda la altura de la pantalla y centra el formulario */}
      <div className="lg:col-span-7 xl:col-span-7 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto bg-white dark:bg-slate-900">
        
        {/* Barra superior con botón volver al inicio */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-xs group"
            title="Volver a la página principal"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-violet-600 dark:text-violet-400" />
            <span>{idioma === 'EN' ? 'Back to home' : 'Volver al inicio'}</span>
          </button>

          {/* Logo en versión móvil con colores originales */}
          <div className="lg:hidden">
            <MercattoLogo size={26} showSlogan={true} sloganClassName="text-[10px]" />
          </div>
        </div>

        {/* Contenedor central del formulario */}
        <div className="w-full max-w-lg mx-auto my-auto py-6">
          <div className="space-y-1.5 mb-7">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('iniciar_sesion') || 'Iniciar sesión'}
              <span className="text-violet-600">.</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {t('login_sub') || 'Ingresa tus credenciales para acceder a tu cuenta.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Correo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('correo_electronico') || 'Correo Electrónico'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('correo_placeholder') || 'ejemplo@mercatto.com'}
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('contrasena') || 'Contraseña'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-11 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Opciones Recordarme / Olvidé contraseña */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 font-medium text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="w-4 h-4 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <span>{t('recordarme') || 'Recordarme'}</span>
              </label>
              <Link
                to="/recuperar-password"
                className="font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                {t('olvidaste_contrasena') || '¿Olvidaste tu contraseña?'}
              </Link>
            </div>

            {/* Botón Principal con gradiente Mercatto */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>Cargando...</span>
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>{t('ingresar_a_mercatto') || 'Iniciar sesión'}</span>
                </>
              )}
            </button>
          </form>

          {/* Separador "o continúa con" */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('o_continua_con') || 'o continúa con'}
            </span>
          </div>

          {/* Inicio de sesión con Google */}
          <div className="flex justify-center w-full">
            <GoogleLoginButton onCredential={handleGoogle} texto="signin_with" />
          </div>
        </div>

        {/* Sección Inferior: "¿No tienes cuenta? Regístrate aquí" */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {idioma === 'EN' ? "Don't have an account? " : "¿No tienes una cuenta? "}
            <Link
              to="/registro"
              className="font-black text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline transition-colors ml-1"
            >
              {idioma === 'EN' ? 'Sign up here' : 'Regístrate aquí'}
            </Link>
          </p>

          <div>
            <Link
              to="/registro?rol=VENDEDOR"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors"
            >
              <span>¿Tienes un negocio o marca? Abre tu tienda virtual en Mercatto →</span>
            </Link>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            Al iniciar sesión, aceptas los{' '}
            <Link to="/terminos" className="underline hover:text-slate-600 dark:hover:text-slate-300">
              Términos
            </Link>{' '}
            y la{' '}
            <Link to="/privacidad" className="underline hover:text-slate-600 dark:hover:text-slate-300">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>

      </div>

    </div>
  )
}

export default Login