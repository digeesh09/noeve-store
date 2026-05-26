import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@noeve/ui-tokens';

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Order queue</Text>
      <Text style={styles.sub}>
        Authenticate with admin credentials, then PATCH order status (PROCESSING → SHIPPED).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  title: { fontSize: 22, fontWeight: '600', color: colors.brand.primary },
  sub: { marginTop: spacing.sm, color: colors.neutral[800], lineHeight: 20 },
});
