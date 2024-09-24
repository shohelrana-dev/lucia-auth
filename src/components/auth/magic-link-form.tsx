'use client'
import { sendMagicLinkAction } from '@/actions/auth.actions'
import { emailValidation } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { InputGroup } from '../input-group'
import { SubmitButton } from '../submit-button'

export function MagicLinkForm() {
    const { register, formState, handleSubmit, reset, setError } = useForm<{ email: string }>({
        mode: 'all',
        resolver: zodResolver(z.object({ email: emailValidation })),
    })
    const { errors, isSubmitting } = formState

    async function processForm({ email }: { email: string }) {
        const [data, error] = await sendMagicLinkAction({ email })

        if (error) {
            if (error.inputError) {
                setError(error.inputError.name as any, { message: error.inputError.message })
            }
            return toast.error(error.message)
        }
        reset()
        toast.success(data.message)
    }

    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-3'>
            <InputGroup label='Email' type='text' {...register('email')} error={errors?.email} />
            <SubmitButton isSubmitting={isSubmitting}>Login with magic link</SubmitButton>
        </form>
    )
}
