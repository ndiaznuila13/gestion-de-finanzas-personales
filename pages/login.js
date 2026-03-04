import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getSession, login, resetPassword } from '../src/services/authService'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [resetError, setResetError] = useState('')
  const [isResetLoading, setIsResetLoading] = useState(false)

  useEffect(() => {
    const session = getSession()

    if (session) {
      router.replace('/transacciones')
      return
    }

    setIsCheckingSession(false)
  }, [router])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !password.trim()) {
      setError('Correo y contraseña son obligatorios')
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 450))

    const user = login(email, password)

    if (!user) {
      setError('Correo o contraseña incorrectos')
      setIsLoading(false)
      return
    }

    router.push('/transacciones')
  }

  const openResetModal = () => {
    setResetEmail(email.trim())
    setNewPassword('')
    setConfirmPassword('')
    setResetError('')
    setIsResetModalOpen(true)
  }

  const closeResetModal = () => {
    setIsResetModalOpen(false)
    setResetEmail('')
    setNewPassword('')
    setConfirmPassword('')
    setResetError('')
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    setResetError('')
    setSuccess('')

    if (!resetEmail.trim()) {
      setResetError('Debes ingresar un correo electrónico.')
      return
    }

    if (newPassword.trim().length < 8) {
      setResetError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setResetError('Las contraseñas no coinciden.')
      return
    }

    setIsResetLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 350))

    const result = resetPassword(resetEmail, newPassword)

    if (!result.ok) {
      setResetError(result.message)
      setIsResetLoading(false)
      return
    }

    setEmail(resetEmail.trim())
    setPassword('')
    setShowPassword(false)
    setSuccess('Contraseña restablecida. Ya puedes iniciar sesión con tu nueva contraseña.')
    setIsResetLoading(false)
    closeResetModal()
  }

  if (isCheckingSession) {
    return (
      <div className="d-flex min-vh-100 align-items-center justify-content-center bg-body-tertiary text-secondary small fw-medium">
        Cargando sesión...
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Mis Finanzas - Iniciar sesión</title>
      </Head>

      <div className="container-fluid min-vh-100 bg-body-tertiary">
        <div className="row g-0 min-vh-100">
          <div className="col-lg-6 d-none d-lg-flex flex-column justify-content-center p-5 bg-light border-end">
            <div className="text-primary d-flex align-items-center gap-2 mb-4">
              <span className="material-symbols-outlined fs-2">account_balance_wallet</span>
              <h2 className="h3 fw-bold mb-0">Mi Finanzas</h2>
            </div>

            <div className="mb-4">
              <h1 className="display-5 fw-bold text-dark mb-3">
                Controla tus <br />
                <span className="text-primary">finanzas personales</span>
              </h1>
              <p className="lead text-secondary mb-0">
                Registra movimientos, controla tus presupuestos y toma mejores decisiones cada mes.
              </p>
            </div>

            <div className="row g-3 pt-2">
              <div className="col-md-6">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <span className="material-symbols-outlined text-primary mb-2">query_stats</span>
                    <h4 className="h6 fw-bold mb-2">Seguimiento claro</h4>
                    <p className="small text-secondary mb-0">Visualiza tus ingresos y gastos en un solo lugar.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <span className="material-symbols-outlined text-primary mb-2">shield</span>
                    <h4 className="h6 fw-bold mb-2">Acceso seguro</h4>
                    <p className="small text-secondary mb-0">Tu sesión se guarda localmente para continuar rápido.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-3 p-lg-5">
            <div className="card border-0 shadow-sm w-100" style={{ maxWidth: '480px' }}>
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex align-items-center justify-content-center gap-2 text-primary mb-4 d-lg-none">
                  <span className="material-symbols-outlined fs-3">account_balance_wallet</span>
                  <h2 className="h5 fw-bold mb-0">Mi Finanzas</h2>
                </div>

                <ul className="nav nav-tabs mb-4" role="tablist">
                  <li className="nav-item flex-fill" role="presentation">
                    <button className="nav-link active w-100 fw-semibold" type="button">
                      Iniciar sesión
                    </button>
                  </li>
                  <li className="nav-item flex-fill" role="presentation">
                    <button className="nav-link disabled w-100" type="button" disabled>
                      Registrarse
                    </button>
                  </li>
                </ul>

                <form className="d-grid gap-3" onSubmit={handleSubmit}>
                  <div>
                    <label className="form-label">Correo electrónico</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <span className="material-symbols-outlined fs-6">mail</span>
                      </span>
                      <input
                        className="form-control"
                        placeholder="correo@ejemplo.com"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Contraseña</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <span className="material-symbols-outlined fs-6">lock</span>
                      </span>
                      <input
                        className="form-control"
                        placeholder="••••••••"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        <span className="material-symbols-outlined fs-6">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="alert alert-danger py-2 mb-0" role="alert">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success py-2 mb-0" role="alert">
                      {success}
                    </div>
                  )}

                  <div className="d-flex align-items-center justify-content-between">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="recordarme" />
                      <label className="form-check-label small text-secondary" htmlFor="recordarme">
                        Recordarme
                      </label>
                    </div>
                    <button className="btn btn-link text-decoration-none small p-0" type="button" onClick={openResetModal}>
                      ¿Olvidaste tu contraseña?
                    </button>
                  </div>

                  <button
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 fw-semibold"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isResetModalOpen && (
        <>
          <div
            className="modal d-block wallet-modal"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1085 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeResetModal()
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Restablecer contraseña</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeResetModal} />
                </div>
                <form onSubmit={handleResetPassword}>
                  <div className="modal-body d-grid gap-3">
                    <div>
                      <label className="form-label fw-semibold">Correo electrónico</label>
                      <input
                        className="form-control"
                        placeholder="correo@ejemplo.com"
                        type="email"
                        value={resetEmail}
                        onChange={(event) => setResetEmail(event.target.value)}
                        autoFocus
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label fw-semibold">Nueva contraseña</label>
                      <input
                        className="form-control"
                        placeholder="Mínimo 8 caracteres"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="form-label fw-semibold">Confirmar contraseña</label>
                      <input
                        className="form-control"
                        placeholder="Repite la nueva contraseña"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        required
                      />
                    </div>

                    {resetError && (
                      <div className="alert alert-danger py-2 mb-0" role="alert">
                        {resetError}
                      </div>
                    )}
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeResetModal}>
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isResetLoading}>
                      {isResetLoading ? 'Guardando...' : 'Guardar nueva contraseña'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1080 }}></div>
        </>
      )}
    </>
  )
}
