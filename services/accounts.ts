import { db } from '@/db'
import { accounts, AccountTypeEnum } from '@/db/schema'
import argon2 from 'argon2'
import { and, eq } from 'drizzle-orm'

export async function getAccountByUserIdAndAccountType(userId: number, accountType: AccountTypeEnum) {
    return await db.query.accounts.findFirst({
        where: and(eq(accounts.userId, userId), eq(accounts.accountType, accountType)),
    })
}

export async function getAccountByGoogleId(googleId: string) {
    return await db.query.accounts.findFirst({
        where: eq(accounts.googleId, googleId),
    })
}

export async function getAccountByFacebookId(facebookId: string) {
    return await db.query.accounts.findFirst({
        where: eq(accounts.facebookId, facebookId),
    })
}

export async function createAccountViaGoogle(userId: number, googleId: string) {
    const [createdAccount] = await db
        .insert(accounts)
        .values({
            userId: userId,
            accountType: 'google',
            googleId,
        })
        .returning()

    return createdAccount
}

export async function createAccountViaFacebook(userId: number, facebookId: string) {
    const [createdAccount] = await db
        .insert(accounts)
        .values({
            userId: userId,
            accountType: 'facebook',
            facebookId,
        })
        .returning()

    return createdAccount
}

export async function createAccount(userId: number, password: string) {
    const passwordHash = await argon2.hash(password)
    const [createdAccount] = await db
        .insert(accounts)
        .values({
            userId: userId,
            accountType: 'email',
            password: passwordHash,
        })
        .returning()

    return createdAccount
}
