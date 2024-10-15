import { CardBody, CardHeader, Divider } from '@nextui-org/react'
import React from 'react'
import EditForm from './EditForm'
import { getAuthUserId } from '@/app/actions/authActions'
import { getMemberById } from '@/app/actions/memberActions'
import { notFound } from 'next/navigation'

export default async function MemberEditPage() {
    const userId = await getAuthUserId()
    const member = await getMemberById(userId)
    if (!member) return notFound()
    return (
      <>
        <CardHeader className='text-2xl front-semibold text-secondary'>
            Editar Perfil
        </CardHeader>
        <Divider />
        <CardBody>
           <EditForm member={member} />
        </CardBody>
    </>
    )
}
