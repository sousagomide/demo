import { z } from "zod";

export const memberEditSchema = z.object({
    name: z.string().min(1, {
        message: 'Nome é obrigatório'
    }),
    description: z.string().min(1, {
        message: 'Descrição é obrigatória'
    }),
    city: z.string().min(1, {
        message: 'Cidade é obrigatória'
    }),
    country: z.string().min(1, {
        message: 'País é obrigatório'
    })
})

export type MemberEditSchema = z.infer<typeof memberEditSchema>
