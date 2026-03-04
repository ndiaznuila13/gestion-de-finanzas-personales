import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useStore } from '../store/useStore'

export default function NuevaTransaccion() {
  const { accounts, addTransaction } = useStore()
  const [type, setType] = useState('expense')
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [accountId, setAccountId] = useState('')
  const [category, setCategory] = useState('food')
  const router = useRouter()

  useEffect(() => {
    if (!accountId && accounts.length > 0) {
      setAccountId(accounts[0].id)
    }
  }, [accountId, accounts])

  const closeModal = () => {
    router.push('/transacciones')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedDescription = description.trim()
    const parsedAmount = Number.parseFloat(amount || '0')

    if (!trimmedDescription || !accountId || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return
    }

    const finalAmount = type === 'expense' ? -Math.abs(parsedAmount) : Math.abs(parsedAmount)
    addTransaction({ description: trimmedDescription, amount: finalAmount, accountId, date, category, type })
    closeModal()
  }

  return (
    <Layout title="Nueva Transacción - Mi Finanzas">
      <div className="container-xl py-4 py-lg-5">
        <header className="page-header-panel">
          <div>
            <h2 className="h2 fw-bold mb-1">Nueva transacción</h2>
            <p className="text-secondary mb-0">Completa los datos para registrar un movimiento financiero.</p>
          </div>
        </header>
      </div>

      <div
        className="modal d-block wallet-modal"
        tabIndex="-1"
        role="dialog"
        style={{ zIndex: 1085 }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeModal()
          }
        }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Nueva transacción</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={closeModal} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body d-grid gap-3">
                <div>
                  <label className="form-label fw-semibold">Tipo</label>
                  <div className="btn-group w-100" role="group" aria-label="Tipo de transacción">
                    <input
                      checked={type === 'expense'}
                      className="btn-check"
                      id="tx-type-expense"
                      name="tx-type"
                      type="radio"
                      value="expense"
                      onChange={() => setType('expense')}
                    />
                    <label className="btn btn-outline-danger" htmlFor="tx-type-expense">
                      Gasto
                    </label>

                    <input
                      checked={type === 'income'}
                      className="btn-check"
                      id="tx-type-income"
                      name="tx-type"
                      type="radio"
                      value="income"
                      onChange={() => setType('income')}
                    />
                    <label className="btn btn-outline-success" htmlFor="tx-type-income">
                      Ingreso
                    </label>
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold">Descripción / Nombre</label>
                  <input
                    className="form-control"
                    placeholder="Ej. Compra semanal"
                    type="text"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    autoFocus
                  />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Monto ($)</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        className="form-control"
                        placeholder="0.00"
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">Fecha</label>
                    <input
                      className="form-control"
                      type="date"
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label fw-semibold">Cuenta / Cartera</label>
                  <select
                    className="form-select"
                    value={accountId}
                    onChange={(event) => setAccountId(event.target.value)}
                    required
                  >
                    {accounts.length === 0 && (
                      <option value="">No hay carteras disponibles</option>
                    )}
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="form-label fw-semibold">Categoría</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                  >
                    <option value="food">Comida y Restaurantes</option>
                    <option value="transport">Transporte</option>
                    <option value="savings">Ahorros</option>
                    <option value="salary">Salario</option>
                    <option value="leisure">Ocio</option>
                    <option value="other">Otros</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={accounts.length === 0}>
                  Guardar transacción
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1080 }}></div>
    </Layout>
  )
}
