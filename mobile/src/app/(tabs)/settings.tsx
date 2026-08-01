import { StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

export default function SettingsScreen() {
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    const confirmed = await new Promise<boolean>((resolve) => {
      Alert.alert('Cerrar sesión', '¿Estás seguro?', [
        { text: 'Cancelar', onPress: () => resolve(false) },
        { text: 'Cerrar sesión', onPress: () => resolve(true), style: 'destructive' },
      ]);
    });
    if (!confirmed) return;
    try {
      await logout();
    } catch {
      // best-effort cleanup even if backend call fails
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Configuración</Text>
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Sesión</Text>
        <Button title="Cerrar sesión" onPress={handleLogout} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12, color: '#111827' },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 14, color: '#374151', marginBottom: 8 },
});