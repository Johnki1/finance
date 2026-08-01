/**
 * Utilidades para formateo de moneda.
 * Funciones puras, sin efectos secundarios.
 */

export const DEFAULT_CURRENCY = 'COP';

export const formatCurrency = (amount: number, currency = DEFAULT_CURRENCY): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
  return Number.parseFloat(cleaned) || 0;
};