import { useEffect } from 'react'
import { useRouter } from 'next/router'
import withAuth from '../src/guards/withAuth'

function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/transacciones')
  }, [router])

  return null
}

export default withAuth(Home)
