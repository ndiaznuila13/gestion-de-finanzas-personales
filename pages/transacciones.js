import { useMemo, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useStore } from '../store/useStore'
import withAuth from '../src/guards/withAuth'

function Transacciones() {
  const { transactions } = useStore()
  const [activeTab, setActiveTab] = useState('all')

  const filteredTransactions = useMemo(() => {
    if (activeTab === 'income') {
      return transactions.filter((tx) => tx.amount >= 0)
    }

    if (activeTab === 'expense') {
      return transactions.filter((tx) => tx.amount < 0)
    }

    return transactions
  }, [activeTab, transactions])

  const getCategoryMeta = (tx) => {
    const isIncome = tx.amount >= 0
    const normalizedDesc = (tx.description || '').toLowerCase()

    if (isIncome && normalizedDesc.includes('sueldo')) {
      return { label: 'Salario', badgeClass: 'text-bg-success', icon: 'work' }
    }

    if (isIncome) {
      return { label: 'Ingreso', badgeClass: 'text-bg-success', icon: 'trending_up' }
    }

    return { label: 'Gasto', badgeClass: 'text-bg-warning text-dark', icon: 'receipt_long' }
  }

  const formatDate = (value) => {
    if (!value) {
      return 'Sin fecha'
    }

    const date = new Date(`${value}T00:00:00`)

    if (Number.isNaN(date.getTime())) {
      return value
    }

    return date.toLocaleDateString('es-SV', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Layout title="Transacciones - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">
        <header className="page-header-panel">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <h2 className="h2 fw-bold mb-1">Transacciones</h2>
              <p className="text-secondary mb-0">Gestiona y analiza tus movimientos financieros</p>
            </div>
            <div className="d-flex flex-wrap gap-2">
              <button className="btn btn-outline-secondary d-inline-flex align-items-center gap-2" type="button">
                <span className="material-symbols-outlined fs-6">download</span>
                Exportar CSV
              </button>
              <Link
                href="/nueva_transaccion"
                className="btn btn-primary d-inline-flex align-items-center gap-2"
              >
                <span className="material-symbols-outlined fs-6">add</span>
                Nueva Transacción
              </Link>
            </div>
          </div>
        </header>

        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
            <ul className="nav nav-tabs border-0">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'all' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab('all')}
                >
                  Todos
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'income' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab('income')}
                >
                  Ingresos
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'expense' ? 'active' : ''}`}
                  type="button"
                  onClick={() => setActiveTab('expense')}
                >
                  Gastos
                </button>
              </li>
            </ul>
            <div>
              <label className="form-label text-uppercase small text-secondary fw-semibold mb-1">Periodo</label>
              <select className="form-select form-select-sm">
                <option>Octubre 2023</option>
                <option>Septiembre 2023</option>
                <option>Agosto 2023</option>
                <option>Últimos 90 días</option>
              </select>
            </div>
          </div>
        </section>

        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase small text-secondary fw-semibold">Fecha</th>
                  <th className="text-uppercase small text-secondary fw-semibold">Descripción</th>
                  <th className="text-uppercase small text-secondary fw-semibold">Categoría</th>
                  <th className="text-uppercase small text-secondary fw-semibold">Cuenta</th>
                  <th className="text-uppercase small text-secondary fw-semibold text-end">Monto</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => {
                  const meta = getCategoryMeta(tx)

                  return (
                    <tr key={tx.id}>
                      <td className="small text-secondary">{formatDate(tx.date)}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="transaction-icon-box rounded bg-light d-flex align-items-center justify-content-center text-secondary">
                            <span className="material-symbols-outlined fs-6">{meta.icon}</span>
                          </div>
                          <span className="fw-semibold">{tx.description || 'Sin descripción'}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`badge rounded-pill ${meta.badgeClass}`}>
                          {meta.label}
                        </span>
                      </td>
                      <td className="small text-secondary">{tx.accountName || 'Sin cuenta'}</td>
                      <td className={`fw-bold text-end ${tx.amount >= 0 ? 'text-success' : 'text-danger'}`}>
                        {tx.amount >= 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td className="text-center text-secondary py-4" colSpan={5}>
                      No hay transacciones para mostrar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card-footer bg-light d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2">
            <p className="small text-secondary mb-0">
              Mostrando {filteredTransactions.length} de {transactions.length} transacciones
            </p>
            <ul className="pagination pagination-sm mb-0">
              <li className="page-item disabled">
                <button className="page-link" type="button">Anterior</button>
              </li>
              <li className="page-item">
                <button className="page-link" type="button">Siguiente</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(Transacciones)
