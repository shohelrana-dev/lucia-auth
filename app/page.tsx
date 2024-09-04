'use client'

import { useSession } from '@/providers/session-provider'

export default function Home() {
    const { user, session } = useSession()
    return (
        <main className='flex flex-col items-center justify-center p-24'>
            <h1 className='text-4xl font-bold'>Home</h1>
            <div className='mt-5'>
                {' '}
                {user ? <h3 className='text-lg'>Welcome back, {user?.name}</h3> : 'Guest'}
            </div>
        </main>
    )
}
