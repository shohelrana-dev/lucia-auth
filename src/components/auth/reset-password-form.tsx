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
    })
    const router = useRouter()
    const { errors, isSubmitting } = formState

    async function processForm(data: ResetPasswordPayload) {
        const [error, success] = await resetPasswordAction(data)

        if (error) {
            return toast.error(error.message)
        }

        toast.success(success.message)
        router.push('/login')
    }

    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-4'>
            <input type='hidden' value={token} {...register('token')} />
            <InputGroup
                type='password'
                label='Password'
                {...register('password')}
                error={errors.password}
            />
            <InputGroup
                type='password'
                label='Confirm password'
                {...register('confirmPassword')}
                error={errors.confirmPassword}
            />
            <SubmitButton isSubmitting={isSubmitting}>Reset Password</SubmitButton>
        </form>
    )
}
