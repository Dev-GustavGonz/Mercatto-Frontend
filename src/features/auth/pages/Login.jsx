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
  const { t, idioma, cambiarIdioma } = useLanguage()
  const isEn = idioma === 'EN'
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
      error(isEn ? 'Please enter your email address' : 'Por favor ingresa tu correo electrónico')
      return
    }

    if (!/\S+@\S+\.\S+/.test(emailTrim)) {
      error(isEn ? 'Invalid email format' : 'El formato del correo electrónico no es válido')
      return
    }

    if (!password) {
      error(isEn ? 'Please enter your password' : 'Por favor ingresa tu contraseña')
      return
    }

    setLoading(true)
    const res = await login(emailTrim, password, recordarme)
    setLoading(false)

    if (res?.exito) {
      success(isEn ? 'Welcome back to Mercatto!' : '¡Bienvenido de vuelta a Mercatto!')
      irSegunRol(res)
    } else {
      error(res?.mensaje || (isEn ? 'Login failed. Check your credentials.' : 'Error al iniciar sesión. Verifica tus credenciales.'))
    }
  }

  const handleGoogle = async (credential) => {
    setLoading(true)
    const res = await loginGoogle(credential)
    setLoading(false)

    if (res?.exito) {
      success(isEn ? 'Welcome to Mercatto!' : '¡Bienvenido a Mercatto!')
      irSegunRol(res)
    } else {
      error(res?.mensaje || (isEn ? 'Could not sign in with Google' : 'No se pudo iniciar sesión con Google'))
    }
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full lg:grid lg:grid-cols-12 bg-white dark:bg-slate-950">
      
      {/* Columna Izquierda: Fija en desktop */}
      <div className="lg:col-span-5 xl:col-span-5 relative hidden lg:flex flex-col justify-between p-6 lg:p-8 xl:p-10 h-screen bg-slate-950 text-white overflow-hidden">
        <img 
          src="/images/login-ecommerce.jpg" 
          alt="Mercatto Marketplace" 
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75] contrast-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-violet-950/60 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/95 pointer-events-none" />

        {/* Logo oficial con colores originales en esquina y separación amplia con el slogan */}
        <div className="relative z-10 self-start">
          <MercattoLogo 
            variant="onDark"
            size={42} 
            showSlogan={true} 
            sloganClassName="mt-3.5 text-xs sm:text-[13px] font-bold tracking-wide block"
          />
        </div>

        {/* Tarjeta de beneficios */}
        <div className="relative z-10 space-y-3 bg-slate-950/80 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={15} className="text-violet-400" />
            <span>{isEn ? 'From the neighborhood to your screen' : 'Del barrio a tu pantalla'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {isEn
              ? 'Connect directly with verified brands and stores. Enjoy 100% secure payments and direct shipping to your door.'
              : 'Conecta directamente con marcas y tiendas verificadas. Disfruta de pagos 100% seguros y envíos directos a tu puerta.'}
          </p>
          <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-300 font-semibold border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{isEn ? '100% Protected' : '100% Protegido'}</span>
            </div>
            <span className="text-white/30">•</span>
            <div>{isEn ? 'Nationwide shipping' : 'Envíos directos a todo el país'}</div>
          </div>
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="lg:col-span-7 xl:col-span-7 min-h-screen lg:h-screen lg:overflow-y-auto flex flex-col justify-between p-5 sm:p-10 lg:p-12 xl:p-16 bg-white dark:bg-slate-900">
        
        {/* Barra superior limpia para móvil y escritorio: Volver a la izquierda, Idioma a la derecha */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-xs group"
            title={isEn ? 'Back to home' : 'Volver a la página principal'}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-violet-600 dark:text-violet-400" />
            <span>{isEn ? 'Back' : 'Volver'}</span>
          </button>

          {/* Selector de idioma ES / EN */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
            <button
              type="button"
              onClick={() => cambiarIdioma('es')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                !isEn
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Cambiar a Español"
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => cambiarIdioma('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                isEn
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Switch to English"
            >
              EN
            </button>
          </div>
        </div>

        {/* Contenedor central del formulario */}
        <div className="w-full max-w-lg mx-auto my-auto py-4">
          {/* Logo en versión móvil, limpio y con colores oficiales */}
          <div className="lg:hidden mb-6">
            <MercattoLogo size={32} showSlogan={true} sloganClassName="mt-2 text-[11px]" />
          </div>

          <div className="space-y-1.5 mb-6">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('iniciar_sesion') || (isEn ? 'Log in' : 'Iniciar sesión')}
              <span className="text-violet-600">.</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {t('login_sub') || (isEn ? 'Enter your registered email and password' : 'Ingresa tus credenciales para acceder a tu cuenta.')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Correo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('correo_electronico') || (isEn ? 'Email Address' : 'Correo Electrónico')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('correo_placeholder') || (isEn ? 'example@mercatto.com' : 'ejemplo@mercatto.com')}
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                {t('contrasena') || (isEn ? 'Password' : 'Contraseña')}
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
                  title={showPassword ? (isEn ? 'Hide password' : 'Ocultar contraseña') : (isEn ? 'Show password' : 'Ver contraseña')}
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
                <span>{t('recordarme') || (isEn ? 'Remember me' : 'Recordarme')}</span>
              </label>
              <Link
                to="/recuperar-password"
                className="font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                {t('olvidaste_contrasena') || (isEn ? 'Forgot your password?' : '¿Olvidaste tu contraseña?')}
              </Link>
            </div>

            {/* Botón Principal */}
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
                  <span>{isEn ? 'Loading...' : 'Cargando...'}</span>
                </span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>{t('ingresar_a_mercatto') || (isEn ? 'Sign In to Mercatto' : 'Ingresar a Mercatto')}</span>
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <span className="relative bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('o_continua_con') || (isEn ? 'or continue with' : 'o continúa con')}
            </span>
          </div>

          {/* Inicio de sesión con Google */}
          <div className="flex justify-center w-full">
            <GoogleLoginButton onCredential={handleGoogle} texto="signin_with" />
          </div>
        </div>

        {/* Sección Inferior */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {isEn ? "Don't have an account? " : "¿No tienes una cuenta? "}
            <Link
              to="/registro"
              className="font-black text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 hover:underline transition-colors ml-1"
            >
              {isEn ? 'Sign up here' : 'Regístrate aquí'}
            </Link>
          </p>

          <div>
            <Link
              to="/registro?rol=VENDEDOR"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-colors"
            >
              <span>
                {isEn
                  ? 'Have a business or brand? Open your virtual store on Mercatto →'
                  : '¿Tienes un negocio o marca? Abre tu tienda virtual en Mercatto →'}
              </span>
            </Link>
          </div>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-1">
            {isEn ? 'By signing in, you agree to our ' : 'Al iniciar sesión, aceptas los '}
            <Link to="/terminos" className="underline hover:text-slate-600 dark:hover:text-slate-300">
              {isEn ? 'Terms' : 'Términos'}
            </Link>
            {isEn ? ' and ' : ' y la '}
            <Link to="/privacidad" className="underline hover:text-slate-600 dark:hover:text-slate-300">
              {isEn ? 'Privacy Policy' : 'Política de Privacidad'}
            </Link>
            .
          </p>
        </div>

      </div>

    </div>
  )
}

export default Login