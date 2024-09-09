import { MagicLinkForm } from '@/components/auth/magic-link-form'
import { Toast } from '@/components/toast'
import { Button } from '@/components/ui/button'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account',
}

interface Props {
    searchParams: {
        authError: string
    }
}

export default function LoginPage({ searchParams }: Props) {
    return (
        <>
            {searchParams.authError && (
                <Toast message={'Login attempt failed! Please try again.'} type='error' />
            )}
            <div className='flex flex-col gap-3'>
                <MagicLinkForm />
                <Link href='/login/email'>
                    <Button variant='ghost' className='w-full'>
                        Login with email and password
                    </Button>
                </Link>
            </div>
        </>
    )
}
