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
  CheckCircle2,
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
    if (!password) return { score: 0, label: '', color: 'bg-white/10' }
    let score = 0
    if (password.length >= 6) score += 1
    if (password.length >= 8) score += 1
    if (/[A-Z]/.test(password) || /\d/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password) && password.length >= 8) score += 1
    if (score <= 1) return { score: 1, label: isEn ? 'Weak' : 'Débil', color: 'bg-rose-500' }
    if (score === 2) return { score: 2, label: isEn ? 'Fair' : 'Media', color: 'bg-amber-400' }
    if (score === 3) return { score: 3, label: isEn ? 'Good' : 'Buena', color: 'bg-sky-400' }
    return { score: 4, label: isEn ? 'Strong' : 'Fuerte', color: 'bg-emerald-400' }
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
    <div className="min-h-screen w-full lg:grid lg:grid-cols-12 bg-[#0A0718] font-sans text-slate-100 overflow-x-hidden relative selection:bg-violet-600 selection:text-white">
      {/* Fondo ambiental dinámico / gradientes de malla */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/15 rounded-full blur-[130px]" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-purple-600/10 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* ============================================================== */}
      {/* COLUMNA IZQUIERDA: SHOWCASE DINÁMICO SEGÚN ROL                 */}
      {/* ============================================================== */}
      <div className="lg:col-span-5 xl:col-span-5 relative hidden lg:flex flex-col justify-between p-8 xl:p-12 z-10 border-r border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-sm sticky top-0 h-screen">
        {/* Top */}
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

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
            <MapPin size={12} />
            <span>Cartagena de Indias</span>
          </span>
        </div>

        {/* Centro dinámico según rol */}
        <div className="space-y-6 my-auto py-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-xs font-bold text-violet-300 backdrop-blur-md">
            <Sparkles size={14} className="text-violet-400" />
            <span>
              {rol === 'VENDEDOR'
                ? isEn ? 'Merchant Onboarding' : 'Vitrina Digital para Tiendas'
                : isEn ? 'Buyer Membership' : 'Compra Directa y Segura'}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-[1.15]">
              {rol === 'VENDEDOR' ? (
                isEn ? (
                  <>
                    Launch your virtual store <br />
                    <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                      across Cartagena.
                    </span>
                  </>
                ) : (
                  <>
                    Lanza tu tienda virtual <br />
                    <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                      en toda Cartagena.
                    </span>
                  </>
                )
              ) : isEn ? (
                <>
                  Join the local marketplace <br />
                  <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                    built for you.
                  </span>
                </>
              ) : (
                <>
                  Únete al marketplace <br />
                  <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                    hecho para Cartagena.
                  </span>
                </>
              )}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {rol === 'VENDEDOR'
                ? isEn
                  ? 'Manage products, track orders, and receive direct payouts to your bank or Nequi.'
                  : 'Publica tu catálogo, gestiona envíos y recibe liquidaciones directas a tu cuenta bancaria o Nequi.'
                : isEn
                ? 'Explore verified local stores, save favorites, and pay safely with Wompi.'
                : 'Explora tiendas locales verificadas, guarda favoritos y paga con total respaldo Wompi.'}
            </p>
          </div>

          {/* Bento cards dinámicas */}
          {rol === 'VENDEDOR' ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isEn ? 'AI Insights' : 'Analítica IA'}</span>
                  <TrendingUp size={16} className="text-violet-400" />
                </div>
                <p className="text-base font-black text-white">Panel Vendedor</p>
                <span className="text-[10px] text-slate-400 block">
                  {isEn ? 'Real-time sales metrics' : 'Métricas e historial real'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isEn ? 'Payouts' : 'Liquidaciones'}</span>
                  <CreditCard size={16} className="text-emerald-400" />
                </div>
                <p className="text-base font-black text-white">Nequi & Bancos</p>
                <span className="text-[10px] text-slate-400 block">
                  {isEn ? 'Planes from 1% fee' : 'Planes desde 1% comisión'}
                </span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isEn ? 'Security' : 'Seguridad'}</span>
                  <ShieldCheck size={16} className="text-emerald-400" />
                </div>
                <p className="text-base font-black text-white">100% Wompi</p>
                <span className="text-[10px] text-slate-400 block">
                  {isEn ? 'PSE, Nequi & Cards' : 'PSE, Nequi y Tarjetas'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{isEn ? 'Delivery' : 'Entregas'}</span>
                  <Zap size={16} className="text-amber-400" />
                </div>
                <p className="text-base font-black text-white">Rastreo en Vivo</p>
                <span className="text-[10px] text-slate-400 block">
                  {isEn ? 'Fast local shipping' : 'Envíos en toda Cartagena'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Mercatto Platform 2.0</span>
          </div>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMNA DERECHA: FORMULARIO GLASSMORPHISM                      */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 xl:col-span-7 relative z-10 flex flex-col justify-between p-5 sm:p-8 lg:p-10 xl:p-14 min-h-screen">
        {/* Barra superior */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white cursor-pointer"
              aria-label="Volver"
            >
              <ArrowLeft size={16} />
            </button>
            <Link to="/" className="inline-block" title="Ir al inicio de Mercatto">
              <MercattoLogo
                variant="whiteBorder"
                size={30}
                showSlogan={true}
                sloganClassName="mt-1 text-xs font-bold text-violet-300 block"
              />
            </Link>
          </div>

          <div className="flex items-center p-1 bg-white/[0.06] backdrop-blur-md rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => cambiarIdioma('es')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                !isEn ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25' : 'text-slate-400 hover:text-white'
              }`}
            >
              ES
            </button>
            <button
              type="button"
              onClick={() => cambiarIdioma('en')}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                isEn ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {/* Tarjeta central del Registro */}
        <div className="w-full max-w-xl mx-auto my-auto">
          <div className="bg-[#110D24]/90 backdrop-blur-xl border border-white/15 rounded-[32px] p-6 sm:p-8 shadow-2xl shadow-black/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-1.5 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">
                  {rol === 'VENDEDOR'
                    ? isEn ? 'Seller Registration' : 'Registro de Tienda'
                    : isEn ? 'Buyer Registration' : 'Registro de Comprador'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {isEn ? 'Create an Account' : 'Crear una Cuenta'}
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-400">
                {rol === 'VENDEDOR'
                  ? isEn
                    ? 'Register your official store in Cartagena and start selling.'
                    : 'Registra tu negocio oficial en Cartagena y empieza a vender.'
                  : isEn
                  ? 'Sign up for free to shop and track your orders.'
                  : 'Regístrate gratis para comprar y rastrear tus pedidos.'}
              </p>
            </div>

            {/* Selector visual de Rol */}
            <div className="relative z-10 grid grid-cols-2 gap-2.5 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => {
                  setRol('COMPRADOR')
                  setFormError(null)
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  rol === 'COMPRADOR'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User size={15} />
                <span>{t('quiero_comprar') || (isEn ? 'Buy' : 'Quiero Comprar')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRol('VENDEDOR')
                  setFormError(null)
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  rol === 'VENDEDOR'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store size={15} />
                <span>{isEn ? 'Open Store' : 'Abrir Tienda'}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} noValidate className="relative z-10 space-y-3.5">
              {formError?.message && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs font-semibold text-rose-300"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
                  <span>{formError.message}</span>
                </div>
              )}

              {/* Nombre y Correo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    {t('nombre_completo') || (isEn ? 'Full Name' : 'Nombre Completo')}
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-400 transition-colors">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => {
                        setNombre(e.target.value)
                        clearFieldError('nombre')
                      }}
                      placeholder={isEn ? 'e.g. John Doe' : 'Ej: Ana Pérez'}
                      required
                      autoComplete="name"
                      className={`w-full rounded-2xl border bg-white/[0.04] pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:bg-white/[0.07] transition-all ${
                        formError?.field === 'nombre'
                          ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                          : 'border-white/10 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                    {t('correo_electronico') || (isEn ? 'Email' : 'Correo Electrónico')}
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
                        clearFieldError('email')
                      }}
                      placeholder={t('correo_placeholder') || 'ejemplo@mercatto.com'}
                      required
                      autoComplete="email"
                      className={`w-full rounded-2xl border bg-white/[0.04] pl-10 pr-3.5 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:bg-white/[0.07] transition-all ${
                        formError?.field === 'email'
                          ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                          : 'border-white/10 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña & Confirmación + Indicador de fortaleza */}
              <div className="space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      {t('contrasena') || (isEn ? 'Password' : 'Contraseña')}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-400 transition-colors">
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
                        className={`w-full rounded-2xl border bg-white/[0.04] pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:bg-white/[0.07] transition-all ${
                          formError?.field === 'password'
                            ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                            : 'border-white/10 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={showPassword ? (isEn ? 'Hide' : 'Ocultar') : (isEn ? 'Show' : 'Ver')}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1 uppercase tracking-wider">
                      {t('confirmar_contrasena') || (isEn ? 'Confirm' : 'Confirmar')}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-400 transition-colors">
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
                        className={`w-full rounded-2xl border bg-white/[0.04] pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:bg-white/[0.07] transition-all ${
                          formError?.field === 'confirmPassword'
                            ? 'border-rose-500 focus:ring-4 focus:ring-rose-500/20'
                            : 'border-white/10 focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title={showConfirmPassword ? (isEn ? 'Hide' : 'Ocultar') : (isEn ? 'Show' : 'Ver')}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Medidor visual de seguridad */}
                {password && (
                  <div className="flex items-center gap-2 pt-0.5">
                    <div className="flex-1 grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 rounded-full transition-all ${
                            passwordStrength.score >= level ? passwordStrength.color : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{passwordStrength.label}</span>
                  </div>
                )}
              </div>

              {/* Datos del Negocio y Cuenta para Liquidaciones (VENDEDOR) */}
              {rol === 'VENDEDOR' && (
                <div className="p-4 rounded-2xl bg-white/[0.03] border border-violet-500/30 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-violet-300 uppercase tracking-wider">
                      <Store size={15} className="text-violet-400" />
                      <span>{isEn ? 'Store Information' : 'Datos de tu Tienda'}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                      <MapPin size={10} />
                      Cartagena
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isEn ? 'Store Name' : 'Nombre de tu Tienda'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Store size={15} />
                        </div>
                        <input
                          type="text"
                          value={nombreTienda}
                          onChange={(e) => {
                            setNombreTienda(e.target.value)
                            clearFieldError('nombreTienda')
                          }}
                          placeholder={isEn ? 'e.g. Caribe Tech' : 'Ej: Caribe Tech'}
                          required
                          className={`w-full rounded-xl border bg-white/[0.05] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none ${
                            formError?.field === 'nombreTienda'
                              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                              : 'border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        {isEn ? 'Tax ID / Citizen ID' : 'NIT o Cédula'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Building size={15} />
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
                          className={`w-full rounded-xl border bg-white/[0.05] pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none ${
                            formError?.field === 'nitCedula'
                              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                              : 'border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cuenta para transacciones y liquidaciones */}
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-violet-300 mb-2">
                      <CreditCard size={13} className="text-violet-400" />
                      <span>{isEn ? 'Payout Account for Sales' : 'Cuenta para Transacciones y Liquidaciones'}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          {isEn ? 'Bank / Wallet' : 'Entidad Bancaria o Billetera'}
                        </label>
                        <select
                          value={banco}
                          onChange={(e) => {
                            setBanco(e.target.value)
                            clearFieldError('banco')
                          }}
                          className="w-full rounded-xl border border-white/10 bg-[#17122E] px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 cursor-pointer"
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
                        <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                          {isEn ? 'Account / Mobile Number' : 'Número de Cuenta o Celular Nequi'}
                        </label>
                        <input
                          type="text"
                          value={cuentaBancaria}
                          onChange={(e) => {
                            setCuentaBancaria(e.target.value)
                            clearFieldError('cuentaBancaria')
                          }}
                          placeholder={isEn ? 'e.g. 123-456789-00' : 'Ej: 123-456789-00 o 3001234567'}
                          required
                          className={`w-full rounded-xl border bg-white/[0.05] px-3.5 py-2.5 text-xs sm:text-sm font-mono text-white placeholder-slate-400 focus:outline-none ${
                            formError?.field === 'cuentaBancaria'
                              ? 'border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                              : 'border-white/10 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Checkbox Términos */}
              <div className="pt-0.5">
                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={aceptaTerminos}
                    onChange={(e) => {
                      setAceptaTerminos(e.target.checked)
                      clearFieldError('terminos')
                    }}
                    className="w-4 h-4 rounded-md border-white/20 bg-white/5 text-violet-600 focus:ring-violet-500 cursor-pointer"
                  />
                  <span>
                    {isEn ? 'I agree to the ' : 'Acepto los '}
                    <Link to="/terminos" target="_blank" className="font-bold underline text-white hover:text-violet-300">
                      {isEn ? 'Terms & Conditions' : 'Términos y Condiciones'}
                    </Link>
                  </span>
                </label>
              </div>

              {/* Botón Principal */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl font-black text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>{isEn ? 'Creating account...' : 'Creando cuenta...'}</span>
                  </span>
                ) : (
                  <>
                    <CheckCircle2 size={17} />
                    <span>
                      {rol === 'VENDEDOR'
                        ? isEn ? 'Submit Store Application' : 'Enviar Solicitud de Tienda'
                        : isEn ? 'Create Account' : 'Crear Cuenta'}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Registro con Google para Compradores */}
            {rol === 'COMPRADOR' && (
              <>
                <div className="relative my-5 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <span className="relative bg-[#110D24] px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {t('o_continua_con') || (isEn ? 'or continue with' : 'o continúa con')}
                  </span>
                </div>

                <div className="flex justify-center w-full">
                  <GoogleLoginButton onCredential={handleGoogle} texto="signup_with" />
                </div>
              </>
            )}
          </div>

          {/* Enlace a Login */}
          <div className="mt-5 text-center text-xs sm:text-sm text-slate-400 font-medium">
            {t('ya_tienes_cuenta') || (isEn ? 'Already have an account?' : '¿Ya tienes una cuenta?')}{' '}
            <Link to="/login" className="font-black text-violet-400 hover:text-violet-300 hover:underline ml-1">
              {t('iniciar_sesion') || (isEn ? 'Log in here' : 'Inicia sesión aquí')}
            </Link>
          </div>
        </div>

        <div className="mt-5 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} Mercatto Marketplace · Cartagena de Indias
        </div>
      </div>
    </div>
  )
}

export default Registro
