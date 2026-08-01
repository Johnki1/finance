import { type ComponentProps } from 'react';
import { type StyleProp, type ViewStyle, Pressable, Text, StyleSheet } from 'react-native';

type Props = ComponentProps<typeof Pressable> & {
  title: string;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
};

export default function Button({ title, variant = 'primary', style, ...rest }: Props) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' ? styles.primary : styles.secondary,
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    minHeight: 48,
  },
  primary: { backgroundColor: '#2563eb' },
  secondary: { backgroundColor: '#e2e8f0' },
  pressed: { opacity: 0.85 },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});