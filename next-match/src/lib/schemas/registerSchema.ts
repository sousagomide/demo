import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(3, {
        message: 'O nome deve conter no mínimo 3 caracteres'
    }),
    email: z.string().email({
        message: 'Email inválido'
    }),
    password: z.string().min(6, {
        message: 'A senha deve conter no mínimo 6 caracteres'
    })
})

export type RegisterSchema = z.infer<typeof registerSchema>;
