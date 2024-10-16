import { getAuthUserId } from '@/app/actions/authActions'
import { getMemberById, getMemberPhotosById, getMemberPhotosByUserId } from '@/app/actions/memberActions'
import DeleteButton from '@/components/DeleteButton'
import ImageUploadButton from '@/components/ImageUploadButton'
import StarButton from '@/components/StarButton'
import { CardBody, CardHeader, Divider, Image } from '@nextui-org/react'
import React from 'react'
import MemberPhotoUpload from './MemberPhotoUpload'
import MemberImage from '@/components/MemberImage'
import MemberPhotos from '@/components/MemberPhotos'

export default async function PhotosPage() {
    const userId = await getAuthUserId()
    const member = await getMemberById(userId)
    const photos = await getMemberPhotosById(userId)

    
    return (
        <>
            <CardHeader className='text-2xl front-semibold text-secondary'>
                Editar Perfil
            </CardHeader>
            <Divider />
            <CardBody>
                <MemberPhotoUpload />
                <MemberPhotos photos={photos} editing={true} mainImageUrl={member?.image}/>
            </CardBody>
        </>
    )
}
