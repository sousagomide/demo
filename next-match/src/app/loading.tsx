import { Spinner } from '@nextui-org/react'
import React from 'react'

export default function Loading() {
    return (
        <div className='flex justify-center items-center vertical-center'>
            <Spinner color='secondary' label='Loading...' labelColor='secondary'/>
        </div>
    )
}
