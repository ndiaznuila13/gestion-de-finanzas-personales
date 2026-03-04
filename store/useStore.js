import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const STORE_KEY = 'finanzas-storage'

const getNextId = (items, prefix) => {
  const maxId = items.reduce((max, item) => {
    const numericId = Number.parseInt(String(item.id).replace(prefix, ''), 10)
    return Number.isNaN(numericId) ? max : Math.max(max, numericId)
  }, 0)

  return `${prefix}${maxId + 1}`
}

const getInitialState = () => ({
  count: 0,
  accounts: [
    { id: 'acc1', name: 'Caja', balance: 1200.0, type: 'Efectivo', goal: 1800 },
    { id: 'acc2', name: 'Cuenta Banco', balance: 3400.5, type: 'Banco', goal: 5000 }
  ],
  transactions: [
    { id: 1, date: '24 Oct 2023', description: 'Suscripción Netflix', icon: 'movie', category: 'Entretenimiento', categoryColor: 'purple', account: 'Visa Débito (...4421)', amount: -15.99 },
    { id: 2, date: '23 Oct 2023', description: 'Depósito Nómina Acme Inc.', icon: 'work', category: 'Salario', categoryColor: 'green', account: 'Cuenta Corriente', amount: 2500.00 },
    { id: 3, date: '22 Oct 2023', description: 'Supermercado Central', icon: 'shopping_cart', category: 'Alimentación', categoryColor: 'amber', account: 'Efectivo', amount: -85.40 },
    { id: 4, date: '21 Oct 2023', description: 'Pago Gimnasio Power', icon: 'fitness_center', category: 'Salud', categoryColor: 'blue', account: 'Visa Débito (...4421)', amount: -45.00 },
    { id: 5, date: '20 Oct 2023', description: 'Transferencia Bizum Recibida', icon: 'swap_horiz', category: 'Otros', categoryColor: 'slate', account: 'Cuenta Corriente', amount: 20.00 },
    { id: 6, date: '19 Oct 2023', description: 'Cena Restaurante El Olivo', icon: 'restaurant', category: 'Restauración', categoryColor: 'orange', account: 'Efectivo', amount: -32.50 },
  ],
  budgets: [
    { id: 'b1', name: 'Alimentación', limit: 800, spent: 600, category: 'Hogar', priority: 'Alta', dueDate: '' },
    { id: 'b2', name: 'Transporte', limit: 300, spent: 120, category: 'Movilidad', priority: 'Media', dueDate: '' },
    { id: 'b3', name: 'Entretenimiento', limit: 250, spent: 245, category: 'Ocio', priority: 'Baja', dueDate: '' }
  ]
})

export const useStore = create(
  persist(
    (set) => ({
      ...getInitialState(),

      increase: () => set((state) => ({ count: state.count + 1 })),
      decrease: () => set((state) => ({ count: state.count - 1 })),
      resetStore: () => set(getInitialState()),

      addAccount: ({ name, balance, type, goal }) => set((state) => {
        const normalizedName = (name || '').trim()

        if (!normalizedName) {
          return state
        }

        const numericBalance = Number.isFinite(balance) ? balance : 0
        const numericGoal = Number.isFinite(goal) && goal > 0
          ? goal
          : Math.max(Math.round(Math.abs(numericBalance) * 1.2), 100)
        const id = getNextId(state.accounts, 'acc')
        const newAccount = {
          id,
          name: normalizedName,
          balance: numericBalance,
          type: type || 'Cartera',
          goal: numericGoal
        }

        return { accounts: [newAccount, ...state.accounts] }
      }),

      updateAccount: ({ id, name, balance, goal }) => set((state) => {
        const normalizedName = (name || '').trim()
        const numericBalance = Number.isFinite(balance) ? balance : 0
        const numericGoal = Number.isFinite(goal) && goal > 0 ? goal : null

        return {
          accounts: state.accounts.map((account) => {
            if (account.id !== id) {
              return account
            }

            return {
              ...account,
              name: normalizedName || account.name,
              balance: numericBalance,
              goal: numericGoal ?? account.goal ?? Math.max(Math.round(Math.abs(numericBalance) * 1.2), 100)
            }
          })
        }
      }),

      deleteAccount: (id) => set((state) => ({
        accounts: state.accounts.filter((account) => account.id !== id)
      })),

      addBudget: ({ name, limit, spent, description, category, priority, dueDate }) => set((state) => {
        const normalizedName = (name || '').trim()
        const numericLimit = Number.isFinite(limit) ? limit : 0
        const numericSpent = Number.isFinite(spent) ? spent : 0

        if (!normalizedName || numericLimit <= 0) {
          return state
        }

        const newBudget = {
          id: getNextId(state.budgets, 'b'),
          name: normalizedName,
          limit: numericLimit,
          spent: Math.max(0, numericSpent),
          description: (description || '').trim(),
          category: (category || 'General').trim(),
          priority: (priority || 'Media').trim(),
          dueDate: dueDate || ''
        }

        return { budgets: [newBudget, ...state.budgets] }
      }),

      updateBudget: ({ id, name, limit, description, category, priority, dueDate }) => set((state) => {
        const normalizedName = (name || '').trim()
        const numericLimit = Number.isFinite(limit) ? limit : null

        return {
          budgets: state.budgets.map((budget) => {
            if (budget.id !== id) {
              return budget
            }

            return {
              ...budget,
              name: normalizedName || budget.name,
              limit: numericLimit && numericLimit > 0 ? numericLimit : budget.limit,
              description: description !== undefined ? (description || '').trim() : budget.description,
              category: category !== undefined ? (category || 'General').trim() : budget.category,
              priority: priority !== undefined ? (priority || 'Media').trim() : budget.priority,
              dueDate: dueDate !== undefined ? dueDate || '' : budget.dueDate
            }
          })
        }
      }),

      deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter((budget) => budget.id !== id)
      })),

      addBudgetExpense: ({ id, amount, accountId }) => set((state) => {
        const numericAmount = Number.isFinite(amount) ? Math.abs(amount) : 0

        if (numericAmount <= 0) {
          return state
        }

        const sourceAccount = accountId
          ? state.accounts.find((account) => account.id === accountId)
          : null
        const currentBudget = state.budgets.find((budget) => budget.id === id)

        if (accountId && !sourceAccount) {
          return state
        }

        if (!currentBudget) {
          return state
        }

        const nextAccounts = sourceAccount
          ? state.accounts.map((account) => (
            account.id === sourceAccount.id
              ? { ...account, balance: Number((account.balance - numericAmount).toFixed(2)) }
              : account
          ))
          : state.accounts

        const nextTransactions = [
          {
            id: getNextId(state.transactions, 't'),
            date: new Date().toISOString().slice(0, 10),
            description: `Gasto de presupuesto: ${currentBudget.name}`,
            amount: -numericAmount,
            accountId: sourceAccount?.id || accountId || null,
            accountName: sourceAccount?.name || 'Sin cuenta'
          },
          ...state.transactions
        ]

        return {
          accounts: nextAccounts,
          transactions: nextTransactions,
          budgets: state.budgets.map((budget) => {
            if (budget.id !== id) {
              return budget
            }

            return {
              ...budget,
              spent: Number((budget.spent + numericAmount).toFixed(2))
            }
          })
        }
      }),

      addTransaction: (tx) => set((state) => {
        const id = getNextId(state.transactions, 't')
        const account = state.accounts.find((item) => item.id === tx.accountId) || { name: 'Desconocida' }
        const newTx = {
          id,
          date: tx.date || new Date().toISOString().slice(0, 10),
          description: tx.description,
          amount: tx.amount,
          accountId: tx.accountId,
          accountName: account.name
        }

        return { transactions: [newTx, ...state.transactions] }
      })
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        count: state.count,
        accounts: state.accounts,
        transactions: state.transactions,
        budgets: state.budgets
      })
    }
  )
)
