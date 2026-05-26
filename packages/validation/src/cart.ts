import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export const updateCartLineSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(99),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartLineInput = z.infer<typeof updateCartLineSchema>;
