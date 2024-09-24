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
    const { handleSubmit, register, formState, reset, setError } = useForm<{ email: string }>({
        resolver: zodResolver(z.object({ email: emailValidation })),
        mode: 'all',
    })
    const { errors, isSubmitting } = formState

    async function processForm({ email }: { email: string }) {
        const [data, error] = await forgotPasswordAction({ email })
        if (error) {
            if (error.inputError) {
                setError(error.inputError.name as any, { message: error.inputError.message })
            }
            return toast.error(error.message)
        }
        toast.success(data.message)
        reset()
    }

    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-4'>
            <InputGroup label='Email' {...register('email')} error={errors.email} />
            <SubmitButton isSubmitting={isSubmitting}>Send Reset Link</SubmitButton>
        </form>
    )
}
