import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import Input from '@/components/common/Input'
import Button from '@/components/common/Button'
import GoogleLoginButton from '../components/GoogleLoginButton'
import MercattoLogo from '@/components/common/MercattoLogo'
import { User, Mail, Lock, Store, Building, MapPin, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

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
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-mercatto-border dark:border-slate-800 shadow-xl space-y-6">
        
        {/* Header con Marca y Tipografía Coherente */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <MercattoLogo size={36} showSlogan={true} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('crear_cuenta_mercatto')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {t('registro_sub')}
          </p>
        </div>

        {/* Pestañas de Selección de Rol (Comprador vs Vendedor) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setRol('COMPRADOR')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              rol === 'COMPRADOR'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <User size={15} />
            <span>{t('quiero_comprar')}</span>
          </button>

          <button
            type="button"
            onClick={() => setRol('VENDEDOR')}
            className={`py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              rol === 'VENDEDOR'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Store size={15} />
            <span>{t('quiero_vender')}</span>
          </button>
        </div>

        {/* Formulario de Registro con validaciones completas */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('nombre_completo')}
            placeholder="Ej: Fernando Barboza"
            icon={User}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            autoComplete="name"
          />

          <Input
            label={t('correo_electronico')}
            type="email"
            placeholder={t('correo_placeholder')}
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label={t('contrasena')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Ocultar' : 'Ver'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />

            <Input
              label={t('confirmar_contrasena')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Repite la contraseña"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                  title={showConfirmPassword ? 'Ocultar' : 'Ver'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>

          {/* Información adicional obligatoria para Vendedores */}
          {rol === 'VENDEDOR' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-3.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-300">
                <Store size={15} />
                <span>{idioma === 'EN' ? 'Store & Business Information' : 'Datos del Negocio / Tienda Oficial'}</span>
              </div>

              <Input
                label={idioma === 'EN' ? 'Store Name' : 'Nombre de tu Tienda Virtual'}
                placeholder="Ej: Alien Tech Colombia"
                icon={Store}
                value={nombreTienda}
                onChange={(e) => setNombreTienda(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label={idioma === 'EN' ? 'Tax ID / National ID' : 'NIT o Cédula'}
                  placeholder="Ej: 900.123.456-7"
                  icon={Building}
                  value={nitCedula}
                  onChange={(e) => setNitCedula(e.target.value)}
                  required
                />
                <Input
                  label={idioma === 'EN' ? 'City in Colombia' : 'Ciudad en Colombia'}
                  placeholder="Ej: Bogotá, Medellín, Cali"
                  icon={MapPin}
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            className={`w-full font-bold shadow-lg mt-2 cursor-pointer ${
              rol === 'VENDEDOR'
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25'
                : 'bg-mercatto-primary hover:bg-mercatto-deep text-white shadow-violet-600/25'
            }`} 
            loading={loading}
          >
            {rol === 'VENDEDOR' 
              ? (idioma === 'EN' ? 'Submit Store Application' : 'Enviar Solicitud de Tienda') 
              : t('crear_cuenta_mercatto')}
          </Button>
        </form>

        {rol === 'COMPRADOR' && (
          <>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-xs text-slate-400 font-medium">{t('o_continua_con')}</span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>
            <GoogleLoginButton onCredential={handleGoogle} texto="signup_with" />
          </>
        )}

        <div className="text-center pt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {t('ya_tienes_cuenta')}{' '}
          <Link to="/login" className="font-bold text-violet-600 dark:text-violet-400 hover:underline">
            {t('iniciar_sesion')}
          </Link>
        </div>

      </div>
    </div>
  )
}

export default Registro
