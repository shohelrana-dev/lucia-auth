import { db } from '@/db'
import { accounts, AccountTypeEnum } from '@/db/schema'
import argon2 from '@node-rs/argon2'
import { and, eq } from 'drizzle-orm'
import 'server-only'

export const hashOptions = {
    // recommended minimum parameters
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
}

export async function getAccountByUserIdAndAccountType(userId: number, accountType: AccountTypeEnum) {
    const [account] = await db
        .select()
        .from(accounts)
        .where(and(eq(accounts.userId, userId), eq(accounts.accountType, accountType)))

    return account
}

export async function getAccountByGoogleId(googleId: string) {
    const [account] = await db.select().from(accounts).where(eq(accounts.googleId, googleId))
    return account
}

export async function getAccountByFacebookId(facebookId: string) {
    const [account] = await db.select().from(accounts).where(eq(accounts.facebookId, facebookId))
    return account
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
    const passwordHash = await argon2.hash(password, hashOptions)
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

export async function updateAccountPassword(userId: number, password: string) {
    const passwordHash = await argon2.hash(password, hashOptions)
    await db
        .update(accounts)
        .set({ password: passwordHash })
        .where(and(eq(accounts.userId, userId), eq(accounts.accountType, 'email')))
}
