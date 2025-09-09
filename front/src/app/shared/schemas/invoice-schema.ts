import z from 'zod';

export const invoiceSchema = z.object({
  id: z.string(),
  totalExclTax: z.number(),
  createdAt: z.string(),
  totalInclTax: z.number(),
});
