import { useEffect, useState, useCallback } from 'react';
import api from './api';
import AddIncomeModal from './AddIncomeModal';
import AddFixedExpenseModal from './AddFixedExpenseModal';
import AddVariableExpenseModal from './AddVariableExpenseModal';
import EditIncomeModal from './EditIncomeModal';
import EditFixedExpenseModal from './EditFixedExpenseModal';
import EditVariableExpenseModal from './EditVariableExpenseModal';
import { formatCurrency } from './utils/formatters';
import { monthNames } from './utils/dateUtils';
import type {
  FinanceSummaryResponse,
  IncomeResponse,
  FixedExpenseResponse,
  VariableExpenseResponse,
} from './types';

type Tab = 'income' | 'fixed' | 'variable';

function Dashboard() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(currentMonth);

  const handleMonthChange = (value: string) => {
    const m = Number(value);
    if (year < currentYear || m <= currentMonth) {
      setMonth(m);
    }
  };

  const handleYearChange = (value: string) => {
    const y = Number(value);
    if (y <= currentYear) {
      setYear(y);
    }
  };
  const [summary, setSummary] = useState<FinanceSummaryResponse | null>(null);
  const [incomes, setIncomes] = useState<IncomeResponse[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpenseResponse[]>([]);
  const [variableExpenses, setVariableExpenses] = useState<VariableExpenseResponse[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('income');
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showFixedModal, setShowFixedModal] = useState(false);
  const [showVariableModal, setShowVariableModal] = useState(false);
  const [editingFixed, setEditingFixed] = useState<FixedExpenseResponse | null>(null);
  const [editingIncome, setEditingIncome] = useState<IncomeResponse | null>(null);
  const [editingVariable, setEditingVariable] = useState<VariableExpenseResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{type: 'income' | 'fixed' | 'variable'; id: number} | null>(null);
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({message, type});
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.get<FinanceSummaryResponse>(`/summary?year=${year}&month=${month}`),
      api.get<IncomeResponse[]>('/incomes'),
      api.get<FixedExpenseResponse[]>('/fixed-expenses'),
      api.get<VariableExpenseResponse[]>('/variable-expenses'),
    ])
      .then(([s, i, f, v]) => {
        setSummary(s.data);
        setIncomes(i.data);
        setFixedExpenses(f.data);
        setVariableExpenses(v.data);
      })
      .catch(() => showToast('Error al cargar los datos. Intenta recargar.', 'error'))
      .finally(() => setLoading(false));
  }, [year, month]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-400 text-sm">Cargando...</div>
      </div>
    );
  }


  const cards = [
    {
      label: 'Ingresos',
      value: summary?.totalIncome ?? 0,
      color: 'text-gray-900',
      bg: 'bg-white',
    },
    {
      label: 'Gastos Fijos',
      value: summary?.totalFixedExpenses ?? 0,
      color: 'text-gray-600',
      bg: 'bg-white',
    },
    {
      label: 'Gastos Variables',
      value: summary?.totalVariableExpenses ?? 0,
      color: 'text-gray-600',
      bg: 'bg-white',
    },
    {
      label: 'Balance',
      value: summary?.balance ?? 0,
      color: (summary?.balance ?? 0) >= 0 ? 'text-gray-900' : 'text-red-500',
      bg: 'bg-white',
    },
    {
      label: 'Balance Acumulado',
      value: summary?.accumulatedBalance ?? 0,
      color: (summary?.accumulatedBalance ?? 0) >= 0 ? 'text-gray-900' : 'text-red-500',
      bg: 'bg-white',
    },
  ];

  const activeList = (() => {
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDay = new Date(year, month, 0).getDate();
    const endOfMonth = `${year}-${String(month).padStart(2, '0')}-${String(endDay).padStart(2, '0')}`;
    let list: any[] = [];
    switch (activeTab) {
      case 'income':
        // El ingreso solo se muestra en el mes exacto de su fecha
        list = incomes.filter(inc => inc.date >= startOfMonth && inc.date <= endOfMonth);
        break;
      case 'fixed':
        // El gasto fijo se muestra desde su fecha de creación hasta el presente
        list = fixedExpenses.filter(fe => fe.createdAt.slice(0, 10) <= endOfMonth);
        break;
      case 'variable':
        // El gasto variable solo se muestra en el mes exacto de su fecha
        list = variableExpenses.filter(ve => ve.date >= startOfMonth && ve.date <= endOfMonth);
        break;
    }
    return list;
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
            Finanzas
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/reports'}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              Ver Reportes
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Cards */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Filtros de periodo */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-sm text-gray-500">Periodo:</span>
          <select
            value={month}
            onChange={(e) => handleMonthChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            {monthNames.map((name, i) => {
              const m = i + 1;
              const disabled = year === currentYear && m > currentMonth;
              return (
                <option key={m} value={m} disabled={disabled}>
                  {name}
                </option>
              );
            })}
          </select>
          <select
            value={year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            {Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`${card.bg} rounded-xl border border-gray-100 shadow-sm px-5 py-5`}
            >
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                {card.label}
              </div>
              <div className={`text-xl font-semibold ${card.color}`}>
                {formatCurrency(card.value)}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setShowIncomeModal(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            + Añadir Ingreso
          </button>
          <button
            onClick={() => setShowFixedModal(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            + Añadir Gasto Fijo
          </button>
          <button
            onClick={() => setShowVariableModal(true)}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
          >
            + Añadir Gasto Variable
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {([
            { key: 'income', label: 'Ingresos' },
            { key: 'fixed', label: 'Gastos Fijos' },
            { key: 'variable', label: 'Gastos Variables' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {activeList.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">
              No hay registros para mostrar
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="text-right px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">
                      Monto
                    </th>
                    {activeTab === 'fixed' && (
                      <th className="text-left px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">
                        Categoría
                      </th>
                    )}
                    {activeTab === 'fixed' && (
                      <th className="text-right px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">
                        Vence
                      </th>
                    )}
                    {(activeTab === 'income' || activeTab === 'variable') && (
                      <th className="text-right px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                    )}
                    {(activeTab === 'income' || activeTab === 'variable') && (
                      <th className="text-left px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">
                        Categoría
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {activeList.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-700 whitespace-nowrap">{item.description}</td>
                      <td className="px-6 py-3 text-right text-gray-900 font-medium whitespace-nowrap">
                        {formatCurrency(item.amount)}
                      </td>
                      {activeTab === 'fixed' && (
                        <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{item.category}</td>
                      )}
                      {activeTab === 'fixed' && (
                        <td className="px-6 py-3 text-right text-gray-500 whitespace-nowrap">
                          {item.dueDay ? `Día ${item.dueDay}` : '-'}
                        </td>
                      )}
                      {(activeTab === 'income' || activeTab === 'variable') && (
                        <td className="px-6 py-3 text-right text-gray-500 whitespace-nowrap">{item.date}</td>
                      )}
                      {(activeTab === 'income' || activeTab === 'variable') && (
                        <td className="px-6 py-3 text-gray-500 whitespace-nowrap">{item.category || '-'}</td>
                      )}
                      <td className="px-6 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            if (activeTab === 'income') setEditingIncome(item as IncomeResponse);
                            else if (activeTab === 'fixed') setEditingFixed(item as FixedExpenseResponse);
                            else setEditingVariable(item as VariableExpenseResponse);
                          }}
                          className="text-sm text-gray-500 hover:text-gray-800 mr-3"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteTarget({type: activeTab, id: item.id})}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modals */}
        <AddIncomeModal
          open={showIncomeModal}
          onClose={() => setShowIncomeModal(false)}
          onSuccess={() => { fetchData(); showToast('Ingreso guardado exitosamente', 'success'); }}
        />
        <AddFixedExpenseModal
          open={showFixedModal}
          onClose={() => setShowFixedModal(false)}
          onSuccess={() => { fetchData(); showToast('Gasto fijo guardado exitosamente', 'success'); }}
        />
        <AddVariableExpenseModal
          open={showVariableModal}
          onClose={() => setShowVariableModal(false)}
          onSuccess={() => { fetchData(); showToast('Gasto variable guardado exitosamente', 'success'); }}
        />

        {editingIncome && (
          <EditIncomeModal
            open={!!editingIncome}
            income={editingIncome}
            onClose={() => setEditingIncome(null)}
            onSuccess={() => { fetchData(); showToast('Ingreso actualizado exitosamente', 'success'); }}
          />
        )}
        {editingFixed && (
          <EditFixedExpenseModal
            open={!!editingFixed}
            expense={editingFixed}
            onClose={() => setEditingFixed(null)}
            onSuccess={() => { fetchData(); showToast('Gasto fijo actualizado exitosamente', 'success'); }}
          />
        )}
        {editingVariable && (
          <EditVariableExpenseModal
            open={!!editingVariable}
            expense={editingVariable}
            onClose={() => setEditingVariable(null)}
            onSuccess={() => { fetchData(); showToast('Gasto variable actualizado exitosamente', 'success'); }}
          />
        )}

        {/* Confirmación de eliminación */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar eliminación</h3>
              <p className="text-sm text-gray-500 mb-6">¿Estás seguro de eliminar este registro?</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={async () => {
                    if (!deleteTarget) return;
                    const urlMap = {
                      income: '/incomes',
                      fixed: '/fixed-expenses',
                      variable: '/variable-expenses',
                    };
                    const base = urlMap[deleteTarget.type];
                    try {
                      await api.delete(`${base}/${deleteTarget.id}`);
                      showToast('Registro eliminado exitosamente', 'success');
                      fetchData();
                    } catch {
                      showToast('Error al eliminar el registro', 'error');
                    }
                    setDeleteTarget(null);
                  }}
                  className="flex-1 px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast global */}
        {toast && (
          <div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-opacity ${
              toast.type === 'success' ? 'bg-gray-900' : 'bg-red-500'
            }`}
          >
            {toast.message}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;