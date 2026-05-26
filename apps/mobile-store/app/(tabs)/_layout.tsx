import { Tabs } from 'expo-router';
import { colors } from '@noeve/ui-tokens';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.brand.accent,
        tabBarInactiveTintColor: colors.neutral[800],
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: colors.neutral[200],
        },
        headerStyle: { backgroundColor: colors.neutral[50] },
        headerTintColor: colors.brand.primary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Tabs.Screen name="shop" options={{ title: 'Shop' }} />
      <Tabs.Screen name="cart" options={{ title: 'Bag' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
