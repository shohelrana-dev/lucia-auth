'use client'
import { loginAction } from '@/actions/auth.actions'
import { AFTER_LOGIN_REDIRECT_URL } from '@/app-config'
import { showToastFromActionResult } from '@/lib/utils'
import { loginSchema, LoginSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { InputGroup } from '../input-group'
import { SubmitButton } from '../submit-button'

export function LoginForm() {
    const { register, formState, handleSubmit } = useForm<LoginSchema>({
        mode: 'all',
        resolver: zodResolver(loginSchema),
    })
    const router = useRouter()
    const { errors, isSubmitting } = formState

    async function processForm(data: LoginSchema) {
        const result = await loginAction(data)

        showToastFromActionResult(result)
        if (result.status === 'success') {
            router.push(AFTER_LOGIN_REDIRECT_URL)
        }
        if (result.data && !result.data.emailVerified) {
            router.push(`/verify-email?email=${result.data.email}`)
        }
    }

    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-3'>
            <InputGroup
                type='text'
                placeholder='name@example.com'
                {...register('email')}
                error={errors?.email}
            />
            <InputGroup
                type='password'
                placeholder='Password'
                {...register('password')}
                error={errors?.password}
            />

            <SubmitButton isLoading={isSubmitting}>Login</SubmitButton>
        </form>
    )
}
