// validators.js — Validaciones reutilizables de autenticación y formularios

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NAME_HAS_LETTER_REGEX = /[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ]/
const CITY_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s.-]{2,60}$/
const ID_CHARS_REGEX = /^[0-9.\-\s]+$/
const ACCOUNT_CHARS_REGEX = /^[0-9\-\s]+$/

export const extractApiErrorMessage = (err, fallback) => {
  const data = err?.response?.data
  if (typeof data === 'string' && data.trim()) return data.trim()
  if (data?.mensaje) return data.mensaje
  if (data?.message) return data.message
  if (data?.error && typeof data.error === 'string') return data.error
  if (err?.code === 'ECONNABORTED') {
    return 'La solicitud tardó demasiado. Verifica tu conexión e inténtalo de nuevo.'
  }
  if (!err?.response && err?.message === 'Network Error') {
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
  }
  return fallback
}

export const validarNombreCompleto = (nombre, isEn = false) => {
  const clean = (nombre || '').trim().replace(/\s+/g, ' ')
  if (!clean) {
    return isEn ? 'Please enter your full name' : 'Por favor ingresa tu nombre completo'
  }
  if (clean.length < 3) {
    return isEn
      ? 'Full name must be at least 3 characters'
      : 'El nombre completo debe tener al menos 3 caracteres'
  }
  if (!NAME_HAS_LETTER_REGEX.test(clean)) {
    return isEn
      ? 'Please enter a valid name with letters'
      : 'Ingresa un nombre válido (debe contener letras)'
  }
  if (clean.length > 100) {
    return isEn
      ? 'Full name cannot exceed 100 characters'
      : 'El nombre no puede superar los 100 caracteres'
  }
  return null
}

export const validarEmail = (email, isEn = false) => {
  const clean = (email || '').trim()
  if (!clean) {
    return isEn ? 'Please enter your email address' : 'Por favor ingresa tu correo electrónico'
  }
  if (clean.length > 150 || !EMAIL_REGEX.test(clean)) {
    return isEn
      ? 'Please enter a valid email address'
      : 'Por favor ingresa un correo electrónico válido (ej: nombre@correo.com)'
  }
  return null
}

export const validarPassword = (password, isEn = false) => {
  if (!password || !password.trim()) {
    return isEn ? 'Please enter a password' : 'Por favor ingresa una contraseña'
  }
  if (password.length < 6) {
    return isEn
      ? 'Password must be at least 6 characters'
      : 'La contraseña debe tener al menos 6 caracteres'
  }
  if (password.trim().length < 6) {
    return isEn
      ? 'Password cannot be made only of spaces'
      : 'La contraseña no puede contener solo espacios'
  }
  if (password.length > 100) {
    return isEn
      ? 'Password cannot exceed 100 characters'
      : 'La contraseña no puede superar los 100 caracteres'
  }
  return null
}

export const validarDatosVendedor = (
  { nombreTienda, nitCedula, ciudad, banco, cuentaBancaria },
  isEn = false
) => {
  const tiendaTrim = (nombreTienda || '').trim().replace(/\s+/g, ' ')
  if (!tiendaTrim) {
    return {
      field: 'nombreTienda',
      message: isEn ? 'Please enter your store name' : 'Por favor ingresa el nombre de tu tienda',
    }
  }
  if (tiendaTrim.length < 2 || !NAME_HAS_LETTER_REGEX.test(tiendaTrim)) {
    return {
      field: 'nombreTienda',
      message: isEn
        ? 'Store name must have at least 2 characters and include letters'
        : 'El nombre de la tienda debe tener al menos 2 caracteres válidos',
    }
  }
  if (tiendaTrim.length > 80) {
    return {
      field: 'nombreTienda',
      message: isEn
        ? 'Store name cannot exceed 80 characters'
        : 'El nombre de la tienda no puede superar los 80 caracteres',
    }
  }

  const nitTrim = (nitCedula || '').trim()
  const nitDigits = nitTrim.replace(/\D/g, '')
  if (!nitTrim) {
    return {
      field: 'nitCedula',
      message: isEn
        ? 'Please enter your Tax ID / Citizen ID'
        : 'Por favor ingresa el NIT o Cédula de tu negocio',
    }
  }
  if (!ID_CHARS_REGEX.test(nitTrim) || nitDigits.length < 6 || nitDigits.length > 15) {
    return {
      field: 'nitCedula',
      message: isEn
        ? 'Tax ID / Citizen ID must contain between 6 and 15 digits'
        : 'El NIT o Cédula debe contener entre 6 y 15 dígitos válidos',
    }
  }

  const ciudadTrim = (ciudad || '').trim().replace(/\s+/g, ' ')
  if (ciudadTrim && (!CITY_REGEX.test(ciudadTrim) || !NAME_HAS_LETTER_REGEX.test(ciudadTrim))) {
    return {
      field: 'ciudad',
      message: isEn
        ? 'Please enter a valid city name (letters only)'
        : 'Ingresa un nombre de ciudad válido (solo letras, mínimo 2 caracteres)',
    }
  }

  if (!banco || !banco.trim()) {
    return {
      field: 'banco',
      message: isEn ? 'Please select a bank or wallet' : 'Selecciona una entidad bancaria o billetera',
    }
  }

  const cuentaTrim = (cuentaBancaria || '').trim()
  const cuentaDigits = cuentaTrim.replace(/\D/g, '')
  if (!cuentaTrim) {
    return {
      field: 'cuentaBancaria',
      message: isEn
        ? 'Please enter your bank account or payout wallet for sales transactions'
        : 'Por favor ingresa la cuenta bancaria o Nequi para recibir las transacciones de ventas',
    }
  }
  if (!ACCOUNT_CHARS_REGEX.test(cuentaTrim)) {
    return {
      field: 'cuentaBancaria',
      message: isEn
        ? 'Account number can only contain digits and hyphens'
        : 'El número de cuenta solo puede contener dígitos y guiones',
    }
  }
  if (banco === 'Nequi' || banco === 'Daviplata') {
    if (!/^3\d{9}$/.test(cuentaDigits)) {
      return {
        field: 'cuentaBancaria',
        message: isEn
          ? `${banco} number must be a 10-digit Colombian mobile number (starts with 3)`
          : `El número de ${banco} debe ser un celular colombiano de 10 dígitos (ej: 3001234567)`,
      }
    }
  } else if (cuentaDigits.length < 6 || cuentaDigits.length > 20) {
    return {
      field: 'cuentaBancaria',
      message: isEn
        ? 'Bank account number must have between 6 and 20 digits'
        : 'El número de cuenta bancaria debe tener entre 6 y 20 dígitos',
    }
  }

  return null
}
