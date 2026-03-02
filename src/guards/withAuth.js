import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { getSession } from '../services/authService'

export default function withAuth(WrappedComponent) {
  function ProtectedPage(props) {
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
      const session = getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      setIsAuthenticated(true)
      setIsChecking(false)
    }, [router])

    if (isChecking || !isAuthenticated) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background-light font-display text-sm font-medium text-slate-600">
          Cargando sesión...
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }

  ProtectedPage.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return ProtectedPage
}
