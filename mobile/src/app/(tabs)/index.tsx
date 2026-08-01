import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { financeService } from '../../services/financeService';
import { useOffline } from '../../context/OfflineContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import type { FinanceSummaryResponse } from '../../../../packages/shared/src/types/common';
import { Colors, spacing, typography, borderRadius } from '../../theme';

type Status = 'loading' | 'error' | 'success' | 'empty';

interface SummaryCard {
  label: string;
  value: number;
}

export default function DashboardScreen() {
  const [status, setStatus] = useState<Status>('loading');
  const [summary, setSummary] = useState<FinanceSummaryResponse | null>(null);
  const [error, setError] = useState('');
  const { offline } = useOffline();

  const loadSummary = async () => {
    try {
      setStatus('loading');
      const data = await financeService.getSummary();
      setSummary(data as any);
      setStatus('success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al cargar el resumen financiero';
      setError(message);
      setStatus('error');
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  const cards: SummaryCard[] = summary
    ? [
        { label: 'Ingresos', value: summary.totalIncome },
        { label: 'Gastos Fijos', value: summary.totalFixedExpenses },
        { label: 'Gastos Variables', value: summary.totalVariableExpenses },
        { label: 'Balance', value: summary.balance },
        { label: 'Balance Acumulado', value: summary.accumulatedBalance },
      ]
    : [];

  if (status === 'loading') {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>Cargando...</Text>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Reintentar" onPress={loadSummary} />
      </View>
    );
  }

  if (status === 'success' && (!summary || cards.length === 0)) {
    return (
      <View style={styles.center}>
        <Text style={styles.centerText}>No hay datos para mostrar en este periodo.</Text>
      </View>
    );
  }

  const colorFor = (label: string, value: number) => {
    if (label.includes('Balance')) {
      return value >= 0 ? Colors.success : Colors.error;
    }
    if (label.includes('Ingresos')) return Colors.success;
    return Colors.error;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Resumen Financiero</Text>
      {offline ? <Text style={styles.offlineBanner}>Modo offline</Text> : null}
      <View style={styles.grid}>
        {cards.map((card) => (
          <Card key={card.label} title={card.label} style={styles.card}>
            <Text style={[styles.value, { color: colorFor(card.label, card.value) }]}>
              {card.value.toFixed(2)}
            </Text>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.semibold, marginBottom: spacing.md, color: Colors.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: { width: '47%', marginBottom: spacing.sm },
  value: { fontSize: typography.sizes.lg, fontWeight: typography.weights.bold, marginTop: spacing.sm, color: Colors.text },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: Colors.background },
  centerText: { color: Colors.textSecondary, fontSize: typography.sizes.sm, textAlign: 'center', marginBottom: spacing.sm },
  errorText: { color: Colors.error, fontSize: typography.sizes.sm, textAlign: 'center', marginBottom: spacing.sm },
  offlineBanner: { backgroundColor: '#fde68a', color: '#92400e', padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: spacing.md, textAlign: 'center', fontSize: typography.sizes.sm },
});