import { useEffect, useState } from 'react';
import api from './api';
import { formatCurrency } from './utils/formatters';
import { monthNames } from './utils/dateUtils';
import type { QuarterlyReportResponse } from './types';

function Reports() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const [year, setYear] = useState(currentYear);
  const [quarter, setQuarter] = useState(1);
  const [mode, setMode] = useState<'quarterly' | 'custom'>('quarterly');
  const [reports, setReports] = useState<QuarterlyReportResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Custom range state
  const [startYear, setStartYear] = useState(currentYear);
  const [startMonth, setStartMonth] = useState(1);
  const [endYear, setEndYear] = useState(currentYear);
  const [endMonth, setEndMonth] = useState(currentMonth);

  const fetchReport = async () => {
    setLoading(true);
    setError('');
    try {
      if (mode === 'quarterly') {
        const res = await api.get<QuarterlyReportResponse[]>('/reports/quarterly', {
          params: { year, quarter },
        });
        setReports(res.data);
      } else {
        // Validación frontend: no superar fecha actual y máximo 4 meses
        const today = new Date();
        const maxEndYear = today.getFullYear();
        const maxEndMonth = today.getMonth() + 1;

        if (endYear > maxEndYear || (endYear === maxEndYear && endMonth > maxEndMonth)) {
          throw new Error('La fecha fin no puede superar el mes y año actual');
        }

        const monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
        if (monthsDiff < 0 || monthsDiff > 4) {
          throw new Error('El rango seleccionado no puede ser superior a 4 meses');
        }

        const start = `${startYear}-${String(startMonth).padStart(2, '0')}-01`;
        const lastDay = new Date(endYear, endMonth, 0).getDate();
        const end = `${endYear}-${String(endMonth).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        const res = await api.get<QuarterlyReportResponse[]>('/reports/custom', {
          params: { startDate: start, endDate: end },
        });
        setReports(res.data);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Error al cargar el reporte';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [mode, year, quarter, startYear, startMonth, endYear, endMonth]);

  const quarterLabels = ['Enero - Marzo', 'Abril - Junio', 'Julio - Septiembre', 'Octubre - Diciembre'];

  const isQuarterDisabled = (q: number, y: number) => {
    if (y > currentYear) return true;
    if (y < currentYear) return false;
    return q > Math.ceil(currentMonth / 3);
  };

  const isMonthDisabled = (m: number, y: number) => {
    if (y > currentYear) return true;
    if (y < currentYear) return false;
    return m > currentMonth;
  };

  const isCurrentQuarter = (q: number, y: number) => {
    return y === currentYear && q === Math.ceil(currentMonth / 3);
  };

  const handleYearChange = (value: string) => {
    const y = Number(value);
    setYear(y);
    if (isQuarterDisabled(quarter, y)) {
      setQuarter(1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900 tracking-tight">Reportes</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              ← Volver al Dashboard
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMode('quarterly')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  mode === 'quarterly' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                Trimestre
              </button>
              <button
                onClick={() => setMode('custom')}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                  mode === 'custom' ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200'
                }`}
              >
                Rango
              </button>
            </div>
            {mode === 'quarterly' ? (
              <>
                <select
                  value={year}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  {Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <select
                  value={quarter}
                  onChange={(e) => {
                    const q = Number(e.target.value);
                    if (!isQuarterDisabled(q, year)) setQuarter(q);
                  }}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  {quarterLabels.map((label, i) => (
                    <option key={i + 1} value={i + 1} disabled={isQuarterDisabled(i + 1, year)}>{label}</option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <select
                  value={startMonth}
                  onChange={(e) => setStartMonth(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  {monthNames.map((m, i) => (
                    <option key={i+1} value={i+1}>{m}</option>
                  ))}
                </select>
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  {Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <span className="text-sm text-gray-400">hasta</span>
                <select
                  value={endMonth}
                  onChange={(e) => setEndMonth(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  {monthNames.map((m, i) => (
                    <option key={i+1} value={i+1} disabled={isMonthDisabled(i+1, endYear)}>{m}</option>
                  ))}
                </select>
                <select
                  value={endYear}
                  onChange={(e) => setEndYear(Number(e.target.value))}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
                >
                  {Array.from({ length: currentYear - 2020 + 1 }, (_, i) => 2020 + i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-medium bg-blue-50 text-blue-800">
            Info
          </span>
          <span>Solo periodos finalizados. Máximo 5 meses. No incluir mes en curso ni futuros.</span>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">Cargando...</div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-sm text-red-500">{error}</div>
          ) : reports.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-gray-400">No hay datos para este periodo</div>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">Periodo</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">Ingresos</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">Gastos Fijos</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">Gastos Variables</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                      <th className="text-right px-6 py-3 font-medium text-gray-400 uppercase tracking-wider">Balance Acumulado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {reports.map((r) => (
                      <tr key={`${r.year}-${r.quarter}-${r.startDate}`} className="hover:bg-gray-50">
                        <td className="px-6 py-3 text-gray-700 whitespace-nowrap">
                          {mode === 'quarterly' && isCurrentQuarter(r.quarter, r.year) ? 'Trimestre en curso' : `${r.startDate.slice(5)} al ${r.endDate.slice(5)}`}
                        </td>
                        <td className="px-6 py-3 text-right text-green-600 font-medium whitespace-nowrap">
                          {formatCurrency(r.totalIncome)}
                        </td>
                        <td className="px-6 py-3 text-right text-gray-900 font-medium whitespace-nowrap">
                          {formatCurrency(r.totalFixedExpenses)}
                        </td>
                        <td className="px-6 py-3 text-right text-gray-900 font-medium whitespace-nowrap">
                          {formatCurrency(r.totalVariableExpenses)}
                        </td>
                        <td
                          className={`px-6 py-3 text-right font-medium whitespace-nowrap ${
                            r.balance >= 0 ? 'text-green-600' : 'text-red-500'
                          }`}
                        >
                          {formatCurrency(r.balance)}
                        </td>
                        <td className="px-6 py-3 text-right font-medium whitespace-nowrap text-gray-900">
                          {formatCurrency(r.accumulatedBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Reports;