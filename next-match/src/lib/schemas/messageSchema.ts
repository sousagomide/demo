import { z } from "zod";

export const messageSchema = z.object({
    text: z.string().min(1, {
        message: 'Conteúdo é requerido'
    })
})

export type MessageSchema = z.infer<typeof messageSchema>