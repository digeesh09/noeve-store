import { Tabs } from 'expo-router';
import { Text, View } from 'react-native';
import { colors } from '@noeve/ui-tokens';
import { useCart } from '../../src/context/cart-context';

function BagTabIcon({ color }: { color: string }) {
  const { cart } = useCart();
  return (
    <View>
      <Text style={{ fontSize: 18, color }}>🛍</Text>
      {cart.itemCount > 0 ? (
        <View
          style={{
            position: 'absolute',
            right: -8,
            top: -4,
            backgroundColor: colors.brand.accent,
            borderRadius: 8,
            minWidth: 16,
            height: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 9, fontWeight: '700', color: colors.brand.primary }}>
            {cart.itemCount > 9 ? '9+' : cart.itemCount}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

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
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Bag',
          tabBarIcon: ({ color }) => <BagTabIcon color={color} />,
        }}
      />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
    </Tabs>
  );
}
