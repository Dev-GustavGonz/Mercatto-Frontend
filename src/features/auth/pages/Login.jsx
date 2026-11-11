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
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-100/70 dark:bg-slate-950 relative overflow-hidden">
      {/* Resplandores ambientales de fondo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta principal ampliada con bordes redondeados y estilo split-card */}
      <div className="w-full max-w-6xl xl:max-w-7xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-violet-500/10 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 lg:p-8 transition-all relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[640px] xl:min-h-[700px]">
          
          {/* Columna Izquierda: Showcase visual estético con halo de luz y marca Mercatto */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 xl:p-10 min-h-[640px] bg-slate-950 text-white shadow-inner">
            {/* Imagen de fondo estética con filtro de color acorde a Mercatto */}
            <img 
              src="/images/login-hero.jpg" 
              alt="Mercatto Experience" 
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-105"
            />

            {/* Capas de gradientes para legibilidad y tono violeta de la marca */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-violet-950/50 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/95 pointer-events-none" />

            {/* Halo de luz holográfico de fondo */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="w-64 h-64 rounded-full border border-violet-400/30 shadow-[0_0_100px_rgba(139,92,246,0.45)] rotate-[-12deg]" />
              <div className="absolute inset-0 w-64 h-64 rounded-full border border-pink-400/25 blur-[1px] rotate-[22deg]" />
            </div>

            {/* Logo de Mercatto en la parte superior del banner */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-2">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg shadow-violet-500/20 transition-transform hover:scale-105">
                <MercattoLogo showText={false} size={34} className="text-white drop-shadow-md" />
              </div>
              <span className="mt-2.5 text-xs font-bold tracking-widest uppercase text-white/90">
                Mercatto Oficial
              </span>
            </div>

            {/* Tarjeta de cristal en la parte inferior */}
            <div className="relative z-10 space-y-3 bg-slate-950/70 backdrop-blur-md p-6 rounded-2xl border border-white/15 shadow-xl">
              <div className="flex items-center gap-2 text-violet-300 font-bold text-xs uppercase tracking-wider">
                <Sparkles size={15} className="text-violet-400" />
                <span>Del barrio a tu pantalla</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                Conecta con tiendas oficiales, marcas verificadas y miles de productos con envíos ágiles y compras protegidas.
              </p>
              <div className="flex items-center gap-4 pt-2 text-xs text-slate-300 font-semibold border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>100% Protegido</span>
                </div>
                <span className="text-white/30">•</span>
                <div>Envíos directos a todo el país</div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario limpio y espacioso */}
          <div className="lg:col-span-7 flex flex-col justify-between px-3 py-4 sm:px-8 sm:py-6 lg:px-10 xl:px-12">
            <div>
              {/* Barra Superior con Botón de Retroceso destacado y Logo */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer group shadow-xs hover:border-slate-300"
                  title="Volver a la tienda"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-violet-600 dark:text-violet-400" />
                  <span>{idioma === 'EN' ? 'Back to store' : 'Volver al inicio'}</span>
                </button>

                <Link to="/" className="inline-flex items-center transition-transform hover:scale-105" title="Ir a Mercatto">
                  <MercattoLogo size={28} showSlogan={false} />
                </Link>
              </div>

              {/* Título y enlace a Registro */}
              <div className="space-y-2 mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {t('iniciar_sesion') || 'Iniciar sesión'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {idioma === 'EN' ? "Don't have an account? " : "¿No tienes una cuenta? "}
                  <Link
                    to="/registro"
                    className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline underline-offset-4 transition-colors"
                  >
                    {idioma === 'EN' ? 'Sign up' : 'Regístrate aquí'}
                  </Link>
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Campo Correo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    {t('correo_electronico') || 'Correo Electrónico'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('correo_placeholder') || 'ejemplo@mercatto.com'}
                      required
                      autoComplete="email"
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* Campo Contraseña */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    {t('contrasena') || 'Contraseña'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 pl-11 pr-11 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
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

                {/* Botón Principal (Pill oscuro / violeta acorde a la referencia y marca) */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 rounded-full font-bold text-sm tracking-wide text-white bg-slate-950 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 shadow-lg shadow-slate-950/15 dark:shadow-violet-600/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-3"
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

              {/* Separador "or" */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  or
                </span>
              </div>

              {/* Inicio de sesión con Google (botón en píldora) */}
              <div className="flex justify-center w-full">
                <GoogleLoginButton onCredential={handleGoogle} texto="signin_with" />
              </div>
            </div>

            {/* Pie de términos y enlace a tiendas */}
            <div className="pt-6 text-center space-y-2 border-t border-slate-100 dark:border-slate-800/80 mt-6">
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Al iniciar sesión, aceptas los{' '}
                <Link to="/terminos" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                  Términos de Servicio
                </Link>{' '}
                y la{' '}
                <Link to="/privacidad" className="underline hover:text-slate-600 dark:hover:text-slate-300">
                  Política de Privacidad
                </Link>
                .
              </p>
              <div className="pt-1">
                <Link
                  to="/registro?rol=VENDEDOR"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:underline"
                >
                  <span>¿Tienes un negocio? Abre tu tienda virtual en Mercatto</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Login