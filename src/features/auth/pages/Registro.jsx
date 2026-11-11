import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import GoogleLoginButton from '../components/GoogleLoginButton'
import MercattoLogo from '@/components/common/MercattoLogo'
import { User, Mail, Lock, Store, Building, MapPin, Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'

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
  const [ciudad, setCiudad] = useState('')

  const [loading, setLoading] = useState(false)
  const { registro, loginGoogle } = useAuth()
  const { success, error, info } = useToast()
  const { t, idioma } = useLanguage()
  const navigate = useNavigate()

  const handleGoogle = async (credential) => {
    setLoading(true)
    const res = await loginGoogle(credential)
    setLoading(false)

    if (res?.exito) {
      success(idioma === 'EN' ? 'Account created with Google! Welcome to Mercatto.' : '¡Cuenta creada con Google! Bienvenido a Mercatto.')
      window.location.replace('/')
    } else {
      error(res?.mensaje || (idioma === 'EN' ? 'Could not continue with Google' : 'No se pudo continuar con Google'))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!aceptaTerminos) {
      error(idioma === 'EN' ? 'You must accept the Terms and Conditions' : 'Debes aceptar los Términos y Condiciones para continuar')
      return
    }

    const nombreTrim = nombre.trim()
    const emailTrim = email.trim()

    if (!nombreTrim) {
      error(idioma === 'EN' ? 'Please enter your full name' : 'Por favor ingresa tu nombre completo')
      return
    }

    if (!emailTrim || !/\S+@\S+\.\S+/.test(emailTrim)) {
      error(idioma === 'EN' ? 'Please enter a valid email address' : 'Por favor ingresa un correo electrónico válido')
      return
    }

    if (password.length < 6) {
      error(idioma === 'EN' ? 'Password must be at least 6 characters' : 'La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (password !== confirmPassword) {
      error(idioma === 'EN' ? 'Passwords do not match' : 'Las contraseñas no coinciden. Por favor verifícalas.')
      return
    }

    if (rol === 'VENDEDOR') {
      if (!nombreTienda.trim()) {
        error(idioma === 'EN' ? 'Please enter your store name' : 'Por favor ingresa el nombre de tu tienda')
        return
      }
      if (!nitCedula.trim()) {
        error(idioma === 'EN' ? 'Please enter your Tax ID / Citizen ID' : 'Por favor ingresa el NIT o Cédula de tu negocio')
        return
      }
      if (!ciudad.trim()) {
        error(idioma === 'EN' ? 'Please enter your city' : 'Por favor ingresa la ciudad de tu negocio en Colombia')
        return
      }
    }

    setLoading(true)

    const payload = {
      nombre: nombreTrim,
      email: emailTrim,
      password,
      rol,
      vendedor:
        rol === 'VENDEDOR'
          ? {
              nombreTienda: nombreTienda.trim(),
              nitCedula: nitCedula.trim(),
              ciudad: ciudad.trim(),
              tipo: 'PERSONA_NATURAL',
            }
          : undefined,
    }

    const res = await registro(payload)
    setLoading(false)

    if (res?.exito) {
      if (rol === 'VENDEDOR') {
        success(idioma === 'EN' ? 'Store registered! Check your email to verify your account.' : '¡Tienda registrada! Verifica tu correo o ingresa para comenzar.')
        navigate('/login?registro=pendiente')
      } else {
        success(idioma === 'EN' ? 'Account created successfully! Welcome to Mercatto.' : '¡Cuenta creada con éxito! Bienvenido a Mercatto.')
        window.location.replace('/')
      }
    } else {
      error(res?.mensaje || (idioma === 'EN' ? 'Error creating account' : 'Error al crear la cuenta'))
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-slate-100/70 dark:bg-slate-950 relative overflow-hidden">
      {/* Resplandores ambientales de fondo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Tarjeta principal ampliada con estilo split-card inspirado en la referencia */}
      <div className="w-full max-w-6xl xl:max-w-7xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-violet-500/10 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-6 lg:p-8 transition-all relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch min-h-[660px] xl:min-h-[720px]">
          
          {/* Columna Izquierda: Showcase visual estético con halo de luz y marca Mercatto */}
          <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 xl:p-10 min-h-[660px] bg-slate-950 text-white shadow-inner">
            {/* Imagen de fondo estética con halo */}
            <img 
              src="/images/login-hero.jpg" 
              alt="Mercatto Experience" 
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.85] contrast-105"
            />

            {/* Capas de gradientes para legibilidad */}
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
                <span>{rol === 'VENDEDOR' ? 'Impulsa tu negocio' : 'Tu marketplace favorito'}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {rol === 'VENDEDOR'
                  ? 'Abre tu vitrina virtual y comienza a vender productos verificados con alcance nacional y panel de analítica integrado.'
                  : 'Crea tu cuenta gratis en Mercatto y accede a miles de productos de tiendas de confianza con pagos protegidos.'}
              </p>
              <div className="flex items-center gap-4 pt-2 text-xs text-slate-300 font-semibold border-t border-white/10">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-emerald-400" />
                  <span>Pagos Wompi</span>
                </div>
                <span className="text-white/30">•</span>
                <div>Envíos directos</div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario limpio y moderno */}
          <div className="lg:col-span-7 flex flex-col justify-between px-3 py-4 sm:px-8 sm:py-6 lg:px-10 xl:px-12">
            <div>
              {/* Barra Superior con Botón de Retroceso destacado y Logo */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
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

              {/* Título y enlace a Iniciar Sesión (Estilo exacto a la primera imagen) */}
              <div className="space-y-2 mb-6">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {idioma === 'EN' ? 'Create an Account' : 'Crear una Cuenta'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {idioma === 'EN' ? 'Already have an account? ' : '¿Ya tienes una cuenta? '}
                  <Link
                    to="/login"
                    className="font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 underline underline-offset-4 transition-colors"
                  >
                    {idioma === 'EN' ? 'Log in' : 'Inicia sesión'}
                  </Link>
                </p>
              </div>

              {/* Selector de Rol estilizado en píldoras */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-5">
                <button
                  type="button"
                  onClick={() => setRol('COMPRADOR')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    rol === 'COMPRADOR'
                      ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <User size={15} />
                  <span>{t('quiero_comprar') || 'Quiero Comprar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRol('VENDEDOR')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    rol === 'VENDEDOR'
                      ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Store size={15} />
                  <span>{t('quiero_vender') || 'Quiero Vender'}</span>
                </button>
              </div>

              {/* Formulario de Registro */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre Completo */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                    {t('nombre_completo') || 'Nombre Completo'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Ej: John Doe"
                      required
                      autoComplete="name"
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 pl-11 pr-4 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                    />
                  </div>
                </div>

                {/* Correo Electrónico */}
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

                {/* Contraseña & Confirmación en grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 pl-11 pr-11 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title={showPassword ? 'Ocultar' : 'Ver'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                      {t('confirmar_contrasena') || 'Confirmar Contraseña'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Lock size={18} />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-800/60 pl-11 pr-11 py-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-900 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title={showConfirmPassword ? 'Ocultar' : 'Ver'}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Campos exclusivos para Vendedores */}
                {rol === 'VENDEDOR' && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3.5 animate-fadeIn">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                      <Store size={15} />
                      <span>{idioma === 'EN' ? 'Store & Business Information' : 'Datos del Negocio / Tienda Oficial'}</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {idioma === 'EN' ? 'Store Name' : 'Nombre de tu Tienda Virtual'}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Store size={16} />
                        </div>
                        <input
                          type="text"
                          value={nombreTienda}
                          onChange={(e) => setNombreTienda(e.target.value)}
                          placeholder="Ej: Alien Tech Colombia"
                          required
                          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {idioma === 'EN' ? 'Tax ID / National ID' : 'NIT o Cédula'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Building size={16} />
                          </div>
                          <input
                            type="text"
                            value={nitCedula}
                            onChange={(e) => setNitCedula(e.target.value)}
                            placeholder="Ej: 900.123.456-7"
                            required
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          {idioma === 'EN' ? 'City in Colombia' : 'Ciudad en Colombia'}
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <MapPin size={16} />
                          </div>
                          <input
                            type="text"
                            value={ciudad}
                            onChange={(e) => setCiudad(e.target.value)}
                            placeholder="Ej: Bogotá, Medellín, Cali"
                            required
                            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Checkbox Términos (Idéntico al de la imagen de referencia) */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={aceptaTerminos}
                      onChange={(e) => setAceptaTerminos(e.target.checked)}
                      className="w-4 h-4 rounded-md border-slate-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
                    />
                    <span>
                      {idioma === 'EN' ? 'I agree to the ' : 'Acepto los '}
                      <Link to="/terminos" target="_blank" className="font-bold underline text-slate-900 dark:text-white hover:text-violet-600">
                        {idioma === 'EN' ? 'Terms & Condition' : 'Términos y Condiciones'}
                      </Link>
                    </span>
                  </label>
                </div>

                {/* Botón Principal (Pill oscuro / violeta acorde a la referencia y marca) */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 rounded-full font-bold text-sm tracking-wide text-white transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg ${
                    rol === 'VENDEDOR'
                      ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/25'
                      : 'bg-slate-950 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 shadow-slate-950/15 dark:shadow-violet-600/30'
                  }`}
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
                      <CheckCircle2 size={18} />
                      <span>
                        {rol === 'VENDEDOR'
                          ? (idioma === 'EN' ? 'Submit Store Application' : 'Enviar Solicitud de Tienda')
                          : (idioma === 'EN' ? 'Create Account' : 'Crear Cuenta')}
                      </span>
                    </>
                  )}
                </button>
              </form>

              {/* Registro con Google para Compradores */}
              {rol === 'COMPRADOR' && (
                <>
                  <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                    </div>
                    <span className="relative bg-white dark:bg-slate-900 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      or
                    </span>
                  </div>

                  <div className="flex justify-center w-full">
                    <GoogleLoginButton onCredential={handleGoogle} texto="signup_with" />
                  </div>
                </>
              )}
            </div>

            {/* Enlace final a Login */}
            <div className="text-center pt-6 text-xs text-slate-500 dark:text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800/80 mt-6">
              {t('ya_tienes_cuenta') || '¿Ya tienes una cuenta?'}{' '}
              <Link to="/login" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">
                {t('iniciar_sesion') || 'Iniciar sesión'}
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default Registro