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
                        senderDeleted: false
                    },
                    {
                        senderId: member?.userId,
                        recipientId: userId,
                        recipientDeleted: false
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

        if (messages.length > 0) {
            await prisma.message.updateMany({
                where: {
                        senderId: member?.userId,
                        recipientId: userId,
                        dateRead: null
                },
                data: {dateRead : new Date()}
            })
        }

        return messages.map(message => mapMessageToMessageDto(message))
    } catch (error) {
        console.log(error)
        throw error
    }
}

export async function getMessagesContainer(container: string) {
    try {
        const userId = await getAuthUserId()
        const selector = container === 'outbox' ? 'senderId' : 'recipientId'
        const conditions = {
            [container === 'outbox' ? 'senderId' : 'recipientId']: userId,
            ...(container === 'outbox' ? {senderDeleted: false} : {recipientDeleted: false})
        }
        const messages = await prisma.message.findMany({
            where: conditions,
            orderBy: {
                created: 'desc'
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
    } catch(error) {
        console.log(error)
        throw error
    }
}

export async function deleteMessage(messageId: string, isOutbox: boolean) {
    const selector = isOutbox ? 'senderDeleted' : 'recipientDeleted'
    try {
        const userId = await getAuthUserId()
        await prisma.message.update({
            where: {id: messageId},
            data: {
                [selector]: true
            }
        })
        const messagesToDelete = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        senderId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    },
                    {
                        recipientId: userId,
                        senderDeleted: true,
                        recipientDeleted: true
                    }
                ]
            }
        })
        if (messagesToDelete.length > 0) {
            await prisma.message.deleteMany({
                where: {
                    OR: messagesToDelete.map(m => ({id: m.id}))
                }
            })
        }
    } catch(error) {
        console.log(error)
        throw error
    }
}

