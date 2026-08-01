import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { incomeService } from '../../services/incomeService';
import { useOffline } from '../../context/OfflineContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import type { IncomeResponse } from '../../../../packages/shared/src/types/income';
import { Colors, spacing, typography, borderRadius } from '../../theme';

type Status = 'loading' | 'error' | 'success' | 'empty';

const formatCurrency = (value: number) =>
  value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

export default function IncomesScreen() {
  const { offline, pendingCount, sync } = useOffline();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<IncomeResponse[]>([]);
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  const load = async () => {
    try {
      setStatus('loading');
      const list = await incomeService.list();
      setItems(list);
      setStatus(list.length === 0 ? 'empty' : 'success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al cargar ingresos';
      setError(message);
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setError('');
    if (!description.trim() || !amount || !date) {
      setError('Descripción, monto y fecha son requeridos');
      return;
    }
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Monto inválido');
      return;
    }
    setSaving(true);
    try {
      await incomeService.create({
        description: description.trim(),
        amount: parsedAmount,
        date,
        category: category.trim() || undefined,
      });
      setDescription('');
      setAmount('');
      setDate('');
      setCategory('');
      await load();
    } catch (err: any) {
      const message = err.response?.data?.message || 'No fue posible crear el ingreso';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleSync = async () => {
    setSyncLoading(true);
    try {
      await sync();
      await load();
    } catch {
      // handled by offline context
    } finally {
      setSyncLoading(false);
    }
  };

  const renderItem = (item: IncomeResponse) => (
    <View key={item.id} style={styles.row}>
      <View style={styles.rowInfo}>
        <Text style={styles.rowTitle}>{item.description}</Text>
        <Text style={styles.rowMeta}>
          {item.date} {item.category ? `· ${item.category}` : ''}
        </Text>
      </View>
      <Text style={styles.rowAmount}>{formatCurrency(item.amount)}</Text>
    </View>
  );

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
        <Button title="Reintentar" onPress={load} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ingresos</Text>
      {offline ? <Text style={styles.offlineBanner}>Modo offline</Text> : null}
      {!offline && pendingCount > 0 ? (
        <View style={styles.syncRow}>
          <Text style={styles.syncText}>{pendingCount} pendientes</Text>
          <Button title="Sincronizar" onPress={handleSync} disabled={syncLoading} />
        </View>
      ) : null}
      <Card title="Nuevo ingreso" style={styles.formCard}>
        <View style={styles.field}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput value={description} onChangeText={setDescription} style={styles.input} placeholder="Salario, freelance..." placeholderTextColor="#9ca3af" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Monto</Text>
          <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} placeholder="0.00" placeholderTextColor="#9ca3af" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Fecha</Text>
          <TextInput value={date} onChangeText={setDate} style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Categoría</Text>
          <TextInput value={category} onChangeText={setCategory} style={styles.input} placeholder="Ej: SALARIO" placeholderTextColor="#9ca3af" />
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Button title="Guardar" onPress={handleSave} disabled={saving} />
      </Card>

      {status === 'empty' ? (
        <View style={styles.center}>
          <Text style={styles.centerText}>No hay registros para mostrar</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map(renderItem)}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.semibold, marginBottom: spacing.md, color: Colors.text },
  formCard: { marginBottom: spacing.lg },
  field: { gap: spacing.xs, marginBottom: spacing.md },
  label: { fontSize: typography.sizes.sm, color: Colors.textSecondary, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: typography.sizes.sm, color: Colors.text },
  errorText: { color: Colors.error, fontSize: typography.sizes.xs, marginBottom: spacing.sm },
  list: { gap: spacing.md },
  row: { borderWidth: 1, borderColor: Colors.border, borderRadius: borderRadius.md, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.background },
  rowInfo: { flex: 1 },
  rowTitle: { fontSize: typography.sizes.sm, color: Colors.text, fontWeight: typography.weights.medium },
  rowMeta: { fontSize: typography.sizes.xs, color: Colors.textSecondary, marginTop: spacing.xs },
  rowAmount: { fontSize: typography.sizes.sm, color: Colors.success, fontWeight: typography.weights.bold, marginLeft: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: Colors.background },
  centerText: { color: Colors.textSecondary, fontSize: typography.sizes.sm, textAlign: 'center', marginBottom: spacing.sm },
  offlineBanner: { backgroundColor: '#fde68a', color: '#92400e', padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: spacing.md, textAlign: 'center', fontSize: typography.sizes.sm },
  syncRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  syncText: { fontSize: typography.sizes.sm, color: Colors.textSecondary },
});