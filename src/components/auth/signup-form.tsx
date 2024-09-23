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
    const { register, formState, handleSubmit, setError } = useForm<SignupPayload>({
        mode: 'all',
        resolver: zodResolver(signupSchema),
    })
    const router = useRouter()
    const { errors, isSubmitting } = formState

    async function processForm(payload: SignupPayload) {
        const [data, error] = await signupAction(payload)

        if (error) {
            if (error.inputError) {
                setError(error.inputError.name as any, { message: error.inputError.message })
            }
            return toast.error(error.message)
        }

        toast.success(data.message)
        router.push('/verify-email?email=' + payload.email)
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
