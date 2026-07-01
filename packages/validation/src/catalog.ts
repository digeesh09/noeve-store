import { z } from 'zod';

export const productVariantSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1),
  name: z.string().min(1),
  priceCents: z.number().int().min(0),
  stockQuantity: z.number().int().min(0).default(0),
});

export const productImageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  alt: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const createProductSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  description: z.string().max(5000).optional(),
  categoryId: z.string().uuid(),
  basePriceCents: z.number().int().min(0),
  currency: z.string().length(3).default('INR'),
  material: z.string().max(100).optional(),
  purity: z.string().max(50).optional(),
  gemstone: z.string().max(100).optional(),
  weightGrams: z.number().positive().optional(),
  careInstructions: z.string().max(2000).optional(),
  variants: z.array(productVariantSchema).optional(),
  images: z.array(productImageSchema).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = createProductSchema.partial();
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
