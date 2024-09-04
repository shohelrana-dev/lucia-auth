'use client'

import { signupAction } from '@/actions/auth.actions'
import { showToastFromActionResult } from '@/lib/utils'
import { SignupSchema, signupSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { InputGroup } from '../input-group'
import { SubmitButton } from '../submit-button'

export function SignupForm() {
    const { register, formState, handleSubmit } = useForm<SignupSchema>({
        mode: 'all',
        resolver: zodResolver(signupSchema),
    })
    const router = useRouter()
    const { errors, isSubmitting } = formState

    async function processForm(data: SignupSchema) {
        const result = await signupAction(data)

        showToastFromActionResult(result)
        if (result.status === 'success') {
            router.push('/verify-email?email=' + result.data?.email)
        }
    }
    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-3'>
            <InputGroup placeholder='Name' {...register('name')} error={errors.name} />

            <InputGroup
                type='text'
                placeholder='name@example.com'
                error={errors.email}
                {...register('email')}
            />

            <InputGroup
                type='password'
                placeholder='Password'
                error={errors.password}
                {...register('password')}
            />

            <SubmitButton isLoading={isSubmitting}>Continue</SubmitButton>
        </form>
    )
}
