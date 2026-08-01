import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import { Colors, spacing, typography, borderRadius } from '../../theme';

type Status = 'form' | 'success' | 'error';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const token = typeof params.token === 'string' ? params.token : '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<Status>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('Token de recuperación no proporcionado.');
    }
  }, [token]);

  if (status === 'error' && !token) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Volver al Login" onPress={() => router.replace('/(auth)/login')} />
      </View>
    );
  }

  const handleSubmit = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setIsLoading(true);
    try {
      await authService.resetPassword(token, password);
      setStatus('success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al restablecer la contraseña';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contraseña Actualizada</Text>
        <Text style={styles.successText}>
          Tu contraseña ha sido restablecida exitosamente.
        </Text>
        <Button title="Ir a Iniciar Sesión" onPress={() => router.replace('/(auth)/login')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Contraseña</Text>

      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={styles.label}>Nueva Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirmar Contraseña</Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
            placeholder="Repite tu contraseña"
            placeholderTextColor="#9ca3af"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <Button title="Restablecer Contraseña" onPress={handleSubmit} disabled={isLoading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xl,
    color: Colors.text,
  },
  form: {
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
  },
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    color: Colors.textSecondary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.sm,
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successText: {
    color: Colors.success,
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  error: {
    color: Colors.error,
    fontSize: typography.sizes.xs,
  },
});