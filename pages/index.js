import { useEffect } from 'react'
import { useRouter } from 'next/router'

function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/login')
  }, [router])

  return (
    <div className="d-flex min-vh-100 align-items-center justify-content-center bg-body-tertiary text-secondary small fw-medium">
      Redirigiendo al inicio de sesión...
    </div>
  )
}

export default Home
