import { useState } from 'react';
import api from './api';
import Modal from './Modal';
import { getLocalDate } from './utils/dateUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

function AddVariableExpenseModal({ open, onClose, onSuccess }: Props) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getLocalDate());
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await api.post('/variable-expenses', {
        description,
        amount: Number(amount),
        date,
        category: category || undefined,
      });
      setSuccess('Registro guardado exitosamente');
      onSuccess();
      onClose();
      setDescription('');
      setAmount('');
      setDate(getLocalDate());
      setCategory('');
    } catch {
      setError('Error al guardar el registro. Intenta nuevamente.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Añadir Gasto Variable">
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
          <label className="block text-sm font-medium text-gray-600 mb-1">Fecha</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300"
            placeholder="Opcional"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gray-900 text-white text-sm font-medium rounded-lg px-4 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </Modal>
  );
}

export default AddVariableExpenseModal;