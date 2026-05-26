import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing } from '@noeve/ui-tokens';

export default function AdminHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fulfillment</Text>
      <Text style={styles.sub}>
        Scan orders, update pick/pack/ship status via /v1/admin/orders — same backend as web admin.
      </Text>
      <Link href="/orders" style={styles.link}>
        <Text style={styles.linkText}>Open order queue</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg, backgroundColor: colors.neutral[50] },
  title: { fontSize: 28, fontWeight: '700', color: colors.brand.primary },
  sub: { marginTop: spacing.md, lineHeight: 22, color: colors.neutral[800] },
  link: {
    marginTop: spacing.xl,
    backgroundColor: colors.brand.primary,
    padding: spacing.md,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  linkText: { color: '#fff', fontWeight: '600' },
});
