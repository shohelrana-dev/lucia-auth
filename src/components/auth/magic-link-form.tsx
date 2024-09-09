'use client'
import { sendMagicLinkAction } from '@/actions/auth.actions'
import { emailValidation } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { InputGroup } from '../input-group'
import { SubmitButton } from '../submit-button'

export function MagicLinkForm() {
    const { register, formState, handleSubmit } = useForm<{ email: string }>({
        mode: 'all',
        resolver: zodResolver(z.object({ email: emailValidation })),
    })
    const router = useRouter()
    const { errors, isSubmitting } = formState

    async function processForm(data: { email: string }) {
        const [error, success] = await sendMagicLinkAction(data.email)

        if (error) {
            toast.error(error.message)
            if (error.data && !error.data.emailVerifiedAt) {
                router.push('/verify-email?email=' + error.data.email)
            }
        } else {
            toast.success(success.message)
        }
    }

    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-3'>
            <InputGroup label='Email' type='text' {...register('email')} error={errors?.email} />
            <SubmitButton isSubmitting={isSubmitting}>Login with magic link</SubmitButton>
        </form>
    )
}
