import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing, typography } from '@noeve/ui-tokens';
import { formatPrice } from '../lib/format';
import type { Product } from '../lib/types';

interface ProductCardProps {
  product: Product;
  width?: number | `${number}%`;
}

export function ProductCard({ product, width = '48%' }: ProductCardProps) {
  const image = product.images?.[0];

  return (
    <Link href={`/product/${product.slug}`} asChild>
      <Pressable style={[styles.card, { width }]}>
        <View style={styles.imageWrap}>
          {image ? (
            <Image source={{ uri: image.url }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>Noeve</Text>
            </View>
          )}
          {product.category ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.category.name}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        {product.material ? (
          <Text style={styles.meta} numberOfLines={1}>
            {product.material}
            {product.purity ? ` · ${product.purity}` : ''}
          </Text>
        ) : null}
        <Text style={styles.price}>{formatPrice(product.basePriceCents, product.currency)}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.md },
  imageWrap: {
    aspectRatio: 4 / 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.brand.accentLight,
  },
  image: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: colors.brand.primary, opacity: 0.4 },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: { fontSize: 10, fontWeight: '600', color: colors.brand.primary },
  name: {
    marginTop: spacing.sm,
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
    color: colors.brand.primary,
  },
  meta: { marginTop: 2, fontSize: 11, color: colors.neutral[800] },
  price: { marginTop: 4, fontSize: typography.fontSize.sm, fontWeight: '700' },
});
