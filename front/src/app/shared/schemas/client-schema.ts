import z from 'zod';

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  phoneNumber: z.number(),
});
