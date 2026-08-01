import { Tabs } from 'expo-router';

export default function AppNavigator() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e2e8f0',
        },
      }}
    />
  );
}