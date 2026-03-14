import { root } from '../data/authData'

const STORAGE_KEY = 'usuarioActivo'
const PASSWORD_OVERRIDES_KEY = 'passwordOverrides'
const REGISTERED_USERS_KEY = 'registeredUsers'

const isBrowser = () => typeof window !== 'undefined'

const sanitizeUser = (user) => {
  if (!user) {
    return null
  }

  const { password, ...safeUser } = user
  return safeUser
}

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

const isSeedUserEmail = (email) => {
  const normalizedEmail = normalizeEmail(email)
  return root.some((item) => item.email.toLowerCase() === normalizedEmail)
}

const normalizeRegisteredUser = (user) => {
  if (!user || typeof user !== 'object') {
    return null
  }

  const email = normalizeEmail(user.email)
  const password = typeof user.password === 'string' ? user.password : ''
  const nombre = typeof user.nombre === 'string' && user.nombre.trim() ? user.nombre.trim() : 'Usuario'

  if (!email || !password) {
    return null
  }

  return {
    id: Number.isFinite(user.id) ? user.id : Date.now(),
    nombre,
    email,
    password
  }
}

const getRegisteredUsers = () => {
  if (!isBrowser()) {
    return []
  }

  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY)

    if (!raw) {
      return []
    }

    const parsed = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed
      .map((item) => normalizeRegisteredUser(item))
      .filter(Boolean)
  } catch (error) {
    return []
  }
}

const saveRegisteredUsers = (users) => {
  if (!isBrowser()) {
    return false
  }

  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users))
    return true
  } catch (error) {
    return false
  }
}

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
  const registeredUser = getRegisteredUsers().find((item) => item.email === normalizedEmail)

  if (registeredUser) {
    return registeredUser
  }

  return root.find((item) => item.email.toLowerCase() === normalizedEmail) || null
}

const getExpectedPassword = (email) => {
  const normalizedEmail = normalizeEmail(email)
  const user = getUserByEmail(normalizedEmail)

  if (!user) {
    return null
  }

  if (!isSeedUserEmail(normalizedEmail)) {
    return user.password || null
  }

  const overrides = getPasswordOverrides()
  return overrides[normalizedEmail] || user.password || null
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

export function registerUser({ name, email, password, confirmPassword }) {
  if (!isBrowser()) {
    return { ok: false, message: 'No se pudo registrar la cuenta en este entorno.' }
  }

  const normalizedName = (name || '').trim()
  const normalizedEmail = normalizeEmail(email)
  const sanitizedPassword = (password || '').trim()
  const sanitizedConfirmPassword = (confirmPassword || '').trim()

  if (!normalizedName || !normalizedEmail || !sanitizedPassword || !sanitizedConfirmPassword) {
    return { ok: false, message: 'Todos los campos son obligatorios.' }
  }

  if (sanitizedPassword.length < 8) {
    return { ok: false, message: 'La contraseña debe tener al menos 8 caracteres.' }
  }

  if (sanitizedPassword !== sanitizedConfirmPassword) {
    return { ok: false, message: 'Las contraseñas no coinciden.' }
  }

  if (getUserByEmail(normalizedEmail)) {
    return { ok: false, message: 'Ya existe una cuenta con ese correo.' }
  }

  const registeredUsers = getRegisteredUsers()
  const nextId = [...root, ...registeredUsers].reduce((max, item) => {
    const numericId = Number.parseInt(item.id, 10)
    return Number.isNaN(numericId) ? max : Math.max(max, numericId)
  }, 0) + 1

  const newUser = {
    id: nextId,
    nombre: normalizedName,
    email: normalizedEmail,
    password: sanitizedPassword
  }

  if (!saveRegisteredUsers([newUser, ...registeredUsers])) {
    return { ok: false, message: 'No se pudo guardar la cuenta.' }
  }

  return {
    ok: true,
    message: 'Cuenta creada correctamente.',
    user: sanitizeUser(newUser)
  }
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

  if (!isSeedUserEmail(normalizedEmail)) {
    const registeredUsers = getRegisteredUsers()
    const nextRegisteredUsers = registeredUsers.map((item) => (
      item.email === normalizedEmail
        ? { ...item, password: sanitizedPassword }
        : item
    ))

    if (!saveRegisteredUsers(nextRegisteredUsers)) {
      return { ok: false, message: 'No se pudo guardar la nueva contraseña.' }
    }

    return { ok: true, message: 'Contraseña actualizada correctamente.' }
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
