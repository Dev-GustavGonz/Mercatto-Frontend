import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import GoogleLoginButton from '../components/GoogleLoginButton'
import MercattoLogo from '@/components/common/MercattoLogo'
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Zap,
  ShoppingBag,
  Store,
  CheckCircle2,
} from 'lucide-react'
import { validarEmail, extractApiErrorMessage } from '@/utils/validators'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [recordarme, setRecordarme] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
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
    navigate(destino, { replace: true })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const emailTrim = email.trim().toLowerCase()
    const emailErr = validarEmail(emailTrim, isEn)
    if (emailErr) {
      setFormError(emailErr)
      error(emailErr)
      return
    }

    if (!password) {
      const msg = isEn ? 'Please enter your password' : 'Por favor ingresa tu contraseña'
      setFormError(msg)
      error(msg)
      return
    }

    setFormError('')
    setLoading(true)
    try {
      const res = await login(emailTrim, password, recordarme)
      if (res?.exito) {
        success(isEn ? 'Welcome back to Mercatto!' : '¡Bienvenido de vuelta a Mercatto!')
        irSegunRol(res)
      } else {
        const msg =
          res?.mensaje ||
          (isEn
            ? 'Login failed. Check your credentials.'
            : 'Error al iniciar sesión. Verifica tus credenciales.')
        setFormError(msg)
        error(msg)
      }
    } catch (err) {
      const msg = extractApiErrorMessage(
        err,
        isEn
          ? 'Login failed. Check your credentials.'
          : 'Error al iniciar sesión. Verifica tus credenciales.'
      )
      setFormError(msg)
      error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async (credential) => {
    if (loading) return
    setFormError('')
    setLoading(true)
    try {
      const res = await loginGoogle(credential)
      if (res?.exito) {
        success(isEn ? 'Welcome to Mercatto!' : '¡Bienvenido a Mercatto!')
        irSegunRol(res)
      } else {
        const msg =
          res?.mensaje ||
          (isEn ? 'Could not sign in with Google' : 'No se pudo iniciar sesión con Google')
        setFormError(msg)
        error(msg)
      }
    } catch (err) {
      const msg = extractApiErrorMessage(
        err,
        isEn ? 'Could not sign in with Google' : 'No se pudo iniciar sesión con Google'
      )
      setFormError(msg)
      error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-12 bg-[#0A0718] font-sans text-slate-100 overflow-x-hidden relative selection:bg-violet-600 selection:text-white">
      {/* Fondo ambiental dinámico / gradientes de malla */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* COLUMNA IZQUIERDA: HERO INTERACTIVO CON GLASSMORPHISM         */}
      {/* ============================================================== */}
      <div className="lg:col-span-6 xl:col-span-5 relative hidden lg:flex flex-col justify-between p-8 xl:p-12 z-10 border-r border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-sm">
        {/* Top: Botón Volver + Logo */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group backdrop-blur-md"
            title={isEn ? 'Back to home' : 'Volver a la página principal'}
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            <span>{isEn ? 'Home' : 'Inicio'}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-violet-500/10 text-violet-300 border border-violet-500/25">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span>Cartagena de Indias</span>
          </span>
        </div>

        {/* Centro: Arte conceptual innovador */}
        <div className="space-y-6 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-xs font-bold text-violet-300 backdrop-blur-md">
            <Sparkles size={14} className="text-violet-400" />
            <span>{isEn ? 'Next-Gen Local Commerce' : 'Comercio Local de Nueva Generación'}</span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-[1.15]">
              {isEn ? (
                <>
                  Enter the marketplace <br />
                  <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                    redefining Cartagena.
                  </span>
                </>
              ) : (
                <>
                  Entra al marketplace <br />
                  <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                    que redefine a Cartagena.
                  </span>
                </>
              )}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {isEn
                ? 'Buy from verified official distributors and track your purchases in real time with zero intermediaries.'
                : 'Compra en tiendas y distribuidoras verificadas de la ciudad con pagos seguros Wompi y despacho ágil a tu puerta.'}
            </p>
          </div>

          {/* Tarjetas flotantes bento de métricas en vivo */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{isEn ? 'Protection' : 'Protección'}</span>
                <ShieldCheck size={16} className="text-emerald-400" />
              </div>
              <p className="text-lg font-black text-white">100% Wompi</p>
              <span className="text-[10px] text-slate-400 block">{isEn ? 'Bancolombia certified' : 'Transacción bancaria segura'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{isEn ? 'Scope' : 'Alcance'}</span>
                <Zap size={16} className="text-amber-400" />
              </div>
              <p className="text-lg font-black text-white">Directo & Rápido</p>
              <span className="text-[10px] text-slate-400 block">{isEn ? 'Cartagena citywide' : 'Envíos en toda la ciudad'}</span>
            </div>
          </div>
        </div>

        {/* Bottom: Cita inspiracional / branding */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Mercatto Platform 2.0</span>
          </div>
          <span className="text-slate-400">© {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMNA DERECHA: FORMULARIO GLASS / NEOMORFO MINIMALISTA       */}
      {/* ============================================================== */}
      <div className="lg:col-span-6 xl:col-span-7 relative z-10 flex flex-col justify-between p-5 sm:p-8 lg:p-12 xl:p-16 min-h-screen">
        {/* Barra superior: Logo + Selector de idioma */}
        <div className="flex items-center justify-between gap-4 mb-6 sm:mb-8">
          <Link to="/" className="inline-block" title="Ir al inicio de Mercatto">
            <MercattoLogo
              variant="whiteBorder"
              size={32}
              showSlogan={true}
              sloganClassName="mt-1 text-xs font-bold text-violet-300 block"
            />
          </Link>

          <div className="flex items-center p-1 bg-white/[0.06] backdrop-blur-md rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => cambiarIdioma('es')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                !isEn
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => cambiarIdioma('en')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                isEn
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Tarjeta central del Login con estética Glassmorphism */}
        <div className="w-full max-w-md mx-auto my-auto">
          <div className="bg-[#110D24]/90 backdrop-blur-xl border border-white/15 rounded-[32px] p-7 sm:p-9 shadow-2xl shadow-black/60 relative overflow-hidden">
            {/* Resplandor decorativo interno */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">
                  {isEn ? 'Welcome back' : 'Bienvenido de vuelta'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {t('iniciar_sesion') || (isEn ? 'Sign In' : 'Iniciar sesión')}
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-400">
                {isEn ? 'Access your orders, favorites, or vendor hub.' : 'Accede a tus pedidos, favoritos o panel de vendedor.'}
              </p>
            </div>

            {formError && (
              <div
                role="alert"
                className="relative z-10 mb-4 flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-semibold text-rose-300 backdrop-blur-sm"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-4">
              {/* Campo Correo */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {t('correo_electronico') || (isEn ? 'Email' : 'Correo')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-400 transition-colors">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (formError) setFormError('')
                    }}
                    placeholder={t('correo_placeholder') || 'ejemplo@mercatto.com'}
                    required
                    autoComplete="email"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:bg-white/[0.07] focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    {t('contrasena') || (isEn ? 'Password' : 'Contraseña')}
                  </label>
                  <Link
                    to="/recuperar-password"
                    className="text-[11px] font-semibold text-violet-400 hover:text-violet-300 hover:underline transition-colors"
                  >
                    {isEn ? 'Forgot password?' : '¿Olvidaste tu contraseña?'}
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-400 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (formError) setFormError('')
                    }}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:bg-white/[0.07] focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? (isEn ? 'Hide password' : 'Ocultar contraseña') : (isEn ? 'Show password' : 'Ver contraseña')}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Recordarme */}
              <div className="flex items-center pt-0.5">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={recordarme}
                    onChange={(e) => setRecordarme(e.target.checked)}
                    className="w-4 h-4 rounded-md border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500 focus:ring-offset-0 cursor-pointer"
                  />
                  <span>{t('recordarme') || (isEn ? 'Keep me signed in' : 'Recordar mi sesión')}</span>
                </label>
              </div>

              {/* Botón Principal Gradiente */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>{isEn ? 'Authenticating...' : 'Iniciando sesión...'}</span>
                  </span>
                ) : (
                  <>
                    <span>{t('ingresar_a_mercatto') || (isEn ? 'Sign In to Mercatto' : 'Ingresar a Mercatto')}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Separador */}
            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-[#110D24] px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {t('o_continua_con') || (isEn ? 'or' : 'o')}
              </span>
            </div>

            {/* Inicio de sesión con Google */}
            <div className="flex justify-center w-full">
              <GoogleLoginButton onCredential={handleGoogle} texto="signin_with" />
            </div>
          </div>

          {/* Accesos rápidos inferiores */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {isEn ? "Don't have an account yet? " : "¿Aún no tienes una cuenta? "}
              <Link
                to="/registro"
                className="font-black text-violet-400 hover:text-violet-300 hover:underline transition-colors"
              >
                {isEn ? 'Sign up for free' : 'Regístrate gratis'}
              </Link>
            </p>

            <div>
              <Link
                to="/registro?rol=VENDEDOR"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all shadow-xs"
              >
                <Store size={14} className="text-amber-400" />
                <span>
                  {isEn
                    ? 'Own a brand or business? Open your store →'
                    : '¿Tienes un negocio o marca? Abre tu tienda oficial →'}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer simple */}
        <div className="mt-6 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} Mercatto Marketplace · Cartagena de Indias
        </div>
      </div>
    </div>
  )
}

export default Login
