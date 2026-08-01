import { type ComponentProps } from 'react';
import { type StyleProp, type ViewStyle, View, Text, StyleSheet } from 'react-native';

type Props = ComponentProps<typeof View> & {
  title?: string;
  style?: StyleProp<ViewStyle>;
};

export default function Card({ title, style, children, ...rest }: Props) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#0f172a',
  },
});