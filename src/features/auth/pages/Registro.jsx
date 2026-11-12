import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import GoogleLoginButton from '../components/GoogleLoginButton'
import MercattoLogo from '@/components/common/MercattoLogo'
import { User, Mail, Lock, Store, Building, MapPin, Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck, CheckCircle2, CreditCard, AlertCircle } from 'lucide-react'
import {
  validarNombreCompleto,
  validarEmail,
  validarPassword,
  validarDatosVendedor,
  extractApiErrorMessage,
} from '@/utils/validators'

export const Registro = () => {
  const [searchParams] = useSearchParams()
  const rolInicial = searchParams.get('rol') === 'VENDEDOR' ? 'VENDEDOR' : 'COMPRADOR'

  const [rol, setRol] = useState(rolInicial)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [aceptaTerminos, setAceptaTerminos] = useState(true)

  // Campos Vendedor
  const [nombreTienda, setNombreTienda] = useState('')
  const [nitCedula, setNitCedula] = useState('')
  const [banco, setBanco] = useState('Bancolombia')
  const [cuentaBancaria, setCuentaBancaria] = useState('')

  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState(null)
  const { registro, loginGoogle } = useAuth()
  const { success, error, info } = useToast()
  const { t, idioma, cambiarIdioma } = useLanguage()
  const isEn = idioma === 'EN'
  const navigate = useNavigate()

  const reportError = (field, message) => {
    setFormError({ field, message })
    error(message)
  }

  const clearFieldError = (field) => {
    if (formError && (!field || formError.field === field || formError.field === 'general')) {
      setFormError(null)
    }
  }

  const detectarCampoBackend = (mensaje = '') => {
    const lower = mensaje.toLowerCase()
    if (lower.includes('correo') || lower.includes('email')) return 'email'
    if (lower.includes('tienda') || lower.includes('store')) return 'nombreTienda'
    if (lower.includes('nit') || lower.includes('cédula') || lower.includes('cedula')) return 'nitCedula'
    if (lower.includes('contraseña') || lower.includes('password')) return 'password'
    return 'general'
  }

  const handleGoogle = async (credential) => {
    if (loading) return
    setFormError(null)
    setLoading(true)
    try {
      const res = await loginGoogle(credential)
      if (res?.exito) {
        success(isEn ? 'Account created with Google! Welcome to Mercatto.' : '¡Cuenta creada con Google! Bienvenido a Mercatto.')
        navigate('/', { replace: true })
      } else {
        reportError(
          'general',
          res?.mensaje || (isEn ? 'Could not continue with Google' : 'No se pudo continuar con Google')
        )
      }
    } catch (err) {
      reportError(
        'general',
        extractApiErrorMessage(err, isEn ? 'Could not continue with Google' : 'No se pudo continuar con Google')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    const nombreTrim = nombre.trim().replace(/\s+/g, ' ')
    const emailTrim = email.trim().toLowerCase()

    const nombreErr = validarNombreCompleto(nombreTrim, isEn)
    if (nombreErr) {
      reportError('nombre', nombreErr)
      return
    }

    const emailErr = validarEmail(emailTrim, isEn)
    if (emailErr) {
      reportError('email', emailErr)
      return
    }

    const passErr = validarPassword(password, isEn)
    if (passErr) {
      reportError('password', passErr)
      return
    }

    if (password !== confirmPassword) {
      reportError(
        'confirmPassword',
        isEn ? 'Passwords do not match' : 'Las contraseñas no coinciden. Por favor verifícalas.'
      )
      return
    }

    if (rol === 'VENDEDOR') {
      const vendorErr = validarDatosVendedor(
        { nombreTienda, nitCedula, banco, cuentaBancaria },
        isEn
      )
      if (vendorErr) {
        reportError(vendorErr.field, vendorErr.message)
        return
      }
    }

    if (!aceptaTerminos) {
      reportError(
        'terminos',
        isEn
          ? 'You must accept the Terms and Conditions'
          : 'Debes aceptar los Términos y Condiciones para continuar'
      )
      return
    }

    setFormError(null)
    setLoading(true)

    const payload = {
      nombre: nombreTrim,
      email: emailTrim,
      password,
      rol,
      vendedor:
        rol === 'VENDEDOR'
          ? {
              nombreTienda: nombreTienda.trim().replace(/\s+/g, ' '),
              nitCedula: nitCedula.trim(),
              ciudad: 'Cartagena de Indias',
              banco: banco.trim(),
              cuentaBancaria: cuentaBancaria.trim(),
              tipo: 'PERSONA_NATURAL',
            }
          : undefined,
    }

    try {
      const res = await registro(payload)

      if (res?.exito) {
        if (rol === 'VENDEDOR') {
          success(isEn ? 'Store registered! Check your email to verify your account.' : '¡Tienda registrada! Verifica tu correo o ingresa para comenzar.')
          navigate('/login?registro=pendiente')
        } else {
          success(isEn ? 'Account created successfully! Welcome to Mercatto.' : '¡Cuenta creada con éxito! Bienvenido a Mercatto.')
          navigate('/', { replace: true })
        }
      } else {
        const msg = res?.mensaje || (isEn ? 'Error creating account' : 'Error al crear la cuenta')
        reportError(detectarCampoBackend(msg), msg)
      }
    } catch (err) {
      const msg = extractApiErrorMessage(err, isEn ? 'Error creating account' : 'Error al crear la cuenta')
      reportError(detectarCampoBackend(msg), msg)
    } finally {
      setLoading(false)
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

        {/* Botón Volver en esquina superior izquierda */}
        <div className="relative z-10 self-start">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all cursor-pointer shadow-xs group"
            title={isEn ? 'Back to home' : 'Volver a la página principal'}
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>{isEn ? 'Back' : 'Volver'}</span>
          </button>
        </div>

        {/* Tarjeta de beneficios */}
        <div className="relative z-10 space-y-3 bg-slate-950/80 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={15} className="text-violet-400" />
            <span>{rol === 'VENDEDOR' ? (isEn ? 'Official Merchant Platform' : 'Panel de Vendedores Oficial') : (isEn ? 'Your Favorite Marketplace' : 'Tu marketplace favorito')}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {rol === 'VENDEDOR'
              ? (isEn
                  ? 'Open your store window and sell verified products with nationwide reach and real-time sales payouts.'
                  : 'Abre tu vitrina virtual y comienza a vender productos verificados con alcance nacional y liquidación de transacciones en tiempo real.')
              : (isEn
                  ? 'Join Mercatto for free and access thousands of trusted products with fast deliveries and secure payments.'
                  : 'Únete gratis a Mercatto y accede a miles de productos de confianza con pagos seguros y entregas ágiles.')}
          </p>
          <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-300 font-semibold border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>{isEn ? 'Wompi Payouts' : 'Pagos Wompi'}</span>
            </div>
            <span className="text-white/30">•</span>
            <div>{isEn ? 'Direct deliveries' : 'Envíos a todo el país'}</div>
          </div>
        </div>
      </div>

      {/* Columna Derecha */}
      <div className="lg:col-span-7 xl:col-span-7 min-h-screen lg:h-screen lg:overflow-y-auto flex flex-col justify-between p-0 lg:p-12 xl:p-16 bg-white dark:bg-slate-900">
        
        {/* Hero Banner exclusivo para Móvil: coherente con desktop */}
        <div className="lg:hidden relative w-full h-44 sm:h-52 flex flex-col justify-between p-5 bg-slate-950 text-white overflow-hidden rounded-b-[2rem] shadow-lg shrink-0">
          <img 
            src="/images/login-ecommerce.jpg" 
            alt="Mercatto Marketplace" 
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-violet-950/50 mix-blend-multiply pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90 pointer-events-none" />

          {/* Barra superior móvil dentro del banner */}
          <div className="relative z-10 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-white/15 backdrop-blur-md border border-white/20 hover:bg-white/25 transition-all cursor-pointer"
            >
              <ArrowLeft size={15} />
              <span>{isEn ? 'Back' : 'Volver'}</span>
            </button>

            <div className="flex items-center p-1 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
              <button
                type="button"
                onClick={() => cambiarIdioma('es')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                  !isEn ? 'bg-white text-violet-700 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => cambiarIdioma('en')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer ${
                  isEn ? 'bg-white text-violet-700 shadow-xs' : 'text-white/80 hover:text-white'
                }`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Logo coherente dentro del banner móvil */}
          <div className="relative z-10 self-start">
            <MercattoLogo 
              variant="onDark" 
              size={32} 
              showSlogan={true} 
              sloganClassName="mt-2 text-[11px] font-bold tracking-wide block" 
            />
          </div>
        </div>

        {/* Barra superior exclusiva para Desktop */}
        <div className="hidden lg:flex items-start justify-between gap-4 mb-4">
          <Link
            to="/"
            className="inline-block"
            title={isEn ? 'Back to home' : 'Volver a la página principal'}
          >
            <MercattoLogo
              variant="default"
              size={36}
              showSlogan={true}
              sloganClassName="mt-2 text-xs font-bold tracking-wide block"
            />
          </Link>

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
        <div className="w-full max-w-lg mx-auto my-auto px-5 py-6 sm:px-10 sm:py-8 lg:p-0">
          <div className="space-y-1.5 mb-5">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {isEn ? 'Create an Account' : 'Crear una Cuenta'}
              <span className="text-violet-600">.</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {rol === 'VENDEDOR' 
                ? (isEn ? 'Register your official store and start selling on Mercatto.' : 'Registra tu negocio oficial y empieza a vender en Mercatto.')
                : (isEn ? 'Sign up to shop and track your orders nationwide.' : 'Regístrate para comprar y rastrear tus pedidos.')}
            </p>
          </div>

          {/* Selector de Rol estilizado en una sola línea limpia */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-5 border border-slate-200/70 dark:border-slate-700/70">
            <button
              type="button"
              onClick={() => {
                setRol('COMPRADOR')
                setFormError(null)
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                rol === 'COMPRADOR'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <User size={15} className="shrink-0" />
              <span>{t('quiero_comprar') || (isEn ? 'Buy' : 'Quiero Comprar')}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRol('VENDEDOR')
                setFormError(null)
              }}
              className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${
                rol === 'VENDEDOR'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25 border border-violet-500'
                  : 'text-slate-500 hover:text-violet-600 dark:hover:text-violet-300'
              }`}
            >
              <Store size={15} className="shrink-0" />
              <span>{isEn ? 'Open Store' : 'Abrir Tienda'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
            {formError?.message && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-2xl border border-rose-200 dark:border-rose-800/70 bg-rose-50 dark:bg-rose-950/50 px-3.5 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <span>{formError.message}</span>
              </div>
            )}

            {/* Nombre Completo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                {t('nombre_completo') || (isEn ? 'Full Name' : 'Nombre Completo')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value)
                    clearFieldError('nombre')
                  }}
                  placeholder={isEn ? 'e.g. John Doe' : 'Ej: John Doe'}
                  required
                  autoComplete="name"
                  className={`w-full rounded-2xl border bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-all ${
                    formError?.field === 'nombre'
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700/90 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15'
                  }`}
                />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                {t('correo_electronico') || (isEn ? 'Email Address' : 'Correo Electrónico')}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    clearFieldError('email')
                  }}
                  placeholder={t('correo_placeholder') || (isEn ? 'example@mercatto.com' : 'ejemplo@mercatto.com')}
                  required
                  autoComplete="email"
                  className={`w-full rounded-2xl border bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-all ${
                    formError?.field === 'email'
                      ? 'border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700/90 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15'
                  }`}
                />
              </div>
            </div>

            {/* Contraseña & Confirmación en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  {t('contrasena') || (isEn ? 'Password' : 'Contraseña')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      clearFieldError('password')
                    }}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className={`w-full rounded-2xl border bg-slate-50/70 dark:bg-slate-800/60 pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-all ${
                      formError?.field === 'password'
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700/90 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title={showPassword ? (isEn ? 'Hide' : 'Ocultar') : (isEn ? 'Show' : 'Ver')}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  {t('confirmar_contrasena') || (isEn ? 'Confirm' : 'Confirmar')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value)
                      clearFieldError('confirmPassword')
                    }}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className={`w-full rounded-2xl border bg-slate-50/70 dark:bg-slate-800/60 pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 transition-all ${
                      formError?.field === 'confirmPassword'
                        ? 'border-rose-500 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700/90 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title={showConfirmPassword ? (isEn ? 'Hide' : 'Ocultar') : (isEn ? 'Show' : 'Ver')}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Datos del Negocio y Cuenta para Liquidaciones (VENDEDOR) */}
            {rol === 'VENDEDOR' && (
              <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-slate-800/80 border border-violet-200/80 dark:border-violet-800/50 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-900 dark:text-violet-300 uppercase tracking-wider">
                  <Store size={15} className="text-violet-600 dark:text-violet-400" />
                  <span>{isEn ? 'Store & Business Information' : 'Datos del Negocio / Tienda Oficial'}</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Store Name' : 'Nombre de tu Tienda Virtual'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Store size={16} />
                    </div>
                    <input
                      type="text"
                      value={nombreTienda}
                      onChange={(e) => {
                        setNombreTienda(e.target.value)
                        clearFieldError('nombreTienda')
                      }}
                      placeholder={isEn ? 'e.g. Alien Tech Colombia' : 'Ej: Alien Tech Colombia'}
                      required
                      className={`w-full rounded-xl border bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none ${
                        formError?.field === 'nombreTienda'
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {isEn ? 'Tax ID / Citizen ID' : 'NIT o Cédula'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Building size={16} />
                    </div>
                    <input
                      type="text"
                      value={nitCedula}
                      onChange={(e) => {
                        setNitCedula(e.target.value)
                        clearFieldError('nitCedula')
                      }}
                      placeholder="Ej: 900.123.456-7"
                      required
                      className={`w-full rounded-xl border bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none ${
                        formError?.field === 'nitCedula'
                          ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20'
                      }`}
                    />
                  </div>
                </div>

                {/* Cuenta para transacciones y liquidaciones de ventas */}
                <div className="pt-2 border-t border-violet-200/60 dark:border-violet-800/40">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-violet-900 dark:text-violet-300 mb-2">
                    <CreditCard size={14} className="text-violet-600 dark:text-violet-400" />
                    <span>{isEn ? 'Payout Account for Sales' : 'Cuenta para Transacciones y Liquidaciones'}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Bank / Wallet' : 'Entidad Bancaria o Billetera'}
                      </label>
                      <select
                        value={banco}
                        onChange={(e) => {
                          setBanco(e.target.value)
                          clearFieldError('banco')
                        }}
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
                      >
                        <option value="Bancolombia">Bancolombia (Ahorros/Corriente)</option>
                        <option value="Nequi">Nequi</option>
                        <option value="Daviplata">Daviplata</option>
                        <option value="Davivienda">Davivienda</option>
                        <option value="BBVA">BBVA Colombia</option>
                        <option value="Banco de Bogota">Banco de Bogotá</option>
                        <option value="Banco de Occidente">Banco de Occidente</option>
                        <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
                        <option value="Otro">Otro Banco Nacional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {isEn ? 'Account / Mobile Number' : 'Número de Cuenta o Celular Nequi'}
                      </label>
                      <input
                        type="text"
                        value={cuentaBancaria}
                        onChange={(e) => {
                          setCuentaBancaria(e.target.value)
                          clearFieldError('cuentaBancaria')
                        }}
                        placeholder={isEn ? 'e.g. 123-456789-00 or 3001234567' : 'Ej: 123-456789-00 o 3001234567'}
                        required
                        className={`w-full rounded-xl border bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 focus:outline-none ${
                          formError?.field === 'cuentaBancaria'
                            ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                            : 'border-slate-300 dark:border-slate-700 focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Checkbox Términos */}
            <div className="pt-0.5">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => {
                    setAceptaTerminos(e.target.checked)
                    clearFieldError('terminos')
                  }}
                  className="w-4 h-4 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <span>
                  {isEn ? 'I agree to the ' : 'Acepto los '}
                  <Link to="/terminos" target="_blank" className="font-bold underline text-slate-900 dark:text-white hover:text-violet-600">
                    {isEn ? 'Terms & Conditions' : 'Términos y Condiciones'}
                  </Link>
                </span>
              </label>
            </div>

            {/* Botón Principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-700 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
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
                  <CheckCircle2 size={18} />
                  <span>
                    {rol === 'VENDEDOR'
                      ? (isEn ? 'Submit Store Application' : 'Enviar Solicitud de Tienda')
                      : (isEn ? 'Create Account' : 'Crear Cuenta')}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Registro con Google para Compradores */}
          {rol === 'COMPRADOR' && (
            <>
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t('o_continua_con') || (isEn ? 'or continue with' : 'o continúa con')}
                </span>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLoginButton onCredential={handleGoogle} texto="signup_with" />
              </div>
            </>
          )}
        </div>

        {/* Sección Inferior */}
        <div className="px-5 pb-6 pt-5 sm:px-10 lg:px-0 lg:pb-0 text-center text-sm text-slate-600 dark:text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800/80">
          {t('ya_tienes_cuenta') || (isEn ? 'Already have an account?' : '¿Ya tienes una cuenta?')}{' '}
          <Link to="/login" className="font-black text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:underline ml-1">
            {t('iniciar_sesion') || (isEn ? 'Log in here' : 'Inicia sesión aquí')}
          </Link>
        </div>

      </div>

    </div>
  )
}

export default Registro