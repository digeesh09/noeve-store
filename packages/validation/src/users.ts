import { z } from 'zod';

export const addressSchema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(1, 'Name is required').max(100),
  phone: z.string({ required_error: 'Phone is required' })
    .regex(/^\d{10}$/, 'Mobile number must be exactly 10 digits'),
  streetLine1: z.string({ required_error: 'Street Line 1 is required' }).min(1, 'Street Line 1 is required').max(255),
  streetLine2: z.string().max(255).optional(),
  city: z.string({ required_error: 'City is required' }).min(1, 'City is required').max(100),
  state: z.string({ required_error: 'State is required' }).min(1, 'State is required').max(100),
  postalCode: z.string({ required_error: 'Postal code is required' }).min(1, 'Postal code is required').max(20),
  country: z.string({ required_error: 'Country is required' })
    .regex(/^(in|india)$/i, 'Only Indian shipping locations are allowed')
    .default('India'),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;
