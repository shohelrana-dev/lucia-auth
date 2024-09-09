import { cookies } from 'next/headers'
import { cache } from 'react'
import 'server-only'
import { lucia, validateRequest } from './auth'

export const getCurrentUser = cache(async () => {
    const { user } = await validateRequest()
    if (!user) {
        return null
    }
    return user
})

export async function createSession(userId: number) {
    const session = await lucia.createSession(userId.toString(), {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
}

export async function clearSession() {
    const { session } = await validateRequest()
    if (!session) return

    await lucia.invalidateSession(session.id)
    const sessionCookie = lucia.createBlankSessionCookie()
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
}
