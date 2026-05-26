import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import { colors, spacing } from '@noeve/ui-tokens';

interface Product {
  id: string;
  name: string;
  basePriceCents: number;
  currency: string;
}

export default function ShopScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const apiUrl =
    (Constants.expoConfig?.extra as { apiUrl?: string })?.apiUrl ??
    'http://localhost:3001/v1';

  useEffect(() => {
    fetch(`${apiUrl}/store/products`)
      .then((r) => r.json())
      .then((json) => setProducts(json.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Shop</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        ListEmptyComponent={
          <Text style={styles.empty}>No products. Start API and run db:seed.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>
              {(item.basePriceCents / 100).toLocaleString('en-IN', {
                style: 'currency',
                currency: item.currency,
              })}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  heading: { fontSize: 24, fontWeight: '600', color: colors.brand.primary, marginBottom: spacing.md },
  card: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  name: { fontWeight: '500' },
  price: { marginTop: 4, color: colors.neutral[800] },
  empty: { color: colors.neutral[800], marginTop: spacing.lg },
});
