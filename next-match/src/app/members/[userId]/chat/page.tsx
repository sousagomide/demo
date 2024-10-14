import { CardBody, Divider } from '@nextui-org/react'
import { CardHeader } from '@nextui-org/react'
import React from 'react'

export default function ChatPage() {
  return (
        <>
            <CardHeader className='text-2xl front-semibold text-secondary'>
                Chat
            </CardHeader>
            <Divider />
            <CardBody>
                Chat goes here
            </CardBody>
        </>
  )
}
