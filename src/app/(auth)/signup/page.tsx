import { loginViaFacebookAction, loginViaGoogleAction } from '@/actions/auth.actions'
import facebook from '@/assets/facebook.svg'
import google from '@/assets/google.svg'
import { SignupForm } from '@/components/auth/signup-form'
import { SocialLoginButton } from '@/components/social-login-button'
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Signup',
    description: 'Signup for an account',
}

export default function SignupPage() {
    return (
        <>
            <CardHeader className='text-center'>
                <h2 className='text-lg font-extrabold'>Create your account</h2>
                <p className='text-sm text-gray-500'>
                    Welcome! Please fill in the details to get started.
                </p>
            </CardHeader>

            <CardContent>
                <div className='flex gap-2'>
                    <form action={loginViaGoogleAction} className='w-full'>
                        <SocialLoginButton name='Google' icon={google} />
                    </form>
                    <form action={loginViaFacebookAction} className='w-full'>
                        <SocialLoginButton name='Facebook' icon={facebook} />
                    </form>
                </div>

                <div className='flex items-center gap-4 my-5'>
                    <Separator className='flex-1' />
                    <span className='text-muted-foreground uppercase text-xs'>or</span>
                    <Separator className='flex-1' />
                </div>

                <SignupForm />
            </CardContent>
            <CardFooter>
                <p className='text-center text-sm text-gray-500 w-full'>
                    Already have an account?{' '}
                    <Link href='/login' className='text-blue-600'>
                        Login
                    </Link>
                </p>
            </CardFooter>
        </>
    )
}
