'use client'
import { resetPasswordAction } from '@/actions/auth.actions'
import { ResetPasswordPayload, resetPasswordSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { InputGroup } from '../input-group'
import { SubmitButton } from '../submit-button'

export function ResetPasswordForm({ token }: { token: string }) {
    const { handleSubmit, register, formState } = useForm<ResetPasswordPayload>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'all',
    })
    const router = useRouter()
    const { errors, isSubmitting } = formState

    async function processForm(input: ResetPasswordPayload) {
        const [data, error] = await resetPasswordAction(input)

        if (error) {
            return toast.error(error.message)
        }

        toast.success(data.message)
        router.push('/login')
    }

    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-4'>
            <input type='hidden' value={token} {...register('token')} />
            <InputGroup
                type='password'
                label='Password'
                error={errors.password}
                {...register('password')}
            />
            <InputGroup
                type='password'
                label='Confirm password'
                error={errors.confirmPassword}
                {...register('confirmPassword')}
            />
            <SubmitButton isSubmitting={isSubmitting}>Reset Password</SubmitButton>
        </form>
    )
}
