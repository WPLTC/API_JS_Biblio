import { z } from "zod"

export const bookSchema = z.object({
  id: z.string().uuid().optional(), 
  title: z.string().min(1).max(200),
  author_id: z.string().uuid(),
  isbn: z.string().length(13),
  published_year: z.number().int().min(1900).max(2100),
  pages: z.number().int().optional(),
  description: z.string().optional(),
  available: z.boolean().optional().default(true),
  created_at: z.date().optional(), 
  updated_at: z.date().optional()  
})

