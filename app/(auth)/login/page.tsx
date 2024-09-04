import { loginViaFacebookAction, loginViaGoogleAction } from '@/actions/auth.actions'
import { SITE_NAME } from '@/app-config'
import facebook from '@/assets/facebook.svg'
import google from '@/assets/google.svg'
import { LoginForm } from '@/components/auth/login-form'
import { SocialLoginButton } from '@/components/social-login-button'
import { Toast } from '@/components/toast'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
        <main className='min-h-screen flex flex-col items-center justify-center bg-light-gray'>
            {searchParams.authError && (
                <Toast message={'Login attempt failed! Please try again.'} type='error' />
            )}
            <Card className='w-full max-w-[380px] mb-32 bg-white'>
                <CardHeader className='text-center'>
                    <h2 className='text-lg font-extrabold'>Login to {SITE_NAME}</h2>
                    <p className='text-sm text-gray-500'>Welcome back! Please sign in to continue</p>
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

                    <LoginForm />
                </CardContent>
                <CardFooter>
                    <p className='text-center text-sm text-gray-500 w-full'>
                        Don&apos;t have an account?{' '}
                        <Link href='/signup' className='text-blue-600'>
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </main>
    )
}
