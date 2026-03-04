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
        <div className="d-flex min-vh-100 align-items-center justify-content-center bg-body-tertiary text-secondary small fw-medium">
          Cargando sesión...
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }

  ProtectedPage.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return ProtectedPage
}
