'use server'

import { messageSchema, MessageSchema } from "@/lib/schemas/messageSchema";
import { ActionResult } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { getMemberById, getMemberByUserId } from "./memberActions";
import { mapMessageToMessageDto } from "@/lib/mappings";

export async function createMessage(recipientUserId: string, data: MessageSchema): Promise<ActionResult<Message>> {
    try {
        const userId = await getAuthUserId()
        const member = await getMemberByUserId(recipientUserId)
        const validated = messageSchema.safeParse(data)
        if (!validated.success) return {status: 'error', error: validated.error.errors}
        const {text} = validated.data
        const message = await prisma.message.create({
            data: {
                text,
                recipientId: member?.userId,
                senderId: userId
            }
        })
        return {status: 'success', data: message}
    } catch(error) {
        console.log(error)
        return {status: 'error', error: 'Há algo errado'}
    }
}

export async function getMessageThread(recipientId: string) {
    try {
        const userId = await getAuthUserId()
        const member = await getMemberByUserId(recipientId)
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        recipientId: member?.userId,
                    },
                    {
                        senderId: member?.userId,
                        recipientId: userId
                    }
                ]
            },
            orderBy: {
                created: 'asc'
            },
            select: {
                id: true,
                text: true,
                created: true,
                dateRead: true,
                sender: {
                    select: {
                        userId: true,
                        name: true,
                        image: true
                    }
                },
                recipient: {
                    select: {
                        userId: true,
                        name: true,
                        image: true
                    }
                }
            }
        })
        return messages.map(message => mapMessageToMessageDto(message))
    } catch (error) {
        console.log(error)
        throw error
    }
}