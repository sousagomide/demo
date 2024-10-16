import { getMemberPhotosByUserId } from '@/app/actions/memberActions'
import MemberImage from '@/components/MemberImage'
import { CardBody, Image } from '@nextui-org/react'
import { CardHeader, Divider } from '@nextui-org/react'
import React from 'react'

export default async function PhotosPage({params}: {params: {userId: string}}) {
    const photos = await getMemberPhotosByUserId(params.userId)
  return (
        <>
            <CardHeader className='text-2xl front-semibold text-secondary'>
                Fotos
            </CardHeader>
            <Divider />
            <CardBody>
                <div className='grid grid-cols-5 gap3'>
                    {photos && photos.map(photo => (
                        <div key={photo.id}>
                            <MemberImage photo={photo}/>
                        </div>
                    ))}
                </div>
            </CardBody>
        </>
  )
}
