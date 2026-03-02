import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getSession, login } from '../src/services/authService'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)

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

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light font-display text-sm font-medium text-slate-600">
        Cargando sesión...
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Mi Finanzas - Iniciar sesión</title>
      </Head>

      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light font-display text-slate-900 lg:flex-row">
        <div className="relative hidden flex-col justify-center overflow-hidden bg-primary/5 p-12 lg:flex lg:w-1/2 xl:p-24">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-10">
            <div className="absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-primary blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-primary blur-[120px]" />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-center gap-3 text-primary">
              <span className="material-symbols-outlined text-4xl font-bold">account_balance_wallet</span>
              <h2 className="text-2xl font-black tracking-tight">Mi Finanzas</h2>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl font-black leading-tight tracking-tight text-slate-900 xl:text-6xl">
                Controla tus <br />
                <span className="text-primary">finanzas personales</span>
              </h1>
              <p className="max-w-md text-lg leading-relaxed text-slate-600">
                Registra movimientos, controla tus presupuestos y toma mejores decisiones cada mes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
                <span className="material-symbols-outlined mb-3 text-primary">query_stats</span>
                <h4 className="font-bold text-slate-900">Seguimiento claro</h4>
                <p className="text-sm text-slate-500">Visualiza tus ingresos y gastos en un solo lugar.</p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-white p-6 shadow-sm">
                <span className="material-symbols-outlined mb-3 text-primary">shield</span>
                <h4 className="font-bold text-slate-900">Acceso seguro</h4>
                <p className="text-sm text-slate-500">Tu sesión se guarda localmente para continuar rápido.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="mb-8 flex items-center justify-center gap-2 text-primary lg:hidden">
              <span className="material-symbols-outlined text-3xl font-bold">account_balance_wallet</span>
              <h2 className="text-xl font-bold tracking-tight">Mi Finanzas</h2>
            </div>

            <div className="mb-8 overflow-hidden border-b border-slate-200">
              <div className="flex">
                <button className="flex-1 border-b-2 border-primary py-4 text-sm font-bold text-primary transition-all">
                  Iniciar sesión
                </button>
                <button
                  className="flex-1 cursor-not-allowed border-b-2 border-transparent py-4 text-sm font-bold text-slate-400"
                  type="button"
                  disabled
                >
                  Registrarse
                </button>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Correo electrónico</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">mail</span>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-background-light py-3 pl-10 pr-4 text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                      placeholder="correo@ejemplo.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Contraseña</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">lock</span>
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-background-light py-3 pl-10 pr-12 text-slate-900 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-primary"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary"
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between">
                <label className="flex cursor-pointer items-center gap-2">
                  <input className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary" type="checkbox" />
                  <span className="text-sm text-slate-600">Recordarme</span>
                </label>
                <a className="text-sm font-medium text-primary hover:underline" href="#">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
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
    </>
  )
}
