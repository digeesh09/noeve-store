import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { colors, spacing } from '@noeve/ui-tokens';

export default function CartScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="Your bag" subtitle="Review items before checkout" />

      <View style={styles.empty}>
        <Text style={styles.icon}>✦</Text>
        <Text style={styles.emptyTitle}>Your bag is empty</Text>
        <Text style={styles.emptySub}>
          Discover pendants, fine jewellery, and care accessories.
        </Text>
        <Link href="/(tabs)/shop" style={styles.cta}>
          <Text style={styles.ctaText}>Continue shopping</Text>
        </Link>
      </View>

      <View style={styles.info}>
        <Text style={styles.infoTitle}>Secure checkout</Text>
        <Text style={styles.infoSub}>Payments and order sync coming in the next release.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.neutral[50] },
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
  emptySub: {
    marginTop: spacing.sm,
    textAlign: 'center',
    fontSize: 14,
    color: colors.neutral[800],
    lineHeight: 20,
  },
  cta: {
    marginTop: spacing.lg,
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
  },
  ctaText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  info: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.brand.accentLight + '66',
    borderRadius: 12,
  },
  infoTitle: { fontWeight: '700', color: colors.brand.primary },
  infoSub: { marginTop: 4, fontSize: 13, color: colors.neutral[800] },
});
