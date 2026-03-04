import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getSession, logout } from '../src/services/authService'

export default function Layout({ children, title = 'Mi Finanzas' }) {
  const router = useRouter()
  const path = router.pathname
  const [usuarioActivo, setUsuarioActivo] = useState(null)

  useEffect(() => {
    setUsuarioActivo(getSession())
  }, [path])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const navItems = [
    { href: '/transacciones', label: 'Transacciones', icon: 'receipt_long' },
    { href: '/carteras', label: 'Carteras', icon: 'account_balance_wallet' },
    { href: '/presupuestos', label: 'Presupuestos', icon: 'pie_chart' },
  ]

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className="container-fluid px-0 app-shell">
        <div className="row g-0 min-vh-100">
          <aside className="col-12 col-md-3 col-lg-2 border-end bg-light d-flex flex-column app-sidebar">
            <div className="p-4 d-flex align-items-center gap-3 border-bottom">
              <div className="sidebar-brand-icon rounded-circle bg-primary text-white d-flex align-items-center justify-content-center">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <div>
                <h1 className="h6 mb-0 fw-bold text-dark">Mis Finanzas</h1>
                <p className="mb-0 small text-secondary">Plan Personal</p>
              </div>
            </div>

            <nav className="nav flex-column p-3 gap-1 flex-grow-1">
              {navItems.map((item) => {
                const isActive = path === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-link nav-link d-flex align-items-center gap-2 rounded px-3 py-2 ${
                      isActive ? 'active-nav fw-semibold' : 'text-secondary'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined ${isActive ? 'text-primary' : 'text-secondary'}`}
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="p-3 mt-auto border-top">
              <div className="d-flex align-items-center gap-2 p-2 bg-white border rounded">
                <img
                  alt="Avatar"
                  className="rounded-circle border user-avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVN-pUHflivqjPksMhXNVTb9NmQRqreiQyCQ2vHf3Dsm6A0P2FaYPixYSVoZk_3Pzacuc8Ndn1VnwKsVUKIhaPgck76Is7OvxJO9ajky5D0CCoffTPSzujB8lMtnJqPwfY7XvG5ExUE24sC5og_6hSsCQfCgxsqkPjj49v39EeHx8s2PkDVdZrU80rh7tqbEDJtDCG5_t9WcBeUzIslOWlO4DmaZUK2gZ0QTNwWO3a_AN9OV94vHvfOLsxtaL4yPTZsazlHoQkagwp"
                />
                <div className="flex-grow-1 text-truncate">
                  <p className="mb-0 small fw-bold text-dark text-truncate">
                    {usuarioActivo?.nombre || 'Usuario'}
                  </p>
                  <p className="mb-0 text-secondary user-email text-truncate">
                    {usuarioActivo?.email || 'Sin sesión activa'}
                  </p>
                </div>
              </div>
              <button
                className="btn btn-outline-secondary btn-sm w-100 mt-3 fw-semibold"
                type="button"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          </aside>

          <main className="col d-flex flex-column bg-body-tertiary">
            {children}
          </main>
        </div>
      </div>
    </>
  )
}
