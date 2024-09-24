'use server'

import { SITE_NAME, SITE_URL } from '@/app-config'
import MagicLinkEmail from '@/emails/magic-link'
import PasswordResetEmail from '@/emails/password-reset'
import VerifyEmail from '@/emails/verify-email'
import { facebook, google } from '@/lib/auth'
import { ActionError, InputError } from '@/lib/error'
import { sendEmail } from '@/lib/mail'
import { createServerAction } from '@/lib/safe-action'
import { clearSession, createSession } from '@/lib/session'
import {
    emailValidation,
    emailVerificationSchema,
    loginSchema,
    resetPasswordSchema,
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
import { z } from 'zod'

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

export const signupAction = createServerAction()
    .schema(signupSchema)
    .handler(async (data) => {
        const { name, email, password } = data || {}

        const findUser = await getUserByEmail(email)
        if (findUser) {
            throw new InputError('email', 'Email already exists.')
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

        return { message: 'Please verify your email.', user }
    })

export const verifyEmailAction = createServerAction()
    .schema(emailVerificationSchema)
    .handler(async (input) => {
        const { email, code } = input || {}

        const verificationToken = await getVerificationToken(code, 'email_verification')

        if (!verificationToken) {
            throw new InputError('code', 'Invalid verification code.')
        }
        if (verificationToken.tokenExpiresAt < new Date()) {
            throw new InputError('code', 'Verification code expired.')
        }

        const user = await getUserByEmail(email)

        if (!user) throw new Error('User not found.')
        if (user.emailVerifiedAt) {
            throw new Error('Email already verified.')
        }

        await setemailVerifiedAt(user.id)

        deleteVerificationToken(code)

        return { message: 'Email verified. You can now login.' }
    })

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

export const resendVerificationEmailAction = createServerAction()
    .schema(z.object({ email: emailValidation }))
    .handler(async (input) => {
        const { email } = input || {}

        const user = await getUserByEmail(email)
        if (!user) throw new Error('User not found.')

        if (user.emailVerifiedAt) throw new Error('Email already verified.')

        const token = await generateVerficationToken(user.id, 'email_verification')

        await sendEmail({
            to: email,
            subject: `Email Verification Code ${token}`,
            react: VerifyEmail({ name: user.name, verificationCode: token }),
        })

        return { message: 'Email verification code sent.' }
    })

export const forgotPasswordAction = createServerAction()
    .schema(z.object({ email: emailValidation }))
    .handler(async ({ email } = {}) => {
        const user = await getUserByEmail(email)
        if (!user) throw new InputError('email', 'User not found with the email.')

        const account = await getAccountByUserIdAndAccountType(user.id, 'email')
        if (!account) {
            throw new InputError('email', 'Account not found for email and password login.')
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

        return { message: 'Password reset link sent to your email. Please check your email.' }
    })

export const resetPasswordAction = createServerAction()
    .schema(resetPasswordSchema)
    .handler(async (input) => {
        const { password, token } = input || {}

        const tokenData = await getVerificationToken(token, 'password_reset')
        if (!tokenData) throw new Error('Invalid token.')

        const account = await getAccountByUserIdAndAccountType(tokenData.userId, 'email')

        if (!account) {
            throw new Error('Account not found')
        }
        if (tokenData.tokenExpiresAt < new Date()) {
            throw new Error('Token expired')
        }

        await updateAccountPassword(account.id, password)

        return { message: 'Password reset successfully' }
    })

export const sendMagicLinkAction = createServerAction()
    .schema(z.object({ email: emailValidation }))
    .handler(async ({ email } = {}) => {
        const user = await getUserByEmail(email)
        if (!user) throw new InputError('email', 'User not found with the email')

        const token = await generateVerficationToken(user.id, 'magic_link')

        const url = `${SITE_URL}/api/auth/login/magic?token=${token}`

        await sendEmail({
            to: email,
            subject: `Magic link to login to ${SITE_NAME}`,
            react: MagicLinkEmail({ name: user.name, url }),
        })

        return { message: 'Magic link sent to your email. Please check your email.' }
    })
