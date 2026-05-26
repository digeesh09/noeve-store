import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { getProduct } from '../../src/lib/api';
import { formatPrice } from '../../src/lib/format';
import type { Product } from '../../src/lib/types';
import { colors, spacing, typography } from '@noeve/ui-tokens';

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    getProduct(slug).then((p) => {
      setProduct(p);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={colors.brand.accent} size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Product not found</Text>
      </View>
    );
  }

  const image = product.images?.[0];
  const specs = [
    { label: 'Material', value: product.material },
    { label: 'Purity', value: product.purity },
    { label: 'Gemstone', value: product.gemstone },
    { label: 'Weight', value: product.weightGrams ? `${product.weightGrams} g` : null },
  ].filter((s) => s.value);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.imageWrap}>
        {image ? (
          <Image source={{ uri: image.url }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Noeve</Text>
          </View>
        )}
      </View>

      {product.category ? (
        <Text style={styles.category}>{product.category.name.toUpperCase()}</Text>
      ) : null}
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{formatPrice(product.basePriceCents, product.currency)}</Text>

      {product.description ? (
        <Text style={styles.desc}>{product.description}</Text>
      ) : null}

      {specs.length > 0 ? (
        <View style={styles.specs}>
          {specs.map((s) => (
            <View key={s.label} style={styles.specRow}>
              <Text style={styles.specLabel}>{s.label}</Text>
              <Text style={styles.specValue}>{s.value}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {product.careInstructions ? (
        <View style={styles.care}>
          <Text style={styles.careTitle}>Care</Text>
          <Text style={styles.careText}>{product.careInstructions}</Text>
        </View>
      ) : null}

      <Pressable style={styles.addBtn}>
        <Text style={styles.addBtnText}>Add to bag</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.neutral[50] },
  content: { paddingBottom: spacing.xxl },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: colors.semantic.error },
  imageWrap: {
    aspectRatio: 4 / 5,
    backgroundColor: colors.brand.accentLight,
  },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderText: { opacity: 0.3, fontSize: 24, color: colors.brand.primary },
  category: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: colors.brand.accent,
  },
  name: {
    marginTop: spacing.xs,
    marginHorizontal: spacing.lg,
    fontSize: typography.fontSize.xl,
    fontWeight: '700',
    color: colors.brand.primary,
  },
  price: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
    fontSize: 22,
    fontWeight: '700',
  },
  desc: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    fontSize: 15,
    lineHeight: 22,
    color: colors.neutral[800],
  },
  specs: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.neutral[200],
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  specRow: { flexDirection: 'row', justifyContent: 'space-between' },
  specLabel: { fontSize: 12, fontWeight: '600', color: colors.neutral[800], textTransform: 'uppercase' },
  specValue: { fontSize: 14, fontWeight: '600', color: colors.brand.primary },
  care: {
    marginTop: spacing.md,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.brand.accentLight + '99',
    borderRadius: 12,
    padding: spacing.md,
  },
  careTitle: { fontWeight: '700', color: colors.brand.primary },
  careText: { marginTop: spacing.xs, fontSize: 14, color: colors.neutral[800], lineHeight: 20 },
  addBtn: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.brand.primary,
    borderRadius: 28,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
