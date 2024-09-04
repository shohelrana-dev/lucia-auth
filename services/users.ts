import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

interface CreateUserData {
    name: string
    email?: string
    picture?: string
    emailVerified?: Date | null
}

export async function getUserByEmail(email: string) {
    return await db.query.users.findFirst({
        where: eq(users.email, email),
    })
}

export async function createUser(data: CreateUserData) {
    const [user] = await db
        .insert(users)
        .values({
            name: data.name,
            email: data.email,
            picture: data.picture,
            emailVerified: data.emailVerified,
        })
        .returning()

    return user
}

export async function setEmailVerified(userId: number) {
    const [user] = await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, userId))
        .returning()

    return user
}
