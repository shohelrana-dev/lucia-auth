'use client'
import { forgotPasswordAction } from '@/actions/auth.actions'
import { emailValidation } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { InputGroup } from '../input-group'
import { SubmitButton } from '../submit-button'

export function ForgotPasswordForm() {
    const { handleSubmit, register, formState, reset } = useForm<{ email: string }>({
        resolver: zodResolver(z.object({ email: emailValidation })),
    })
    const { errors, isSubmitting } = formState

    async function processForm(data: { email: string }) {
        const [error, success] = await forgotPasswordAction(data.email)
        if (error) {
            return toast.error(error.message)
        }
        toast.success(success.message)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-4'>
            <InputGroup label='Email' {...register('email')} error={errors.email} />
            <SubmitButton isSubmitting={isSubmitting}>Send Reset Link</SubmitButton>
        </form>
    )
}
