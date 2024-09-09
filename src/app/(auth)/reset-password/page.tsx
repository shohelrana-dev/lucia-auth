import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
    title: 'Reset Password',
    description: 'Reset your account password',
}

interface Props {
    searchParams: {
        token: string
    }
}

export default function ResetPasswordPage({ searchParams }: Props) {
    if (!searchParams.token) {
        redirect('/login')
    }

    return (
        <main className='min-h-screen flex flex-col items-center justify-center bg-light-gray'>
            <Card className='w-full max-w-[380px] mb-32 bg-white'>
                <CardHeader className='text-center'>
                    <h2 className='text-lg font-extrabold'>Reset password</h2>
                    <p className='text-sm text-gray-500'>Enter your new password below</p>
                </CardHeader>

                <CardContent>
                    <ResetPasswordForm token={searchParams.token} />
                </CardContent>
                <CardFooter className='flex flex-col gap-2'>
                    <p className='text-center -mt-3 text-sm'>
                        Go back to{' '}
                        <Link href='/login' className='text-blue-600'>
                            Login
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    )
}
