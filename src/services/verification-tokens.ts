import { db } from '@/db'
import { verificationTokens, VerificationTypeEnum } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import otpGenerator from 'otp-generator'
import 'server-only'

export async function generateVerficationToken(
    userId: number,
    verificationType: VerificationTypeEnum,
    digitsOnly = true
) {
    //delete existing token if exists
    await db.delete(verificationTokens).where(and(eq(verificationTokens.userId, userId)))

    const otp = otpGenerator.generate(digitsOnly ? 6 : 12, {
        digits: digitsOnly,
        upperCaseAlphabets: !digitsOnly,
        lowerCaseAlphabets: !digitsOnly,
        specialChars: !digitsOnly,
    })
    const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 10)

    const [existingToken] = await db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.userId, userId))

    if (existingToken) {
        const [updatedToken] = await db
            .update(verificationTokens)
            .set({ token: otp, tokenExpiresAt })
            .where(eq(verificationTokens.id, existingToken.id))
            .returning()

        return updatedToken.token
    }

    const [verificationToken] = await db
        .insert(verificationTokens)
        .values({
            userId: userId,
            verificationType,
            token: otp,
            tokenExpiresAt,
        })
        .returning()

    return verificationToken.token
}

export async function getVerificationToken(token: string, verificationType: VerificationTypeEnum) {
    const [verificationToken] = await db
        .select()
        .from(verificationTokens)
        .where(
            and(
                eq(verificationTokens.token, token),
                eq(verificationTokens.verificationType, verificationType)
            )
        )

    return verificationToken
}

export async function deleteVerificationToken(token: string) {
    return await db.delete(verificationTokens).where(eq(verificationTokens.token, token))
}
