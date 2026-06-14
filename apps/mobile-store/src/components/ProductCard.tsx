import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { colors, spacing } from '@noeve/ui-tokens';
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
  card: { marginBottom: spacing.md, padding: 6, backgroundColor: '#2d144a', borderRadius: 16, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.1)' },
  imageWrap: {
    aspectRatio: 4 / 5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#311456',
  },
  image: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: colors.brand.accent, opacity: 0.4 },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.brand.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  badgeText: { fontSize: 9, fontWeight: '700', color: colors.brand.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  name: {
    marginTop: spacing.sm,
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 4,
  },
  meta: { marginTop: 2, fontSize: 10, color: '#bfb5cc', paddingHorizontal: 4 },
  price: { marginTop: 4, fontSize: 13, fontWeight: '700', color: colors.brand.accent, paddingHorizontal: 4 },
});

