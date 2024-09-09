'use server'

import { SITE_NAME, SITE_URL } from '@/app-config'
import { MagicLinkEmail } from '@/emails/magic-link'
import PasswordResetEmail from '@/emails/password-reset'
import VerifyEmail from '@/emails/verify-email'
import { facebook, google } from '@/lib/auth'
import { ActionError, InputError } from '@/lib/error'
import { sendEmail } from '@/lib/mail'
import { createServerAction } from '@/lib/safe-action'
import { clearSession, createSession } from '@/lib/session'
import { actionResult } from '@/lib/utils'
import {
    emailValidation,
    emailVerificationSchema,
    loginSchema,
    ResetPasswordPayload,
    resetPasswordSchema,
    SignupPayload,
    signupSchema,
} from '@/lib/zod'
import {
    createAccount,
    getAccountByUserIdAndAccountType,
    hashOptions,
    updateAccountPassword,
} from '@/services/accounts'
import { createUser, getUserByEmail, setemailVerifiedAt } from '@/services/users'
import {
    deleteVerificationToken,
    generateVerficationToken,
    getVerificationToken,
} from '@/services/verification-tokens'
import argon2 from '@node-rs/argon2'
import { generateCodeVerifier, generateState } from 'arctic'
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
    await clearSession()

    revalidatePath('/')
}

export async function signupAction(data: SignupPayload) {
    try {
        const { name, email, password } = await signupSchema.parseAsync(data)
        console.log(name, email, password)

        const findUser = await getUserByEmail(email)
        if (findUser) {
            return actionResult('error', 'Email already exists.')
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
            react: VerifyEmail({ name: user.name, verificationCode: token }),
        })

        return actionResult('success', 'Please verify your email.', user)
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            return actionResult('error', 'Invalid form data')
        }
        return actionResult('error', 'Something went wrong. Please try again.')
    }
}

export async function verifyEmailAction(prevState: unknown, formData: FormData) {
    try {
        const { email, code } = await emailVerificationSchema.parseAsync(
            Object.fromEntries(formData.entries())
        )

        const verificationToken = await getVerificationToken(code, 'email_verification')

        if (!verificationToken) {
            return actionResult('error', 'Invalid verification code.')
        }
        if (verificationToken.tokenExpiresAt < new Date()) {
            return actionResult('error', 'Verification code expired.')
        }

        const user = await getUserByEmail(email)

        if (!user) return actionResult('error', 'User not found.')
        if (user.emailVerifiedAt) {
            return actionResult('error', 'Email already verified.')
        }

        await setemailVerifiedAt(user.id)

        deleteVerificationToken(code)

        return actionResult('success', 'Email verified. You can now login.')
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            return actionResult('error', (e.format() as any).code._errors[0] ?? 'Validation error')
        }
        return actionResult('error', 'Something went wrong. Please try again.')
    }
}

export const loginAction = createServerAction()
    .schema(loginSchema)
    .handler(async function (input) {
        const { email, password } = input || {}

        const user = await getUserByEmail(email)
        if (!user) {
            throw new InputError('email', 'User not found with this email.')
        }

        const account = await getAccountByUserIdAndAccountType(user.id, 'email')
        if (!account) {
            throw new InputError('password', 'Invalid password.')
        }

        const isPasswordMatched = await argon2.verify(account.password!, password, hashOptions)
        if (!isPasswordMatched) {
            throw new InputError('password', 'Password is incorrect.')
        }

        if (!user.emailVerifiedAt) {
            throw new ActionError('Please verify your email first.', 'EMAIL_NOT_VERIFIED')
        }

        await createSession(user.id)

        revalidatePath('/')
        return { message: 'Logged in.' }
    })

export async function resendVerificationEmailAction(prevState: unknown, formData: FormData) {
    const { email } = Object.fromEntries(formData.entries()) as {
        email: string
    }

    if (!email) return actionResult('error', 'Email is required.')

    const user = await getUserByEmail(email)
    if (!user) return actionResult('error', 'User not found.')

    if (user.emailVerifiedAt) return actionResult('error', 'Email already verified.')

    const token = await generateVerficationToken(user.id, 'email_verification')

    await sendEmail({
        to: email,
        subject: `Email Verification Code ${token}`,
        react: VerifyEmail({ name: user.name, verificationCode: token }),
    })

    return actionResult('success', 'Email verification code sent.')
}

export async function forgotPasswordAction(_email: string) {
    try {
        const email = await emailValidation.parseAsync(_email)

        const user = await getUserByEmail(email)
        if (!user) return actionResult('error', 'User not found.')

        const account = await getAccountByUserIdAndAccountType(user.id, 'email')
        if (!account) {
            return actionResult('error', 'Account not found for email and password login.')
        }

        const token = await generateVerficationToken(user.id, 'password_reset', false)

        await sendEmail({
            to: email,
            subject: `Reset your ${SITE_NAME} account password`,
            react: PasswordResetEmail({
                name: user.name,
                url: `${SITE_URL}/reset-password?token=${token}`,
            }),
        })

        return actionResult(
            'success',
            'Password reset link sent to your email. Please check your email.'
        )
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            return actionResult('error', 'Invalid form data.')
        }
        return actionResult('error', 'Something went wrong. Please try again.')
    }
}

export async function resetPasswordAction(data: ResetPasswordPayload) {
    try {
        const { password, token } = await resetPasswordSchema.parseAsync(data)

        const tokenData = await getVerificationToken(token, 'password_reset')
        if (!tokenData) return actionResult('error', 'Invalid token.')

        const account = await getAccountByUserIdAndAccountType(tokenData.userId, 'email')

        if (!account) {
            return actionResult('error', 'Account not found')
        }
        if (tokenData.tokenExpiresAt < new Date()) {
            return actionResult('error', 'Token expired')
        }

        await updateAccountPassword(account.id, password)

        return actionResult('success', 'Password reset successfully')
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            return actionResult('error', 'Invalid form data')
        }
        return actionResult('error', 'Something went wrong. Please try again.')
    }
}

export async function sendMagicLinkAction(_email: string) {
    try {
        const email = await emailValidation.parseAsync(_email)

        const user = await getUserByEmail(email)
        if (!user) return actionResult('error', 'User not found.')

        if (!user.emailVerifiedAt) {
            return actionResult('error', 'Please verify your email first.', user)
        }

        const token = await generateVerficationToken(user.id, 'magic_link')

        const url = `${SITE_URL}/api/auth/login/magic?token=${token}`

        await sendEmail({
            to: email,
            subject: `Magic link to login to ${SITE_NAME}`,
            react: MagicLinkEmail({ name: user.name, url }),
        })

        return actionResult('success', 'Magic link sent to your email. Please check your email.')
    } catch (e) {
        console.log(e)
        if (e instanceof ZodError) {
            return actionResult('error', 'Invalid email.')
        }
        return actionResult('error', 'Something went wrong. Please try again.')
    }
}
