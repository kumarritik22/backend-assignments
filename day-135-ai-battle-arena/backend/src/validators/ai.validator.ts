import { z } from 'zod';

export const invokeSchema = z.object({
  body: z.object({
    input: z.string().min(2, 'Prompt must be at least 2 characters long').max(1000, 'Prompt cannot exceed 1000 characters'),
  }),
});
