import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Forgot Password',
    description: 'If you forgot your password, you can reset it here',
}

export default function ForgotPasswordPage() {
    return (
        <>
            <CardHeader className='text-center'>
                <h2 className='text-lg font-extrabold'>Forgot Password</h2>
                <p className='text-sm text-gray-500'>Enter your email to reset your password</p>
            </CardHeader>

            <CardContent>
                <ForgotPasswordForm />
            </CardContent>

            <CardFooter className='justify-center'>
                <p className='text-sm text-gray-500 text-center'>
                    Go back to{' '}
                    <Link href='/login' className='text-blue-600'>
                        Login
                    </Link>
                </p>
            </CardFooter>
        </>
    )
}
