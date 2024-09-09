'use client'

import { signupAction } from '@/actions/auth.actions'
import { SignupPayload, signupSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { InputGroup } from '../input-group'
import { SubmitButton } from '../submit-button'

export function SignupForm() {
    const { register, formState, handleSubmit } = useForm<SignupPayload>({
        mode: 'all',
        resolver: zodResolver(signupSchema),
    })
    const router = useRouter()
    const { errors, isSubmitting } = formState

    async function processForm(data: SignupPayload) {
        const [error, success] = await signupAction(data)

        if (error) {
            return toast.error(error.message)
        }

        toast.success(success.message)
        router.push('/verify-email?email=' + success.data?.email)
    }
    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-3'>
            <InputGroup label='Name' {...register('name')} error={errors.name} />

            <InputGroup label='Email' error={errors.email} {...register('email')} />

            <InputGroup
                label='Password'
                type='password'
                error={errors.password}
                {...register('password')}
            />

            <SubmitButton isSubmitting={isSubmitting}>Continue</SubmitButton>
        </form>
    )
}
