import { LoginForm } from '@/components/auth/login-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login',
    description: 'Login to your account with email and password',
}

export default function EmailLoginPage() {
    return <LoginForm />
}
