import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import GoogleLoginButton from '../components/GoogleLoginButton'
import MercattoLogo from '@/components/common/MercattoLogo'
import { User, Mail, Lock, Store, Building, MapPin, Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck, CheckCircle2, Globe } from 'lucide-react'

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
  const { t, idioma, cambiarIdioma } = useLanguage()
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
    <div className="min-h-screen w-full lg:grid lg:grid-cols-12 bg-white dark:bg-slate-950">
      
      {/* Columna Izquierda: Sticky y fixed-height para evitar estiramiento al abrir tienda */}
      <div className="lg:col-span-5 xl:col-span-5 relative hidden lg:flex flex-col justify-between p-6 lg:p-8 xl:p-10 min-h-screen lg:h-screen lg:sticky lg:top-0 bg-slate-950 text-white overflow-hidden">
        {/* Imagen de fondo e-commerce con object-cover y sin estirarse */}
        <img 
          src="/images/login-ecommerce.jpg" 
          alt="Mercatto Marketplace" 
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.75] contrast-110"
        />

        {/* Gradientes de marca Mercatto */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-violet-950/60 mix-blend-multiply pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/95 pointer-events-none" />

        {/* Logo oficial con colores originales bien en la esquina y con separación amplia con el slogan */}
        <div className="relative z-10 self-start">
          <MercattoLogo 
            variant="onDark"
            size={42} 
            showSlogan={true} 
            sloganClassName="mt-3.5 text-xs sm:text-[13px] font-bold tracking-wide block"
          />
        </div>

        {/* Tarjeta de beneficios en la parte inferior */}
        <div className="relative z-10 space-y-3 bg-slate-950/80 backdrop-blur-md p-6 rounded-3xl border border-white/15 shadow-2xl">
          <div className="flex items-center gap-2 text-violet-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles size={15} className="text-violet-400" />
            <span>{rol === 'VENDEDOR' ? 'Panel de Vendedores Oficial' : 'Tu marketplace favorito'}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            {rol === 'VENDEDOR'
              ? 'Abre tu vitrina virtual y comienza a vender productos verificados con alcance nacional y analítica de ventas.'
              : 'Únete gratis a Mercatto y accede a miles de productos de confianza con pagos seguros y entregas ágiles.'}
          </p>
          <div className="flex items-center gap-4 pt-2 text-[11px] text-slate-300 font-semibold border-t border-white/10">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Pagos Wompi</span>
            </div>
            <span className="text-white/30">•</span>
            <div>Envíos a todo el país</div>
          </div>
        </div>
      </div>

      {/* Columna Derecha: Formulario con selector de idioma arriba a la izquierda */}
      <div className="lg:col-span-7 xl:col-span-7 min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 overflow-y-auto bg-white dark:bg-slate-900">
        
        {/* Barra superior: Selector de idioma y botón volver */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer border border-slate-200/80 dark:border-slate-700/80 shadow-xs group"
              title="Volver a la página principal"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform text-violet-600 dark:text-violet-400" />
              <span>{idioma === 'EN' ? 'Back' : 'Volver'}</span>
            </button>

            {/* Selector de idioma arriba a la izquierda */}
            <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/70 dark:border-slate-700/70">
              <button
                type="button"
                onClick={() => cambiarIdioma('es')}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                  idioma === 'ES'
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
                  idioma === 'EN'
                    ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>
          </div>

          {/* Logo en versión móvil */}
          <div className="lg:hidden">
            <MercattoLogo size={26} showSlogan={true} sloganClassName="mt-2 text-[10px]" />
          </div>
        </div>

        {/* Contenedor central del formulario */}
        <div className="w-full max-w-lg mx-auto my-auto py-4">
          <div className="space-y-1.5 mb-5">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {idioma === 'EN' ? 'Create an Account' : 'Crear una Cuenta'}
              <span className="text-violet-600">.</span>
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              {rol === 'VENDEDOR' 
                ? 'Registra tu negocio oficial y empieza a vender en Mercatto.' 
                : 'Regístrate para comprar y rastrear tus pedidos.'}
            </p>
          </div>

          {/* Selector de Rol estilizado acorde a Mercatto (SIN NARANJA) */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 mb-5 border border-slate-200/70 dark:border-slate-700/70">
            <button
              type="button"
              onClick={() => setRol('COMPRADOR')}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                rol === 'COMPRADOR'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm border border-slate-200/80 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
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
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25 border border-violet-500'
                  : 'text-slate-500 hover:text-violet-600 dark:hover:text-violet-300'
              }`}
            >
              <Store size={15} />
              <span>{t('quiero_vender') || 'Quiero abrir tienda y vender'}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Nombre Completo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                {t('nombre_completo') || 'Nombre Completo'}
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: John Doe"
                  required
                  autoComplete="name"
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all"
                />
              </div>
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
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
                  className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/60 pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all"
                />
              </div>
            </div>

            {/* Contraseña & Confirmación en grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  {t('contrasena') || 'Contraseña'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/60 pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title={showPassword ? 'Ocultar' : 'Ver'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
                  {t('confirmar_contrasena') || 'Confirmar'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <Lock size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-200 dark:border-slate-700/90 bg-slate-50/70 dark:bg-slate-800/60 pl-10 pr-10 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 shadow-inner-xs focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-violet-600 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Ocultar' : 'Ver'}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Datos del Negocio para Vendedores en tonos violeta/índigo acordes (SIN NARANJA) */}
            {rol === 'VENDEDOR' && (
              <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-slate-800/80 border border-violet-200/80 dark:border-violet-800/50 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-violet-900 dark:text-violet-300 uppercase tracking-wider">
                  <Store size={15} className="text-violet-600 dark:text-violet-400" />
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
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
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
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
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
                        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20"
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

            {/* Botón Principal con el gradiente oficial de Mercatto (SIN NARANJA) */}
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
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative bg-white dark:bg-slate-900 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t('o_continua_con') || 'o continúa con'}
                </span>
              </div>

              <div className="flex justify-center w-full">
                <GoogleLoginButton onCredential={handleGoogle} texto="signup_with" />
              </div>
            </>
          )}
        </div>

        {/* Sección Inferior: "¿Ya tienes cuenta? Inicia sesión" */}
        <div className="text-center pt-5 text-sm text-slate-600 dark:text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800/80">
          {t('ya_tienes_cuenta') || '¿Ya tienes una cuenta?'}{' '}
          <Link to="/login" className="font-black text-violet-600 dark:text-violet-400 hover:text-violet-700 hover:underline ml-1">
            {t('iniciar_sesion') || 'Inicia sesión aquí'}
          </Link>
        </div>

      </div>

    </div>
  )
}

export default Registro