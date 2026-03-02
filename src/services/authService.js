import { root } from '../data/authData'

const STORAGE_KEY = 'usuarioActivo'

const isBrowser = () => typeof window !== 'undefined'

const sanitizeUser = (user) => {
  if (!user) {
    return null
  }

  const { password, ...safeUser } = user
  return safeUser
}

export function login(email, password) {
  if (!isBrowser()) {
    return null
  }

  const normalizedEmail = email.trim().toLowerCase()

  const user = root.find(
    (item) =>
      item.email.toLowerCase() === normalizedEmail &&
      item.password === password
  )

  if (!user) {
    return null
  }

  const safeUser = sanitizeUser(user)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
  return safeUser
}

export function logout() {
  if (!isBrowser()) {
    return
  }

  localStorage.removeItem(STORAGE_KEY)
}

export function getSession() {
  if (!isBrowser()) {
    return null
  }

  const sessionRaw = localStorage.getItem(STORAGE_KEY)

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
