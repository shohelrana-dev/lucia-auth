'use client'

import { resendVerificationEmailAction, verifyEmailAction } from '@/actions/auth.actions'
import { SubmitButton } from '@/components/submit-button'
import { CardContent, CardHeader } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { emailVerificationSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export default function VerifyEmailPage(props: { searchParams: { email: string } }) {
    const router = useRouter()
    const { register, handleSubmit, formState, setError } = useForm({
        mode: 'all',
        resolver: zodResolver(emailVerificationSchema),
    })
    const [isResendSuccess, setIsResrendSuccess] = useState(false)

    const email = props.searchParams.email
    const code = register('code')

    async function processForm(input: unknown) {
        const [data, error] = await verifyEmailAction(input)

        if (error) {
            if (error.inputError) {
                setError(error.inputError.name, { message: error.inputError.message })
            }
            return toast.error(error.message)
        }

        toast.success(data.message)
        router.push('/login')
    }

    async function processResendForm() {
        const [data, error] = await resendVerificationEmailAction({ email })

        if (error) {
            return toast.error(error.message)
        }
        setIsResrendSuccess(true)
        toast.success(data.message)
    }

    if (!email) return router.push('/login')

    return (
        <>
            <CardHeader className='text-center'>
                <h2 className='text-lg font-extrabold'>Verify your email</h2>
                <p className='text-sm text-gray-500'>Check your email for a verification code.</p>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-4'>
                    <input type='hidden' value={email} {...register('email')} />
                    <InputOTP maxLength={6} name={code.name} ref={code.ref} onBlur={code.onBlur}>
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
                    {formState.errors.code && (
                        <p className='text-destructive text-[13px] -mt-1'>
                            <Info size={16} className='inline-block mr-1' />
                            <span>{formState.errors.code.message?.toString()}</span>
                        </p>
                    )}
                    <SubmitButton isSubmitting={formState.isSubmitting}>Verify</SubmitButton>
                </form>

                {!!isResendSuccess ? (
                    <p className='text-sm text-gray-500 text-center mt-5'>Email resent.</p>
                ) : (
                    <form action={processResendForm} className='flex flex-col gap-4'>
                        <p className='text-sm text-gray-500 text-center mt-5'>
                            Didn&apos;t receive the email? <br />
                            <SubmitButton variant='link'>Resend</SubmitButton>
                        </p>
                    </form>
                )}
            </CardContent>
        </>
    )
}
