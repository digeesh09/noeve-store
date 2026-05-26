import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, typography } from '@noeve/ui-tokens';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>NOEVE</Text>
      <Text style={styles.title}>Fine jewellery & accessories</Text>
      <Text style={styles.subtitle}>
        Connected to the same API as the web store — centrally managed by admin.
      </Text>
      <Link href="/shop" style={styles.cta}>
        <Text style={styles.ctaText}>Shop now</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
  },
  eyebrow: {
    fontSize: typography.fontSize.sm,
    letterSpacing: 4,
    color: colors.brand.accent,
  },
  title: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.xxl,
    fontWeight: '600',
    color: colors.brand.primary,
  },
  subtitle: {
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
    color: colors.neutral[800],
    lineHeight: 24,
  },
  cta: {
    marginTop: spacing.xl,
    alignSelf: 'flex-start',
    backgroundColor: colors.brand.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 24,
  },
  ctaText: {
    color: '#fff',
    fontWeight: '600',
  },
});
