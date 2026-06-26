import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { colors, spacing } from '@noeve/ui-tokens';
import { useCart } from '../../src/context/cart-context';
import { useAuth } from '../../src/context/auth-context';
import { apiClient } from '../../src/lib/api';
import { formatPrice } from '../../src/lib/format';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, refresh: refreshCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      Alert.alert('Sign in required', 'Please sign in to place an order.');
      router.replace('/(tabs)/account');
    }
  }, [isAuthenticated, router]);

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) return;
    setSubmitting(true);
    try {
      const res = await apiClient.store.placeOrder({ note });
      await refreshCart();
      setSuccess(res.data.orderNumber);
    } catch (err: any) {
      Alert.alert('Checkout Error', err?.message || 'Could not place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Order Confirmed', headerBackVisible: false }} />
        <View style={styles.successCard}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Order confirmed</Text>
          <Text style={styles.successText}>
            Thank you! Your order {success} has been placed successfully.
          </Text>
          <Pressable style={styles.btn} onPress={() => router.replace('/(tabs)/shop')}>
            <Text style={styles.btnText}>Continue Shopping</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (!cart || cart.lines.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Checkout' }} />
        <Text style={styles.emptyText}>Your bag is empty.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Checkout' }} />

      <Text style={styles.title}>Complete your order</Text>
      <Text style={styles.subtitle}>
        Payment integration coming soon — orders are confirmed immediately for demo purposes.
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Order summary</Text>
        {cart.lines.map((line) => (
          <View key={line.id} style={styles.lineItem}>
            <Text style={styles.lineName}>
              {line.productName} × {line.quantity}
            </Text>
            <Text style={styles.linePrice}>{formatPrice(line.lineTotalCents, line.currency)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatPrice(cart.subtotalCents, cart.currency)}</Text>
        </View>
      </View>

      <View style={styles.noteSection}>
        <Text style={styles.label}>Order note (optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Gift message, delivery instructions…"
          placeholderTextColor="rgba(33, 29, 25, 0.4)"
          multiline
          numberOfLines={3}
          value={note}
          onChangeText={setNote}
        />
      </View>

      <Pressable style={styles.btn} onPress={handlePlaceOrder} disabled={submitting}>
        <Text style={styles.btnText}>{submitting ? 'Placing order…' : 'Place order'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.neutral[50] },
  scroll: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  title: { fontSize: 24, fontWeight: '700', color: colors.brand.primary, fontFamily: 'serif' },
  subtitle: { marginTop: spacing.sm, fontSize: 14, color: 'rgba(33, 29, 25, 0.7)', lineHeight: 20 },
  summaryCard: {
    marginTop: spacing.xl,
    backgroundColor: colors.neutral.cream,
    borderRadius: 4,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(33, 29, 25, 0.08)',
  },
  summaryTitle: { fontSize: 16, fontWeight: '700', color: colors.brand.primary, marginBottom: spacing.md },
  lineItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  lineName: { fontSize: 14, color: colors.neutral.ink },
  linePrice: { fontSize: 14, fontWeight: '600', color: colors.neutral.ink },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderColor: 'rgba(33, 29, 25, 0.08)',
  },
  totalLabel: { fontSize: 15, fontWeight: '700', color: colors.brand.primary },
  totalValue: { fontSize: 15, fontWeight: '700', color: colors.brand.primary },
  noteSection: { marginTop: spacing.xl },
  label: { fontSize: 13, fontWeight: '600', color: colors.neutral.ink, marginBottom: spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(33, 29, 25, 0.12)',
    borderRadius: 4,
    padding: spacing.md,
    fontSize: 15,
    backgroundColor: colors.neutral.cream,
    textAlignVertical: 'top',
    color: colors.neutral.ink,
  },
  btn: {
    marginTop: spacing.xl,
    backgroundColor: colors.brand.primary,
    borderRadius: 4,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnText: { color: colors.neutral[50], fontWeight: '700', fontSize: 15 },
  emptyText: { fontSize: 16, color: colors.neutral.ink },
  successCard: { alignItems: 'center', padding: spacing.xl, backgroundColor: colors.neutral.cream, borderWidth: 1, borderColor: 'rgba(33, 29, 25, 0.08)', borderRadius: 4 },
  successIcon: { fontSize: 48, color: colors.brand.primary, marginBottom: spacing.md },
  successTitle: { fontSize: 24, fontWeight: '700', color: colors.brand.primary, fontFamily: 'serif' },
  successText: { marginTop: spacing.sm, textAlign: 'center', color: colors.neutral.ink, lineHeight: 22 },
});
