'use client'
import { loginViaFacebookAction, loginViaGoogleAction } from '@/actions/auth.actions'
import { SITE_NAME } from '@/app-config'
import facebook from '@/assets/facebook.svg'
import google from '@/assets/google.svg'
import { Divider } from '@/components/divider'
import { SocialLoginButton } from '@/components/social-login-button'
import { Button } from '@/components/ui/button'
import { CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    if (pathname === '/login/magic/error') {
        return children
    }

    return (
        <>
            <CardHeader className='text-center'>
                <h2 className='text-lg font-extrabold'>Login to {SITE_NAME}</h2>
                <p className='text-sm text-gray-500'>Welcome back! Please sign in to continue</p>
            </CardHeader>

            <CardContent className='pb-0'>
                <div className='flex gap-2'>
                    <form action={loginViaGoogleAction} className='w-full'>
                        <SocialLoginButton name='Google' icon={google} />
                    </form>
                    <form action={loginViaFacebookAction} className='w-full'>
                        <SocialLoginButton name='Facebook' icon={facebook} />
                    </form>
                </div>

                <Divider>OR</Divider>

                {children}
            </CardContent>
            <CardFooter className='block'>
                <Divider>Don&apos;t have an account?</Divider>
                <Link href='/signup'>
                    <Button variant='outline' className='w-full'>
                        Create an account
                    </Button>
                </Link>
            </CardFooter>
        </>
    )
}
