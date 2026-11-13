import React, { useState, useCallback } from 'react'
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
  Store,
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

  const irSegunRol = useCallback((res) => {
    const email = res?.usuario?.email?.toLowerCase()
    const rol = email === 'realmercatto@gmail.com' ? 'ADMIN' : res?.usuario?.rol
    let destino = redirectUrl
    if (rol === 'VENDEDOR') {
      destino = '/vendedor'
    } else if (rol === 'ADMIN') {
      destino = '/admin'
    }
    navigate(destino, { replace: true })
  }, [navigate, redirectUrl])

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

  const handleGoogle = useCallback(async (credential) => {
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
  }, [loading, loginGoogle, isEn, success, error, irSegunRol])

  return (
    <div className="min-h-screen lg:h-screen w-full lg:grid lg:grid-cols-12 font-sans selection:bg-violet-600 selection:text-white lg:overflow-hidden bg-white">
      {/* ============================================================== */}
      {/* COLUMNA IZQUIERDA: MORADO ELEGANTE CARTAGENA                   */}
      {/* ============================================================== */}
      <div className="lg:col-span-5 xl:col-span-5 relative hidden lg:flex flex-col justify-between p-6 sm:p-8 xl:p-10 z-10 bg-gradient-to-br from-[#180A2E] via-[#0F071D] to-[#0A0514] text-slate-100 overflow-hidden border-r border-violet-950/40 lg:h-screen">
        {/* Halos morados ambientales */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[110px] pointer-events-none" />

        {/* Top: Volver + Ubicación Cartagena */}
        <div className="flex items-center justify-between relative z-10">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group backdrop-blur-md"
            title={isEn ? 'Back to home' : 'Volver a la página principal'}
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>{isEn ? 'Home' : 'Inicio'}</span>
          </button>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Cartagena de Indias</span>
          </span>
        </div>

        {/* Centro: Showcase Visual Compacto */}
        <div className="space-y-4 my-auto py-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs font-bold text-violet-300 backdrop-blur-md">
            <Sparkles size={13} className="text-violet-400" />
            <span>{isEn ? 'Direct & Secure Shopping' : 'Compra Directa y Segura'}</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl xl:text-3xl font-black text-white tracking-tight leading-tight">
              {isEn ? (
                <>
                  Join the marketplace <br />
                  <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                    built for Cartagena.
                  </span>
                </>
              ) : (
                <>
                  Únete al marketplace <br />
                  <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                    hecho para Cartagena.
                  </span>
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {isEn
                ? 'Explore verified local stores, save favorites, and pay with complete Wompi protection.'
                : 'Explora tiendas locales verificadas, guarda favoritos y paga con total respaldo Wompi.'}
            </p>
          </div>

          {/* Bento cards compactas */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>{isEn ? 'Security' : 'Seguridad'}</span>
                <ShieldCheck size={15} className="text-emerald-400" />
              </div>
              <p className="text-base font-black text-white">100% Wompi</p>
              <span className="text-[10.5px] text-slate-400 block">{isEn ? 'PSE, Nequi & Cards' : 'PSE, Nequi y Tarjetas'}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>{isEn ? 'Deliveries' : 'Entregas'}</span>
                <Zap size={15} className="text-amber-400" />
              </div>
              <p className="text-base font-black text-white">{isEn ? 'Live Tracking' : 'Rastreo en Vivo'}</p>
              <span className="text-[10.5px] text-slate-400 block">{isEn ? 'All Cartagena' : 'Envíos en Cartagena'}</span>
            </div>
          </div>
        </div>

        {/* Footer izquierdo compacto */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Mercatto Platform</span>
          </div>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMNA DERECHA: FORMULARIO BALANCEADO CON FONDO BLANCO        */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 xl:col-span-7 bg-white text-slate-900 p-5 sm:p-7 lg:p-8 xl:p-10 flex flex-col justify-between lg:h-screen overflow-y-auto relative">
        {/* Barra superior compacta: Logo + Idioma */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <Link to="/" className="inline-block" title="Ir al inicio de Mercatto">
            <MercattoLogo
              variant="default"
              size={28}
              showSlogan={true}
              sloganClassName="mt-0.5 text-[11px] font-bold text-violet-600 block"
            />
          </Link>

          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => cambiarIdioma('es')}
              className={`px-2.5 py-0.5 rounded-md text-xs font-black transition-all cursor-pointer ${
                !isEn
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => cambiarIdioma('en')}
              className={`px-2.5 py-0.5 rounded-md text-xs font-black transition-all cursor-pointer ${
                isEn
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Formulario central bien proporcionado (sin bajarse) */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-2">
          <div className="space-y-1 mb-4">
            <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
              {t('iniciar_sesion') || (isEn ? 'Log in' : 'Iniciar sesión')}
            </h1>
            <p className="text-xs text-slate-500">
              {isEn ? 'Enter your registered email and password' : 'Ingresa con tu correo y contraseña registrados'}
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="mb-3.5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-3">
            {/* Campo Correo */}
            <div className="space-y-1">
              <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                {t('correo_electronico') || (isEn ? 'Email address' : 'Correo electrónico')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <Mail size={15} />
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                  {t('contrasena') || (isEn ? 'Password' : 'Contraseña')}
                </label>
                <Link
                  to="/recuperar-password"
                  className="text-[11px] font-semibold text-violet-600 hover:text-violet-700 hover:underline transition-colors"
                >
                  {isEn ? 'Forgot password?' : '¿Olvidaste tu contraseña?'}
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <Lock size={15} />
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  title={showPassword ? (isEn ? 'Hide password' : 'Ocultar contraseña') : (isEn ? 'Show password' : 'Ver contraseña')}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Recordarme */}
            <div className="flex items-center pt-0.5">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recordarme}
                  onChange={(e) => setRecordarme(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <span>{t('recordarme') || (isEn ? 'Remember me' : 'Recordarme')}</span>
              </label>
            </div>

            {/* Botón Principal Gradiente */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-2.5 text-[10.5px] font-bold text-slate-400 uppercase tracking-wider">
              {t('o_continua_con') || (isEn ? 'or continue with' : 'o continúa con')}
            </span>
          </div>

          {/* Inicio de sesión con Google */}
          <div className="flex justify-center w-full">
            <GoogleLoginButton onCredential={handleGoogle} texto="signin_with" />
          </div>

          {/* Accesos rápidos inferiores compactos */}
          <div className="mt-4 text-center space-y-2">
            <p className="text-xs text-slate-600">
              {isEn ? "Don't have an account yet? " : "¿No tienes una cuenta? "}
              <Link
                to="/registro"
                className="font-bold text-violet-600 hover:text-violet-700 hover:underline"
              >
                {isEn ? 'Sign up here' : 'Regístrate aquí'}
              </Link>
            </p>

            <div>
              <Link
                to="/registro?rol=VENDEDOR"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-violet-50/60 border border-slate-200 hover:border-violet-200 text-[11px] font-bold text-slate-700 hover:text-violet-800 transition-all shadow-xs"
              >
                <Store size={13} className="text-violet-600" />
                <span>
                  {isEn
                    ? 'Own a business? Open your store on Mercatto →'
                    : '¿Tienes un negocio o marca? Abre tu tienda virtual en Mercatto →'}
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer simple compacto */}
        <div className="pt-2 text-center text-[10.5px] text-slate-400">
          © {new Date().getFullYear()} Mercatto Marketplace · Cartagena de Indias
        </div>
      </div>
    </div>
  )
}

export default Login
