import { z } from 'zod'

export const signupSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name is required' })
        .max(20, { message: 'Name must be at most 20 characters' }),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters' })
        .max(30, { message: 'Password must be at most 30 characters' }),
})

export type SignupSchema = z.infer<typeof signupSchema>

export const emailVerificationSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    code: z
        .string()
        .min(1, { message: 'Verification code is required' })
        .min(6, { message: 'Verification code must be 6 characters' })
        .max(6, { message: 'Verification code must be 6 characters' }),
})

export type EmailVerificationSchema = z.infer<typeof emailVerificationSchema>

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(1, { message: 'Password is required' }),
})

export type LoginSchema = z.infer<typeof loginSchema>
