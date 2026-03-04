import { root } from '../data/authData'

const STORAGE_KEY = 'usuarioActivo'
const PASSWORD_OVERRIDES_KEY = 'passwordOverrides'

const isBrowser = () => typeof window !== 'undefined'

const sanitizeUser = (user) => {
  if (!user) {
    return null
  }

  const { password, ...safeUser } = user
  return safeUser
}

const normalizeEmail = (email) => email.trim().toLowerCase()

const getPasswordOverrides = () => {
  if (!isBrowser()) {
    return {}
  }

  try {
    const raw = localStorage.getItem(PASSWORD_OVERRIDES_KEY)

    if (!raw) {
      return {}
    }

    const parsed = JSON.parse(raw)
    return typeof parsed === 'object' && parsed !== null ? parsed : {}
  } catch (error) {
    return {}
  }
}

const savePasswordOverrides = (overrides) => {
  if (!isBrowser()) {
    return false
  }

  try {
    localStorage.setItem(PASSWORD_OVERRIDES_KEY, JSON.stringify(overrides))
    return true
  } catch (error) {
    return false
  }
}

const getUserByEmail = (email) => {
  const normalizedEmail = normalizeEmail(email)
  return root.find((item) => item.email.toLowerCase() === normalizedEmail) || null
}

const getExpectedPassword = (email) => {
  const normalizedEmail = normalizeEmail(email)
  const overrides = getPasswordOverrides()

  if (overrides[normalizedEmail]) {
    return overrides[normalizedEmail]
  }

  const user = getUserByEmail(normalizedEmail)
  return user?.password || null
}

export function login(email, password) {
  if (!isBrowser()) {
    return null
  }

  const normalizedEmail = normalizeEmail(email)
  const user = getUserByEmail(normalizedEmail)
  const expectedPassword = getExpectedPassword(normalizedEmail)

  if (!user || expectedPassword !== password) {
    return null
  }

  const safeUser = sanitizeUser(user)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
  } catch (error) {
    return null
  }
  return safeUser
}

export function resetPassword(email, newPassword) {
  if (!isBrowser()) {
    return { ok: false, message: 'No se pudo restablecer la contraseña en este entorno.' }
  }

  const normalizedEmail = normalizeEmail(email || '')
  const sanitizedPassword = (newPassword || '').trim()

  if (!normalizedEmail) {
    return { ok: false, message: 'Debes ingresar un correo electrónico.' }
  }

  if (sanitizedPassword.length < 8) {
    return { ok: false, message: 'La nueva contraseña debe tener al menos 8 caracteres.' }
  }

  const user = getUserByEmail(normalizedEmail)

  if (!user) {
    return { ok: false, message: 'No existe una cuenta con ese correo.' }
  }

  const overrides = getPasswordOverrides()
  const nextOverrides = {
    ...overrides,
    [normalizedEmail]: sanitizedPassword
  }

  if (!savePasswordOverrides(nextOverrides)) {
    return { ok: false, message: 'No se pudo guardar la nueva contraseña.' }
  }

  return { ok: true, message: 'Contraseña actualizada correctamente.' }
}

export function logout() {
  if (!isBrowser()) {
    return
  }

  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    return
  }
}

export function getSession() {
  if (!isBrowser()) {
    return null
  }

  let sessionRaw = null

  try {
    sessionRaw = localStorage.getItem(STORAGE_KEY)
  } catch (error) {
    return null
  }

  if (!sessionRaw) {
    return null
  }

  try {
    const session = JSON.parse(sessionRaw)
    const safeSession = sanitizeUser(session)

    if (!safeSession?.email) {
      logout()
      return null
    }

    return safeSession
  } catch (error) {
    logout()
    return null
  }
}
