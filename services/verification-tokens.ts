import { db } from '@/db'
import { verificationTokens, VerificationTypeEnum } from '@/db/schema'
import { eq } from 'drizzle-orm'
import otpGenerator from 'otp-generator'

export async function generateVerficationToken(userId: number, type: VerificationTypeEnum) {
    const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    })
    const tokenExpiresAt = new Date(Date.now() + 1000 * 60 * 10)

    const existingToken = await db.query.verificationTokens.findFirst({
        where: eq(verificationTokens.userId, userId),
    })

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
            type,
            token: otp,
            tokenExpiresAt,
        })
        .returning()

    return verificationToken.token
}

export async function getVerificationToken(token: string) {
    return await db.query.verificationTokens.findFirst({
        where: eq(verificationTokens.token, token),
    })
}

export async function deleteVerificationToken(token: string) {
    return await db.delete(verificationTokens).where(eq(verificationTokens.token, token))
}
