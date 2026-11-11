import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import GoogleLoginButton from '../components/GoogleLoginButton'
import MercattoLogo from '@/components/common/MercattoLogo'
import { Mail, Lock, LogIn, Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'

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
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-violet-50/70 via-slate-50 to-indigo-50/60 dark:from-slate-950 dark:via-slate-900 dark:to-violet-950/40 relative overflow-hidden">
      {/* Resplandores ambientales de fondo con gradientes suaves */}
      <div className="absolute -top-36 -left-36 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 -right-36 w-96 h-96 bg-fuchsia-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta principal con profundidad, sombras ricas y bordes redondeados */}
      <div className="w-full max-w-5xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(118,85,214,0.18)] border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 md:p-7 transition-all relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-stretch">
          
          {/* Columna Izquierda: Banner visual de compras con Mercatto y su eslogan oficial */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 min-h-[620px] bg-slate-950 text-white shadow-2xl">
            {/* Imagen de compras y lifestyle de alta calidad */}
            <img 
              src="/images/login-shopping.jpg" 
              alt="Mercatto Shopping Experience" 
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.88] contrast-105 transition-transform duration-700 hover:scale-105"
            />

            {/* Capas de gradientes ricas en tonos violetas e índigo */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-violet-950/50 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90 pointer-events-none" />

            {/* Cabecera del Banner: Logo oficial Mercatto con su eslogan justo debajo */}
            <div className="relative z-10 p-5 rounded-2xl bg-slate-950/50 backdrop-blur-md border border-white/15 shadow-lg">
              <MercattoLogo 
                variant="white" 
                size={36} 
                showSlogan={true} 
                sloganClassName="text-violet-200 text-xs font-semibold mt-1 block tracking-wide" 
              />
            </div>

            {/* Chip flotante central */}
            <div className="relative z-10 self-start">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/25 text-white text-xs font-bold shadow-md">
                <span className="text-amber-300">★ 4.9</span>
                <span>Tiendas Oficiales Verificadas</span>
              </div>
            </div>

            {/* Tarjeta de cristal en la parte inferior */}
            <div className="relative z-10 space-y-3 bg-slate-950/75 backdrop-blur-md p-6 rounded-2xl border border-white/15 shadow-xl">
              <div className="flex items-center gap-2 text-violet-300 font-bold text-xs uppercase tracking-wider">
                <Sparkles size={15} className="text-violet-400" />
                <span>Experiencia de compra moderna</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                Conecta directamente con marcas y emprendedores locales con pagos seguros y envíos ágiles a tu puerta.
              </p>
              <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-300 font-semibold border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>100% Protegido</span>
                </div>
                <span className="text-white/30">•</span>
                <div>Envíos directos</div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario estilizado con profundidad */}
          <div className="lg:col-span-7 flex flex-col justify-between px-2 sm:px-6 md:px-8 py-2 sm:py-4">
            <div>
              {/* Barra Superior con botón para retroceder */}
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-xs group"
                  title="Volver a la página principal"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-violet-600 dark:text-violet-400" />
                  <span>{idioma === 'EN' ? 'Back to home' : 'Volver al inicio'}</span>
                </button>

                {/* En móviles mostramos el logo Mercatto con su eslogan */}
                <div className="lg:hidden">
                  <MercattoLogo size={26} showSlogan={true} sloganClassName="text-[10px]" />
                </div>
              </div>

              {/* Título y subtítulo acogedor */}
              <div className="space-y-1.5 mb-7">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {t('iniciar_sesion') || 'Iniciar sesión'}
                  <span className="text-violet-600">.</span>
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t('login_sub') || 'Ingresa tus credenciales para acceder a tu cuenta.'}
                </p>
              </div>

              {/* Formulario */}
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
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-slate-50/60 dark:bg-slate-800/60 pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all"
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
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-slate-50/60 dark:bg-slate-800/60 pl-11 pr-11 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all"
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

                {/* Botón Principal con gradiente vibrante y elevación */}
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

            {/* Sección Inferior: "¿No tienes una cuenta? Regístrate aquí" en el lugar solicitado */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 text-center space-y-3">
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
      </div>
    </div>
  )
}

export default Login