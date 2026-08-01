import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../stores/authStore';
import Button from '../../components/ui/Button';
import { Colors, spacing, typography, borderRadius } from '../../theme';

type FormErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, isAuthenticated, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [errors, setErrors] = useState<FormErrors>({});

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

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Email inválido';
    if (!firstName.trim()) next.firstName = 'Requerido';
    if (!lastName.trim()) next.lastName = 'Requerido';
    if (password.length < 8) next.password = 'Mínimo 8 caracteres';
    if (password !== confirmPassword) next.confirmPassword = 'No coincide';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    await register(email, password, firstName, lastName);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear cuenta</Text>

      <View style={styles.form}>
        <Field label="Nombre" value={firstName} onChange={setFirstName} error={errors.firstName} />
        <Field label="Apellido" value={lastName} onChange={setLastName} error={errors.lastName} />
        <Field
          label="Email"
          value={email}
          onChange={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          error={errors.email}
        />
        <Field
          label="Contraseña"
          value={password}
          onChange={setPassword}
          secureTextEntry
          error={errors.password}
        />
        <Field
          label="Confirmar contraseña"
          value={confirmPassword}
          onChange={setConfirmPassword}
          secureTextEntry
          error={errors.confirmPassword}
        />

        <Button title="Registrarme" onPress={handleRegister} disabled={isLoading} />

        <Text style={styles.footerText}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.link} onPress={() => router.replace('/(auth)/login')}>
            Inicia sesión
          </Text>
        </Text>
      </View>
    </View>
  );
}

// eslint-disable-next-line react/display-name
const Field = ({
  label,
  value,
  onChange,
  error,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} & React.ComponentProps<any>) => {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        style={[styles.input, error ? styles.inputError : null]}
        placeholderTextColor="#9ca3af"
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

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
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    color: Colors.error,
    fontSize: typography.sizes.xs,
  },
  footerText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  link: {
    color: Colors.text,
    fontWeight: typography.weights.medium,
  },
});