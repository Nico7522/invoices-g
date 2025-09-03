import z from 'zod';

export const carPartSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});
