import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { colors, spacing } from '@noeve/ui-tokens';
import { useAuth } from '../../src/context/auth-context';
import { useState } from 'react';

const perks = [
  { n: '01', title: 'Order tracking', desc: 'Follow delivery from warehouse to door.' },
  { n: '02', title: 'Saved addresses', desc: 'Faster checkout on repeat orders.' },
  { n: '03', title: 'Care reminders', desc: 'Keep your jewellery radiant longer.' },
];

export default function AccountScreen() {
  const { isAuthenticated, login, logout, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      await login(email, password);
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <ScreenHeader
        eyebrow="Account"
        title={isAuthenticated ? 'My Profile' : 'Welcome back'}
        subtitle={isAuthenticated ? 'Manage your orders and settings' : 'Sign in to track orders and manage your profile'}
      />

      {!isAuthenticated ? (
        <View style={styles.form}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colors.neutral[800]}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={[styles.label, { marginTop: spacing.md }]}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.neutral[800]}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Pressable style={styles.btn} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.btnText}>{isLoading ? 'Signing in...' : 'Sign in'}</Text>
          </Pressable>
          <Text style={styles.hint}>New to Noeve? Create an account (coming soon)</Text>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.label}>Signed in</Text>
          <Pressable style={styles.btn} onPress={logout}>
            <Text style={styles.btnText}>Sign out</Text>
          </Pressable>
        </View>
      )}

      <View style={styles.ordersCard}>
        <Text style={styles.ordersTitle}>Your orders</Text>
        <Text style={styles.ordersSub}>
          {isAuthenticated ? 'View your recent orders below.' : 'View history after signing in.'}
        </Text>
        <Link href="/(tabs)/shop">
          <Text style={styles.ordersLink}>Start shopping →</Text>
        </Link>
      </View>

      {perks.map((p) => (
        <View key={p.n} style={styles.perk}>
          <Text style={styles.perkN}>{p.n}</Text>
          <View style={styles.perkBody}>
            <Text style={styles.perkTitle}>{p.title}</Text>
            <Text style={styles.perkDesc}>{p.desc}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    padding: spacing.lg,
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.neutral[800] },
  input: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.brand.primary,
  },
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.brand.primary,
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  hint: { marginTop: spacing.md, textAlign: 'center', fontSize: 12, color: colors.neutral[800] },
  ordersCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.brand.primary,
    borderRadius: 16,
    padding: spacing.lg,
  },
  ordersTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  ordersSub: { marginTop: spacing.xs, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  ordersLink: { marginTop: spacing.md, fontSize: 14, fontWeight: '600', color: colors.brand.accent },
  perk: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral[200],
  },
  perkN: { fontSize: 14, fontWeight: '700', color: colors.brand.accent },
  perkBody: { flex: 1 },
  perkTitle: { fontWeight: '700', color: colors.brand.primary },
  perkDesc: { marginTop: 2, fontSize: 13, color: colors.neutral[800] },
  errorText: { color: 'red', marginBottom: spacing.sm, fontSize: 13, textAlign: 'center' },
});
