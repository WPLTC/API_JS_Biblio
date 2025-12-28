import { z } from "zod"

export const authorSchema = z.object({
  name: z.string().min(2).max(100),
  birth_year: z.number().optional(),
  nationality: z.string().optional(),
  biography: z.string().optional()
})
