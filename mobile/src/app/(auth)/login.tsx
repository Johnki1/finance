import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';
import { Colors, spacing, typography, borderRadius } from '../../theme';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, clearError } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error]);

  const handleSubmit = async () => {
    await login(email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Finance</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholder="tu@email.com"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholder="••••••"
        />

        <Button
          title="Ingresar"
          onPress={handleSubmit}
          disabled={isLoading}
        />
      </View>

      <Text style={styles.footerText}>
        ¿No tienes cuenta?{' '}
        <Text style={styles.link} onPress={() => router.push('/register')}>
          Registrarse
        </Text>
      </Text>
      <Text style={styles.footerText}>
        <Text style={styles.link} onPress={() => router.push('/forgot-password')}>
          ¿Olvidaste tu contraseña?
        </Text>
      </Text>
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
  footerText: {
    marginTop: spacing.xl,
    fontSize: typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  link: {
    color: Colors.text,
    fontWeight: typography.weights.medium,
  },
});
