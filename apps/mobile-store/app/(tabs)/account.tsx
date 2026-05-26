import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@noeve/ui-tokens';

export default function AccountScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.sub}>Login via /v1/store/auth — same users as web.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: spacing.lg },
  title: { fontSize: 24, fontWeight: '600', color: colors.brand.primary },
  sub: { marginTop: spacing.sm, color: colors.neutral[800] },
});
