'use client'

import { Tab, Tabs } from '@nextui-org/react'
import { Member } from '@prisma/client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { Key, useTransition } from 'react'
import MemberCard from '../members/MemberCard'
import Loading from '../loading'
import LoadingComponent from '@/components/LoadingComponent'

type Props = {
    members: Member[]
    likeIds: string[]
}

export default function ListsTab({members, likeIds}: Props) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()
    const [isPending, startTransition] = useTransition()
    const tabs = [
        {id: 'source', label: 'Membros que gostei'},
        {id: 'target', label: 'Membros que me gostaram'},
        {id: 'mutual', label: 'Membros que gostaram de ambos'}
    ]

    function handleTabChange(key: Key) {
        startTransition(() => {
            const params = new URLSearchParams(searchParams)
            params.set('type', key.toString())
            router.replace(`${pathname}?${params.toString()}`)
        })
    }
    
    return (
        <div className='flex w-full flex-col mt-10 gap-5'>
            <Tabs
                aria-label='Like tabs'
                items={tabs}
                color='secondary'
                onSelectionChange={(key) => handleTabChange(key)}>
                    {(item) => (
                        <Tab key={item.id} title={item.label}>
                            {isPending ? (
                                <LoadingComponent />
                            ) : (
                                <>
                                    {members.length > 0 ? (
                                        <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8'>
                                            {members.map(member => (
                                                <MemberCard key={member.id} member={member} likeIds={likeIds}/>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>Não há membros nesta lista</div>
                                    )}
                                </>
                            )}
                        </Tab>
                    )}
            </Tabs>
        </div>
        
    )
}
