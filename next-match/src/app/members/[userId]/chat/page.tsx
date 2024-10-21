import CardInnerWrapper from '@/components/CardInnerWrapper'
import { CardBody, Divider } from '@nextui-org/react'
import { CardHeader } from '@nextui-org/react'
import React from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/app/actions/messageActions'
import MessageBox from './MessageBox'
import { getAuthUserId } from '@/app/actions/authActions'

export default async function ChatPage({params}: {params: {userId: string}}) {
  const userId = await getAuthUserId()
  const messages = await getMessageThread(params.userId)
  const body = (
    <div>
      {messages.length === 0 ? 'Não há mensagens disponível' : (
        <div>
          {messages.map(message => (
            <MessageBox key={message.id} message={message} currentUserId={userId}/>
          ))}
        </div>
      )}
    </div>
  )

  return (
        <CardInnerWrapper 
            header="Chat"
            body={body}
            footer={<ChatForm />}
        />
  )
}
