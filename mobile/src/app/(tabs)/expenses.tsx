import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Alert } from 'react-native';
import { fixedExpenseService } from '../../services/fixedExpenseService';
import { useOffline } from '../../context/OfflineContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import type { FixedExpenseResponse, FixedExpenseRequest } from '../../services/fixedExpenseService';
import { Colors, spacing, typography, borderRadius } from '../../theme';

type Status = 'loading' | 'error' | 'success' | 'empty';
type Tab = 'list' | 'create';

type ExpenseCategory =
  | 'ARRIENDO'
  | 'AGUA'
  | 'LUZ'
  | 'GAS'
  | 'INTERNET_TV'
  | 'MASCOTAS'
  | 'MERCADO'
  | 'OTROS';

const CATEGORIES: ExpenseCategory[] = [
  'ARRIENDO',
  'AGUA',
  'LUZ',
  'GAS',
  'INTERNET_TV',
  'MASCOTAS',
  'MERCADO',
  'OTROS',
];

export default function FixedExpensesScreen() {
  const { offline, pendingCount, sync } = useOffline();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<FixedExpenseResponse[]>([]);
  const [tab, setTab] = useState<Tab>('list');

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('OTROS');
  const [dueDay, setDueDay] = useState('');
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<FixedExpenseResponse | null>(null);
  const [error, setError] = useState('');
  const [syncLoading, setSyncLoading] = useState(false);

  const restoreForm = (item: FixedExpenseResponse | null) => {
    if (!item) return;
    setDescription(item.description);
    setAmount(String(item.amount));
    setCategory(item.category);
    setDueDay(item.dueDay != null ? String(item.dueDay) : '');
    setEditing(item);
    setTab('create');
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('OTROS');
    setDueDay('');
    setEditing(null);
    setError('');
  };

  const load = async () => {
    try {
      setStatus('loading');
      const list = await fixedExpenseService.list();
      setItems(list);
      setStatus(list.length === 0 ? 'empty' : 'success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al cargar gastos fijos';
      setError(message);
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    setError('');
    if (!description.trim() || !amount || !dueDay) {
      setError('Descripción, monto y día de vencimiento son requeridos');
      return;
    }
    const parsedAmount = Number(amount);
    const parsedDueDay = Number(dueDay);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Monto inválido');
      return;
    }
    if (Number.isNaN(parsedDueDay) || parsedDueDay < 1 || parsedDueDay > 31) {
      setError('Día de vencimiento inválido');
      return;
    }
    setSaving(true);
    try {
      const payload: FixedExpenseRequest = {
        description: description.trim(),
        amount: parsedAmount,
        category,
        dueDay: parsedDueDay,
      };
      if (editing) {
        await fixedExpenseService.update(editing.id, payload);
      } else {
        await fixedExpenseService.create(payload);
      }
      resetForm();
      setTab('list');
      await load();
    } catch (err: any) {
      const message = err.response?.data?.message || 'No fue posible guardar el gasto fijo';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: FixedExpenseResponse) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert('Eliminar gasto fijo', '¿Estás seguro?', [
        { text: 'Cancelar', onPress: () => resolve(false) },
        { text: 'Eliminar', onPress: () => resolve(true), style: 'destructive' },
      ]);
    });
    if (!confirmed) return;
    try {
      await fixedExpenseService.remove(item.id);
      if (editing?.id === item.id) resetForm();
      await load();
    } catch (err: any) {
      const message = err.response?.data?.message || 'No fue posible eliminar el gasto fijo';
      setError(message);
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

  const formatCurrency = (value: number) =>
    value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

  if (tab === 'create') {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{editing ? 'Editar' : 'Nuevo'} gasto fijo</Text>
        <Card style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.input} placeholder="Ej: Internet" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Monto</Text>
            <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} placeholder="0.00" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Categoría</Text>
            <View style={styles.row}>
              {CATEGORIES.map((c) => (
                <Button key={c} title={c} onPress={() => setCategory(c)} style={[styles.chip, category === c && styles.chipActive]} />
              ))}
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Día de vencimiento</Text>
            <TextInput value={dueDay} onChangeText={setDueDay} keyboardType="number-pad" style={styles.input} placeholder="1-31" placeholderTextColor="#9ca3af" />
          </View>
          {error ? <Text style={styles.formError}>{error}</Text> : null}
          <View style={styles.actions}>
            <Button title="Guardar" onPress={handleSave} disabled={saving} />
            <Button title="Cancelar" onPress={() => { resetForm(); setTab('list'); }} style={styles.secondary} />
          </View>
        </Card>
      </ScrollView>
    );
  }

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
      <Text style={styles.title}>Gastos Fijos</Text>
      {offline ? <Text style={styles.offlineBanner}>Modo offline</Text> : null}
      {!offline && pendingCount > 0 ? (
        <View style={styles.syncRow}>
          <Text style={styles.syncText}>{pendingCount} pendientes</Text>
          <Button title="Sincronizar" onPress={handleSync} disabled={syncLoading} />
        </View>
      ) : null}
      <Button title="Nuevo gasto fijo" onPress={() => { resetForm(); setTab('create'); }} style={styles.primaryAction} />
      {status === 'empty' ? (
        <View style={styles.center}>
          <Text style={styles.centerText}>No hay registros para mostrar</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <Card key={item.id} title={`${item.category} · Día ${item.dueDay ?? '-'}`} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.description}</Text>
              <Text style={styles.itemAmount}>{formatCurrency(item.amount)}</Text>
              <View style={styles.itemActions}>
                <Button title="Editar" onPress={() => restoreForm(item)} />
                <Button title="Eliminar" onPress={() => handleDelete(item)} style={styles.danger} />
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: typography.sizes.xxl, fontWeight: typography.weights.semibold, marginBottom: spacing.md, color: Colors.text },
  primaryAction: { alignSelf: 'flex-start', marginBottom: spacing.md },
  formCard: { marginBottom: spacing.lg },
  field: { gap: spacing.xs, marginBottom: spacing.md },
  label: { fontSize: typography.sizes.sm, color: Colors.textSecondary, marginBottom: spacing.xs },
  input: { borderWidth: 1, borderColor: Colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: typography.sizes.sm, color: Colors.text },
  formError: { color: Colors.error, fontSize: typography.sizes.xs, marginBottom: spacing.sm },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  secondary: { backgroundColor: Colors.border },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.background },
  chipActive: { backgroundColor: Colors.text, borderColor: Colors.text },
  list: { gap: spacing.md },
  itemCard: { marginBottom: spacing.sm },
  itemTitle: { fontSize: typography.sizes.md, color: Colors.text, fontWeight: typography.weights.medium, marginBottom: spacing.xs },
  itemAmount: { fontSize: typography.sizes.sm, color: Colors.success, fontWeight: typography.weights.bold, marginBottom: spacing.sm },
  itemActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  danger: { backgroundColor: Colors.error },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: Colors.background },
  centerText: { color: Colors.textSecondary, fontSize: typography.sizes.sm, textAlign: 'center', marginBottom: spacing.sm },
  errorText: { color: Colors.error, fontSize: typography.sizes.sm, textAlign: 'center', marginBottom: spacing.sm },
  offlineBanner: { backgroundColor: '#fde68a', color: '#92400e', padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: spacing.md, textAlign: 'center', fontSize: typography.sizes.sm },
  syncRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  syncText: { fontSize: typography.sizes.sm, color: Colors.textSecondary },
});