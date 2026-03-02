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

      <div className="flex h-screen overflow-hidden bg-background-light font-display text-slate-900">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 text-base font-bold leading-none">Mi Finanzas</h1>
              <p className="text-slate-500 text-xs font-medium">Plan Personal</p>
            </div>
          </div>

          <nav className="flex-1 px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = path === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'active-nav'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined ${isActive ? 'text-primary' : ''}`}
                    style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                  >
                    {item.icon}
                  </span>
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="p-4 mt-auto border-t border-slate-200">
            <div className="flex items-center gap-3 p-2">
              <img
                alt="Avatar"
                className="w-8 h-8 rounded-full border border-slate-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVN-pUHflivqjPksMhXNVTb9NmQRqreiQyCQ2vHf3Dsm6A0P2FaYPixYSVoZk_3Pzacuc8Ndn1VnwKsVUKIhaPgck76Is7OvxJO9ajky5D0CCoffTPSzujB8lMtnJqPwfY7XvG5ExUE24sC5og_6hSsCQfCgxsqkPjj49v39EeHx8s2PkDVdZrU80rh7tqbEDJtDCG5_t9WcBeUzIslOWlO4DmaZUK2gZ0QTNwWO3a_AN9OV94vHvfOLsxtaL4yPTZsazlHoQkagwp"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {usuarioActivo?.nombre || 'Usuario'}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {usuarioActivo?.email || 'Sin sesión activa'}
                </p>
              </div>
            </div>
            <button
              className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden bg-background-light">
          {children}
        </main>
      </div>
    </>
  )
}
