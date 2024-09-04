'use client'

import { resendVerificationEmailAction, verifyEmailAction } from '@/actions/auth.actions'
import { SubmitButton } from '@/components/submit-button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { ActionResult } from '@/lib/types'
import { showToastFromActionResult } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useFormState } from 'react-dom'

export default function VerifyEmailPage(props: { searchParams: { email: string } }) {
    const router = useRouter()
    const [state, formAction] = useFormState(verifyEmailAction, null)
    const [resendFormState, resendFormAction] = useFormState(resendVerificationEmailAction, null)
    const email = props.searchParams.email
    if (!email) router.push('/login')

    useEffect(() => {
        document.title = 'Verify Email'
    }, [])

    useEffect(() => {
        showToastFromActionResult(state as ActionResult)
        if (state?.status === 'success') {
            router.push('/login')
        }
    }, [state, router])

    useEffect(() => {
        showToastFromActionResult(resendFormState as ActionResult)
    }, [resendFormState])

    return (
        <main className='min-h-screen flex flex-col items-center justify-center bg-light-gray'>
            <Card className='w-full max-w-[350px] mb-32 bg-white'>
                <CardHeader className='text-center'>
                    <h2 className='text-lg font-extrabold'>Verify your email</h2>
                    <p className='text-sm text-gray-500'>Check your email for a verification code.</p>
                </CardHeader>

                <CardContent>
                    <form action={formAction} className='flex flex-col gap-4'>
                        <input type='hidden' name='email' value={email} />
                        <InputOTP maxLength={6} name='code'>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                            </InputOTPGroup>
                            <InputOTPSeparator />
                            <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <SubmitButton>Verify</SubmitButton>
                    </form>

                    {resendFormState?.status !== 'success' && (
                        <form action={resendFormAction} className='flex flex-col gap-4'>
                            <p className='text-sm text-gray-500 text-center mt-5'>
                                Didn&apos;t receive the email?{' '}
                                <input type='hidden' name='email' value={email} />
                                <br />
                                <SubmitButton variant='link'>Resend</SubmitButton>
                            </p>
                        </form>
                    )}
                    {resendFormState?.status === 'success' && (
                        <p className='text-sm text-gray-500 text-center mt-5'>Email resent.</p>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}
