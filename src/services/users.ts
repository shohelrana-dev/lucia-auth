import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import 'server-only'

interface CreateUserData {
    name: string
    email?: string
    picture?: string
    emailVerifiedAt?: Date | null
}

export async function getUserById(userId: number) {
    const [user] = await db.select().from(users).where(eq(users.id, userId))
    return user
}

export async function getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user
}

export async function createUser(data: CreateUserData) {
    const [user] = await db
        .insert(users)
        .values({
            name: data.name,
            email: data.email,
            picture: data.picture,
            emailVerifiedAt: data.emailVerifiedAt,
        })
        .returning()

    return user
}

export async function setemailVerifiedAt(userId: number) {
    const [user] = await db
        .update(users)
        .set({ emailVerifiedAt: new Date() })
        .where(eq(users.id, userId))
        .returning()

    return user
}
