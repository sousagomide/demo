import { getAuthUserId } from '@/app/actions/authActions'
import { getMemberPhotosById, getMemberPhotosByUserId } from '@/app/actions/memberActions'
import DeleteButton from '@/components/DeleteButton'
import ImageUploadButton from '@/components/ImageUploadButton'
import StarButton from '@/components/StarButton'
import { CardBody, CardHeader, Divider, Image } from '@nextui-org/react'
import React from 'react'

export default async function PhotosPage() {
    const userId = await getAuthUserId()
    const photos = await getMemberPhotosById(userId)

    
    return (
        <>
            <CardHeader className='text-2xl front-semibold text-secondary'>
                Editar Perfil
            </CardHeader>
            <Divider />
            <CardBody>
                <div className='pt-5 pl-5'>
                    <ImageUploadButton />
                </div>
                <div className='grid grid-cols-5 gap-3 p-5'>
                    {photos && photos.map(photo => (
                        <div key={photo.id} className='relative'>
                            <Image 
                                width={220}
                                height={220}
                                src={photo.url}
                                alt='Image of user'
                            />
                            <div className='absolute top-3 left-3 z-50'>
                                <StarButton selected={true} loading={false}/>
                            </div>
                            <div className='absolute top-3 right-3 z-50'>
                                <DeleteButton loading={false}/>
                            </div>
                        </div>
                    ))}
                </div>
            </CardBody>
        </>
    )
}
