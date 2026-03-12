"use client"

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useStore } from '../../store/useStore'
import withAuth from '../../src/guards/withAuth'

function Transacciones() {
  const { transactions, deleteTransaction } = useStore()
  const [activeTab, setActiveTab] = useState('all')
  const [openMenuId, setOpenMenuId] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

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

  const openDeleteModal = (transaction) => {
    setSelectedTransaction(transaction)
    setIsDeleteModalOpen(true)
    setOpenMenuId(null)
  }

  const closeDeleteModal = () => {
    setSelectedTransaction(null)
    setIsDeleteModalOpen(false)
  }

  const confirmDeleteTransaction = () => {
    if (!selectedTransaction) {
      return
    }

    deleteTransaction(selectedTransaction.id)
    closeDeleteModal()
  }

  const toggleTransactionMenu = (transactionId) => {
    setOpenMenuId((current) => (current === transactionId ? null : transactionId))
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
          <div className="table-responsive transactions-table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-uppercase small text-secondary fw-semibold">Fecha</th>
                  <th className="text-uppercase small text-secondary fw-semibold">Descripción</th>
                  <th className="text-uppercase small text-secondary fw-semibold">Categoría</th>
                  <th className="text-uppercase small text-secondary fw-semibold">Cuenta</th>
                  <th className="text-uppercase small text-secondary fw-semibold text-end">Monto</th>
                  <th className="text-uppercase small text-secondary fw-semibold text-end tx-actions-col">Acciones</th>
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
                      <td className="tx-actions-col">
                        <div className="transaction-actions-wrapper">
                          <button
                            className="btn btn-link text-secondary p-0 d-inline-flex align-items-center justify-content-center tx-actions-trigger"
                            type="button"
                            onClick={() => toggleTransactionMenu(tx.id)}
                            aria-expanded={openMenuId === tx.id}
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                          <div className={`dropdown-menu transaction-actions-menu ${openMenuId === tx.id ? 'show' : ''}`}>
                            <button className="dropdown-item text-danger" type="button" onClick={() => openDeleteModal(tx)}>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td className="text-center text-secondary py-4" colSpan={6}>
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

      {isDeleteModalOpen && (
        <>
          <div
            className="modal d-block wallet-modal"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1085 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeDeleteModal()
              }
            }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Eliminar transacción</h5>
                  <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeDeleteModal} />
                </div>
                <div className="modal-body">
                  <p className="mb-8 text-secondary">
                    Esta acción eliminará la transacción del historial y no se puede deshacer.
                  </p>
                  <div className="rounded border bg-light p-3">
                    <p className="mb-1 fw-semibold">{selectedTransaction?.description || 'Sin descripción'}</p>
                    <p className="mb-0 small text-secondary">
                      {formatDate(selectedTransaction?.date)} • {selectedTransaction?.accountName || 'Sin cuenta'} • {selectedTransaction?.amount >= 0 ? '+' : '-'}${Math.abs(selectedTransaction?.amount || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={closeDeleteModal}>
                    Cancelar
                  </button>
                  <button type="button" className="btn btn-danger" onClick={confirmDeleteTransaction}>
                    Eliminar transacción
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" style={{ zIndex: 1080 }} />
        </>
      )}
    </Layout>
  )
}

export default withAuth(Transacciones)
