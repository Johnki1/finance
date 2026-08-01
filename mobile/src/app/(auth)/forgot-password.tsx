import { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../../services/authService';
import Button from '../../components/ui/Button';
import { Colors, spacing, typography, borderRadius } from '../../theme';

type Status = 'form' | 'success';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setStatus('success');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al solicitar recuperación';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Recuperar Contraseña</Text>
        <View style={styles.form}>
          <Text style={styles.successText}>
            Hemos enviado un enlace de recuperación a tu correo electrónico. Por favor, revisa tu bandeja de
            entrada.
          </Text>
          <Button title="Volver a Iniciar Sesión" onPress={() => router.replace('/(auth)/login')} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar Contraseña</Text>
      <View style={styles.form}>
        <Text style={styles.helpText}>
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="tu@email.com"
            placeholderTextColor="#9ca3af"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <Button title="Enviar Enlace" onPress={handleSubmit} disabled={isLoading} />

        <Text style={styles.footerText}>
          <Text style={styles.link} onPress={() => router.replace('/(auth)/login')}>
            ← Volver al Login
          </Text>
        </Text>
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
  helpText: {
    fontSize: typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xs,
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
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    color: Colors.error,
    fontSize: typography.sizes.xs,
  },
  successText: {
    fontSize: typography.sizes.sm,
    color: Colors.success,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  footerText: {
    marginTop: spacing.sm,
    fontSize: typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  link: {
    color: Colors.text,
    fontWeight: typography.weights.medium,
  },
});