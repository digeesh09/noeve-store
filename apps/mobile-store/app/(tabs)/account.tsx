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
            placeholderTextColor="rgba(33, 29, 25, 0.4)"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={[styles.label, { marginTop: spacing.md }]}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="rgba(33, 29, 25, 0.4)"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Pressable style={styles.btn} onPress={handleLogin} disabled={isLoading}>
            <Text style={styles.btnText}>{isLoading ? 'Signing in...' : 'Sign in'}</Text>
          </Pressable>
          <Text style={styles.hint}>Demo: customer@noeve.local / Customer123!</Text>
        </View>
      ) : (
        <View style={styles.form}>
          <Text style={styles.label}>Signed in as Member</Text>
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
  scroll: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  form: {
    backgroundColor: colors.neutral.cream,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(33, 29, 25, 0.08)',
    padding: spacing.lg,
  },
  label: { fontSize: 13, fontWeight: '600', color: colors.neutral.ink },
  input: {
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(33, 29, 25, 0.12)',
    borderRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 15,
    color: colors.neutral.ink,
  },
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.brand.primary,
    borderRadius: 4,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  btnText: { color: colors.neutral[50], fontWeight: '700', fontSize: 15 },
  hint: { marginTop: spacing.md, textAlign: 'center', fontSize: 12, color: 'rgba(33, 29, 25, 0.5)' },
  ordersCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.brand.primary,
    borderRadius: 4,
    padding: spacing.lg,
  },
  ordersTitle: { fontSize: 18, fontWeight: '700', color: colors.neutral[50] },
  ordersSub: { marginTop: spacing.xs, fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  ordersLink: { marginTop: spacing.md, fontSize: 14, fontWeight: '600', color: colors.brand.accent },
  perk: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.neutral.cream,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(33, 29, 25, 0.08)',
  },
  perkN: { fontSize: 14, fontWeight: '700', color: colors.brand.accent },
  perkBody: { flex: 1 },
  perkTitle: { fontWeight: '700', color: colors.neutral.ink },
  perkDesc: { marginTop: 2, fontSize: 13, color: 'rgba(33, 29, 25, 0.6)' },
  errorText: { color: colors.brand.primary, marginBottom: spacing.sm, fontSize: 13, textAlign: 'center' },
});
