import { z } from 'zod'

export const emailValidation = z
    .string()
    .min(1, { message: 'Please enter email' })
    .email({ message: 'Email is invalid' })
export const passwordValidation = z
    .string()
    .min(1, { message: 'Please enter password' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .max(30, { message: 'Password must be at most 30 characters' })

export const signupSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Please enter your name' })
        .max(20, { message: 'Name must be at most 20 characters' }),
    email: emailValidation,
    password: passwordValidation,
})

export const emailVerificationSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    code: z
        .string()
        .min(1, { message: 'Please enter verification code' })
        .min(6, { message: 'Verification code must be 6 characters' })
        .max(6, { message: 'Verification code must be 6 characters' }),
})

export const loginSchema = z.object({
    email: emailValidation,
    password: passwordValidation,
})

export const resetPasswordSchema = z
    .object({
        password: passwordValidation,
        confirmPassword: z.string().min(1, { message: 'Please enter confirm password' }),
        token: z.string().min(1, { message: 'Token is required' }),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: "Passwords didn't match",
                path: ['confirmPassword'],
            })
        }
    })

export type SignupPayload = z.infer<typeof signupSchema>
export type LoginPayload = z.infer<typeof loginSchema>
export type EmailVerificationPayload = z.infer<typeof emailVerificationSchema>
export type ResetPasswordPayload = z.infer<typeof resetPasswordSchema>
