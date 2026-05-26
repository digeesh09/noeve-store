import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@noeve/ui-tokens';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.neutral[50] },
          headerTintColor: colors.brand.primary,
          headerTitleStyle: { fontWeight: '600' },
          contentStyle: { backgroundColor: colors.neutral[50] },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[slug]"
          options={{ title: 'Product', headerBackTitle: 'Back' }}
        />
      </Stack>
    </>
  );
}
