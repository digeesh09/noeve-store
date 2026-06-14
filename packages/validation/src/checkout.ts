import { z } from 'zod';

export const placeOrderSchema = z.object({
  note: z.string().max(500).optional(),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
