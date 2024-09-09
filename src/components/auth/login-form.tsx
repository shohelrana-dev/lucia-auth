'use client'
import { loginAction } from '@/actions/auth.actions'
import { AFTER_LOGIN_REDIRECT_URL } from '@/app-config'
import { LoginPayload, loginSchema } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { InputGroup } from '../input-group'
import { SubmitButton } from '../submit-button'
import { Button } from '../ui/button'

export function LoginForm() {
    const router = useRouter()
    const { register, handleSubmit, formState, setError } = useForm<LoginPayload>({
        resolver: zodResolver(loginSchema),
        mode: 'all',
    })
    const { errors, isSubmitting } = formState

    async function processForm(payload: LoginPayload) {
        const [data, error] = await loginAction(payload)

        if (error) {
            if (error.inputError) {
                setError(error.inputError.name as any, { message: error.inputError.message })
            }
            if (error.code === 'EMAIL_NOT_VERIFIED') {
                router.push(`/verify-email?email=${payload.email}`)
            }
            return toast.error(error.message)
        }

        toast.success(data.message)
        router.push(AFTER_LOGIN_REDIRECT_URL)
    }

    return (
        <form onSubmit={handleSubmit(processForm)} className='flex flex-col gap-3'>
            <InputGroup label='Email' error={errors.email} {...register('email')} />
            <InputGroup
                label='Password'
                type='password'
                error={errors.password}
                {...register('password')}
            />
            <p className='text-right -mt-3'>
                <Link href='/forgot-password' className='text-foreground text-xs'>
                    Forgot Password
                </Link>
            </p>

            <SubmitButton isSubmitting={isSubmitting}>Login</SubmitButton>
            <Link href='/login'>
                <Button variant='ghost' className='w-full'>
                    Login with magic link
                </Button>
            </Link>
        </form>
    )
}
