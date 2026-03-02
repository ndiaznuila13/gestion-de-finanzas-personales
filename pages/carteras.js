import { useState } from 'react'
import Layout from '../components/Layout'
import { useStore } from '../store/useStore'
import withAuth from '../src/guards/withAuth'

function Carteras() {
  const { accounts } = useStore()
  const [walletName, setWalletName] = useState('')
  const [initialAmount, setInitialAmount] = useState('')

  const wallets = [
    { id: 1, name: 'Ahorros Personal', balance: 4200, goal: 5000, icon: 'savings', iconBg: 'bg-blue-100 text-blue-600' },
    { id: 2, name: 'Gastos de Negocio', balance: 6800, goal: 10000, icon: 'business_center', iconBg: 'bg-purple-100 text-purple-600' },
    { id: 3, name: 'Fondo de Viajes', balance: 1450, goal: 3000, icon: 'flight', iconBg: 'bg-orange-100 text-orange-600' },
  ]

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  return (
    <Layout title="Carteras - Mi Finanzas">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <h2 className="text-xl font-bold tracking-tight">Mis Carteras</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary w-64"
              placeholder="Buscar carteras..."
              type="text"
            />
          </div>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPqiPuXkFo3de2Ksww4MM4161qqzqgoKaO4nwkRynti9sQt3YREeDIpbTkRcPlhH5SDdnMKIqkK_fYNN9b6XNDGuIoRwQ_2l8vQ_LKWqXIbKdANeGjT5Ct-Iu-NSHDfmEGkV_hrJ8_g5zOaNMglNR69QntQz96qIEfwYEt9LU16qm4GzP_pxzFiy9JL3aL8JIeKEw-N09UOR2II0ub5RabS06Ww2SsY4a-thKwss6-yCLKCpXzUVfSy3NkoECqQ1bh_AUUlVEa0eAf"
              alt="User"
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-8 space-y-8 overflow-auto flex-1">
        {/* Hero Balance Card */}
        <div className="bg-primary rounded-xl p-8 text-white shadow-lg shadow-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-90">Balance Total Combinado</p>
            <h3 className="text-4xl font-bold mt-1">${totalBalance.toLocaleString()}.00</h3>
            <div className="flex items-center gap-2 mt-4 bg-white/20 w-fit px-3 py-1 rounded-full text-sm backdrop-blur-md">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>+5.2% este mes</span>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
          <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[160px] opacity-10 rotate-12">account_balance</span>
        </div>

        {/* Create New Wallet Section */}
        <section className="max-w-2xl">
          <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 text-primary rounded-full">
                <span className="material-symbols-outlined">add_circle</span>
              </div>
              <h3 className="text-lg font-bold">Crear Nueva Cartera</h3>
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Nombre de la Cartera</label>
                  <input
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                    placeholder="Ej. Ahorros Navidad"
                    type="text"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Monto Inicial</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="0.00"
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md shadow-primary/20"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-xl">add</span>
                  <span>Crear Cartera</span>
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Active Wallets */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Tus Carteras Activas</h3>
            <span className="text-sm text-slate-500">{wallets.length} carteras totales</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wallets.map((wallet) => {
              const percent = Math.round((wallet.balance / wallet.goal) * 100)
              return (
                <div
                  key={wallet.id}
                  className="bg-white p-6 rounded-xl border border-slate-200 hover:border-primary/50 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg ${wallet.iconBg}`}>
                      <span className="material-symbols-outlined">{wallet.icon}</span>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-900">{wallet.name}</h4>
                  <p className="text-2xl font-bold mt-2">${wallet.balance.toLocaleString()}.00</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-500">Meta: ${wallet.goal.toLocaleString()}.00</span>
                      <span className="text-primary">{percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default withAuth(Carteras)
