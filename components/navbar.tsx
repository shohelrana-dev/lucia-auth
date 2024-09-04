import { logoutAction } from '@/actions/auth.actions'
import { SITE_NAME } from '@/app-config'
import { Button } from '@/components/ui/button'
import { validateRequest } from '@/lib/auth'
import Link from 'next/link'
import { SubmitButton } from './submit-button'

export async function Navbar() {
    const { session, user } = await validateRequest()

    return (
        <header className='fixed inset-x-0 top-0 z-50 bg-white shadow-sm dark:bg-gray-950/90'>
            <div className='w-full max-w-7xl mx-auto px-4'>
                <div className='flex justify-between h-14 items-center'>
                    <Link href='#' className='flex items-center'>
                        <h2 className='text-2xl font-bold'>{SITE_NAME}</h2>
                    </Link>
                    <nav className='hidden md:flex gap-4'></nav>
                    <div className='flex items-center gap-4'>
                        {session ? (
                            <form action={logoutAction}>
                                <SubmitButton variant='outline'>Logout</SubmitButton>
                            </form>
                        ) : (
                            <>
                                <Link href='/login'>
                                    <Button variant='outline' size='sm'>
                                        Login
                                    </Button>
                                </Link>
                                <Link href='/signup'>
                                    <Button size='sm'>Signup</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
