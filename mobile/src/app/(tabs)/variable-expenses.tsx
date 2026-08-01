import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Alert } from 'react-native';
import { variableExpenseService } from '../../services/variableExpenseService';
import { useOffline } from '../../context/OfflineContext';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import type { VariableExpenseResponse, VariableExpenseRequest } from '../../services/variableExpenseService';
import { Colors, spacing, typography, borderRadius } from '../../theme';

type Status = 'loading' | 'error' | 'success' | 'empty';

export default function VariableExpensesScreen() {
  const { offline, pendingCount, sync } = useOffline();
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<VariableExpenseResponse[]>([]);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [saving, setSaving] = useState(false);

  const [editing, setEditing] = useState<VariableExpenseResponse | null>(null);
  const [error, setError] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate('');
    setCategory('');
    setEditing(null);
    setError('');
  };

  const load = async () => {
    try {
      setStatus('loading');
      const list = await variableExpenseService.list();
      setItems(list);
      setStatus(list.length === 0 ? 'empty' : 'success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al cargar gastos variables';
      setError(message);
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const formatDateInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    const yyyy = digits.slice(0, 4);
    const mm = digits.slice(4, 6);
    const dd = digits.slice(6, 8);
    if (digits.length <= 4) return yyyy;
    if (digits.length <= 6) return `${yyyy}-${mm}`;
    return `${yyyy}-${mm}-${dd}`;
  };

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
      const payload: VariableExpenseRequest = {
        description: description.trim(),
        amount: parsedAmount,
        date,
        category: category.trim() || null,
      };
      if (editing) {
        await variableExpenseService.update(editing.id, payload);
      } else {
        await variableExpenseService.create(payload);
      }
      resetForm();
      setFormVisible(false);
      await load();
    } catch (err: any) {
      const message = err.response?.data?.message || 'No fue posible guardar el gasto variable';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: VariableExpenseResponse) => {
    setDescription(item.description);
    setAmount(String(item.amount));
    setDate(item.date);
    setCategory(item.category ?? '');
    setEditing(item);
    setError('');
    setFormVisible(true);
  };

  const handleDelete = async (item: VariableExpenseResponse) => {
    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert('Eliminar gasto variable', '¿Estás seguro?', [
        { text: 'Cancelar', onPress: () => resolve(false) },
        { text: 'Eliminar', onPress: () => resolve(true), style: 'destructive' },
      ]);
    });
    if (!confirmed) return;
    try {
      await variableExpenseService.remove(item.id);
      if (editing?.id === item.id) resetForm();
      await load();
    } catch (err: any) {
      const message = err.response?.data?.message || 'No fue posible eliminar el gasto variable';
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

  if (formVisible) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{editing ? 'Editar' : 'Nuevo'} gasto variable</Text>
        <Card style={styles.formCard}>
          <View style={styles.field}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput value={description} onChangeText={setDescription} style={styles.input} placeholder="Ej: Mercado" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Monto</Text>
            <TextInput value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} placeholder="0.00" placeholderTextColor="#9ca3af" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Fecha</Text>
            <TextInput value={date} onChangeText={(text) => setDate(formatDateInput(text))} keyboardType="number-pad" style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" maxLength={10} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Categoría</Text>
            <TextInput value={category} onChangeText={setCategory} style={styles.input} placeholder="Ej: SUPERMERCADO" placeholderTextColor="#9ca3af" />
          </View>
          {error ? <Text style={styles.formError}>{error}</Text> : null}
          <View style={styles.actions}>
            <Button title="Guardar" onPress={handleSave} disabled={saving} />
            <Button title="Cancelar" onPress={() => { resetForm(); setFormVisible(false); }} style={styles.secondary} />
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
      <Text style={styles.title}>Gastos Variables</Text>
      {offline ? <Text style={styles.offlineBanner}>Modo offline</Text> : null}
      {!offline && pendingCount > 0 ? (
        <View style={styles.syncRow}>
          <Text style={styles.syncText}>{pendingCount} pendientes</Text>
          <Button title="Sincronizar" onPress={handleSync} disabled={syncLoading} />
        </View>
      ) : null}
      <Button title="Nuevo gasto variable" onPress={() => { resetForm(); setFormVisible(true); }} style={styles.primaryAction} />
      {status === 'empty' ? (
        <View style={styles.center}>
          <Text style={styles.centerText}>No hay registros para mostrar</Text>
        </View>
      ) : (
        <View style={styles.list}>
          {items.map((item) => (
            <Card key={item.id} title={item.date} style={styles.itemCard}>
              <Text style={styles.itemTitle}>{item.description}</Text>
              <Text style={styles.itemMeta}>
                {item.category ? `${item.category} · ` : ''} {formatCurrency(item.amount)}
              </Text>
              <View style={styles.itemActions}>
                <Button title="Editar" onPress={() => handleEdit(item)} />
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
  list: { gap: spacing.md },
  itemCard: { marginBottom: spacing.sm },
  itemTitle: { fontSize: typography.sizes.md, color: Colors.text, fontWeight: typography.weights.medium, marginBottom: spacing.xs },
  itemMeta: { fontSize: typography.sizes.sm, color: Colors.success, fontWeight: typography.weights.bold, marginBottom: spacing.sm },
  itemActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  danger: { backgroundColor: Colors.error },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: Colors.background },
  centerText: { color: Colors.textSecondary, fontSize: typography.sizes.sm, textAlign: 'center', marginBottom: spacing.sm },
  errorText: { color: Colors.error, fontSize: typography.sizes.sm, textAlign: 'center', marginBottom: spacing.sm },
  offlineBanner: { backgroundColor: '#fde68a', color: '#92400e', padding: spacing.sm, borderRadius: borderRadius.md, marginBottom: spacing.md, textAlign: 'center', fontSize: typography.sizes.sm },
  syncRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  syncText: { fontSize: typography.sizes.sm, color: Colors.textSecondary },
});