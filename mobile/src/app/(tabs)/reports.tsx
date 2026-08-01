import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { reportService } from '../../services/reportService';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import type { QuarterlyReportItem } from '../../services/reportService';

type Status = 'loading' | 'error' | 'success' | 'empty';
type Mode = 'quarterly' | 'custom';

const QUARTERS = [1, 2, 3, 4] as const;

const formatCurrency = (value: number) =>
  value.toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

const formatDate = (value: string) => value;

export default function ReportsScreen() {
  const [status, setStatus] = useState<Status>('loading');
  const [items, setItems] = useState<QuarterlyReportItem[]>([]);
  const [mode, setMode] = useState<Mode>('quarterly');
  const [error, setError] = useState('');
  const [loadingReport, setLoadingReport] = useState(false);

  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [quarter, setQuarter] = useState<string>('1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const load = async () => {
    try {
      setStatus('loading');
      const y = Number(year);
      const q = Number(quarter);
      const data = await reportService.getQuarterly(y, q);
      setItems(data);
      setStatus(data.length === 0 ? 'empty' : 'success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al cargar reportes';
      setError(message);
      setStatus('error');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleQuarterly = async () => {
    setError('');
    const y = Number(year);
    const q = Number(quarter);
    if (Number.isNaN(y) || Number.isNaN(q) || q < 1 || q > 4) {
      setError('Año y trimestre inválidos');
      return;
    }
    setLoadingReport(true);
    try {
      const data = await reportService.getQuarterly(y, q);
      setItems(data);
      setStatus(data.length === 0 ? 'empty' : 'success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'No fue posible obtener el reporte';
      setError(message);
      setStatus('error');
    } finally {
      setLoadingReport(false);
    }
  };

  const handleCustom = async () => {
    setError('');
    if (!startDate || !endDate) {
      setError('Rango de fechas requerido');
      return;
    }
    setLoadingReport(true);
    try {
      const data = await reportService.getCustom(startDate, endDate);
      setItems(data);
      setStatus(data.length === 0 ? 'empty' : 'success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'No fue posible obtener el reporte';
      setError(message);
      setStatus('error');
    } finally {
      setLoadingReport(false);
    }
  };

  const renderSummary = (item: QuarterlyReportItem) => (
    <Card key={`${item.year}-${item.quarter}`} title={`${item.year} · Q${item.quarter}`} style={styles.card}>
      <Text style={styles.dateRange}>{formatDate(item.startDate)} — {formatDate(item.endDate)}</Text>
      <View style={styles.row}>
        <View style={styles.kpi}>
          <Text style={styles.kpiLabel}>Ingresos</Text>
          <Text style={styles.kpiValue}>{formatCurrency(item.totalIncome)}</Text>
        </View>
        <View style={styles.kpi}>
          <Text style={styles.kpiLabel}>Gastos fijos</Text>
          <Text style={styles.kpiValueDanger}>{formatCurrency(item.totalFixedExpenses)}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.kpi}>
          <Text style={styles.kpiLabel}>Gastos variables</Text>
          <Text style={styles.kpiValueDanger}>{formatCurrency(item.totalVariableExpenses)}</Text>
        </View>
        <View style={styles.kpi}>
          <Text style={styles.kpiLabel}>Balance</Text>
          <Text style={[styles.kpiValue, item.balance < 0 && styles.negative]}>{formatCurrency(item.balance)}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <View style={styles.kpi}>
          <Text style={styles.kpiLabel}>Balance acumulado</Text>
          <Text style={styles.kpiValue}>{formatCurrency(item.accumulatedBalance)}</Text>
        </View>
      </View>
    </Card>
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
      <Text style={styles.title}>Reportes</Text>

      <Card style={styles.filterCard}>
        <View style={styles.segment}>
          <TouchableOpacity onPress={() => setMode('quarterly')} style={[styles.segmentItem, mode === 'quarterly' && styles.segmentActive]}>
            <Text style={[styles.segmentText, mode === 'quarterly' && styles.segmentTextActive]}>Trimestral</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMode('custom')} style={[styles.segmentItem, mode === 'custom' && styles.segmentActive]}>
            <Text style={[styles.segmentText, mode === 'custom' && styles.segmentTextActive]}>Personalizado</Text>
          </TouchableOpacity>
        </View>

        {mode === 'quarterly' ? (
          <View>
            <View style={styles.row}>
              <View style={styles.field}>
                <Text style={styles.label}>Año</Text>
                <TextInput value={year} onChangeText={setYear} keyboardType="number-pad" style={styles.input} placeholder="YYYY" placeholderTextColor="#9ca3af" />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Trimestre</Text>
                <View style={styles.rowChips}>
                  {QUARTERS.map((q) => (
                    <TouchableOpacity key={q} onPress={() => setQuarter(String(q))} style={[styles.chip, Number(quarter) === q && styles.chipActive]}>
                      <Text style={[styles.chipText, Number(quarter) === q && styles.chipTextActive]}>Q{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <Button title="Aplicar" onPress={handleQuarterly} disabled={loadingReport} />
          </View>
        ) : (
          <View>
            <View style={styles.field}>
              <Text style={styles.label}>Fecha inicio</Text>
              <TextInput value={startDate} onChangeText={setStartDate} style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Fecha fin</Text>
              <TextInput value={endDate} onChangeText={setEndDate} style={styles.input} placeholder="YYYY-MM-DD" placeholderTextColor="#9ca3af" />
            </View>
            <Button title="Aplicar" onPress={handleCustom} disabled={loadingReport} />
          </View>
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </Card>

      {status === 'empty' ? (
        <View style={styles.center}>
          <Text style={styles.centerText}>No hay registros para mostrar</Text>
        </View>
      ) : (
        <View style={styles.list}>{items.map(renderSummary)}</View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12, color: '#111827' },
  filterCard: { marginBottom: 16 },
  segment: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  segmentItem: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb', alignItems: 'center', backgroundColor: '#ffffff' },
  segmentActive: { backgroundColor: '#111827', borderColor: '#111827' },
  segmentText: { fontSize: 14, color: '#374151', fontWeight: '500' },
  segmentTextActive: { color: '#ffffff' },
  field: { gap: 4, marginBottom: 10 },
  label: { fontSize: 14, color: '#374151', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827' },
  row: { flexDirection: 'row', gap: 10 },
  rowChips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#ffffff' },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { fontSize: 13, color: '#111827' },
  chipTextActive: { color: '#ffffff' },
  card: { marginBottom: 10 },
  dateRange: { fontSize: 12, color: '#6b7280', marginBottom: 8 },
  kpi: { flex: 1 },
  kpiLabel: { fontSize: 12, color: '#374151', marginBottom: 4 },
  kpiValue: { fontSize: 14, color: '#065f46', fontWeight: '600' },
  kpiValueDanger: { fontSize: 14, color: '#ef4444', fontWeight: '600' },
  negative: { color: '#ef4444' },
  divider: { height: 1, backgroundColor: '#e5e7eb', marginVertical: 10 },
  list: { gap: 10 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  centerText: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  errorText: { color: '#ef4444', fontSize: 12, marginTop: 8, textAlign: 'center' },
});