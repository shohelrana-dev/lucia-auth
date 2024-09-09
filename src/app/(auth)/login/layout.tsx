import { loginViaFacebookAction, loginViaGoogleAction } from '@/actions/auth.actions'
import { SITE_NAME } from '@/app-config'
import facebook from '@/assets/facebook.svg'
import google from '@/assets/google.svg'
import { Divider } from '@/components/divider'
import { SocialLoginButton } from '@/components/social-login-button'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className='min-h-screen flex flex-col items-center justify-center bg-light-gray'>
            <Card className='w-full max-w-[380px] mb-32 bg-white'>
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
            </Card>
        </main>
    )
}
