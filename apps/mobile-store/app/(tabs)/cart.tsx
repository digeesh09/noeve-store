import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { useCart } from '../../src/context/cart-context';
import { formatPrice } from '../../src/lib/format';
import { colors, spacing } from '@noeve/ui-tokens';

export default function CartScreen() {
  const { cart, loading, updateQuantity, removeItem } = useCart();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.accent} size="large" />
      </View>
    );
  }

  if (cart.lines.length === 0) {
    return (
      <View style={styles.container}>
        <ScreenHeader title="Your bag" subtitle="Review items before checkout" />
        <View style={styles.empty}>
          <Text style={styles.icon}>✦</Text>
          <Text style={styles.emptyTitle}>Your bag is empty</Text>
          <Link href="/(tabs)/shop" style={styles.cta}>
            <Text style={styles.ctaText}>Continue shopping</Text>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <ScreenHeader title="Your bag" subtitle={`${cart.itemCount} items`} />

      {cart.lines.map((line) => (
        <View key={line.id} style={styles.line}>
          {line.imageUrl ? (
            <Image source={{ uri: line.imageUrl }} style={styles.thumb} />
          ) : (
            <View style={[styles.thumb, styles.thumbPlaceholder]} />
          )}
          <View style={styles.lineBody}>
            <Text style={styles.lineName}>{line.productName}</Text>
            <Text style={styles.linePrice}>{formatPrice(line.unitPriceCents, line.currency)}</Text>
            <View style={styles.qtyRow}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => updateQuantity(line.id, line.quantity - 1)}
                disabled={line.quantity <= 1}
              >
                <Text>−</Text>
              </Pressable>
              <Text style={styles.qty}>{line.quantity}</Text>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => updateQuantity(line.id, line.quantity + 1)}
              >
                <Text>+</Text>
              </Pressable>
              <Pressable onPress={() => removeItem(line.id)} style={styles.remove}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>{formatPrice(cart.subtotalCents, cart.currency)}</Text>
        </View>
        <Link href="/checkout" asChild>
          <Pressable style={styles.checkout}>
            <Text style={styles.checkoutText}>Proceed to checkout</Text>
          </Pressable>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.neutral[50] },
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.neutral[200],
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: spacing.xl,
    marginTop: spacing.md,
  },
  icon: { fontSize: 32, color: colors.brand.accent },
  emptyTitle: { marginTop: spacing.md, fontSize: 18, fontWeight: '700', color: colors.brand.primary },
  cta: {
    marginTop: spacing.lg,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
  },
  ctaText: { color: '#fff', fontWeight: '700' },
  line: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  thumb: { width: 72, height: 88, borderRadius: 8 },
  thumbPlaceholder: { backgroundColor: colors.brand.accentLight },
  lineBody: { flex: 1 },
  lineName: { fontWeight: '600', color: colors.brand.primary },
  linePrice: { marginTop: 4, fontWeight: '700' },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: { fontWeight: '600', minWidth: 24, textAlign: 'center' },
  remove: { marginLeft: 'auto' },
  removeText: { fontSize: 12, color: colors.neutral[800] },
  summary: {
    marginTop: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  summaryLabel: { color: colors.neutral[800] },
  summaryValue: { fontWeight: '700', fontSize: 16 },
  checkout: {
    backgroundColor: colors.brand.accent,
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  checkoutText: { fontWeight: '700', color: colors.brand.primary },
  hint: { marginTop: spacing.sm, textAlign: 'center', fontSize: 11, color: colors.neutral[800] },
});
