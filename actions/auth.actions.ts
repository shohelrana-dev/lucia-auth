'use server'

import VerifyEmail from '@/emails/verify-email'
import { facebook, google, lucia, validateRequest } from '@/lib/auth'
import { sendEmail } from '@/lib/mail'
import { errorResult, successResult } from '@/lib/utils'
import { emailVerificationSchema, LoginSchema, loginSchema, SignupSchema, signupSchema } from '@/lib/zod'
import { createAccount, getAccountByUserIdAndAccountType } from '@/services/accounts'
import { createUser, getUserByEmail, setEmailVerified } from '@/services/users'
import {
    deleteVerificationToken,
    generateVerficationToken,
    getVerificationToken,
} from '@/services/verification-tokens'
import { generateCodeVerifier, generateState } from 'arctic'
import argon2 from 'argon2'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ZodError } from 'zod'

export async function loginViaGoogleAction() {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const url = await google.createAuthorizationURL(state, codeVerifier, {
        scopes: ['profile', 'email'],
    })

    cookies().set('google_oauth_state', state, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
    })

    cookies().set('google_code_verifier', codeVerifier, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
    })

    redirect(url.href)
}

export async function loginViaFacebookAction() {
    const state = generateState()
    const url = await facebook.createAuthorizationURL(state)

    cookies().set('facebook_oauth_state', state, {
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 60 * 10,
    })

    redirect(url.href)
}

export async function logoutAction() {
    const { session } = await validateRequest()
    if (!session) return

    await lucia.invalidateSession(session.id)
    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    revalidatePath('/')
}

export async function signupAction(data: SignupSchema) {
    try {
        const { name, email, password } = await signupSchema.parseAsync(data)
        console.log(name, email, password)

        const findUser = await getUserByEmail(email)
        if (findUser) {
            return errorResult('Email already exists.')
        }

        const user = await createUser({
            name,
            email,
        })
        await createAccount(user.id, password)

        const token = await generateVerficationToken(user.id, 'email_verification')

        await sendEmail({
            to: email,
            subject: `Email Verification Code ${token}`,
            react: VerifyEmail({ verificationCode: token }),
        })

        return successResult<typeof user>('Please verify your email.', user)
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            return errorResult('Invalid form data')
        }
        return errorResult('Something went wrong. Please try again.')
    }
}

export async function verifyEmailAction(prevState: unknown, formData: FormData) {
    try {
        const { email, code } = await emailVerificationSchema.parseAsync(
            Object.fromEntries(formData.entries())
        )

        const user = await getUserByEmail(email)
        if (!user) return errorResult('User not found.')

        if (user.emailVerified) return errorResult('Email already verified.')

        const verificationToken = await getVerificationToken(code)

        if (!verificationToken) {
            return errorResult('Invalid verification code.')
        }
        if (verificationToken.tokenExpiresAt < new Date()) {
            return errorResult('Verification code expired.')
        }

        await setEmailVerified(user.id)

        deleteVerificationToken(code)

        return successResult('Email verified. You can now login.')
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            return errorResult((e.format() as any).code._errors[0] ?? 'Validation error')
        }
        return errorResult('Something went wrong. Please try again.')
    }
}

export async function loginAction(data: LoginSchema) {
    try {
        const { email, password } = await loginSchema.parseAsync(data)

        if (!email || !password) return errorResult('Email and password are required.')

        const user = await getUserByEmail(email)
        if (!user) return errorResult('User not found.')

        const account = await getAccountByUserIdAndAccountType(user.id, 'email')
        if (!account) return errorResult('Account not found for email and password login.')

        const isPasswordMatch = await argon2.verify(account.password!, password)

        if (!isPasswordMatch) return errorResult('Invalid password.')

        if (!user.emailVerified) return errorResult('Please verify your email first.', user)

        const session = await lucia.createSession(user.id.toString(), {})
        const sessionCookie = lucia.createSessionCookie(session.id)

        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

        revalidatePath('/')
        return successResult('Logged in.')
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            return errorResult('Invalid form data.')
        }
        return errorResult('Something went wrong. Please try again.')
    }
}

export async function resendVerificationEmailAction(prevState: unknown, formData: FormData) {
    const { email } = Object.fromEntries(formData.entries()) as {
        email: string
    }

    if (!email) return errorResult('Email is required.')

    const user = await getUserByEmail(email)
    if (!user) return errorResult('User not found.')

    if (user.emailVerified) return errorResult('Email already verified.')

    const token = await generateVerficationToken(user.id, 'email_verification')

    await sendEmail({
        to: email,
        subject: `Email Verification Code ${token}`,
        react: VerifyEmail({ verificationCode: token }),
    })

    return successResult('Email verification code sent.')
}
