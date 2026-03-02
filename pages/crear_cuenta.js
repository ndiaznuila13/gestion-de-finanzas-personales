import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function CrearCuenta() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-light font-display text-sm font-medium text-slate-600">
      Redirigiendo a inicio de sesión...
    </div>
  )
}
