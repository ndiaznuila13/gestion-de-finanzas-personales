import Layout from '../components/Layout'
import withAuth from '../src/guards/withAuth'

function Presupuestos() {
  const budgets = [
    { id: 1, name: 'Alimentación', icon: 'restaurant', iconBg: 'bg-primary/10 text-primary', spent: 600, limit: 800, barColor: 'bg-primary' },
    { id: 2, name: 'Transporte', icon: 'directions_car', iconBg: 'bg-orange-100 text-orange-600', spent: 120, limit: 300, barColor: 'bg-orange-500' },
    { id: 3, name: 'Entretenimiento', icon: 'movie', iconBg: 'bg-purple-100 text-purple-600', spent: 245, limit: 250, barColor: 'bg-rose-500' },
    { id: 4, name: 'Servicios del Hogar', icon: 'bolt', iconBg: 'bg-cyan-100 text-cyan-600', spent: 180, limit: 500, barColor: 'bg-cyan-500' },
  ]

  const totalBudgeted = 3500
  const totalSpent = 2150
  const potentialSavings = totalBudgeted - totalSpent

  return (
    <Layout title="Presupuestos - Mi Finanzas">
      <div className="max-w-5xl mx-auto p-8 overflow-auto flex-1">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black tracking-tight">Presupuestos</h2>
            <p className="text-slate-500 mt-1">Gestiona tus límites de gasto mensuales y ahorra más.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-all shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            Crear Presupuesto
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Presupuestado</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold">${totalBudgeted.toLocaleString()}.00</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">0.0%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total Gastado</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold">${totalSpent.toLocaleString()}.00</span>
              <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">-12.5%</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Ahorro Potencial</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold">${potentialSavings.toLocaleString()}.00</span>
              <span className="text-xs font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">+5.2%</span>
            </div>
          </div>
        </div>

        {/* Detailed Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">analytics</span>
            Detalle por categoría
          </h3>

          {budgets.map((budget) => {
            const percent = Math.round((budget.spent / budget.limit) * 100)
            const percentColor = percent >= 90 ? 'text-rose-500 font-bold' : percent >= 70 ? 'text-primary' : `text-${budget.barColor.replace('bg-', '')}`
            return (
              <div
                key={budget.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center gap-6"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-12 h-12 rounded-xl ${budget.iconBg} flex items-center justify-center shrink-0`}>
                    <span className="material-symbols-outlined text-[28px]">{budget.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-base truncate">{budget.name}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Mensual</p>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end gap-2 flex-1">
                  <div className="flex justify-between w-full text-sm font-medium mb-1">
                    <span className="text-slate-600">${budget.spent.toFixed(2)} de ${budget.limit.toFixed(2)}</span>
                    <span className={percent >= 90 ? 'text-rose-500 font-bold' : 'text-primary'}>{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${budget.barColor} rounded-full transition-all`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State Suggestion */}
        <div className="mt-12 p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-slate-400 text-3xl">lightbulb</span>
          </div>
          <h4 className="font-bold text-slate-900">¿Necesitas ayuda con tus ahorros?</h4>
          <p className="text-slate-500 text-sm max-w-sm mt-2">Prueba nuestra herramienta de auto-presupuesto basada en tus gastos del mes anterior.</p>
          <button className="mt-4 text-primary font-bold text-sm hover:underline">Sugerir presupuesto inteligente</button>
        </div>
      </div>
    </Layout>
  )
}

export default withAuth(Presupuestos)
