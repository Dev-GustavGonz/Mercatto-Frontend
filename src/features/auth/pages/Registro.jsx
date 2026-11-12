import React, { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import GoogleLoginButton from '../components/GoogleLoginButton'
import MercattoLogo from '@/components/common/MercattoLogo'
import {
  User,
  Mail,
  Lock,
  Store,
  Building,
  MapPin,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Zap,
} from 'lucide-react'
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
  const { success, error } = useToast()
  const { t, idioma, cambiarIdioma } = useLanguage()
  const isEn = idioma === 'EN'
  const navigate = useNavigate()

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-slate-200' }
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password) || /\d/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 8) score += 1
    if (score <= 1) return { score: 1, label: isEn ? 'Weak' : 'Débil', color: 'bg-rose-500' }
    if (score === 2) return { score: 2, label: isEn ? 'Fair' : 'Media', color: 'bg-amber-500' }
    if (score === 3) return { score: 3, label: isEn ? 'Good' : 'Buena', color: 'bg-sky-500' }
    return { score: 4, label: isEn ? 'Strong' : 'Fuerte', color: 'bg-emerald-500' }
  }, [password, isEn])

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
        success(isEn ? 'Welcome to Mercatto!' : '¡Bienvenido a Mercatto!')
        const destino = res.usuario?.rol === 'VENDEDOR' ? '/vendedor' : '/'
        navigate(destino, { replace: true })
      } else {
        const msg = res?.mensaje || (isEn ? 'Could not sign up with Google' : 'No se pudo registrar con Google')
        reportError('general', msg)
      }
    } catch (err) {
      const msg = extractApiErrorMessage(err, isEn ? 'Could not sign up with Google' : 'No se pudo registrar con Google')
      reportError('general', msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loading) return

    setFormError(null)

    // Validar nombre
    const nombreErr = validarNombreCompleto(nombre, isEn)
    if (nombreErr) {
      reportError('nombre', nombreErr)
      return
    }

    // Validar email
    const emailErr = validarEmail(email, isEn)
    if (emailErr) {
      reportError('email', emailErr)
      return
    }

    // Validar password
    const passErr = validarPassword(password, isEn)
    if (passErr) {
      reportError('password', passErr)
      return
    }

    // Confirm password
    if (password !== confirmPassword) {
      const msg = isEn ? 'Passwords do not match' : 'Las contraseñas no coinciden'
      reportError('confirmPassword', msg)
      return
    }

    // Campos vendedor
    let tiendaPayload = null
    if (rol === 'VENDEDOR') {
      const errsVendedor = validarDatosVendedor(
        { nombreTienda, nitCedula, ciudad: 'Cartagena de Indias', banco, cuentaBancaria },
        isEn
      )
      if (errsVendedor.nombreTienda) {
        reportError('nombreTienda', errsVendedor.nombreTienda)
        return
      }
      if (errsVendedor.nitCedula) {
        reportError('nitCedula', errsVendedor.nitCedula)
        return
      }
      if (errsVendedor.cuentaBancaria) {
        reportError('cuentaBancaria', errsVendedor.cuentaBancaria)
        return
      }

      tiendaPayload = {
        nombreTienda: nombreTienda.trim(),
        nitCedula: nitCedula.trim(),
        ciudad: 'Cartagena de Indias',
        banco: banco.trim(),
        cuentaBancaria: cuentaBancaria.trim(),
      }
    }

    // Aceptar términos
    if (!aceptaTerminos) {
      const msg = isEn
        ? 'You must accept the terms and conditions to continue'
        : 'Debes aceptar los términos y condiciones para continuar'
      reportError('terminos', msg)
      return
    }

    setLoading(true)
    try {
      const payload = {
        nombreCompleto: nombre.trim(),
        email: email.trim().toLowerCase(),
        password,
        rol,
        ...(tiendaPayload || {}),
      }

      const res = await registro(payload)
      if (res?.exito) {
        if (rol === 'VENDEDOR') {
          success(
            isEn
              ? 'Store registered! Our team will verify your account shortly.'
              : '¡Tienda registrada! Nuestro equipo verificará tu vitrina pronto.'
          )
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
    <div className="min-h-screen lg:h-screen w-full lg:grid lg:grid-cols-12 font-sans selection:bg-violet-600 selection:text-white lg:overflow-hidden bg-white">
      {/* ============================================================== */}
      {/* COLUMNA IZQUIERDA: SHOWCASE MORADO ADAPTATIVO POR ROL          */}
      {/* ============================================================== */}
      <div className="lg:col-span-5 xl:col-span-5 relative hidden lg:flex flex-col justify-between p-6 sm:p-8 xl:p-10 z-10 bg-gradient-to-br from-[#180A2E] via-[#0F071D] to-[#0A0514] text-slate-100 overflow-hidden border-r border-violet-950/40 lg:h-screen">
        {/* Halos ambientales */}
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
            <MapPin size={11} className="text-emerald-400" />
            <span>Cartagena de Indias</span>
          </span>
        </div>

        {/* Centro dinámico según rol */}
        <div className="space-y-4 my-auto py-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs font-bold text-violet-300 backdrop-blur-md">
            <Sparkles size={13} className="text-violet-400" />
            <span>
              {rol === 'VENDEDOR'
                ? isEn ? 'Merchant Onboarding' : 'Vitrina Digital para Tiendas'
                : isEn ? 'Direct & Secure Shopping' : 'Compra Directa y Segura'}
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl xl:text-3xl font-black text-white tracking-tight leading-tight">
              {rol === 'VENDEDOR' ? (
                isEn ? (
                  <>
                    Launch your virtual store <br />
                    <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                      across Cartagena.
                    </span>
                  </>
                ) : (
                  <>
                    Lanza tu tienda virtual <br />
                    <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                      en toda Cartagena.
                    </span>
                  </>
                )
              ) : isEn ? (
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
              {rol === 'VENDEDOR'
                ? isEn
                  ? 'Sell directly with zero startup fees. Fast settlements to Bancolombia, Nequi, or Daviplata.'
                  : 'Vende sin costos de apertura. Liquidación rápida a Bancolombia, Nequi o Daviplata.'
                : isEn
                  ? 'Explore verified local stores, save favorites, and pay with complete Wompi protection.'
                  : 'Explora tiendas locales verificadas, guarda favoritos y paga con total respaldo Wompi.'}
            </p>
          </div>

          {/* Tarjetas bento adaptativas compactas */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {rol === 'VENDEDOR' ? (
              <>
                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{isEn ? 'Setup Fee' : 'Apertura'}</span>
                    <TrendingUp size={15} className="text-emerald-400" />
                  </div>
                  <p className="text-base font-black text-white">$0 COP</p>
                  <span className="text-[10.5px] text-slate-400 block">{isEn ? '100% Free' : '100% Gratis'}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>{isEn ? 'Payouts' : 'Liquidación'}</span>
                    <CreditCard size={15} className="text-violet-400" />
                  </div>
                  <p className="text-base font-black text-white">Nequi / Bancos</p>
                  <span className="text-[10.5px] text-slate-400 block">{isEn ? 'Direct transfer' : 'Transferencia directa'}</span>
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
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

        {/* Contenedor central del Formulario bien proporcionado */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-2">
          {/* Selector de Rol Compacto */}
          <div className="mb-3.5">
            <div className="p-0.5 rounded-xl bg-slate-100 border border-slate-200 grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => {
                  setRol('COMPRADOR')
                  setFormError(null)
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  rol === 'COMPRADOR'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User size={14} />
                <span>{isEn ? 'I want to Buy' : 'Quiero Comprar'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRol('VENDEDOR')
                  setFormError(null)
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  rol === 'VENDEDOR'
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store size={14} />
                <span>{isEn ? 'I want to Sell' : 'Quiero Vender'}</span>
              </button>
            </div>
          </div>

          <div className="space-y-0.5 mb-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {rol === 'VENDEDOR'
                ? isEn ? 'Create your store.' : 'Crear tienda virtual.'
                : isEn ? 'Create your account.' : 'Crear cuenta.'}
            </h1>
            <p className="text-xs text-slate-500">
              {rol === 'VENDEDOR'
                ? isEn
                  ? 'Set up your showcase and sell across Cartagena.'
                  : 'Configura tu vitrina y vende en toda Cartagena.'
                : isEn
                  ? 'Access the best local catalog and secure payments.'
                  : 'Accede al mejor catálogo local y pagos 100% seguros.'}
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="mb-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700"
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{formError.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-2.5">
            {/* Nombre Completo */}
            <div className="space-y-1">
              <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                {isEn ? 'Full Name' : 'Nombre Completo'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => {
                    setNombre(e.target.value)
                    clearFieldError('nombre')
                  }}
                  placeholder={isEn ? 'e.g. Gustavo González' : 'Ej: Gustavo González'}
                  required
                  autoComplete="name"
                  className={`w-full rounded-xl border bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-3 transition-all ${
                    formError?.field === 'nombre'
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                      : 'border-slate-200 focus:border-violet-600 focus:ring-violet-500/10'
                  }`}
                />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div className="space-y-1">
              <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                {t('correo_electronico') || (isEn ? 'Email' : 'Correo electrónico')}
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
                    clearFieldError('email')
                  }}
                  placeholder={t('correo_placeholder') || 'ejemplo@mercatto.com'}
                  required
                  autoComplete="email"
                  className={`w-full rounded-xl border bg-slate-50/70 pl-9 pr-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-3 transition-all ${
                    formError?.field === 'email'
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                      : 'border-slate-200 focus:border-violet-600 focus:ring-violet-500/10'
                  }`}
                />
              </div>
            </div>

            {/* SECCIÓN ESPECÍFICA DE VENDEDOR COMPACTA */}
            {rol === 'VENDEDOR' && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                    <Store size={14} className="text-violet-600" />
                    <span>{isEn ? 'Store Details' : 'Datos de la Tienda'}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-700 border border-violet-200">
                    <MapPin size={9} />
                    <span>Cartagena</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {isEn ? 'Store Name' : 'Nombre de Tienda'}
                    </label>
                    <input
                      type="text"
                      value={nombreTienda}
                      onChange={(e) => {
                        setNombreTienda(e.target.value)
                        clearFieldError('nombreTienda')
                      }}
                      placeholder="Ej: Calzados del Norte"
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
                    />
                  </div>

                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {isEn ? 'NIT / ID' : 'NIT o Cédula'}
                    </label>
                    <input
                      type="text"
                      value={nitCedula}
                      onChange={(e) => {
                        setNitCedula(e.target.value)
                        clearFieldError('nitCedula')
                      }}
                      placeholder="Ej: 901234567-8"
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {isEn ? 'Bank' : 'Banco o Billetera'}
                    </label>
                    <select
                      value={banco}
                      onChange={(e) => setBanco(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-violet-600 cursor-pointer"
                    >
                      <option value="Bancolombia">Bancolombia</option>
                      <option value="Nequi">Nequi</option>
                      <option value="Daviplata">Daviplata</option>
                      <option value="Davivienda">Davivienda</option>
                      <option value="BBVA">BBVA</option>
                      <option value="Banco de Bogotá">Banco de Bogotá</option>
                    </select>
                  </div>

                  <div className="space-y-0.5">
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                      {isEn ? 'Account / Phone' : 'Cuenta / Celular'}
                    </label>
                    <input
                      type="text"
                      value={cuentaBancaria}
                      onChange={(e) => {
                        setCuentaBancaria(e.target.value)
                        clearFieldError('cuentaBancaria')
                      }}
                      placeholder="Ej: 3001234567"
                      required
                      className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-violet-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Contraseñas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                  {t('contrasena') || (isEn ? 'Password' : 'Contraseña')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600">
                    <Lock size={15} />
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
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-3 focus:ring-violet-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                  {isEn ? 'Confirm' : 'Confirmar'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600">
                    <Lock size={15} />
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
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-3 focus:ring-violet-500/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Medidor de Fortaleza de Contraseña Compacto */}
            {password && (
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-slate-500">{isEn ? 'Strength' : 'Seguridad'}:</span>
                  <span className="font-bold text-slate-700">{passwordStrength.label}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((seg) => (
                    <div
                      key={seg}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        passwordStrength.score >= seg ? passwordStrength.color : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Checkbox Términos */}
            <div className="pt-0.5">
              <label className="flex items-start gap-2 text-[11px] text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => {
                    setAceptaTerminos(e.target.checked)
                    clearFieldError('terminos')
                  }}
                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                />
                <span>
                  {isEn ? 'I agree to the ' : 'Acepto los '}
                  <Link to="/terminos" target="_blank" className="font-bold text-violet-600 hover:underline">
                    {isEn ? 'Terms' : 'Términos'}
                  </Link>
                  {isEn ? ' and ' : ' y '}
                  <Link to="/privacidad" target="_blank" className="font-bold text-violet-600 hover:underline">
                    {isEn ? 'Privacy Policy' : 'Privacidad'}
                  </Link>
                </span>
              </label>
            </div>

            {/* Botón Principal */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-5 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>{isEn ? 'Creating account...' : 'Creando cuenta...'}</span>
                </span>
              ) : (
                <span>
                  {rol === 'VENDEDOR'
                    ? isEn ? 'Register My Store →' : 'Registrar Mi Tienda Oficial →'
                    : isEn ? 'Create Free Account →' : 'Crear Cuenta Gratis →'}
                </span>
              )}
            </button>
          </form>

          {/* Google Sign-up (solo si es comprador) */}
          {rol === 'COMPRADOR' && (
            <>
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('o_continua_con') || (isEn ? 'or' : 'o continúa con')}
                </span>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLoginButton onCredential={handleGoogle} texto="signup_with" />
              </div>
            </>
          )}

          {/* Accesos rápidos inferiores */}
          <div className="mt-3 text-center">
            <p className="text-xs text-slate-600">
              {isEn ? 'Already have an account? ' : '¿Ya tienes una cuenta? '}
              <Link
                to="/login"
                className="font-bold text-violet-600 hover:text-violet-700 hover:underline"
              >
                {isEn ? 'Log in here' : 'Inicia sesión aquí'}
              </Link>
            </p>
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

export default Registro
