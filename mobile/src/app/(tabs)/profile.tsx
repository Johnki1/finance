import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { authService } from '../../services/authService';
import { useAuthStore } from '../../stores/authStore';
import Card from '../../components/ui/Card';

export type MeResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  emailVerified: boolean;
  createdAt: string;
};

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [profile, setProfile] = useState<MeResponse | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setStatus('loading');
        const data = await authService.me();
        setProfile(data);
        setStatus('success');
      } catch (err: any) {
        const message = err.response?.data?.message || 'No fue posible cargar el perfil';
        setError(message);
        setStatus('error');
      }
    };
    load();
  }, []);

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Usuario';

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
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Perfil</Text>
      <Card style={styles.card}>
        <Text style={styles.name}>{fullName}</Text>
        <Text style={styles.meta}>{profile?.email ?? user?.email}</Text>
        <Text style={styles.meta}>
          {user?.roles?.length ? user.roles.join(', ') : 'Sin roles'}
        </Text>
        <Text style={styles.meta}>
          {profile?.emailVerified != null ? (profile.emailVerified ? 'Email verificado' : 'Email no verificado') : ''}
        </Text>
        <Text style={styles.meta}>{profile?.createdAt ? new Date(profile.createdAt).toLocaleString() : ''}</Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 16 },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 12, color: '#111827' },
  card: { marginBottom: 16 },
  name: { fontSize: 16, color: '#111827', fontWeight: '600', marginBottom: 6 },
  meta: { fontSize: 14, color: '#374151', marginBottom: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  centerText: { color: '#6b7280', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  errorText: { color: '#ef4444', fontSize: 14, textAlign: 'center', marginBottom: 12 },
});