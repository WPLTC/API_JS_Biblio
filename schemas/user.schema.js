import { z } from "zod"

export const userSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email("email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractere"),
  created_at: z.date().optional()
})


export const registerSchema = userSchema.pick({ email: true, password: true })


export const loginSchema = userSchema.pick({ email: true }).extend({
  password: z.string().min(1, " mot de passe est requis")
})

