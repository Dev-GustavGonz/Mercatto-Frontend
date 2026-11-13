import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { useToast } from '@/hooks/useToast'
import { useLanguage } from '@/hooks/useLanguage'
import MercattoLogo from '@/components/common/MercattoLogo'
import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
  HelpCircle,
  RefreshCw,
} from 'lucide-react'
import { validarEmail, extractApiErrorMessage } from '@/utils/validators'

export const RecuperarPassword = () => {
  const [paso, setPaso] = useState(1) // 1: Solicitar código | 2: Ingresar código y nueva contraseña
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [nuevaPassword, setNuevaPassword] = useState('')
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')
  const [countdown, setCountdown] = useState(0)

  const { success, error } = useToast()
  const { idioma } = useLanguage()
  const isEn = idioma === 'EN'
  const navigate = useNavigate()

  // Temporizador para reenvío de código
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  // Paso 1: Enviar solicitud de código
  const handleSolicitarCodigo = async (e) => {
    e?.preventDefault()
    if (loading) return

    const emailTrim = email.trim().toLowerCase()
    const emailErr = validarEmail(emailTrim, isEn)
    if (emailErr) {
      setFormError(emailErr)
      error(emailErr)
      return
    }

    setFormError('')
    setLoading(true)
    try {
      const res = await authService.solicitarRecuperacion(emailTrim)
      success(
        res?.mensaje ||
          (isEn
            ? 'We have sent a verification code to your email.'
            : 'Hemos enviado un código de verificación a tu correo.')
      )
      setPaso(2)
      setCountdown(60)
    } catch (err) {
      let msg = extractApiErrorMessage(
        err,
        isEn
          ? 'Unable to send recovery code. Please verify your email or contact support.'
          : 'No se pudo enviar el código de recuperación. Verifica tu correo o contacta a soporte.'
      )
      if (msg.includes('No static resource') || msg.includes('404') || msg.includes('500') || msg.includes('Internal Server Error')) {
        msg = isEn
          ? 'The password recovery service is currently updating on the server. Please contact support via WhatsApp for immediate assistance.'
          : 'El servicio de recuperación se está sincronizando en el servidor. Puedes contactar a soporte vía WhatsApp para asistencia inmediata.'
      }
      setFormError(msg)
      error(msg)
    } finally {
      setLoading(false)
    }
  }

  // Paso 2: Restablecer contraseña con código
  const handleRestablecer = async (e) => {
    e.preventDefault()
    if (loading) return

    const codigoTrim = codigo.trim()
    if (!codigoTrim || codigoTrim.length < 4) {
      const msg = isEn
        ? 'Please enter the verification code sent to your email.'
        : 'Por favor ingresa el código de verificación enviado a tu correo.'
      setFormError(msg)
      error(msg)
      return
    }

    if (!nuevaPassword || nuevaPassword.length < 6) {
      const msg = isEn
        ? 'The new password must be at least 6 characters long.'
        : 'La nueva contraseña debe tener al menos 6 caracteres.'
      setFormError(msg)
      error(msg)
      return
    }

    if (nuevaPassword !== confirmarPassword) {
      const msg = isEn ? 'Passwords do not match.' : 'Las contraseñas no coinciden.'
      setFormError(msg)
      error(msg)
      return
    }

    setFormError('')
    setLoading(true)
    try {
      const res = await authService.restablecerPassword({
        email: email.trim().toLowerCase(),
        codigo: codigoTrim,
        nuevaPassword,
      })
      success(
        res?.mensaje ||
          (isEn
            ? 'Password updated successfully! You can now log in.'
            : '¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.')
      )
      navigate('/login', { replace: true })
    } catch (err) {
      let msg = extractApiErrorMessage(
        err,
        isEn
          ? 'Invalid or expired code. Please request a new one.'
          : 'Código inválido o expirado. Solicita uno nuevo.'
      )
      if (msg.includes('No static resource') || msg.includes('500') || msg.includes('Internal Server Error')) {
        msg = isEn
          ? 'Could not process request. Please contact support via WhatsApp.'
          : 'No se pudo procesar la solicitud en este momento. Contacta a soporte por WhatsApp.'
      }
      setFormError(msg)
      error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen lg:h-screen w-full lg:grid lg:grid-cols-12 font-sans selection:bg-violet-600 selection:text-white lg:overflow-hidden bg-white">
      {/* ============================================================== */}
      {/* COLUMNA IZQUIERDA: MORADO ELEGANTE CARTAGENA                   */}
      {/* ============================================================== */}
      <div className="lg:col-span-5 xl:col-span-5 relative hidden lg:flex flex-col justify-between p-6 sm:p-8 xl:p-10 z-10 bg-gradient-to-br from-[#180A2E] via-[#0F071D] to-[#0A0514] text-slate-100 overflow-hidden border-r border-violet-950/40 lg:h-screen">
        {/* Halos morados ambientales */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/15 rounded-full blur-[110px] pointer-events-none" />

        {/* Top: Volver al Login */}
        <div className="flex items-center justify-between relative z-10">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer group backdrop-blur-md"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>{isEn ? 'Back to Login' : 'Volver a Iniciar Sesión'}</span>
          </Link>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mercatto Security</span>
          </span>
        </div>

        {/* Centro: Información de Seguridad */}
        <div className="space-y-4 my-auto py-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs font-bold text-violet-300 backdrop-blur-md">
            <Sparkles size={13} className="text-violet-400" />
            <span>{isEn ? 'Account Protection' : 'Protección de Cuenta'}</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl xl:text-3xl font-black text-white tracking-tight leading-tight">
              {isEn ? (
                <>
                  Recover access <br />
                  <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                    quickly and securely.
                  </span>
                </>
              ) : (
                <>
                  Recupera tu acceso <br />
                  <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-amber-200 bg-clip-text text-transparent">
                    rápido y seguro.
                  </span>
                </>
              )}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {isEn
                ? 'We will send a one-time verification code to verify your identity before setting a new password.'
                : 'Te enviaremos un código de verificación único para confirmar tu identidad antes de crear tu nueva contraseña.'}
            </p>
          </div>

          {/* Tips de seguridad */}
          <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-md space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>{isEn ? 'Password Guidelines' : 'Recomendaciones de Seguridad'}</span>
            </div>
            <ul className="space-y-1.5 text-[11.5px] text-slate-300 list-disc list-inside">
              <li>{isEn ? 'Use at least 6 characters' : 'Usa al menos 6 caracteres'}</li>
              <li>{isEn ? 'Combine letters, numbers and symbols' : 'Combina letras y números'}</li>
              <li>{isEn ? 'Never share your verification code' : 'Nunca compartas tu código'}</li>
            </ul>
          </div>
        </div>

        {/* Footer izquierdo */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 relative z-10">
          <span>Mercatto Platform &bull; Cartagena</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>

      {/* ============================================================== */}
      {/* COLUMNA DERECHA: FORMULARIO BLANCO                             */}
      {/* ============================================================== */}
      <div className="lg:col-span-7 xl:col-span-7 bg-white text-slate-900 p-5 sm:p-7 lg:p-8 xl:p-10 flex flex-col justify-between lg:h-screen overflow-y-auto relative">
        {/* Barra superior con Logo */}
        <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-100">
          <Link to="/" className="inline-block" title="Ir al inicio de Mercatto">
            <MercattoLogo
              variant="default"
              size={28}
              showSlogan={true}
              sloganClassName="mt-0.5 text-[11px] font-bold text-violet-600 block"
            />
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 hover:text-violet-800 transition-colors"
          >
            <ArrowLeft size={13} />
            <span>{isEn ? 'Back to Login' : 'Volver al Login'}</span>
          </Link>
        </div>

        {/* Formulario central */}
        <div className="w-full max-w-sm sm:max-w-md mx-auto my-auto py-4">
          <div className="space-y-1 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mb-2 shadow-xs">
              <KeyRound size={20} />
            </div>
            <h1 className="text-2xl sm:text-[26px] font-black text-slate-900 tracking-tight">
              {paso === 1
                ? (isEn ? 'Forgot Password?' : '¿Olvidaste tu contraseña?')
                : (isEn ? 'Set New Password' : 'Crear Nueva Contraseña')}
            </h1>
            <p className="text-xs text-slate-500">
              {paso === 1
                ? (isEn
                    ? 'Enter your email address and we will send you a recovery code'
                    : 'Ingresa tu correo electrónico registrado para enviarte un código de recuperación')
                : (isEn
                    ? `Enter the code sent to ${email} and your new password`
                    : `Ingresa el código enviado a ${email} y tu nueva contraseña`)}
            </p>
          </div>

          {formError && (
            <div
              role="alert"
              className="mb-3.5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 animate-in fade-in"
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* PASO 1: SOLICITAR CÓDIGO */}
          {paso === 1 && (
            <form onSubmit={handleSolicitarCodigo} noValidate className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                  {isEn ? 'Email Address' : 'Correo Electrónico'}
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
                    placeholder="ejemplo@mercatto.com"
                    required
                    autoFocus
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isEn ? 'Sending code...' : 'Enviando código...'}</span>
                  </span>
                ) : (
                  <>
                    <span>{isEn ? 'Send Recovery Code' : 'Enviar Código de Recuperación'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* PASO 2: INGRESAR CÓDIGO Y NUEVA CONTRASEÑA */}
          {paso === 2 && (
            <form onSubmit={handleRestablecer} noValidate className="space-y-3.5">
              {/* Resumen del correo enviado */}
              <div className="flex items-center justify-between p-2.5 bg-violet-50 rounded-xl border border-violet-100 text-xs">
                <div className="flex items-center gap-2 text-violet-900 font-medium truncate">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPaso(1)
                    setFormError('')
                  }}
                  className="text-violet-700 hover:text-violet-900 font-bold underline text-[11px] shrink-0 cursor-pointer ml-2"
                >
                  {isEn ? 'Change' : 'Cambiar'}
                </button>
              </div>

              {/* Campo Código */}
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                  <span>{isEn ? '6-Digit Verification Code' : 'Código de Verificación (6 Dígitos)'}</span>
                  {countdown > 0 ? (
                    <span className="text-[10px] text-slate-400 font-normal">
                      Reenviar en {countdown}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSolicitarCodigo}
                      disabled={loading}
                      className="text-[10px] text-violet-600 hover:underline font-bold cursor-pointer"
                    >
                      {isEn ? 'Resend code' : 'Reenviar código'}
                    </button>
                  )}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={codigo}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    setCodigo(val)
                    if (formError) setFormError('')
                  }}
                  placeholder="123456"
                  required
                  autoFocus
                  className="w-full text-center tracking-[8px] font-mono font-bold text-lg rounded-xl border border-slate-200 bg-slate-50/70 py-2 text-slate-900 placeholder-slate-300 focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                />
              </div>

              {/* Nueva Contraseña */}
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                  {isEn ? 'New Password' : 'Nueva Contraseña'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={nuevaPassword}
                    onChange={(e) => {
                      setNuevaPassword(e.target.value)
                      if (formError) setFormError('')
                    }}
                    placeholder="Mínimo 6 caracteres"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Nueva Contraseña */}
              <div className="space-y-1">
                <label className="block text-[10.5px] font-bold text-slate-700 uppercase tracking-wider">
                  {isEn ? 'Confirm New Password' : 'Confirmar Nueva Contraseña'}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-violet-600 transition-colors">
                    <Lock size={15} />
                  </div>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmarPassword}
                    onChange={(e) => {
                      setConfirmarPassword(e.target.value)
                      if (formError) setFormError('')
                    }}
                    placeholder="Repite tu nueva contraseña"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-2 focus:ring-violet-500/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-5 rounded-xl font-bold text-xs sm:text-sm tracking-wide text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isEn ? 'Updating password...' : 'Actualizando contraseña...'}</span>
                  </span>
                ) : (
                  <>
                    <span>{isEn ? 'Update Password' : 'Restablecer Contraseña'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Enlace de soporte / ayuda */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center space-y-2">
            <p className="text-xs text-slate-500">
              {isEn ? 'Remember your password? ' : '¿Recordaste tu contraseña? '}
              <Link to="/login" className="font-bold text-violet-600 hover:underline">
                {isEn ? 'Log in here' : 'Inicia sesión aquí'}
              </Link>
            </p>

            <a
              href="https://wa.me/573233882717?text=Hola%20Mercatto,%20necesito%20ayuda%20para%20recuperar%20mi%20cuenta"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-emerald-600 transition-colors font-medium"
            >
              <HelpCircle size={13} />
              <span>{isEn ? 'Need help? Contact support on WhatsApp' : '¿Necesitas ayuda? Contacta a soporte vía WhatsApp'}</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 text-center text-[10.5px] text-slate-400">
          &copy; {new Date().getFullYear()} Mercatto Marketplace &bull; Cartagena de Indias
        </div>
      </div>
    </div>
  )
}

export default RecuperarPassword
