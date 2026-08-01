import { Stack } from 'expo-router';

export default function AuthNavigator() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: '#ffffff' },
      }}
    />
  );
}