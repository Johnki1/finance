import { useEffect, useState } from 'react';
import api from './api';
import Modal from './Modal';
import type { FixedExpenseResponse, ExpenseCategory } from './types';

const categories: ExpenseCategory[] = [
  'ARRIENDO', 'AGUA', 'LUZ', 'GAS', 'INTERNET_TV', 'MASCOTAS', 'MERCADO', 'OTROS',
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  expense: FixedExpenseResponse;
}

function EditFixedExpenseModal({ open, onClose, onSuccess, expense }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('OTROS');
  const [dueDay, setDueDay] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && expense) {
      setDescription(expense.description);
      setAmount(String(expense.amount));
      setCategory(expense.category);
      setDueDay(expense.dueDay ? String(expense.dueDay) : '');
      setSuccess('');
      setError('');
    }
  }, [open, expense]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await api.put(`/fixed-expenses/${expense.id}`, {
        description,
        amount: Number(amount),
        category,
        dueDay: dueDay ? Number(dueDay) : null,
      });
      setSuccess('Gasto fijo actualizado exitosamente');
      onSuccess();
      setTimeout(onClose, 1200);
    } catch {
      setError('Error al actualizar el registro. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Editar Gasto Fijo">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-3 py-2">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Monto</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Día de vencimiento</label>
          <input
            type="number"
            min="1"
            max="31"
            value={dueDay}
            onChange={(e) => setDueDay(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Opcional"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gray-900 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Actualizar'}
        </button>
      </form>
    </Modal>
  );
}

export default EditFixedExpenseModal;